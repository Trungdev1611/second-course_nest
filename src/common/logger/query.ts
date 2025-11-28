import { EntitySubscriberInterface, EventSubscriber } from "typeorm";

@EventSubscriber()
export class QueryLoggerSubscriber implements EntitySubscriberInterface {
  private queryTimes = new Map<string, number>();
  private static scopeTimers = new Map<string, number>();
  private static scopeAggregations = new Map<string, number>();

  private colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m',
    cyan: '\x1b[36m',
  };

  beforeQuery(event: any) {
    if (event.query) {
      this.queryTimes.set(event.query, Date.now());
    }
  }

  afterQuery(event: any) {
    if (event.query) {
      const startTime = this.queryTimes.get(event.query);
      if (startTime) {
        const duration = Date.now() - startTime;
        
        // Chọn màu
        let color = this.colors.green;
        let icon = '⚡';
        let status = 'Fast';
        
        if (duration > 50) {
          color = this.colors.yellow;
          icon = '⚠️ ';
          status = 'Moderate';
        }
        if (duration > 200) {
          color = this.colors.red;
          icon = '🐌';
          status = 'Slow';
        }
        
        // Thay parameters
        let executableQuery = this.replaceParams(event.query, event.parameters);
        
        console.log(
          `\n${icon} ${color}${duration}ms (${status})${this.colors.reset}\n` +
          `${this.colors.cyan}${executableQuery}${this.colors.reset}\n`
        );
        
        this.queryTimes.delete(event.query);
      }
    }
  }

  private replaceParams(query: string, parameters?: any[]): string {
    let result = query;
    if (parameters?.length) {
      parameters.forEach((param: any, index: number) => {
        const placeholder = `$${index + 1}`;
        let value: string;
        
        if (param === null || param === undefined) {
          value = 'NULL';
        } else if (typeof param === 'string') {
          value = `'${param.replace(/'/g, "''")}'`;
        } else if (typeof param === 'boolean') {
          value = param ? 'TRUE' : 'FALSE';
        } else if (typeof param === 'object') {
          value = `'${JSON.stringify(param).replace(/'/g, "''")}'`;
        } else {
          value = String(param);
        }
        
        const regex = new RegExp(`\\${placeholder}`, 'g');
        result = result.replace(regex, value);
      });
    }
    return result;
  }
  
  /**
   * Shared helpers giúp đo thời gian tổng quát cho bất kỳ hàm/service nào
   * ví dụ:
   * QueryLoggerSubscriber.startScope('BlogRepository.findAndPaginate');
   * ... logic
   * QueryLoggerSubscriber.endScope('BlogRepository.findAndPaginate');
   */
  static startScope(label: string) {
    QueryLoggerSubscriber.scopeTimers.set(label, performance.now ? performance.now() : Date.now());
  }

  static endScope(label: string) {
    const start = QueryLoggerSubscriber.scopeTimers.get(label);
    if (!start) return;

    QueryLoggerSubscriber.scopeTimers.delete(label);
    const end = performance.now ? performance.now() : Date.now();
    const duration = end - start;
    const prevTotal = QueryLoggerSubscriber.scopeAggregations.get(label) || 0;
    const newTotal = prevTotal + duration;
    QueryLoggerSubscriber.scopeAggregations.set(label, newTotal);

    const formatter = duration > 200 ? '\x1b[31m' : duration > 50 ? '\x1b[33m' : '\x1b[32m';
    const resetColor = '\x1b[0m';
    console.log(
      `⏱️ ${formatter}${label}${resetColor} took ${duration.toFixed(2)}ms (total ${newTotal.toFixed(2)}ms)`
    );
  }

  static resetScope(label?: string) {
    if (label) {
      QueryLoggerSubscriber.scopeAggregations.delete(label);
      QueryLoggerSubscriber.scopeTimers.delete(label);
      return;
    }
    QueryLoggerSubscriber.scopeAggregations.clear();
    QueryLoggerSubscriber.scopeTimers.clear();
  }
}