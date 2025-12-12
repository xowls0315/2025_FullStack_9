// 비행기 시간표 타입
export class FlightSchedule {
  departure: string; // 출발지
  arrival: string; // 도착지
  departureDate: string; // '2025-12-11' 같은 형식
  departureTime: string; // '09:30' 같은 형식
}

export class Airplane {
  id: number; // 내부 식별자
  name: string; // 비행기명
  capacity: number; // 탑승 가능 인원수
  schedules: FlightSchedule[]; // 비행기 시간표 목록
}
