import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ExporterService } from 'src/exporter/exporter.service';

@Injectable()
export class ExporterMiddleware implements NestMiddleware {
  constructor(private readonly exporterService: ExporterService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime(); // 요청 시작 시간 //현재 시간의 [초, 나노초] 반환.

    res.on('finish', () => {
      const duration = process.hrtime(start); // 요청이 완료된 후 걸린 시간 계산 //경과 시간 계산.
      const seconds = duration[0] + duration[1] / 1e9; // 시간을 초로 변환

      const method = req.method;
      const route = req.route ? req.route.path : req.url; // 경로를 기록
      const statusCode = res.statusCode.toString();

      // 요청 횟수 카운터 증가
      this.exporterService.incrementHttpRequestCount(method, route, statusCode);

      // 요청 시간 Gauge에 기록
      this.exporterService.recordHttpRequestDuration(
        method,
        route,
        statusCode,
        seconds,
      );

      // 요청 시간 Gauge에 합산
      this.exporterService.incrementHttpRequestDuration(
        method,
        route,
        statusCode,
        seconds,
      );
    });

    next();
  }
}
