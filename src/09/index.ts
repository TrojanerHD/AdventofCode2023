import { Response } from '..';
import Day from '../day';

export default class Day09 implements Day {
  calcDiffFront(line: string) {
    let values: number[] = line.split(' ').map((it) => Number(it));

    let nextValues = values.map((it, i): number => (i !== values.length - 1 ? values[i + 1] - it : 0));
    nextValues.splice(values.length - 1);
    if (nextValues.some((it) => it !== 0)) {
      const layerAbove = this.calcDiffFront(nextValues.join(' '));
      values.unshift(
        values[0] - layerAbove[0]
      );
    } else {
      values.unshift(values[0]);
    }
    return values;
  }
  calcDiffBack(line: string) {
    let values: number[] = line.split(' ').map((it) => Number(it));

    let nextValues = values.map((it, i): number => (i !== values.length - 1 ? values[i + 1] - it : 0));
    nextValues.splice(values.length - 1);
    if (nextValues.some((it) => it !== 0)) {
      const layerAbove = this.calcDiffBack(nextValues.join(' '));
      values.push(
        values[values.length - 1] + layerAbove[layerAbove.length - 1]
      );
    } else {
      values.push(values[values.length - 1]);
    }
    return values;
  }
  main(data: string): Response | Promise<Response> {
    const lines = data.split('\n').filter((it) => it !== '');
    let result = 0;
    for (const line of lines) {
      const diff = this.calcDiffBack(line);
      result += diff[diff.length - 1];
    }

		let result2 = 0;
		for (const line of lines) {
			const diff = this.calcDiffFront(line);
			result2 += diff[0];
		}
    return [result, result2];
  }
}
