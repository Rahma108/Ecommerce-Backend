import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
@Injectable()
export class EmailService {
  private APPLICATION_NAME: string;
  private GMAIL: string;
  private PASSWORD: string;
  private GITHUB: string;
  private INSTAGRAM_LINK: string;
  private LINKEDIN_LINK: string;

  constructor(private readonly configService: ConfigService) {
    this.APPLICATION_NAME = this.configService.get<string>(
      'APPLICATION_NAME',
    ) as string;
    this.GMAIL = this.configService.get<string>('GMAIL') as string;
    this.PASSWORD = this.configService.get<string>('PASSWORD') as string;
    this.GITHUB = this.configService.get<string>('GITHUB') as string;
    this.INSTAGRAM_LINK = this.configService.get<string>(
      'INSTAGRAM_LINK',
    ) as string;
    this.LINKEDIN_LINK = this.configService.get<string>(
      'LINKEDIN_LINK',
    ) as string;
  }

  async sendEmail({
    to,
    cc,
    bcc,
    subject,
    html,
    attachments = [],
  }: MailOptions): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.GMAIL,
        pass: this.PASSWORD,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: `"${this.APPLICATION_NAME}📩" <${this.GMAIL}>`,
        to,
        cc,
        bcc,
        subject,
        html,
        attachments,
      });

      console.log('Message sent:', info.messageId);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
   emailTemplate({ code, title }: { code: number; title: string }){
    return `<!DOCTYPE html>
                <html>
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
                <style type="text/css">
                body{background-color: #88BDBF;margin: 0px;}
                </style>
                <body style="margin:0px;"> 
                <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
                <tr>
                <td>
                <table border="0" width="100%">
                <tr>
                <td>
                <h1>
                    <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
                </h1>
                </td>
                <td>
                <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
                <tr>
                <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                </td>
                </tr>
                <tr>
                <td>
                <h1 style="padding-top:25px; color:#630E2B">${title}</h1>
                </td>
                </tr>
                <tr>
                <td>
                <p style="padding:0px 100px;">
                </p>
                </td>
                </tr>
                <tr>
                <td>
                <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${code}</p>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                <tr>
                <td>
                <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                </td>
                </tr>
                <tr>
                <td>
                <div style="margin-top:20px;">

                <a href="${this.LINKEDIN_LINK}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="50px" hight="50px"></span></a>
                
                <a href="${this.INSTAGRAM_LINK}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
                </a>
                
                <a href="${this.GITHUB}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
                <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" width="50px" hight="50px"></span>
                </a>

                </div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </body>
                </html>`;
  }
}
