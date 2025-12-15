import { Injectable } from '@nestjs/common';
import { CreateNotionDto } from './dto/create-notion.dto';
import { UpdateNotionDto } from './dto/update-notion.dto';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { parseKakaoTxt, renderKakaoByDate } from 'src/kakao';

@Injectable()
export class NotionService {
  constructor(private config: ConfigService) {}

  async create(createNotionDto: CreateNotionDto) {
    const token = this.config.get('TOKEN');
    const page = this.config.get('PAGE');
    const url = this.config.get('APIURL');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
      parent: {
        type: 'page_id',
        page_id: page,
      },
      title: [{ type: 'text', text: { content: '학생 관리 DB' } }],
      properties: {
        이름: { title: {} },
        날짜: { date: {} },
        재적상태: {
          select: {
            options: [
              { name: '재학', color: 'yellow' },
              { name: '퇴학', color: 'red' },
              { name: '휴학', color: 'green' },
              { name: '졸업', color: 'gray' },
            ],
          },
        },
        성향: {
          multi_select: {
            options: [
              { name: '밝음', color: 'yellow' },
              { name: '조용함', color: 'green' },
              { name: '신비주의', color: 'red' },
              { name: '4차원', color: 'gray' },
            ],
          },
        },
      },
    });

    const result = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
    const data = await result.json();
    return data;
  }

  async addData() {
    const students = [
      {
        name: '이영철',
        registerDate: '2025-06-01',
        personality: ['밝음', '신비주의'],
      },
      {
        name: '신여진',
        registerDate: '2025-04-01',
        personality: ['밝음', '4차원'],
      },
    ];
    const token = this.config.get('TOKEN');
    const page = this.config.get('PAGE');
    const url = this.config.get('PAGEURL');
    const database_id = '2cae86ad68ec813d84d7e8c245af4a37';
    const headers = {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    };
    await Promise.all(
      students.map((v) => {
        return fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            parent: { database_id },
            properties: {
              이름: {
                title: [{ text: { content: v.name } }],
              },
              날짜: {
                date: { start: v.registerDate },
              },
              성향: {
                multi_select: v.personality.map((p) => ({ name: p })),
              },
              재적상태: {
                select: { name: '재학' },
              },
            },
          }),
        }).then((v) => v.json());
      }),
    );
    return '끝';
  }

  async createKakaoDailyDb() {
    const token = this.config.get('TOKEN');
    const page = this.config.get('PAGE');
    const url = this.config.get('APIURL');

    const headers = {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    };

    // ✅ “하루 = 1 Row” 스키마
    const body = {
      parent: { type: 'page_id', page_id: page },
      title: [{ type: 'text', text: { content: '카카오톡 일자별 로그 DB' } }],
      properties: {
        제목: { title: {} }, // ✅ Row 클릭용(필수). 날짜 문자열을 넣을 컬럼
        날짜: { date: {} }, // ✅ 정렬/필터용
        요일: {
          select: {
            options: [
              { name: '월요일', color: 'blue' },
              { name: '화요일', color: 'blue' },
              { name: '수요일', color: 'blue' },
              { name: '목요일', color: 'blue' },
              { name: '금요일', color: 'blue' },
              { name: '토요일', color: 'purple' },
              { name: '일요일', color: 'purple' },
            ],
          },
        },
        내용: { rich_text: {} }, // ✅ “그 날짜 카톡 전체 내용”을 넣을 컬럼
        메시지수: { number: {} }, // ✅ 선택: 그 날 메시지 개수
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(
        `Notion API Error ${res.status}: ${JSON.stringify(json)}`,
      );
    }

    // json.id 가 database_id
    return json;
  }

  async kakaoLog() {
    const filePath = path.join(__dirname, '../../group.txt');

    try {
      const raw = fs.readFileSync(filePath, { encoding: 'utf8' });

      // 1) TXT -> 구조화(JSON)
      const groups = parseKakaoTxt(raw);

      // 2) Notion 설정
      const token = this.config.get('TOKEN');
      const url = this.config.get('PAGEURL');
      const database_id = '2cae86ad68ec816a85e6c430e86bcd0d';

      const headers = {
        Authorization: `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      };

      // 3) rich_text 안전 분할
      const chunkRichText = (content: string, chunkSize = 1800) => {
        const chunks: { text: { content: string } }[] = [];
        for (let i = 0; i < content.length; i += chunkSize) {
          chunks.push({ text: { content: content.slice(i, i + chunkSize) } });
        }
        return chunks;
      };

      // 4) 날짜 1개 = row 1개로 업로드 (레이트리밋 방지 위해 순차 처리 권장)
      const results: any[] = [];

      for (const g of groups) {
        // 하루 전체 텍스트 합치기 (메시지 단위 합침)
        const dayText = g.messages
          .map((m) => `[${m.ampm} ${m.time}] ${m.sender}\n${m.text}`.trim())
          .join('\n\n');

        // ✅ DB 스키마에 맞춘 properties
        const properties: any = {
          제목: { title: [{ text: { content: g.date } }] }, // ⭐ Row 제목(클릭 시 보임)
          날짜: { date: { start: g.date } }, // ⭐ 필수(정렬/필터)
          내용: { rich_text: chunkRichText(dayText) }, // ⭐ 하루 전체 내용
          // 아래 2개는 DB에 해당 컬럼이 있을 때만 유지
          ...(g.dowKo ? { 요일: { select: { name: g.dowKo } } } : {}),
          메시지수: { number: g.messages.length },
        };

        const body = {
          parent: { database_id },
          properties,
        };

        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(
            `Notion API Error ${res.status}: ${JSON.stringify(json)}`,
          );
        }

        results.push(json);
      }

      return { message: '끝', insertedDays: results.length };
    } catch (error) {
      console.error('Failed to read/insert group.txt:', error);
      return null;
    }
  }

  async createKakaoDailyDb2() {
    const token = this.config.get('TOKEN');
    const page = this.config.get('PAGE');
    const url = this.config.get('APIURL');

    const headers = {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    };

    // ✅ “하루 = 1 Row” 스키마
    const body = {
      parent: { type: 'page_id', page_id: page },
      title: [{ type: 'text', text: { content: '카카오톡 웹개발 단톡방 DB' } }],
      properties: {
        제목: { title: {} }, // ✅ Row 클릭용(필수). 날짜 문자열을 넣을 컬럼
        날짜: { date: {} }, // ✅ 정렬/필터용
        요일: {
          select: {
            options: [
              { name: '월요일', color: 'blue' },
              { name: '화요일', color: 'blue' },
              { name: '수요일', color: 'blue' },
              { name: '목요일', color: 'blue' },
              { name: '금요일', color: 'blue' },
              { name: '토요일', color: 'purple' },
              { name: '일요일', color: 'purple' },
            ],
          },
        },
        내용: { rich_text: {} }, // ✅ “그 날짜 카톡 전체 내용”을 넣을 컬럼
        메시지수: { number: {} }, // ✅ 선택: 그 날 메시지 개수
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(
        `Notion API Error ${res.status}: ${JSON.stringify(json)}`,
      );
    }

    // json.id 가 database_id
    return json;
  }

  async kakaoLog2() {
    const filePath = path.join(__dirname, '../../group2.txt');

    try {
      const raw = fs.readFileSync(filePath, { encoding: 'utf8' });

      // 1) TXT -> 구조화(JSON)
      const groups = parseKakaoTxt(raw);

      // 2) Notion 설정
      const token = this.config.get('TOKEN');
      const url = this.config.get('PAGEURL');
      const database_id = '2cae86ad68ec813a8484e312f292f6a2';

      const headers = {
        Authorization: `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      };

      // 3) rich_text 안전 분할
      const chunkRichText = (content: string, chunkSize = 1800) => {
        const chunks: { text: { content: string } }[] = [];
        for (let i = 0; i < content.length; i += chunkSize) {
          chunks.push({ text: { content: content.slice(i, i + chunkSize) } });
        }
        return chunks;
      };

      // 4) 날짜 1개 = row 1개로 업로드 (레이트리밋 방지 위해 순차 처리 권장)
      const results: any[] = [];

      for (const g of groups) {
        // 하루 전체 텍스트 합치기 (메시지 단위 합침)
        const dayText = g.messages
          .map((m) => `[${m.ampm} ${m.time}] ${m.sender}\n${m.text}`.trim())
          .join('\n\n');

        // ✅ DB 스키마에 맞춘 properties
        const properties: any = {
          제목: { title: [{ text: { content: g.date } }] }, // ⭐ Row 제목(클릭 시 보임)
          날짜: { date: { start: g.date } }, // ⭐ 필수(정렬/필터)
          내용: { rich_text: chunkRichText(dayText) }, // ⭐ 하루 전체 내용
          // 아래 2개는 DB에 해당 컬럼이 있을 때만 유지
          ...(g.dowKo ? { 요일: { select: { name: g.dowKo } } } : {}),
          메시지수: { number: g.messages.length },
        };

        const body = {
          parent: { database_id },
          properties,
        };

        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(
            `Notion API Error ${res.status}: ${JSON.stringify(json)}`,
          );
        }

        results.push(json);
      }

      return { message: '끝', insertedDays: results.length };
    } catch (error) {
      console.error('Failed to read/insert group2.txt:', error);
      return null;
    }
  }
}
