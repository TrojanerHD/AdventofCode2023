import { Response } from '..';
import Day from '../day';

export default class Day04 implements Day {
  main(data: string): Response {
    const lines = data.split('\n').filter((line) => line !== '');

    let result1 = 0;
    let result2 = 0;

    const duplicate: number[] = [];
    for (const line of lines) {
      const [info, game] = line.split(': ');
      const card = Number(info.replace('Card ', ''));
      const [winning, my] = game.split(' | ');
      const allWinning = winning
        .trim()
        .split(' ')
        .filter((winning) => winning !== '');
      const allMine = my
        .trim()
        .split(' ')
        .filter((mine) => mine !== '');
      let gameResult = 0;
      let actualWon = 0;
      for (const oneWinning of allWinning) {
        if (allMine.includes(oneWinning)) {
          if (!gameResult) gameResult = 1;
          else gameResult *= 2;
          ++actualWon;
        }
      }
      for (let i = 0; i < actualWon; ++i)
        duplicate[card + i + 1] = duplicate[card + i + 1]
          ? duplicate[card + i + 1] + 1 * ((duplicate[card] ?? 0) + 1)
          : 1 * ((duplicate[card] ?? 0) + 1);
      result1 += gameResult;
      result2 += (duplicate[card] ?? 0) + 1;
    }

    return [result1, result2];
  }
}
