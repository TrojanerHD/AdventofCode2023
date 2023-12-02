import { Response } from '..';
import Day from '../day';

class CubeResult {
  _id;
  _blue: number = 0;
  _red: number = 0;
  _green: number = 0;

  constructor(id: number, blue = 0, red = 0, green = 0) {
    this._blue = blue;
    this._red = red;
    this._green = green;
    this._id = id;
  }
}

export default class Day02 implements Day {
  main(data: string): Response {
    const lines = data.split('\n').filter((line) => line !== '');
    const parsed = lines.map((it) => this.parseCubeLine(it));
    const filtered = parsed.filter(
      (line) =>
        !line.some(
          (result) =>
            result._blue > 14 || result._red > 12 || result._green > 13
        )
    );
    const minCubes = parsed.map((line) =>
      line.reduce((a, b) => {
        return new CubeResult(
          a._id,
          Math.max(a._blue, b._blue),
          Math.max(a._red, b._red),
          Math.max(a._green, b._green)
        );
      })
    );
    return [
      filtered.reduce((a, b) => a + b[0]._id, 0),
      minCubes.reduce((a, b) => a + b._red * b._blue * b._green, 0),
    ];
  }
  private parseCubeLine(line: string): CubeResult[] {
    const results = line.substring(line.indexOf(':') + 1).split(';');
    return results.map(
      (result) =>
        new CubeResult(
          Number(line.match(/Game (\d*)/)![1]),
          Number((result.match(/(\d*) blue/) ?? [0, 0])[1]),
          Number((result.match(/(\d*) red/) ?? [0, 0])[1]),
          Number((result.match(/(\d*) green/) ?? [0, 0])[1])
        )
    );
  }
}
