# 🦄 MZ를 위한 노션 자동화 프로젝트

안녕하세요!  
이 프로젝트는 **Notion의 데이터베이스를 자동으로 생성**하고 관리할 수 있는 MZ취향 저격 TypeScript 백엔드 라이브러리입니다.  
토큰(`NOTION_TOKEN`)과 페이지ID(`NOTION_PAGE_ID`)만 세팅하면, 나만의 스프레드시트/플래너/메모장을 순식간에 만들어줍니다.

## 🎯 주요 특징

- **초 간단 설정:** 토큰과 페이지 ID만 넣으면 끝!
- **자동화된 DB 생성:** DTO에 맞춰 Notion 데이터베이스를 자동 생성
- **에러 핸들링:** 실패시 친절한 메시지와 예외 처리로 디버깅도 쉽다구!
- **MZ 스타일:** 코드도, 사용법도 쉽고 깔끔하게

## 🛠️ 사용법

1. `.env` 파일에 아래 환경변수를 세팅하세요.
   ```
   NOTION_TOKEN=내_노션_인터그레이션_토큰
   NOTION_PAGE_ID=데이터베이스를_생성할_페이지_ID
   ```
2. 필요한 DTO와 설정으로 함수 호출!

## 💡 예시

```ts
import { callNotionApi } from './src/notion/client';
import { CreateBasicDBDTO } from './src/dto/create-basic-db-dto';

const dto: CreateBasicDBDTO = {
  // 여기에 나만의 DB 구조 기입
};

callNotionApi(process.env.NOTION_TOKEN, dto, process.env.NOTION_PAGE_ID)
  .then((db) => console.log('나만의 노션 DB 생성 완료!', db))
  .catch((err) => console.error('실패ㅠㅠ:', err));
```

## 🙌 이런 분께 추천!

- Notion에 뭔가 자동으로 많이 만들고 싶은 MZ 세대
- 코드 어렵게 말고, 직관적으로 쓰고 싶은 분
- 예쁘고, 안정적인 백엔드 라이브러리가 필요한 분

지금 바로 경험해보세요! 🚀
