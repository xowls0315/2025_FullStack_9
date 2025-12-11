import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenusService {
  // 메모리에 menu들을 저장할 배열
  private menus: Menu[] = [
    { id: 1, name: '아메리카노', price: 1000, shot: 2 },
    { id: 2, name: '라떼', price: 2000, shot: 1 },
    { id: 3, name: '모카', price: 2500, shot: 1 },
  ];
  // 초기 데이터 기반으로 nextId 자동 설정
  private nextId = Math.max(...this.menus.map((v) => v.id)) + 1; // auto-increment 역할

  // CREATE: menu 추가
  create(createMenuDto: CreateMenuDto): Menu {
    const newMenu: Menu = {
      id: this.nextId++,
      name: createMenuDto.name,
      price: createMenuDto.price,
      shot: createMenuDto.shot,
    };

    this.menus.push(newMenu);
    return newMenu;
  }

  // READ ALL: 전체 menu 리스트 조회
  findAll(): Menu[] {
    return this.menus;
  }

  // READ ONE: id로 menu 한개 조회
  findOne(id: number): Menu {
    const menu = this.menus.find((v) => v.id === id);
    if (!menu) {
      throw new NotFoundException(`${id}번의 메뉴는 존재하지 않습니다.`);
    }
    return menu;
  }

  // UPDATE: id로 menu 정보 수정
  update(id: number, updateMenuDto: UpdateMenuDto): Menu {
    const menu = this.findOne(id); // 못 찾으면 여기서 NotFoundException

    if (updateMenuDto.name !== undefined) {
      menu.name = updateMenuDto.name;
    }
    if (updateMenuDto.price !== undefined) {
      menu.price = updateMenuDto.price;
    }
    if (updateMenuDto.shot !== undefined) {
      menu.shot = updateMenuDto.shot;
    }

    return menu;
  }

  // DELETE: id로 menu 삭제
  remove(id: number): string {
    const index = this.menus.findIndex((v) => v.id === id);

    if (index === -1) {
      throw new NotFoundException(`${id}번의 메뉴는 존재하지 않습니다.`);
    }

    this.menus.splice(index, 1);
    return `${id}번의 메뉴가 삭제되었습니다!`;
  }
}
