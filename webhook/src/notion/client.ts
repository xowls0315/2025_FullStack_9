import { CreateBasicDBDTO } from '../dto/create-basic-db-dto';
import { NOTION_DATABASE_URL } from './constants';
import { handleNotionApiError } from './errors';
import { createNotionRequestOptions } from './request';

export const callNotionApi = async (
  token: string,
  dto: CreateBasicDBDTO,
  pageId: string,
): Promise<any> => {
  const response = await fetch(
    NOTION_DATABASE_URL,
    createNotionRequestOptions(token, dto, pageId),
  );

  if (!response.ok) {
    return handleNotionApiError(response);
  }

  return response.json();
};
