import { Response } from '..';
import Day from '../day';

class Point {
  y: number;
  x: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export default class Day11 implements Day {
  main(data: string): Response | Promise<Response> {
    const lines = data.split('\n').filter((it) => it !== '');
    let offset = 0;
    const galaxies1 = [];
    const galaxies2 = [];
    const transposed: string[] = [];
    for (let y = 0; y < lines.length; ++y) {
      for (let x = 0; x < lines[y].length; ++x) {
        if (transposed[x] === undefined) transposed[x] = [];
        transposed[x].push(lines[y][x]);
      }
    }
    const xOffsets = [];
    for (let x = 0; x < transposed.length; ++x) {
      let noHashtag = true;
      for (let y = 0; y < transposed.length; ++y) {
        if (transposed[x][y] === '#') noHashtag = false;
      }
      if (noHashtag) xOffsets.push(x);
    }
    for (let y = 0; y < lines.length; ++y) {
      let noHashtag = true;
      for (let x = 0; x < lines[y].length; ++x) {
        let val = lines[y][x];
        if (val === '#') {
          noHashtag = false;
          galaxies1.push(
            new Point(x + xOffsets.filter((it) => it < x).length, y + offset)
          );
          galaxies2.push(
            new Point(
              x + xOffsets.filter((it) => it < x).length * 999999,
              y + offset * 999999
            )
          );
        }
      }
      if (noHashtag) ++offset;
    }

    const results = [0, 0];

    for (const [galaxyIndex, galaxies] of [galaxies1, galaxies2].entries())
      for (let i = 0; i < galaxies.length - 1; ++i)
        for (let j = i + 1; j < galaxies.length; ++j)
          results[galaxyIndex] +=
            Math.abs(galaxies[j].y - galaxies[i].y) +
            Math.abs(galaxies[j].x - galaxies[i].x);

    return results;
  }
}
