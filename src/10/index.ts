import { Response } from '..';
import Day from '../day';

enum Pipe {
  VERTICAL,
  HORIZONTAL,
  NE,
  NW,
  SW,
  SE,
  S,
  G,
}

class Point {
  x: number;
  y: number;
  val: Pipe;
  dist: number = -1;
  static points: Point[] = [];
  static sDir?: Pipe;

  constructor(x: number, y: number, val: Pipe) {
    this.x = x;
    this.y = y;
    this.val = val;
  }
  neighbors() {
    const filteredPoints = Point.points.filter(
      (point) => point.x !== this.x || point.y !== this.y
    );
    const left = filteredPoints.find(
      (point) =>
        point.x === this.x - 1 &&
        point.y === this.y &&
        [Pipe.HORIZONTAL, Pipe.NE, Pipe.SE].includes(point.val)
    );
    const right = filteredPoints.find(
      (point) =>
        point.x === this.x + 1 &&
        point.y === this.y &&
        [Pipe.HORIZONTAL, Pipe.NW, Pipe.SW].includes(point.val)
    );
    const up = filteredPoints.find(
      (point) =>
        point.x === this.x &&
        point.y === this.y - 1 &&
        [Pipe.VERTICAL, Pipe.SW, Pipe.SE].includes(point.val)
    );
    const down = filteredPoints.find(
      (point) =>
        point.x === this.x &&
        point.y === this.y + 1 &&
        [Pipe.VERTICAL, Pipe.NE, Pipe.NW].includes(point.val)
    );

    const neighbors = [];
    switch (this.val) {
      case Pipe.S:
        let possibleDirections = [
          Pipe.HORIZONTAL,
          Pipe.VERTICAL,
          Pipe.NE,
          Pipe.NW,
          Pipe.SE,
          Pipe.SW,
        ];
        if (left !== undefined) {
          neighbors.push(left);
          possibleDirections = possibleDirections.filter(
            (pipe) => ![Pipe.VERTICAL, Pipe.NE, Pipe.SE].includes(pipe)
          );
        }
        if (right !== undefined) {
          neighbors.push(right);
          possibleDirections = possibleDirections.filter(
            (pipe) => ![Pipe.VERTICAL, Pipe.NW, Pipe.SW].includes(pipe)
          );
        }
        if (up !== undefined) {
          neighbors.push(up);
          possibleDirections = possibleDirections.filter(
            (pipe) => ![Pipe.HORIZONTAL, Pipe.SW, Pipe.SE].includes(pipe)
          );
        }
        if (down !== undefined) {
          neighbors.push(down);
          possibleDirections = possibleDirections.filter(
            (pipe) => ![Pipe.HORIZONTAL, Pipe.NE, Pipe.NW].includes(pipe)
          );
        }
        neighbors.length = 2;
        Point.sDir = possibleDirections[0];
        Point.points[
          Point.points.findIndex((point) => point.val === Pipe.S)
        ].val = possibleDirections[0];
        break;
      case Pipe.VERTICAL:
        neighbors.push(up);
        neighbors.push(down);
        break;

      case Pipe.HORIZONTAL:
        neighbors.push(left);
        neighbors.push(right);
        break;
      case Pipe.NE:
        neighbors.push(right);
        neighbors.push(up);
        break;
      case Pipe.NW:
        neighbors.push(left);
        neighbors.push(up);
        break;
      case Pipe.SW:
        neighbors.push(left);
        neighbors.push(down);
        break;
      case Pipe.SE:
        neighbors.push(right);
        neighbors.push(down);
        break;
    }
    return neighbors.filter(
      (neighbor): neighbor is Point => neighbor !== undefined
    );
  }
  neighbor() {
    return this.neighbors().filter((point) => point.dist === -1)[0];
  }
}

export default class Day10 implements Day {
  main(data: string): Response | Promise<Response> {
    const lines = data.split('\n').filter((it) => it !== '');

    let s: Point | undefined;

    const dots = [];
    for (const [y, line] of lines.entries()) {
      for (const [x, char] of line.split('').entries()) {
        switch (char) {
          case '|':
            Point.points.push(new Point(x, y, Pipe.VERTICAL));
            break;
          case '-':
            Point.points.push(new Point(x, y, Pipe.HORIZONTAL));
            break;
          case 'L':
            Point.points.push(new Point(x, y, Pipe.NE));
            break;
          case 'J':
            Point.points.push(new Point(x, y, Pipe.NW));
            break;
          case '7':
            Point.points.push(new Point(x, y, Pipe.SW));
            break;
          case 'F':
            Point.points.push(new Point(x, y, Pipe.SE));
            break;
          case 'S':
            s = new Point(x, y, Pipe.S);
            Point.points.push(s);
            break;
          case '.':
            dots.push(new Point(x, y, Pipe.G));
            break;
        }
      }
    }
    if (s === undefined) throw new Error('No S found');
    const next = [];
    s.dist = 0;
    for (const [i, neighbor] of s.neighbors().entries()) {
      neighbor.dist = 1;
      next[i] = neighbor.neighbor();
      next[i].dist = 2;
    }
    while (next[0] !== undefined && next[1] !== undefined) {
      const oldFirstNext = next[0];
      const oldSecondNext = next[1];
      next[0] = next[0].neighbor();
      next[1] = next[1].neighbor();
      if (next[0] !== undefined) next[0].dist = oldFirstNext.dist + 1;
      if (next[1] !== undefined) next[1].dist = oldSecondNext.dist + 1;
    }

    let result2 = 0;
    Point.points = Point.points.concat(dots);
    for (const point of Point.points) {
      if (point.dist !== -1) continue;
      let last: Point | undefined;
      // Sweepline, whooo
      if (
        Point.points.filter((it) => {
          if ([Pipe.NE, Pipe.SE].includes(it.val)) last = it;
					if (it.y !== last?.y) last = undefined;
          // Edge case when polygon-line is parallel to sweepline
          if (
            [Pipe.SW, Pipe.NW].includes(it.val) &&
            last !== undefined &&
            ((it.val === Pipe.SW && last.val === Pipe.NE) ||
              (it.val === Pipe.NW && last.val === Pipe.SE))
          ) {
            last = undefined;
            return false;
          }
					if ([Pipe.SW, Pipe.NW].includes(it.val)) last = undefined;
          return (
            it.dist !== -1 &&
            it.x > point.x &&
            it.y === point.y &&
            it.val !== Pipe.HORIZONTAL
          );
        }).length %
          2 ===
        1
      )
        ++result2;
    }
    return [Math.max(...Point.points.map((point) => point.dist)), result2];
  }
}
