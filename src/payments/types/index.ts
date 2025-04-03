// export type InitiatePayment = {
//   id: string;
//   status: string;
//   amount: number;
//   currency: string;
//   approvalUrl: string;
// };

export enum CURRENCY {
  EUROPEAN = 'EUR',
  USA = 'USD',
}

export enum PAYMENT_TYPE {
  SUBSCRIPTION = 'subscription',
  ONE_TIME_PAYMENT = 'one-time-payment',
}

export type PaymentAccessTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export type InitiatePaymentResponse = {
  id: string;
  status: string;
  links: { href: string; rel: string; method: string }[];
};

export type InitialPaypalPaymentData = {
  plan_id: string;

  subscriber: {
    email_address: string;
  };

  application_context?: {
    return_url: string;
    cancel_url: string;
  };
};

export type InitiatePaymentPayload = {
  intent: string;
  purchase_units: {
    amount: {
      currency_code: any;
      value: any;
    };
  }[];
};
