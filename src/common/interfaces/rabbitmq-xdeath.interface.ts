export interface RabbitMqXDeath {
  count: number;
  reason: string;
  queue: string;
  time: Object;
  exchange: string;
  'routing-keys': string[]; // routing-keys
  'original-expiration': string; // original-expiration
  'x-first-death-exchange': string; // xFirstDeathExchange
  'x-first-death-queue': string; // xFirstDeathQueue
  'x-first-death-reason': string; // xFirstDeathReason
  'x-last-death-exchange': string; // xLastDeathExchange
  'x-last-death-queue': string; // xLastDeathQueue
  'x-last-death-reason': string; // xLastDeathReason
}
