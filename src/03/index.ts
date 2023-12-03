import { Response } from '..';
import Day from '../day';

class NumPos {
  _x: [number, number] = [0, 0];
  _y: number;
  _value: number = 0;
  _selected = false;

  constructor(x: number, y: number) {
    this._x[0] = x;
    this._x[1] = x;
    this._y = y;
  }

  addToValue(value: string | number) {
    this._value = this._value * 10 + Number(value);
  }
}

export default class Day03 implements Day {
  allNumPos: NumPos[] = [];
  main(data: string): Response {
    const lines: string[] = data.split('\n');
    let result1 = 0;
    let result2 = 0;
    for (const [y, line] of lines.entries()) {
      let last = true;
      let num = new NumPos(0, y);
      this.allNumPos.push(num);
      for (const [x, char] of line.split('').entries()) {
        if (!last) {
          num = new NumPos(x, y);
          this.allNumPos.push(num);
        }
        if (!isNaN(Number(char))) {
          num._x[1] = x;
          num.addToValue(char);
          last = true;
        } else {
          last = false;
        }
      }
    }
    for (const [y, line] of lines.entries()) {
      for (const [x, char] of line.split('').entries()) {
        if (char.match(/[^\d.]/)) {
          const all = this.findAll(x, y).filter<number>(
            (it): it is number => it !== undefined && it !== 0
          );
          result1 += all.reduce<number>((a, b) => a + b, 0);
          if (char === '*' && all.length === 2) {
            result2 += all.reduce<number>((a, b) => a * b, 1);
          }
        }
      }
    }

    return [result1, result2];
  }

  findAll(x: number, y: number) {
    return [
      this.findAny(x - 1, y - 1),
      this.findAny(x, y - 1),
      this.findAny(x + 1, y - 1),
      this.findAny(x - 1, y),
      this.findAny(x + 1, y),
      this.findAny(x - 1, y + 1),
      this.findAny(x, y + 1),
      this.findAny(x + 1, y + 1),
    ];
  }

  findAny(x: number, y: number) {
    const numPos = this.allNumPos.findIndex(
      (it) => !it._selected && it._x[0] <= x && it._x[1] >= x && it._y === y
    );
    if (numPos === -1) return undefined;
    this.allNumPos[numPos]._selected = true;
    return this.allNumPos[numPos]._value;
  }
}
