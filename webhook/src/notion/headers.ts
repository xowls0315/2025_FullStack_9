export const createNotionHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
});

