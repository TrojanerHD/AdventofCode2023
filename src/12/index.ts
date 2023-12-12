import { Response } from '..';
import Day from '../day';

export default class Day12 implements Day {
  #results = [0, 0];
  #workers = [0, 0];
  #terminated = [0, 0];

  async main(data: string): Promise<Response> {
    const lines: string[] = data
      .split('\n')
      .filter((it: string): boolean => it !== '');
    const workerURL = new URL('worker.ts', import.meta.url).href;
    for (const row of lines) {
      const worker = new Worker(workerURL);
      worker.postMessage({ row, part: 0 });
      worker.addEventListener('message', this.onMessage.bind(this));
      ++this.#workers[0];
    }
    for (const row of lines) {
      const [first, second] = row.split(' ');
      let realFirst = '';
      let realSecond = '';
      for (let i = 0; i < 5; ++i) {
        realFirst += `${first}?`;
        realSecond += `${second},`;
      }
      const worker = new Worker(workerURL);
      worker.postMessage({
        row: `${realFirst.slice(0, realFirst.length - 1)} ${realSecond.slice(
          0,
          realSecond.length - 1
        )}`,
        part: 1,
      });
      ++this.#workers[1];
    }
    while (
      this.#terminated[0] + this.#terminated[1] !==
      this.#workers[0] + this.#workers[1]
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return this.#results;
  }
  private onMessage(event: MessageEvent) {
    const { result, part } = event.data;
    ++this.#terminated[part];
    console.log(
      `Terminated: Part 1: ${this.#terminated[0]} / ${
        this.#workers[0]
      }, Part 2: ${this.#terminated[1]} / ${this.#workers[1]}`
    );
    this.#results[part] += result;
  }
}
