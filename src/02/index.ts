import { Response } from '..';
import Day from '../day';

class CubeResult {
  _id: number;
  _blue: number = 0;
  _red: number = 0;
  _green: number = 0;

  constructor(
    id: number,
    blue: number = 0,
    red: number = 0,
    green: number = 0
  ) {
    this._blue = blue;
    this._red = red;
    this._green = green;
    this._id = id;
  }
}

export default class Day02 implements Day {
  main(data: string): Response {
    const lines = data
      .split('\n')
      .filter((line: string): boolean => line !== '');
    const parsed = lines.map((it: string): CubeResult[] =>
      this.parseCubeLine(it)
    );
    const filtered = parsed.filter(
      (line: CubeResult[]): boolean =>
        !line.some(
          (result) =>
            result._blue > 14 || result._red > 12 || result._green > 13
        )
    );
    const minCubes = parsed.map((line: CubeResult[]): CubeResult =>
      line.reduce(
        (a: CubeResult, b: CubeResult): CubeResult =>
          new CubeResult(
            a._id,
            Math.max(a._blue, b._blue),
            Math.max(a._red, b._red),
            Math.max(a._green, b._green)
          )
      )
    );
    return [
      filtered.reduce<number>(
        (a: number, b: CubeResult[]): number => a + b[0]._id,
        0
      ),
      minCubes.reduce<number>(
        (a: number, b: CubeResult): number => a + b._red * b._blue * b._green,
        0
      ),
    ];
  }
  private parseCubeLine(line: string): CubeResult[] {
    const results: string[] = line.substring(line.indexOf(':') + 1).split(';');
    return results.map(
      (result: string): CubeResult =>
        new CubeResult(
          Number(line.match(/Game (\d*)/)![1]),
          Number((result.match(/(\d*) blue/) ?? [0, 0])[1]),
          Number((result.match(/(\d*) red/) ?? [0, 0])[1]),
          Number((result.match(/(\d*) green/) ?? [0, 0])[1])
        )
    );
  }
}
