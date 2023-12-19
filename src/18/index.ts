import { Response } from '..';
import Day from '../day';

enum Dir {
  RIGHT = 'R',
  DOWN = 'D',
  LEFT = 'L',
  UP = 'U',
}

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Point(this.x, this.y);
  }
}

export default class Day18 implements Day {
  countArea(points: Point[], minY: any, maxY: number, minX: any, maxX: number) {
    let result = 0;
    let skipFirst = true;
    let previous = 0;
    for (let y = minY; y <= maxY; ++y) {
		console.log(`${Math.round(1000 * (y - minY) / (maxY - minY)) / 10}%`)
      if (!points.some((point) => point.y === y)) {
        if (skipFirst) {
          skipFirst = false;
        } else {
          result += previous;
          continue;
        }
      } else skipFirst = true;
      previous = 0;
      let inside = false;
      for (let x = minX; x <= maxX; ++x) {
        let foundIndex = points.findIndex(
          (point, i) =>
            point.x === x &&
            points[(i + 1) % points.length].x === x &&
            ((point.y < y && y <= points[(i + 1) % points.length].y) ||
              (point.y >= y && y > points[(i + 1) % points.length].y))
        );
        if (foundIndex !== -1) {
          inside = !inside;
          ++result;
          ++previous;
          continue;
        }
        if (
          inside ||
          points.some(
            (point, i) =>
              point.y === y &&
              points[(i + 1) % points.length].y === y &&
              ((point.x <= x && points[(i + 1) % points.length].x >= x) ||
                (point.x >= x && points[(i + 1) % points.length].x <= x))
          )
        ) {
          ++result;
          ++previous;
        }
      }
    }
    return result;
  }
  main(data: string): Response | Promise<Response> {
    const lines = data.split('\n').filter((it) => it !== '');
    let pos = new Point(0, 0);
    let pos2 = new Point(0, 0);
    const points = [];
    const points2 = [];
    let minY = Infinity;
    let maxY = -Infinity;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY2 = Infinity;
    let maxY2 = -Infinity;
    let minX2 = Infinity;
    let maxX2 = -Infinity;
    for (const line of lines) {
      const [dirString, countString, color] = line.split(' ');
      const dir = dirString as Dir;
      const count = Number(countString);
      const count2String = color.substring(2, 7);
      const count2 = parseInt(count2String, 16);
      points.push(pos.copy());
      minY = Math.min(minY, pos.y);
      maxY = Math.max(maxY, pos.y);
      minX = Math.min(minX, pos.x);
      maxX = Math.max(maxX, pos.x);
      switch (dir) {
        case Dir.UP:
          pos.y -= count;
          break;
        case Dir.RIGHT:
          pos.x += count;
          break;
        case Dir.DOWN:
          pos.y += count;
          break;
        case Dir.LEFT:
          pos.x -= count;
          break;
      }

      points2.push(pos2.copy());
      minY2 = Math.min(minY2, pos2.y);
      maxY2 = Math.max(maxY2, pos2.y);
      minX2 = Math.min(minX2, pos2.x);
      maxX2 = Math.max(maxX2, pos2.x);
      switch (color.substring(7, 8)) {
        case '0':
          pos2.x += count2;
          break;
        case '1':
          pos2.y += count2;
          break;
        case '2':
          pos2.x -= count2;
          break;
        case '3':
          pos2.y -= count2;
          break;
      }
    }

    let result1 = 0;
    let result2 = 0;

    result1 += this.countArea(points, minY, maxY, minX, maxX);
    result2 += this.countArea(points2, minY2, maxY2, minX2, maxX2);
    return [result1, result2];
  }
}
