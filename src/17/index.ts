import { Response } from '..';
import Day from '../day';

enum Dir {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}
class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(point: Point) {
    return this.x === point.x && this.y === point.y;
  }
}

class WeightedPoint extends Point {
  weight: number;

  constructor(x: number, y: number, weight: number) {
    super(x, y);
    this.weight = weight;
  }
}

export default class Day17 implements Day {
  points: WeightedPoint[] = [];
  cache: Map<number, Map<Dir, Map<number, number>>> = new Map();

  /* dijkstra(start: Point) {
    const distances = this.points.map(
      (it) =>
        new WeightedPoint(
          it.x,
          it.y,
          it.x === start.x && it.y === start.y ? 0 : Infinity
        )
    );
    let current = start;
    let move = 0;
    let dir = Dir.LEFT;
    const neighbors = this.getNeighbors(current, move, dir);
  }

  getNeighbors(point: Point, move: number, dir: Dir) {
    const res = [];
    for (const direction of [Dir.DOWN, Dir.LEFT, Dir.RIGHT, Dir.UP]) {
      if (move !== 3 || direction !== dir)
        res.push({
          dir: direction,
          neighbor: this.getNeighbor(point, direction),
        });
    }
    return res;
  } */

  getIndex(point: Point) {
    return this.points.findIndex((it) => it.equals(point));
  }

  getNeighbor(point: Point, dir: Dir) {
    switch (dir) {
      case Dir.UP:
        return this.points.find(
          (it) => it.x === point.x && it.y === point.y - 1
        );
      case Dir.DOWN:
        return this.points.find(
          (it) => it.x === point.x && it.y === point.y + 1
        );
      case Dir.LEFT:
        return this.points.find(
          (it) => it.x === point.x - 1 && it.y === point.y
        );
      case Dir.RIGHT:
        return this.points.find(
          (it) => it.x === point.x + 1 && it.y === point.y
        );
    }
  }
  bruteForce(
    start: WeightedPoint,
    end: WeightedPoint,
    move: number,
    dir: Dir,
    oldSkip: Map<number, Dir[]> = new Map(),
    previousIndex: number,
    previousDir: number
  ): number {
    const index = this.getIndex(start);
    let cacheHit: number | undefined = this.cache
      .get(index)
      ?.get(move)
      ?.get(dir);
    if (cacheHit !== undefined) return cacheHit;
    let res = Infinity;
    if (start.equals(end)) {
      res = start.weight;
      const moveMap = this.cache.get(previousIndex) ?? new Map();
      const dirMap = moveMap.get(move) ?? new Map();
      dirMap.set(dir, res);
      moveMap.set(move, dirMap);
      this.cache.set(previousIndex, moveMap);
      return res;
    }
    if (oldSkip.get(index)?.includes(dir)) {
      return Infinity;
    }
    const skip = new Map(oldSkip);
    skip.set(index, (skip.get(index) ?? []).concat([dir]));
    if (move !== 3) {
      const neighbor = this.getNeighbor(start, dir);
      if (neighbor !== undefined) {
        res = this.bruteForce(neighbor, end, move + 1, dir, skip, index, dir);
      }
    }

    const neighborRight = this.getNeighbor(start, Dir.RIGHT);
    const neighborLeft = this.getNeighbor(start, Dir.LEFT);
    const neighborUp = this.getNeighbor(start, Dir.UP);
    const neighborDown = this.getNeighbor(start, Dir.DOWN);

    switch (dir) {
      case Dir.UP:
        if (neighborRight !== undefined)
          res = Math.min(
            res,
            this.bruteForce(neighborRight, end, 0, Dir.RIGHT, skip, index, dir)
          );
        if (neighborLeft !== undefined)
          res = Math.min(
            res,
            this.bruteForce(neighborLeft, end, 0, Dir.LEFT, skip, index, dir)
          );
        break;
      case Dir.DOWN:
        if (neighborRight !== undefined)
          res = Math.min(
            res,
            this.bruteForce(neighborRight, end, 0, Dir.RIGHT, skip, index, dir)
          );
        if (neighborLeft !== undefined)
          res = Math.min(
            res,
            this.bruteForce(neighborLeft, end, 0, Dir.LEFT, skip, index, dir)
          );
        break;
      case Dir.LEFT:
        if (neighborDown !== undefined)
          res = Math.min(
            res,
            this.bruteForce(neighborDown, end, 0, Dir.DOWN, skip, index, dir)
          );
        if (neighborUp !== undefined)
          res = Math.min(
            res,
            this.bruteForce(neighborUp, end, 0, Dir.UP, skip, index, dir)
          );
        break;
      case Dir.RIGHT:
        if (neighborDown !== undefined)
          res = Math.min(
            res,
            this.bruteForce(neighborDown, end, 0, Dir.DOWN, skip, index, dir)
          );
        if (neighborUp !== undefined)
          res = Math.min(
            res,
            this.bruteForce(neighborUp, end, 0, Dir.UP, skip, index, dir)
          );
        break;
    }
    res += start.weight;
    const moveMap = this.cache.get(previousIndex) ?? new Map();
    const dirMap = moveMap.get(move) ?? new Map();
    dirMap.set(previousDir, Math.min(dirMap.get(previousDir) ?? Infinity, res));
    moveMap.set(move, dirMap);
    this.cache.set(previousDir, moveMap);
    return dirMap.get(dir);
  }
  main(data: string): Response | Promise<Response> {
    const lines: string[] = data
      .split('\n')
      .filter((it: string): boolean => it !== '');

    for (let y = 0; y < lines.length; ++y) {
      for (const [x, weight] of lines[y].split('').entries()) {
        this.points.push(new WeightedPoint(x, y, Number(weight)));
      }
    }
    const result1 = this.bruteForce(
      this.points[0],
      this.points[this.points.length - 1],
      -1,
      Dir.RIGHT,
      undefined,
      0,
      Dir.RIGHT
    );
    const exampleSolution = [
      new Point(0, 0),
      new Point(1, 0),
      new Point(2, 0),
      new Point(2, 1),
      new Point(3, 1),
      new Point(4, 1),
      new Point(5, 1),
      new Point(5, 0),
      new Point(6, 0),
      new Point(7, 0),
      new Point(8, 0),
      new Point(8, 1),
      new Point(8, 2),
      new Point(9, 2),
      new Point(10, 2),
      new Point(10, 3),
      new Point(10, 4),
      new Point(11, 4),
      new Point(11, 5),
      new Point(11, 6),
      new Point(11, 7),
      new Point(12, 7),
      new Point(12, 8),
      new Point(12, 9),
      new Point(12, 10),
      new Point(11, 10),
      new Point(11, 11),
      new Point(11, 12),
      new Point(12, 12),
    ];
    console.log(
      Array.from(this.cache.keys())
        .map((key) => {
          const point = this.points[key];
          return {
            x: point.x,
            y: point.y,
            cost: Array.from(this.cache.get(key)!).map(([dir, map]) => {
              switch (dir) {
                case Dir.UP:
                  return ['up', map];
                case Dir.DOWN:
                  return ['down', map];
                case Dir.LEFT:
                  return ['left', map];
                case Dir.RIGHT:
                  return ['right', map];
              }
            }),
          };
        })
        /* .filter((it) =>
          exampleSolution.some((point) => point.x === it.x && point.y === it.y)
        )
 */ .sort((a, b) => {
          if (a.y === b.y) return a.x - b.x;
          return a.y - b.y;
        })
    );
    return [result1 - this.points[0].weight];
  }
}
