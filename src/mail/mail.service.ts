import * as FormData from 'form-data';
import got from 'got';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVars, MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly options: MailModuleOptions,
  ) {}

  private async sendEmail(
    subject: string,
    template: string,
    { key, value }: EmailVars,
  ) {
    const form = new FormData();
    form.append(
      'from',
      `Kimchi-King from Nuber Eats <mailgun@${this.options.domain}>`,
    );
    form.append('to', `adslonese@gmail.com`);
    form.append('subject', subject);
    form.append('template', template);
    form.append(key, value);
    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      });
    } catch (error) {
      console.log(error);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify Your Email', 'template_email', {
      key: 'h:X-Mailgun-Variables',
      value: JSON.stringify({ username: email, code }),
    });
  }
}
