import { Response } from '..';
import Day from '../day';

interface Game {
  id: number;
  results: CubeResult[];
}

class CubeResult {
  _blue: number = 0;
  _red: number = 0;
  _green: number = 0;

  constructor(
    blue: string | number = 0,
    red: string | number = 0,
    green: string | number = 0
  ) {
    this._blue = Number(blue);
    this._red = Number(red);
    this._green = Number(green);
  }
}

export default class Day02 implements Day {
  main(data: string): Response {
    const lines = data
      .split('\n')
      .filter((line: string): boolean => line !== '');
    const parsed = lines.map((it: string): Game => this.parseCubeLine(it));
    const filtered = parsed.filter(
      (line: Game): boolean =>
        !line.results.some(
          (result) =>
            result._blue > 14 || result._red > 12 || result._green > 13
        )
    );
    const minCubes = parsed.map(
      (line: Game): CubeResult =>
        line.results.reduce(
          (a: CubeResult, b: CubeResult): CubeResult =>
            new CubeResult(
              Math.max(a._blue, b._blue),
              Math.max(a._red, b._red),
              Math.max(a._green, b._green)
            )
        )
    );
    return [
      filtered.reduce<number>((a: number, b: Game): number => a + b.id, 0),
      minCubes.reduce<number>(
        (a: number, b: CubeResult): number => a + b._red * b._blue * b._green,
        0
      ),
    ];
  }
  private parseCubeLine(line: string): Game {
    const results: string[] = line.substring(line.indexOf(':') + 1).split(';');
    return {
      id: Number(line.match(/Game (\d*)/)![1]),
      results: results.map(
        (result: string): CubeResult =>
          new CubeResult(
            result.match(/(\d*) blue/)?.[1],
            result.match(/(\d*) red/)?.[1],
            result.match(/(\d*) green/)?.[1]
          )
      ),
    };
  }
}
