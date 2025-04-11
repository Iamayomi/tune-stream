import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';
import { ServiceAccount } from 'firebase-admin';
import { User } from '../../users/user.entity';

@Injectable()
export class FirebaseService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    // const fbPrivateKeyPath = path.join(
    //   process.cwd(),
    //   'tunestream_private_key.json',
    // );
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_JSON,
    ) as ServiceAccount;

    // const serviceAccount = JSON.parse(
    //   fs.readFileSync(fbPrivateKeyPath, 'utf8'),
    // ) as ServiceAccount;
    // Initialize Firebase Admin SDK (if not already initialized)
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      admin.app();
    }
  }

  public async sendPushNotification(
    payload: PushNotificationPayload,
  ): Promise<void> {
    try {
      // Fetch user's Firebase token from database
      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
        select: ['id', 'firebaseToken'],
      });

      if (user?.firebaseToken) {
        await admin.messaging().send({
          token: user.firebaseToken,
          notification: {
            title: payload.title,
            body: payload.body,
          },
          data: payload.data || {},
        });
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  // Additional methods for token management
  async updateUserFirebaseToken(userId: string, token: string): Promise<void> {
    await this.userRepository.update(userId, {
      firebaseToken: token,
      firebaseTokenUpdatedAt: new Date(),
    });
  }
}
