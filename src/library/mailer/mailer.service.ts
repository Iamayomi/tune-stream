import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';
import { APP_NAME } from 'src/library/config/constants';
import { MailOptions, MailOptionsV2 } from './types';

@Injectable()
export class MailService {
  private viewPath: string;
  private sender: string;

  constructor(private readonly mailerService: MailerService) {
    this.viewPath = path.join(__dirname, '..', '..', 'views', 'emails');
  }

  /**
   * Sends emails using nodemailer and gmail as mail service
   * @param payload [MailOptions]
   */
  public async viaNodemailer(payload: MailOptions) {
    const { from, html, text, subject, attachments, to } = payload;

    const mailOptions = {
      to,
      subject,
      html,
      text,
      attachments,
    };

    return await this.mailerService.sendMail(mailOptions);
  }

  /**
   * Sends emails using nodemailer and gmail as mail service
   * @param payload [MailOptionsV2]
   */
  public async send(payload: MailOptionsV2) {
    const { from, subject, to, template, context } = payload;

    const mailOptions: MailOptionsV2 = {
      to,
      subject,
      template,
      context,
    };

    // const options: NodemailerExpressHandlebarsOptions = {
    //   viewEngine: {
    //     extname: ".handlebars",
    //     partialsDir: this.viewPath,
    //     defaultLayout: false,
    //   },
    //   viewPath: this.viewPath,
    //   extName: ".handlebars",
    // };

    // transporter.use("compile", htmlToText({ wordwrap: 130 }));
    // transporter.use("compile", hbs(options));

    return await this.mailerService.sendMail(mailOptions);
  }
}
