import { Response } from '..';
import Day from '../day';

export default class Day04 implements Day {
  main(data: string): Response {
    const lines = data.split('\n').filter((line) => line !== '');

    let result1 = 0;
    let result2 = 0;

    const duplicate: number[] = new Array(lines.length).fill(0);
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
      for (const oneWinning of allWinning)
        if (allMine.includes(oneWinning))
          gameResult = gameResult === 0 ? 1 : gameResult * 2;

      for (let i = 0; i < Math.log2(gameResult) + 1; ++i)
        duplicate[card + i + 1] =
          (duplicate[card + i + 1] ?? 0) + 1 * (duplicate[card] + 1);
      result1 += gameResult;
      result2 += duplicate[card] + 1;
    }

    return [result1, result2];
  }
}
