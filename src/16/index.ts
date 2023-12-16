import { Response } from '..';
import Day from '../day';

enum Dir {
  UP,
  LEFT,
  DOWN,
  RIGHT,
}

class Point {
  _x: number;
  _y: number;
  _val?: string | number;
  constructor(x: number, y: number, val?: string | number) {
    this._x = x;
    this._y = y;
    this._val = val;
  }
}

class Beam extends Point {
  _dir: Dir;
  _dead: boolean = false;
  constructor(x: number, y: number, dir: Dir) {
    super(x, y);
    this._dir = dir;
  }
}

class Charged extends Point {
  _dirs: Dir[];
  constructor(x: number, y: number, dir: Dir) {
    super(x, y);
    this._dirs = [dir];
  }
}

export default class Day16 implements Day {
  points: Point[] = [];
  lines?: string[];
  simulateBeam(x: number, y: number, dir: Dir, print: boolean = false) {
    let beams: Beam[] = [new Beam(x, y, dir)];
    const charged: Charged[] = [new Charged(x, y, dir)];
    while ((beams = beams.filter((beam) => !beam._dead)).length !== 0) {
      if (print) {
        for (let y = 0; y < this.lines!.length; ++y) {
          let line = '';
          for (let x = 0; x < this.lines![0].length; ++x)
            line += charged.some((point) => point._x === x && point._y === y)
              ? '#'
              : this.points.find((point) => point._x === x && point._y === y)
                  ?._val ?? '.';

          console.log(line);
        }
        console.log('------------------------------------');
      }
      for (const beam of beams) {
        let pt;
        if (
          (pt = this.points.find(
            (point) => point._x === beam._x && point._y === beam._y
          ))
        ) {
          switch (pt._val) {
            case '/':
              switch (beam._dir) {
                case Dir.UP:
                  beam._dir = Dir.RIGHT;
                  break;
                case Dir.DOWN:
                  beam._dir = Dir.LEFT;
                  break;
                case Dir.RIGHT:
                  beam._dir = Dir.UP;
                  break;
                case Dir.LEFT:
                  beam._dir = Dir.DOWN;
                  break;
              }
              break;
            case '\\':
              switch (beam._dir) {
                case Dir.UP:
                  beam._dir = Dir.LEFT;
                  break;
                case Dir.DOWN:
                  beam._dir = Dir.RIGHT;
                  break;
                case Dir.RIGHT:
                  beam._dir = Dir.DOWN;
                  break;
                case Dir.LEFT:
                  beam._dir = Dir.UP;
                  break;
              }
              break;
            case '-':
              if ([Dir.UP, Dir.DOWN].includes(beam._dir)) {
                beam._dir = Dir.LEFT;
                beams.push(new Beam(beam._x, beam._y, Dir.RIGHT));
              }
              break;
            case '|':
              if ([Dir.LEFT, Dir.RIGHT].includes(beam._dir)) {
                beam._dir = Dir.UP;
                beams.push(new Beam(beam._x, beam._y, Dir.DOWN));
              }
              break;
          }
        }
        switch (beam._dir) {
          case Dir.UP:
            --beam._y;
            beam._dead ||= beam._y < 0;
            break;
          case Dir.LEFT:
            --beam._x;
            beam._dead ||= beam._x < 0;
            break;
          case Dir.RIGHT:
            ++beam._x;
            beam._dead ||= beam._x >= this.lines![0].length;
            break;
          case Dir.DOWN:
            ++beam._y;
            beam._dead ||= beam._y >= this.lines!.length;
            break;
        }

        if (beam._dead) continue;
        let found = -1;
        if (
          (found = charged.findIndex(
            (point) => point._x === beam._x && point._y === beam._y
          )) !== -1
        ) {
          if (
            charged.some(
              (point, i) => i === found && point._dirs.includes(beam._dir)
            )
          ) {
            beam._dead = true;
            continue;
          }
          charged[found]._dirs.push(beam._dir);
          continue;
        }
        charged.push(new Charged(beam._x, beam._y, beam._dir));
      }
    }

    return charged.length;
  }
  main(data: string): Response | Promise<Response> {
    this.lines = data.split('\n').filter((it) => it !== '');
    for (let y = 0; y < this.lines.length; ++y)
      for (const [x, char] of this.lines[y].split('').entries())
        if (char !== '') this.points.push(new Point(x, y, char));

    const part1 = this.simulateBeam(0, 0, Dir.RIGHT);

    const allPart2: Point[] = [];
    let percent = 0;
    for (let y = 0; y < this.lines.length; ++y) {
      allPart2.push(
        new Point(0, y, this.simulateBeam(0, y, Dir.RIGHT)),
        new Point(
          this.lines[y].length - 1,
          y,
          this.simulateBeam(this.lines[y].length - 1, y, Dir.LEFT)
        )
      );
      percent = y / (this.lines.length * 2);
      console.log(`${Math.round(percent * 1000) / 10}%`);
    }

    console.log('Starting x');

    for (let x = 0; x < this.lines[0].length; ++x) {
      allPart2.push(
        new Point(x, 0, this.simulateBeam(x, 0, Dir.DOWN)),
        new Point(
          x,
          this.lines.length - 1,
          this.simulateBeam(x, this.lines.length - 1, Dir.UP)
        )
      );
      percent = 1 / 2 + x / (this.lines[0].length * 2);
      console.log(`${Math.round(percent * 1000) / 10}%`);
    }

    const allPart2Sorted = allPart2.sort(
      (a, b) => Number(b._val) - Number(a._val)
    );
    return [part1, allPart2Sorted[0]._val!];
  }
}
