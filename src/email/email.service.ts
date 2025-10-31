import { Injectable } from '@nestjs/common';
import { MailToReceiveTokenDTO } from './email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as hbs from 'handlebars';
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: this.configService.get('GMAIL_SEND'), // Gmail của bạn
            pass: this.configService.get('APP_PASSWORD_GMAIL_SEND'), // App Password
          },
    })
  }
  async sendEmail(to: string, name: string, verifyLink: string, subject: string = "Xác nhận verify email từ Blog app") {
    const html = this.renderTemplate('verify-email', { name, verifyLink });
    await this.transporter.sendMail(
        {
            from: `"Blog App" <${this.configService.get('GMAIL_SEND')}>`,
            to,
            subject: subject,
            html,
          } 
    )
  }

 

  private renderTemplate(templateName: string, context: Record<string, any>): string {
    const templatePath = path.resolve(
        process.cwd(),
        'src', // luôn trỏ về src chứ không phải dist
        'email',
        'templates',
        `${templateName}.hbs`,
      );
    const source = fs.readFileSync(templatePath, 'utf8');
    const compiled = hbs.compile(source);
    return compiled(context);
  }
}
