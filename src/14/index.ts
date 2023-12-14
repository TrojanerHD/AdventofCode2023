import { Response } from '..';
import Day from '../day';

class Point {
  _x: number;
  _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }
}

export default class Day14 implements Day {
  points: Point[] = [];
  hashtags: { _x: Map<number, number[]>; _y: Map<number, number[]> } = {
    _x: new Map(),
    _y: new Map(),
  };

  cloneAllPoints() {
    return this.points.map((it) => new Point(it._x, it._y));
  }

  printPoints(lines: string[]) {
    for (let y = 0; y < lines.length; ++y) {
      let line = '';
      for (let x = 0; x < lines[y].length; ++x) {
        let symbol = '.';
        if (this.points.some((it) => it._x === x && it._y === y)) symbol = 'O';

        if (this.hashtags._y.get(y)?.some((it) => it === x))
          if (symbol === 'O') throw new Error(`At ${x}, ${y}`);
          else symbol = '#';
        line += symbol;
      }
      console.log(line);
    }
  }

  stickToWall(cmp: (x: number) => boolean, incr: boolean, coord: '_y' | '_x') {
    const otherCoord: '_y' | '_x' = coord === '_x' ? '_y' : '_x';
    for (const [i, point] of this.points.entries()) {
      let newPos = point[coord];
      for (; cmp(newPos); newPos += incr ? 1 : -1) {
        const pointInWay = (this.hashtags[coord].get(newPos) ?? []).some(
          (it) => it === point[otherCoord]
        );
        if (pointInWay) {
          break;
        }
      }
      newPos += incr ? -1 : 1;
      while (
        this.points.some(
          (it, index) =>
            it[coord] === newPos &&
            it[otherCoord] === point[otherCoord] &&
            i !== index
        )
      )
        newPos += incr ? -1 : 1;
      point[coord] = newPos;
    }
  }

  main(data: string): Response | Promise<Response> {
    const origPoints: Point[] = [];
    const lines = data.split('\n').filter((it) => it !== '');
    for (let y = 0; y < lines.length; ++y) {
      for (const [x, char] of lines[y].split('').entries()) {
        if (char === 'O') {
          this.points.push(new Point(x, y));
          origPoints.push(new Point(x, y));
        }
        if (char === '#') {
          this.hashtags._x.set(x, (this.hashtags._x.get(x) ?? []).concat([y]));
          this.hashtags._y.set(y, (this.hashtags._y.get(y) ?? []).concat([x]));
        }
      }
    }

    this.stickToWall((y: number) => y >= 0, false, '_y');

    const result1 = this.points.reduce((a, b) => a + (lines.length - b._y), 0);

    this.points = origPoints;
    let total = 1_000_000_000;
    let prior = -1;
    let last: Point[][] = [];
    let i = 0;
    for (; i < total; ++i) {
      this.stickToWall((y: number) => y >= 0, false, '_y');
      this.stickToWall((x: number) => x >= 0, false, '_x');
      this.stickToWall((y: number) => y < lines.length, true, '_y');
      this.stickToWall((x: number) => x < lines[0].length, true, '_x');
      prior = last.findIndex((configuration) =>
        configuration.every((point) =>
          this.points.some((it) => it._x === point._x && it._y === point._y)
        )
      );
      if (prior !== -1) {
        last.splice(0, prior);
        break;
      }
      last.push(this.cloneAllPoints());
    }

    this.points = last[((total - i) % last.length) - 1];

    const result2 = this.points.reduce((a, b) => a + (lines.length - b._y), 0);
    return [result1, result2];
  }
}
