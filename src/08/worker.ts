import { Indication } from '.';

declare const self: Worker;

self.addEventListener('message', onMessage);

class Calculation {
  i = 0;
  steps = 0;
  current: string;
  instructions: string;
  map: Map<string, string[]>;
  workerNr: number;

  constructor(
    current: string,
    instructions: string,
    map: Map<string, string[]>,
    workerNr: number
  ) {
    this.current = current;
    this.instructions = instructions;
    this.map = map;
    this.workerNr = workerNr;
  }

  calculateNext() {
    ++this.steps;
    this.current = this.map.get(this.current)![
      this.instructions[this.i] === 'L' ? 0 : 1
    ];
    this.i = (this.i + 1) % this.instructions.length;
    while (this.current[this.current.length - 1] !== 'Z') {
      ++this.steps;
      const lr = this.instructions[this.i] === 'L' ? 0 : 1;
      this.current = this.map.get(this.current)![lr];
      this.i = (this.i + 1) % this.instructions.length;
    }
  }
}

let calculation: Calculation | undefined;

function onMessage(ev: MessageEvent) {
  switch (ev.data.ind) {
    case Indication.NEW:
      let { current, instructions, map, workerNr } = ev.data;
      calculation = new Calculation(current, instructions, map, workerNr);
      break;
    case Indication.STEP:
      if (calculation === undefined) throw new Error('Not initialized');
      calculation.calculateNext();
      postMessage({
        steps: calculation.steps,
        workerNr: calculation.workerNr,
      });
      break;
  }
}
