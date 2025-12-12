export class Patient {
  id: number;
  name: string; // 환자 이름
  injury: string; // 부상 부위/내용
  severity: '경상' | '부상' | '중상' | '심정지'; // 중증도
}
