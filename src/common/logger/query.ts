import { EntitySubscriberInterface, EventSubscriber } from "typeorm";

@EventSubscriber()
export class QueryLoggerSubscriber implements EntitySubscriberInterface {
  private queryTimes = new Map<string, number>();

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
        
        result = result.replace(placeholder, value);
      });
    }
    return result;
  }
}