import { CreateBasicDBDTO } from '../dto/create-basic-db-dto';
import { createNotionBody } from './body';
import { createNotionHeaders } from './headers';

export const createNotionRequestOptions = (
  token: string,
  dto: CreateBasicDBDTO,
  pageId: string,
): RequestInit => ({
  method: 'POST',
  headers: createNotionHeaders(token),
  body: JSON.stringify(createNotionBody(dto, pageId)),
});

