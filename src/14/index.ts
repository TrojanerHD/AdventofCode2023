import { Response } from '..';
import Day from '../day';

class Point {
  _x: number;
  _y: number;
  _val: string;
  constructor(x: number, y: number, val: string) {
    this._x = x;
    this._y = y;
    this._val = val;
  }
}

export default class Day14 implements Day {
  main(data: string): Response | Promise<Response> {
    const lines = data.split('\n').filter((it) => it !== '');
    let result1 = 0;
    const points: Point[] = [];
    for (let y = 0; y < lines.length; ++y) {
      for (const [x, char] of lines[y].split('').entries()) {
        let insertY = y;
        if (char === 'O') {
          for (
            ;
            insertY > 0 &&
            !points.some((point) => point._x === x && point._y === insertY);
            --insertY
          );
          result1 += lines.length - insertY;
        }
        if (['O', '#'].includes(char)) {
          points.push(new Point(x, ++insertY, char));
        }
      }
    }
    return [result1];
  }
}
