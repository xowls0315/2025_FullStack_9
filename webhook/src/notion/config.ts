export interface NotionConfig {
  token: string;
  pageId: string;
}

export const validateNotionConfig = (
  token: string | undefined,
  pageId: string | undefined,
): NotionConfig => {
  if (!token || !pageId) {
    throw new Error('TOKEN 또는 PAGEID 설정이 필요합니다.');
  }

  return { token, pageId };
};

