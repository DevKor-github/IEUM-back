import { MethodNames } from 'src/common/types/method-names.type';
import { AuthController } from './auth.controller';

type AuthMethodName = MethodNames<AuthController>;

export const AuthDocs: Record<AuthMethodName, MethodDecorator[]> = {
  renewAccessToken: [],
  socialLogin: [],
  handleAppleNotification: [],
};
