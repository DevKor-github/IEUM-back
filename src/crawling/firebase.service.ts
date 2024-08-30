import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  constructor(private readonly userService: UserService) {}

  onModuleInit() {
    const firebaseConfig = {
      type: process.env.FIREBASE_TYPE,
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_CLIENT_ID,
      authUri: process.env.FIREBASE_AUTH_URI,
      tokenUri: process.env.FIREBASE_TOKEN_URI,
      authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    };

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
    });
  }

  getFirebaseApp(): admin.app.App {
    return this.firebaseApp;
  }

  //유저의 id정보가 RabbitMQ 메세지에 포함되어 있으므로 그것으로 Fcm 토큰을 가져올 수 있다.
  //성공시와 실패 시 각각 다른 메세지를 보낸다
  //실패 메세지는 각 서버 단에서 던져진 Exception 정보를 포함한다(코드 형태로 전달한다)
  //푸시에는 간단한 메세지만 담고, 실패 정보는 리턴되는 객체에 담아주어야 할 것 같다.

  async testPushNotification(userId: number) {
    const token = await this.userService.getUserFCMToken(userId);
    try {
      const message = {
        notification: {
          title: '푸시 알림 테스트',
          body: '푸시 알림 테스트',
        },
        token,
      };

      const response = await this.firebaseApp.messaging().send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
  async sendPushNotification(
    userId: number,
    status: 'SUCCESS' | 'FAILURE',
    collectionId?: number,
  ): Promise<void> {
    const token = await this.userService.getUserFCMToken(userId);
    if (token) {
      try {
        const message = {
          notification: {
            title:
              status === 'SUCCESS'
                ? '장소를 추출하는 데 성공했어요.'
                : '장소를 추출하는 데 실패했어요.',
            body:
              status === 'SUCCESS'
                ? '지금 바로 확인해보세요.'
                : '유효한 링크인지 다시 확인해주세요.',
          },
          data: {
            status,
            collectionId: collectionId ? collectionId.toString() : '', //FCM 메세지는 String만 허용
          },
          token,
        };

        const response = await this.firebaseApp.messaging().send(message);
        console.log('Successfully sent message:', response);
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    }
  }
}
