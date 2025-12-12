export type Membership = 'BRONZE' | 'SILVER' | 'GOLD';

export class Passenger {
  id: number;
  name: string; // 이름
  passport: string; // 패스포트 번호
  membership: Membership; // 멤버쉽 등급
}
