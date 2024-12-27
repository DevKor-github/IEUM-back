import { Injectable } from '@nestjs/common';
import { Counter, Histogram, Summary, Gauge } from 'prom-client';

@Injectable()
export class ExporterService {
  private httpRequestCounter: Counter<string>; //counter는 단일 증가만 가능
  private httpRequestDuration: Gauge<string>; // 증가, 감소 가능.
  private httpRequestDurationSum: Gauge<string>; // 증가, 감소 가능.
  constructor() {
    // prom-client에서 요청 횟수를 세기 위한 Counter 생성
    this.httpRequestCounter = new Counter({
      name: 'http_requests_total', //metric의 name
      help: 'Total number of HTTP requests', //metric 부가 설명.
      labelNames: ['node_env', 'method', 'route', 'status_code'], //metric에 표시할 label.
    });

    // 요청 시간 기록을 위한 Gauge 생성
    this.httpRequestDuration = new Gauge({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['node_env', 'method', 'route', 'status_code'],
    });

    // 요청 시간 누적 기록을 위한 Gauge 생성
    this.httpRequestDurationSum = new Gauge({
      name: 'http_request_duration_sum_seconds',
      help: 'Sum Duration of HTTP requests in seconds',
      labelNames: ['node_env', 'method', 'route', 'status_code'],
    });
  }

  // HTTP 요청이 발생할 때마다 요청 별로 Count
  incrementHttpRequestCount(
    node_env: string,
    method: string,
    route: string,
    statusCode: string,
  ): void {
    this.httpRequestCounter.inc({
      node_env,
      method,
      route,
      status_code: statusCode,
    });
  }

  // HTTP 요청이 발생할 때마다 해당 요청의 시간을 잰다.
  recordHttpRequestDuration(
    node_env: string,
    method: string,
    route: string,
    statusCode: string,
    duration: number,
  ): void {
    this.httpRequestDuration.set(
      { node_env, method, route, status_code: statusCode },
      duration,
    );
  }

  // HTTP 요청이 발생할 때마다 요청 별로 누적 걸린 시간 잰다.
  incrementHttpRequestDuration(
    node_env: string,
    method: string,
    route: string,
    statusCode: string,
    duration: number,
  ): void {
    this.httpRequestDurationSum.inc(
      { node_env, method, route, status_code: statusCode },
      duration,
    );
  }
}
