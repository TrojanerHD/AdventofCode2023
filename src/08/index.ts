import { Response } from '..';
import Day from '../day';

export enum Indication {
  NEW,
  STEP,
}

export default class Day08 implements Day {
  solveOne(instructions: string, map: Map<string, string[]>, current: string) {
    let steps = 0;
    let i = 0;
    while (current[current.length - 1] !== 'Z') {
      ++steps;
      current = map.get(current)![instructions[i] === 'L' ? 0 : 1];
      i = (i + 1) % instructions.length;
    }
		return steps;
  }
  results = [0, 1];
  workers: { worker: Worker; working: boolean }[] = [];
  async main(data: string): Promise<Response> {
    const lines = data.split('\n').filter((line) => line !== '');
    const map = new Map<string, string[]>();
    const endsWithA = [];
    for (let line of lines.slice(1)) {
      line = line.replaceAll('(', '').replaceAll(')', '');
      const [start, ends] = line.split(' = ');
      map.set(start, ends.split(', '));
      if (start[start.length - 1] === 'A') {
        endsWithA.push(start);
      }
    }
    const instructions = lines[0];
    let current = 'AAA';
    let steps = 0;
    let i = 0;
    while (current !== 'ZZZ') {
      ++steps;
      current = map.get(current)![instructions[i] === 'L' ? 0 : 1];
      i = (i + 1) % instructions.length;
    }

		const leasts = []
		for (const [i, curr] of endsWithA.entries()) {
			leasts[i] = this.solveOne(instructions, map, curr);
		}

    /* const workerURL = new URL('worker.ts', import.meta.url).href;

    for (const [i, a] of endsWithA.entries()) {
      const worker = new Worker(workerURL);
      worker.postMessage({
        ind: Indication.NEW,
        current: a,
        instructions,
        map,
        workerNr: i,
      });
      worker.addEventListener('message', this.workerMessage.bind(this));
      this.workers.push({ worker, working: false });
    }

    this.nextAttempt();
    while (this.results.some((result) => result != this.results[0])) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } */
    return [steps, `Please enter “lcm(${leasts.join(', ')})” into your favorite math tool (e. g. WolframAlpha)`];
  }
  nextAttempt() {
    if (this.results.some((result) => result !== this.results[0])) {
      for (const [i, worker] of this.workers.entries()) {
        if (this.results[i] === Math.max(...this.results)) continue;
        worker.worker.postMessage({ ind: Indication.STEP });
        worker.working = true;
      }
    } else {
      console.log(this.results[0]);
    }
  }

  workerMessage(ev: MessageEvent) {
    const { workerNr, steps } = ev.data;
    this.results[workerNr] = steps;
    this.workers[workerNr].working = false;
    if (this.workers.every((worker) => !worker.working)) {
      console.log(Math.max(...this.results));
      this.nextAttempt();
    }
  }
}
