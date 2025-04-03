import { BadGatewayException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import {
  InitiatePaymentPayload,
  InitiatePaymentResponse,
  PaymentAccessTokenResponse,
} from './types';
import {
  PAYPAL_API_URL,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
} from 'src/library';

@Injectable()
export class PaymentService {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>(PAYPAL_API_URL);
    this.clientId = this.configService.get<string>(PAYPAL_CLIENT_ID);
    this.clientSecret = this.configService.get<string>(PAYPAL_CLIENT_SECRET);
  }

  // Get PayPal Access Token
  private async getAccessToken(): Promise<string> {
    console.log(this.baseUrl);
    const response = await axios.post<PaymentAccessTokenResponse>(
      `${this.baseUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        auth: { username: this.clientId, password: this.clientSecret },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    return response.data.access_token;
  }

  // Create Order
  public async InitialPaypalPayment(payload: InitiatePaymentPayload) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.post<InitiatePaymentResponse>(
        `${this.baseUrl}/v2/checkout/orders`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return (
        response.data.links.find((link) => link.rel === 'approve')?.href || ''
      );
    } catch (error) {
      console.log('error', error);
      throw new BadGatewayException('An error occurred');
    }
  }

  // Capture Payment
  public async capturePaypalPayment(orderId: string) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log('error', error);
      throw new BadGatewayException('An error occurred');
    }
  }
}
