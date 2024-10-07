import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

dotenv.config();
// const logDir = __dirname + '/../../log s'; // 로그 파일 저장 경로
const nodeMode = process.env.NODE_ENV ?? 'local';
console.log('nodeMode:', nodeMode);
const logDir = '/app/logs';
let transports: winston.transport[] = [];

if (nodeMode !== 'local') {
  transports = [
    // error 레벨 로그를 별도로 저장
    new winstonDaily({
      level: 'error',
      dirname: `${logDir}/error`,
      filename: '%DATE%.error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
      format: winston.format.json(),
    }),
    new winstonDaily({
      level: nodeMode === 'production' ? 'info' : 'silly', // silly 레벨 이상 로그를 기록
      dirname: nodeMode === 'production' ? `${logDir}/info` : `${logDir}/silly`, // 로그 파일 저장 경로
      filename:
        nodeMode === 'production' ? `%DATE%.info.log` : '%DATE%.silly.log', // 파일 이름 형식
      datePattern: 'YYYY-MM-DD', // 일별로 파일 생성
      zippedArchive: true, // 로그 파일을 압축
      maxFiles: '30d', // 30일치 로그 파일만 보관
      format: winston.format.json(),
      //maxSize //단일 로그 파일의 최대 크기, 크기를 넘어서면 다른 로그 파일이 생성됨.
    }),
  ];
  // 모든 레벨 로그를 파일에 저장
}

//Default - Console 표기
transports.push(
  new winston.transports.Console({
    level: nodeMode === 'production' ? 'info' : 'silly', // 개발 단계에서는 모든 레벨의 로그를 출력
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss', // 타임스탬프 형식
      }),
      utilities.format.nestLike('IEUM', {
        prettyPrint: true, // 가독성 좋은 포맷
        colors: true, // 로그에 색상 추가
      }),
    ),
  }),
);

//winston도 nestjs와 같은 loggerService를 사용함.
export const winstonLogger = WinstonModule.createLogger({
  level: 'silly',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss', // 타임스탬프 형식
    }),
    utilities.format.nestLike('IEUM', {
      // prettyPrint: true, // 가독성 좋은 포맷
      colors: true, // 로그에 색상 추가
    }),
  ),
  transports: transports,
  exitOnError: false, // 로깅 서비스에 에러가 발생해도 앱 종료 안 함
});
