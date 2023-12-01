import { Response } from '..';
import Day from '../day';

export default class Day01 implements Day {
  main(data: string): Response {
    const lines: string[] = data.split(/\n/g);
    const newLines1 = lines.map((line: string): string => {
      if (line === '') return '';

      let first: string | undefined;
      let last: string | undefined;
      for (const letter of line) {
        if (letter.match(/\d/)) {
          if (first === undefined) first = letter;

          last = letter;
        }
      }
      return `${first}${last}`;
    });
    const newLines2 = lines.map((line: string): string => {
      if (line === '') return '';

      let first: string | undefined;
      let last: string | undefined;
      line = line
        .replace(/one/g, 'one1one')
        .replace(/two/g, 'two2two')
        .replace(/three/g, 'three3three')
        .replace(/four/g, 'four4four')
        .replace(/five/g, 'five5five')
        .replace(/six/g, 'six6six')
        .replace(/seven/g, 'seven7seven')
        .replace(/eight/g, 'eight8eight')
        .replace(/nine/g, 'nine9nine');

      for (const letter of line) {
        if (letter.match(/\d/)) {
          if (first === undefined) first = letter;

          last = letter;
        }
      }
      return `${first}${last}`;
    });
    return [newLines1, newLines2].map((line: string[]): number =>
      line.reduce<number>((a: number, b: string): number => a + Number(b), 0)
    );
  }
}
