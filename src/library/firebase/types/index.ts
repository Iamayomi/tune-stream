interface PushNotificationPayload {
  title: string;
  body: string;
  userId: number;
  data?: Record<any, any>;
}
