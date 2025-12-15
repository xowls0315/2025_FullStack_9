import { CreateBasicDBDTO } from '../dto/create-basic-db-dto';

export const createNotionBody = (dto: CreateBasicDBDTO, pageId: string) => ({
  parent: { type: 'page_id', page_id: pageId },
  title: [{ type: 'text', text: { content: dto.title } }],
  properties: {
    이름: { title: {} },
    날짜: { date: {} },
    내용: { rich_text: {} },
  },
});

export const createNotionDataBody = (database_id, obj) => ({
  parent: {
    database_id: database_id,
  },
  properties: {
    이름: {
      title: [{ text: { content: obj.name } }],
    },
    날짜: {
      date: { start: obj.date },
    },
    내용: {
      rich_text: [{ text: { content: obj.text } }],
    },
  },
});
