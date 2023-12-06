import { Response } from '..';
import Day from '../day';

export default class Day06 implements Day {
  reduceFn(a: number, b: number) {
    return Number(`${a}${b}`);
  }
  roots(dist: number, time: number) {
    const min = time / 2 - Math.sqrt((-time) ** 2 / 4 - dist);
    const max = time / 2 + Math.sqrt((-time) ** 2 / 4 - dist);

    return Number.isInteger(max - min) ? max - min - 1 : Math.floor(max - min);
  }
  main(data: string): Response {
    const lines: string[] = data
      .split('\n')
      .filter((it: string): boolean => it !== '');

    const [times, distances] = lines.map((it) =>
      it
        .split(' ')
        .filter((it) => !isNaN(Number(it)) && it !== '')
        .map((it) => Number(it))
    );

    // x * (time - x) = -x^2 * time x
    // -x^2 * time x = dist => -x^2 * time x - dist = 0 => x^2 * -time x + dist = 0 => time/2 +- sqrt((-time/2)^2 - dist)
    let result1 = 1;
    for (const [i, time] of times.entries())
      result1 *= this.roots(distances[i], time);

    const newDist = distances.reduce(this.reduceFn);
    const newTime = times.reduce(this.reduceFn);
    return [result1, this.roots(newDist, newTime)];
  }
}
