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

export default class Day13 implements Day {
  private checkNeigbors(puzzle: string[], start: number, end: number) {
    while (start >= 0 && end < puzzle.length) {
      if (puzzle[start] !== puzzle[end]) return false;
      --start;
      ++end;
    }
    return true;
  }
  private checkReflection(puzzle: string[], ignore: number = -1) {
    for (let y = 0; y < puzzle.length - 1; ++y) {
      if (y + 1 !== ignore && this.checkNeigbors(puzzle, y, y + 1))
        return y + 1;
    }
  }
  main(data: string): Response | Promise<Response> {
    const puzzles: string[] = data.split('\n\n');

    let result1 = 0;
    let result2 = 0;
    const firstLines = [];

    for (const puzzle of puzzles) {
      const lines = puzzle.split('\n').filter((it) => it !== '');
      const transposed: string[][] = [];
      for (let y = lines.length - 1; y >= 0; --y) {
        for (let x = 0; x < lines[0].length; ++x) {
          if (transposed[x] === undefined) transposed[x] = [];
          transposed[x][y] = lines[y][x];
        }
      }
      let reflection = this.checkReflection(lines);
      if (reflection === undefined) {
        reflection = this.checkReflection(
          transposed.map((it) => it.reduce((a, b) => `${a}${b}`, ''))
        );
        if (reflection === undefined) continue;
        result1 += reflection;
      } else {
        reflection *= 100;
        result1 += reflection;
      }
      firstLines.push(reflection);
    }

    let found = true;
    puzzleLoop: for (let [pIndex, puzzle] of puzzles.entries()) {
      let old = undefined;
      if (!found) {
        console.log('Nothing');
        result2 += firstLines[pIndex - 1];
      }
      found = false;
      for (let i = 0; i < puzzle.length; ++i) {
        if (old !== undefined)
          puzzle = `${puzzle.substring(0, i - 1)}${old}${puzzle.substring(i)}`;
        if (puzzle[i] === '\n') {
          old = undefined;
          continue;
        }
        old = puzzle[i];
        let newS;
        switch (old) {
          case '#':
            newS = '.';
            break;
          case '.':
            newS = '#';
            break;
          default:
            throw new Error(`Unknown symbol ${old}`);
        }
        puzzle = `${puzzle.substring(0, i)}${newS}${puzzle.substring(i + 1)}`;

        const lines = puzzle.split('\n').filter((it) => it !== '');
        const transposed: string[][] = [];
        for (let y = lines.length - 1; y >= 0; --y) {
          for (let x = 0; x < lines[0].length; ++x) {
            if (transposed[x] === undefined) transposed[x] = [];
            transposed[x][y] = lines[y][x];
          }
        }
        let reflection = this.checkReflection(lines, firstLines[pIndex] / 100);
        if (reflection === undefined) {
          reflection = this.checkReflection(
            transposed.map((it) => it.reduce((a, b) => `${a}${b}`, '')),
            firstLines[pIndex]
          );
          if (reflection === undefined) continue;
          result2 += reflection;
        } else result2 += reflection * 100;

        found = true;
        continue puzzleLoop;
      }
    }
    return [result1, result2];
  }
}
