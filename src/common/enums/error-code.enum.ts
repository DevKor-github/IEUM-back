// 'aabb' : aa는 도메인 bb는 상세 에러 표시.

export enum ErrorCodeEnum {
  // aa = 10 : Auth
  NotValidRefresh = 1001,
  // aa = 20 : User
  NotValidUser = 2001,
  // aa = 30 : Insta
  NotValidInstaGuestUser = 3001,
  NotFoundInstaCollection = 3002,
  // aa = 80 : Server Exception
  DefaultInternalServerError = 8000,
  // aa = 90 : Http default exception
  DefaultBadRequest = 9000,
  DefaultUnauthorized = 9001,
  DefaultUndefined = 9999,
}
