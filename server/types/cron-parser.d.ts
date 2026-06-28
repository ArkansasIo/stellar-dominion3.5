declare module "cron-parser" {
  export class CronExpressionParser {
    static parse(expression: string): CronExpression;
  }

  export interface CronDate {
    toDate(): Date;
  }

  export interface CronExpression {
    next(): CronDate;
    previous(): CronDate;
    hasNext(): boolean;
    hasPrev(): boolean;
    reset(): void;
    fields: CronFields;
    intervals: CronIntervals;
  }

  export interface CronFields {
    second: number[];
    minute: number[];
    hour: number[];
    dayOfMonth: number[];
    month: number[];
    dayOfWeek: number[];
  }

  export interface CronIntervals {
    minute: number[];
  }
}
