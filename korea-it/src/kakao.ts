export type KakaoMessage = {
  date: string; // "2025-12-15"
  dowKo?: string; // "월요일"
  sender: string; // "전수효"
  ampm: '오전' | '오후';
  time: string; // "9:07"
  text: string; // 메시지 본문(개행 포함)
};

export type KakaoDayGroup = {
  date: string;
  dowKo?: string;
  messages: KakaoMessage[];
};

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * 날짜 헤더 파싱
 * - "--------------- 2025년 12월 15일 월요일 ---------------"
 * - "2025년 12월 15일 월요일"
 */
export const parseKakaoDateHeader = (
  line: string,
): { date: string; dowKo?: string } | null => {
  const trimmed = line.trim();

  // 하이픈 유무/개수와 무관하게 인식
  const m = trimmed.match(
    /^(?:-+\s*)?(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일(?:\s*([가-힣]+))?(?:\s*-+)?$/,
  );
  if (!m) return null;

  const [, y, mo, d, dowKo] = m;
  const date = `${y}-${pad2(+mo)}-${pad2(+d)}`;

  return {
    date,
    ...(dowKo?.trim() ? { dowKo: dowKo.trim() } : {}),
  };
};

/**
 * 메시지 시작 라인 판별
 * - "[이영철] [오후 12:55] 내용..."
 * - 공백이 여러 개/없어도 견딤
 */
export function isMessageStart(line: string) {
  return /^\[[^\]]+\]\s*\[(오전|오후)\s*\d{1,2}:\d{2}\]\s*/.test(line);
}

export function parseMessageStart(line: string): {
  sender: string;
  ampm: '오전' | '오후';
  time: string;
  text: string;
} {
  const m = line.match(
    /^\[([^\]]+)\]\s*\[(오전|오후)\s*(\d{1,2}:\d{2})\]\s*(.*)$/,
  );
  if (!m) throw new Error('Invalid message line: ' + line);

  const [, sender, ampm, time, text] = m;
  return {
    sender: sender.trim(),
    ampm: ampm as '오전' | '오후',
    time,
    text: text ?? '',
  };
}

/**
 * TXT -> 날짜별 그룹(JSON)
 * - 메시지 본문은 "원문 들여쓰기" 유지
 * - 메시지 종료 시 우측 공백 정리
 */
export function parseKakaoTxt(txt: string): KakaoDayGroup[] {
  const lines = txt.replace(/\r\n/g, '\n').split('\n');

  const groups: KakaoDayGroup[] = [];
  let currentDay: KakaoDayGroup | null = null;
  let currentMsg: KakaoMessage | null = null;

  const pushCurrentMsg = () => {
    if (!currentDay || !currentMsg) return;

    // 줄 끝 공백 제거 + trailing newline 정리
    currentMsg.text = currentMsg.text.replace(/[ \t]+$/gm, '').trimEnd();
    currentDay.messages.push(currentMsg);
    currentMsg = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // 1) 날짜 헤더
    const day = parseKakaoDateHeader(line);
    if (day) {
      pushCurrentMsg();
      currentDay = { ...day, messages: [] };
      groups.push(currentDay);
      continue;
    }

    // 날짜 섹션 밖은 스킵
    if (!currentDay) continue;

    // 2) 메시지 시작
    if (isMessageStart(line)) {
      pushCurrentMsg();
      const m = parseMessageStart(line);
      currentMsg = {
        date: currentDay.date,
        dowKo: currentDay.dowKo,
        sender: m.sender,
        ampm: m.ampm,
        time: m.time,
        text: m.text ?? '',
      };
      continue;
    }

    // 3) 메시지 본문 이어붙이기
    if (currentMsg) {
      currentMsg.text += (currentMsg.text ? '\n' : '') + rawLine; // 원문 들여쓰기 유지
    }
  }

  pushCurrentMsg();
  return groups;
}

/**
 * 첨부 텍스트 치환(옵션)
 * - "사진" / "동영상" / "파일" 같은 라인을 보기 좋게 바꿈
 */
export function normalizeAttachmentText(text: string): string {
  return text
    .split('\n')
    .map((line) => {
      const t = line.trim();
      if (t === '사진') return '📷 사진';
      if (t === '동영상') return '🎞️ 동영상';
      if (t === '파일') return '📎 파일';
      return line;
    })
    .join('\n');
}

/**
 * 날짜별 예쁜 출력(렌더링) - “노션 본문에 그대로 넣기 좋은 문자열”
 * - 날짜 헤더 + 메시지들을 시간순으로 나열
 */
export function renderKakaoByDate(txt: string) {
  const groups = parseKakaoTxt(txt);

  return groups
    .map((g) => {
      const header = `📅 ${g.date}${g.dowKo ? ` (${g.dowKo})` : ''}`;

      const body = g.messages
        .map((m) => {
          const normalized = normalizeAttachmentText(m.text);

          // 메시지 본문이 여러 줄이면 보기 좋게 들여쓰기
          const lines = normalized.split('\n');
          const first = lines[0] ?? '';
          const rest = lines
            .slice(1)
            .map((l) => `    ${l}`)
            .join('\n');

          const head = `- [${m.ampm} ${m.time}] ${m.sender}: ${first}`;
          return rest ? `${head}\n${rest}` : head;
        })
        .join('\n');

      return `${header}\n${body}`;
    })
    .join('\n\n');
}

/**
 * (추가) “하루 전체 텍스트”를 만드는 함수
 * - 하루=1Row 전략에 최적화: rich_text/property 또는 page 본문에 넣기 좋음
 */
export function buildDayContent(group: KakaoDayGroup): string {
  return group.messages
    .map((m) => {
      const normalized = normalizeAttachmentText(m.text);
      return `[${m.ampm} ${m.time}] ${m.sender}\n${normalized}`.trim();
    })
    .join('\n\n');
}
