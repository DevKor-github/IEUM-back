import { AuthController } from './auth.controller';

type MethodName = Object.getOwnPropertyNames(AuthController.prototype)

export const AuthDocs: Record<MethodName, MethodDecorator[]> = {};
