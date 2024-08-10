import * as nodemailer from 'nodemailer';
import { Cache } from 'cache-manager';
import { Logger } from './logger';
import { Config } from 'src/config/configuration';

export class EmailTools {
  private static directory: string = '/auth/email/codes';
  private static cacheManager: Cache;
  private static emailConfig: Config['email'];
  static setCacheManager(cache: Cache) {
    this.cacheManager = cache;
  }
  static setEmailConfig(config: Config['email']) {
    this.emailConfig = config;
  }
  static async sendVerificationEmail(email: string) {
    const code = genVerificationCode();
    const transporter = nodemailer.createTransport({
      host: this.emailConfig.host,
      port: this.emailConfig.port,
      secure: this.emailConfig.secure,
      auth: {
        user: this.emailConfig.user,
        pass: this.emailConfig.pass,
      },
    });

    const mailOptions = {
      from: this.emailConfig.user,
      to: email,
      subject: '邮箱验证码',
      text: `您的验证码是: ${code}`,
      html: `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9; border-radius: 10px; max-width: 600px; margin: 0 auto;">
      <p style="font-size: 18px; color: #555;">亲爱的用户</p>
      <p style="font-size: 16px; color: #555;">感谢您使用IMJoye的服务！您的验证码如下：</p>
      <p style="font-size: 24px; color: #6a11cb; font-weight: bold; margin: 20px 0;">${code}</p>
      <p style="font-size: 16px; color: #555;">此验证码有效期为1分钟，请尽快使用。</p>
      <p style="font-size: 14px; color: #999;">如果您未请求此验证码，请忽略此邮件。</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    </div>
  `,
    };
    await transporter.sendMail(mailOptions);
    // TODO save code to redis
    await this.cacheManager.set(`${this.directory}/${email}`, code, {
      ttl: 60,
    });
  }

  static async verifyEmailCode(email: string, code: string) {
    if (code.length !== 6) return false;
    // TODO verify code
    const savedCode = await this.cacheManager.get<string>(
      `${this.directory}/${email}`,
    );
    Logger.log(code, savedCode);
    return savedCode === code;
  }
}

export function genVerificationCode() {
  let code = Math.floor(Math.random() * 999999).toString();
  if (code.length < 6) {
    code = '0'.repeat(6 - code.length) + code;
  }
  return code;
}
