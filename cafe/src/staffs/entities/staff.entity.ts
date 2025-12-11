// /staffs => name, position, startDate
// ex) ["J", "점장", "2015/01/01"], ["여진쓰", "부점장", "2017/05/01"], ["율쓰", "슈퍼바이저", "2020/04/01"]
export class Staff {
  id: number;
  name: string;
  position: '바리스타' | '슈퍼바이저' | '점장' | '부점장';
  startDate: Date;
}
