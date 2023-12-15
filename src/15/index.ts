import { Response } from '..';
import Day from '../day';

interface BoxContent {
  key: string;
  value: number;
}

export default class Day15 implements Day {
  main(data: string): Response | Promise<Response> {
    const instructions: string[] = data
      .replaceAll('\n', '')
      .split(',')
      .filter((it: string): boolean => it !== '');

    let result1 = 0;

    const map: Map<number, BoxContent[]> = new Map();

    for (const instruction of instructions) {
      let hash = 0;
      let hash2 = 0;
      let skip = false;
      for (let i = 0; i < instruction.length; ++i) {
        hash += instruction.charCodeAt(i);
        hash *= 17;
        hash %= 256;
        if (!['=', '-'].includes(instruction[i]) && !skip) hash2 = hash;
        else skip = true;
      }
      const existing = map.get(hash2) ?? [];
      const index = existing.findIndex(
        (it) => it.key === instruction.split(/[\-=]/)[0]
      );
      if (instruction.includes('-')) {
        if (index !== -1) existing.splice(index, 1);
      } else {
        if (index !== -1) {
          existing[index].value = +instruction.split('=')[1];
        } else
          existing.push({
            key: instruction.split('=')[0],
            value: +instruction.split('=')[1],
          });
      }
      map.set(hash2, existing);
      result1 += hash;
    }

    let result2 = 0;

    for (const [key, value] of map) {
      for (const [i, tmp] of value.entries()) {
        result2 += (key + 1) * tmp.value * (i + 1);
      }
    }
    return [result1, result2];
  }
}
