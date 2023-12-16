import { Response } from '..';
import Day from '../day';

export default class Day07 implements Day {
  private pointsOfHand(hand: number[]) {
    const groupByCount = hand.reduce(
      (a: { [a: number]: number }, b): { [a: number]: number } => {
        if (Object.keys(a).includes(b.toString()))
          return { ...a, [b]: a[b] + 1 };

        return { ...a, [b]: 1 };
      },
      {}
    );

    let max = Object.values(groupByCount)
      .map((it, i) => ({ count: it, i }))
      .map((it) =>
        Object.keys(groupByCount)[it.i] === '0' ? { count: 0, i: 1 } : it
      )
      .sort((a, b) => b.count - a.count)[0].i;
    groupByCount[Number(Object.keys(groupByCount)[max])] += hand.filter(
      (it) => it === 0
    ).length;
    delete groupByCount[0];

    // Five of a kind
    if (
      Object.values(groupByCount).includes(5) ||
      hand.every((it) => it === 0)
    ) {
      return 7;
    }

    // Four of a kind
    if (Object.values(groupByCount).includes(4)) {
      return 6;
    }

    // Full house
    if (
      Object.values(groupByCount).includes(3) &&
      Object.values(groupByCount).includes(2)
    ) {
      return 5;
    }

    // Three of a kind
    if (Object.values(groupByCount).includes(3)) {
      return 4;
    }

    // Two pair
    const firstPair = Object.values(groupByCount).findIndex((it) => it === 2);
    if (
      firstPair !== -1 &&
      Object.values(groupByCount).some((it, i) => i !== firstPair && it === 2)
    ) {
      return 3;
    }

    // One pair
    if (firstPair !== -1) {
      return 2;
    }

    // High card
    return 1;
  }
  main(data: string): Response {
    const lines = data.split('\n').filter((it) => it !== '');

    const cardValues1: number[][] = lines.map((line) =>
      line
        .split(' ')[0]
        .split('')
        .map((it) => {
          switch (it) {
            case 'T':
              return 9;
            case 'Q':
              return 11;
            case 'K':
              return 12;
            case 'A':
              return 13;
            case 'J':
              return 10;
            default:
              return Number(it) - 1;
          }
        })
    );

    const cardValues2: number[][] = lines.map((line) =>
      line
        .split(' ')[0]
        .split('')
        .map((it) => {
          switch (it) {
            case 'T':
              return 9;
            case 'Q':
              return 10;
            case 'K':
              return 11;
            case 'A':
              return 12;
            case 'J':
              return 0;
            default:
              return Number(it) - 1;
          }
        })
    );

    const scores1 = cardValues1.map((it, i) => ({
      score: this.pointsOfHand(it),
      cards: it,
      bid: Number(lines[i].split(' ')[1]),
    }));

    scores1.sort((a, b) => {
      const typeDiff = a.score - b.score;
      if (typeDiff !== 0) return typeDiff;
      for (let i = 0; i < 5; ++i)
        if (a.cards[i] !== b.cards[i]) return a.cards[i] - b.cards[i];
      return 0;
    });
    const scores2 = cardValues2.map((it, i) => ({
      score: this.pointsOfHand(it),
      cards: it,
      bid: Number(lines[i].split(' ')[1]),
    }));
    scores2.sort((a, b) => {
      const typeDiff = a.score - b.score;
      if (typeDiff !== 0) return typeDiff;
      for (let i = 0; i < 5; ++i)
        if (a.cards[i] !== b.cards[i]) return a.cards[i] - b.cards[i];
      return 0;
    });

    // for (let i = 0; i < cardValues.length - 1; ++i) {
    //   for (let j = i + 1; j < cardValues.length; ++j) {
    //     for (let k = 1; k < 6; ++k) {
    //       console.log(this.pointsOfHand(cardValues[i].slice(0, k)));
    //     }
    // 		console.log();
    //   }
    // }
    return [
      scores1.map((it, i) => it.bid * (i + 1)).reduce((a, b) => a + b),
      scores2.map((it, i) => it.bid * (i + 1)).reduce((a, b) => a + b),
    ];
  }
}
