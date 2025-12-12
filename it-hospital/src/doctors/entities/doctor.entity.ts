export class Doctor {
  id: number; // 식별자
  name: string; // 의사 이름
  major:
    | '외과'
    | '내과'
    | '이비인후과'
    | '안과'
    | '치과'
    | '성형외과'
    | '피부과'; // 전문과
  career: string[]; // 경력 (예: ["서울대병원 5년", "삼성병원 3년"])
}
