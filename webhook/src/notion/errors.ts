export interface NotionApiError {
  status: number;
  message: string;
}

export class NotionApiException extends Error {
  constructor(
    public readonly status: number,
    public readonly errorMessage: string,
  ) {
    super(`Notion API 호출 실패: ${status} - ${errorMessage}`);
    this.name = 'NotionApiException';
  }
}

export const handleNotionApiError = async (
  response: Response,
): Promise<never> => {
  const errorText = await response.text();
  const error: NotionApiError = {
    status: response.status,
    message: errorText,
  };
  throw new NotionApiException(error.status, error.message);
};

