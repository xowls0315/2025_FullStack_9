import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateBasicDBDTO } from './dto/create-basic-db-dto';
import {
  callNotionApi,
  createNotionDataBody,
  createNotionHeaders,
  NOTION_PAGE_URL,
  validateNotionConfig,
} from './notion';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async postBasicDB(dto: CreateBasicDBDTO): Promise<any> {
    const { token, pageId } = validateNotionConfig(
      this.config.get<string>('TOKEN'),
      this.config.get<string>('PAGEID'),
    );
    return callNotionApi(token, dto, pageId);
  }

  async postBasicDBdata(database_id: string) {
    const token = this.config.get('TOKEN');
    const data = [
      { name: '땡땡', date: '2025-06-01', text: '진짜' },
      { name: '뚱뚱', date: '2025-04-01', text: '가짜' },
    ];

    const responses = await Promise.all(
      data.map(async (v) => {
        const res = await fetch(NOTION_PAGE_URL, {
          method: 'POST',
          headers: createNotionHeaders(token),
          body: JSON.stringify(createNotionDataBody(database_id, v)),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(JSON.stringify(result));
        }

        return result;
      }),
    );

    return responses;
  }
}
