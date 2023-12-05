import { Response } from '..';
import Day from '../day';

class Convert {
  _from: string;
  _to: string;
  _destRangeStart: number[] = [];
  _sourceRangeStart: number[] = [];
  _rangeLength: number[] = [];
  constructor(from: string, to: string) {
    this._from = from;
    this._to = to;
  }

  addEntry(
    destRangeStart: number,
    sourceRangeStart: number,
    rangeLength: number
  ): void {
    this._destRangeStart.push(destRangeStart);
    this._sourceRangeStart.push(sourceRangeStart);
    this._rangeLength.push(rangeLength - 1);
  }

  private indexOfSource(source: number) {
    return this._sourceRangeStart.findIndex(
      (start, i) => source >= start && source <= start + this._rangeLength[i]
    );
  }

  calcResult(source: number): { result: number; index: number } {
    let index = -1;
    if ((index = this.indexOfSource(source)) !== -1)
      return {
        result:
          this._destRangeStart[index] +
          (source - this._sourceRangeStart[index]),
        index,
      };

    return { result: source, index };
  }

  calcResultTwo(source: number, length: number): number[] {
    const results: number[] = [];
    let rangeLength = 0;

    while (length > rangeLength) {
      let { result, index } = this.calcResult(source);
      let offset = 0;
      for (; index === -1; ++offset) {
        if (offset >= length) return results.concat(source, length);
        const tmp = this.calcResult(source + offset);
        result = tmp.result;
        index = tmp.index;
      }
      if (offset !== 0) {
        results.push(source, offset);
      }
      rangeLength =
        this._rangeLength[index] + this._sourceRangeStart[index] - source;
      if (length > rangeLength) {
        results.push(
          result,
          rangeLength,
          ...this.calcResultTwo(source + rangeLength + 1, length - rangeLength)
        );
        rangeLength = length;
      } else {
        results.push(result, length);
      }
    }

    return results;
  }
}

export default class Day05 implements Day {
  main(data: string): Response {
    const maps: string[] = data.split('\n\n');

    const seeds: number[] = maps[0]
      .split(': ')[1]
      .trim()
      .split(' ')
      .map((it) => Number(it));

    let seedsPartTwo: number[] = structuredClone(seeds);

    maps.splice(0, 1);

    const convertMap = [];

    for (const map of maps) {
      const lines = map.split('\n');
      const [from, _, to] = lines[0].split(/[- ]/);
      const convert = new Convert(from, to);
      lines.splice(0, 1);
      for (const line of lines) {
        const [destRangeStart, sourceRangeStart, rangeLength] = line
          .trim()
          .split(' ')
          .map((it) => Number(it));
        convert.addEntry(destRangeStart, sourceRangeStart, rangeLength);
      }

      convertMap.push(convert);
    }
    let out = 'seed';
    while (out !== 'location') {
    let start = performance.now();
      const convert = convertMap.find((it) => it._from === out)!;
      out = convert._to;
      for (let i = 0; i < seeds.length; ++i) {
        const seed = seeds[i];
        seeds[i] = convert.calcResult(seed).result;
      }
      let tmp = [];
      for (let i = 0; i < seedsPartTwo.length; ++i) {
        if (i % 2 !== 0) continue;
        const seed = seedsPartTwo[i];
        tmp.push(...convert.calcResultTwo(seed, seedsPartTwo[i + 1]));
      }
      seedsPartTwo = tmp;
      console.log(`Completed calculating ${out} in ${Math.floor((performance.now() - start) / 1000)}s`);
    }

    return [
      Math.min(...seeds),
      Math.min(...seedsPartTwo.filter((_, i) => i % 2 === 0)),
    ];
  }
}
