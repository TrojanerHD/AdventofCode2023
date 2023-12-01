import { Response } from '..';
import Day from '../day';

export default class Day01 implements Day {
  main(data: string): Response {
    const lines = data.split(/\n/g);
    const newLines1 = lines.map((line) => {
      let first = '';
      let last = '';
      for (const letter of line) {
        if (letter.match(/\d/)) {
          if (!first) {
            first = letter;
          }
          last = letter;
        }
      }
      return `${first}${last}`;
    });
    const newLines2 = lines.map((line) => {
      let first = '';
      let last = '';
      line = line.replace(/one/g, 'one1one');
      line = line.replace(/two/g, 'two2two');
      line = line.replace(/three/g, 'three3three');
      line = line.replace(/four/g, 'four4four');
      line = line.replace(/five/g, 'five5five');
      line = line.replace(/six/g, 'six6six');
      line = line.replace(/seven/g, 'seven7seven');
      line = line.replace(/eight/g, 'eight8eight');
      line = line.replace(/nine/g, 'nine9nine');
      for (const letter of line) {
        if (letter.match(/\d/)) {
          if (!first) {
            first = letter;
          }
          last = letter;
        }
      }
      return `${first}${last}`;
    });
    return [newLines1, newLines2].map((line) =>
      line.reduce<number>((a, b) => Number(a) + Number(b), 0)
    );
  }
}
