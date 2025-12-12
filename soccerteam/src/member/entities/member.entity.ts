export class Member {
  id: number;
  name: string;
  age: number;
  registerDate: Date;
  position: ('골키퍼' | '수비수' | '미드필더' | '공격수')[];
}
