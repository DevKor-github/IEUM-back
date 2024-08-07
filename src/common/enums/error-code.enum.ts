// 'aabb' : aa는 도메인 bb는 상세 에러 표시.

export enum ErrorCodeEnum {
  // aa = 10 : Auth
  NotValidRefresh = 1001,
  // aa = 20 : User
  NotValidUser = 2001,
  // aa = 30 : Collection
  NotValidCollection = 3001,
  ConflictedCollection = 3002,
  // aa = 40 : Folder
  NotValidFolder = 4001,
  ForbiddenFolder = 4002,
  // aa - 50 : place
  NotValidPlace = 5001,
  // aa = 80 : Server Exception
  DefaultInternalServerError = 8000,
  // aa = 90 : Http default exception
  DefaultBadRequest = 9000,
  DefaultUnauthorized = 9001,
  DefaultForbidden = 9003,
  DefaultUndefined = 9999,
}
