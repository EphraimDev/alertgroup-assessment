import { createLogger, format, transports } from 'winston';
import * as rTracer from 'cls-rtracer';
import * as path from 'path';
import * as fs from 'fs';
import Module from 'module';
import { Injectable } from '@nestjs/common';

const { combine, timestamp, label, printf } = format;

@Injectable()
export class LoggerUtils {
  constructor() {}

  private getLogLabel = (callingModule: any) => {
    const parts = callingModule.filename.split(path.sep);
    return path.join(parts[parts.length - 2], parts.pop());
  };

  private formatDate = () => {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${year}${month}${day}`;
  };

  private getFile = (type: string) => {
    const d = this.formatDate();
    const filename = `logs/${d}${type}.log`;
    fs.open(filename, 'r', function (err, fd) {
      if (err) {
        fs.writeFile(filename, '', function (err) {
          if (err) {
            return `logs/${type}.log`;
          }
          return filename;
        });
      } else {
        return filename;
      }
    });
    return filename;
  };

  /**
   * Creates a Winston logger object.
   * ### Log Format
   * *| timestamp | request-id | module/filename | log level | log message |*
   *
   * @param {Module} callingModule the module from which the logger is called
   */
  logger = (callingModule: Module) =>
    createLogger({
      format: combine(
        format.colorize(),
        label({ label: this.getLogLabel(callingModule) }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf((info) => {
          const rid = rTracer.id();
          return rid
            ? `| ${info.timestamp} | ${rid} | ${info.label} | ${info.message} |`
            : `| ${info.timestamp} | ${info.label} | ${info.message} |`;
        }),
      ),
      transports: [
        new transports.Console({
          // silent: process.env.NODE_ENV === "production"
        }),
        new transports.File({
          filename: this.getFile('info'),
          level: 'info',
        }),
        new transports.File({
          filename: this.getFile('error'),
          level: 'error',
        }),
      ],
      exitOnError: false,
    });
}
