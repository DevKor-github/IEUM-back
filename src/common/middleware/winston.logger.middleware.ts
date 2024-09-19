import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { winstonLogger } from '../logger/winston.logger';

@Injectable()
export class WinstonLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;
    const startTime = Date.now(); // 요청 시작 시간
    const ip = req.ip; // IP 주소
    // const userAgent = req.get('User-Agent') || ''; // User-Agent 정보

    //프로메테우스 수집 요청 로그 기록 안함.
    if (originalUrl == '/metrics') {
      return next();
    }

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime; // 응답 시간
      const requestLogMessage = {
        app: 'IEUM',
        method: method,
        endpoint: originalUrl,
        statusCode: statusCode,
        reponseTime: responseTime,
        ip: ip,
        query: query,
        body: body,
      };
      winstonLogger.log(requestLogMessage);
    });

    next();
  }
}
