import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: this.config.get('EMAIL_USER'),
        pass: this.config.get('EMAIL_PASS'),
      },
    });
  }

  async sendPwdResetEmail(email: string, token: string) {
    const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;
    const mailOptions = {
      to: email,
      subject: 'Password Reset',
      html: `Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
