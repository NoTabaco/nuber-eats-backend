import * as FormData from 'form-data';
import got from 'got';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly options: MailModuleOptions,
  ) {
    this.sendEmail('Kimchi', `template_email`);
  }

  private async sendEmail(subject: string, template: string) {
    const form = new FormData();
    form.append('from', `Excited User <mailgun@${this.options.domain}>`);
    form.append('to', `adslonese@gmail.com`);
    form.append('subject', subject);
    form.append('template', template);
    form.append(
      'h:X-Mailgun-Variables',
      `{
        "username": "Kimchi-King",
        "code": "Perfect-Kimchi"
        }`,
    );
    const response = await got(
      `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      },
    );
  }
}
