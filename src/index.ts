import * as fs from 'fs';
import Day from './day';

export type Response = (string | number)[];

export interface DayTime {
  day: string;
  time: number;
}

const env: string[] = process.argv[0].split('/');
const bun: boolean = env[env.length - 1] === 'bun';

class Solution {
  #day: string;
  #runTimes: DayTime[];

  constructor(day: number, runTimes: DayTime[]) {
    this.#day = day.toString();
    this.#runTimes = runTimes;
    if (day <= 9) this.#day = `0${this.#day}`;
  }

  async start(): Promise<void> {
    const runTimesIndex: number = this.#runTimes.findIndex(
      (value: DayTime): boolean => value.day === this.#day
    );
    const currentDayTime: DayTime | undefined = this.#runTimes[runTimesIndex];
    if (currentDayTime !== undefined)
      console.log(
        `Day ${this.#day} is expected to run about ${currentDayTime.time}s`
      );

    if (!fs.existsSync(`./src/${this.#day}`)) {
      console.error(`The folder for day ${this.#day} does not exist`);
      return;
    }

    process.chdir(`./src/${this.#day}`);

    if (!fs.existsSync('index.ts')) {
      console.error(`Day ${this.#day} is not solved`);
      process.chdir('../../');
      return;
    }

    if (!fs.existsSync('values.txt')) {
      console.error(`Day ${this.#day} has no provided values`);
      process.chdir('../../');
      return;
    }

    const data: string = fs.readFileSync(`values.txt`, 'utf8');

    const dayClass: any = await import(
      `./${this.#day}/index.${bun ? 't' : 'j'}s`
    );
    const day: Day = new dayClass.default();

    const timeStart: number = performance.now();
    const toLog: Response = await day.main(data);
    const totalTime: number = performance.now() - timeStart;

    if (currentDayTime === undefined)
      this.#runTimes.push({
        day: this.#day,
        time: Math.round(totalTime / 1000),
      });
    else this.#runTimes[runTimesIndex].time = Math.round(totalTime / 1000);

    process.chdir('../../');
    if (!toLog) return;
    for (let i = 0; i < toLog.length; i++) {
      const log = toLog[i];
      this.logger(i + 1, log);
    }
    console.log(`It took ${totalTime}ms to solve day ${this.#day}`);
  }

  private logger(part: number, value: string | number): void {
    console.log(
      `[Year 2023, Day ${this.#day}, Part ${part}] ${value}`
    );
  }
}

const runTimes: DayTime[] = fs.existsSync('./runtimes.json')
  ? JSON.parse(fs.readFileSync('./runtimes.json').toString())
  : [];

async function main() {
  for (const arg of process.argv.filter((_, i): boolean => i > 1)) {
    if (!isNaN(Number(arg))) await new Solution(Number(arg), runTimes).start();
    else console.error(`Parameter ${arg} is not a number`);
  }
}

main()
  .then((): void => fs.writeFileSync('./runtimes.json', JSON.stringify(runTimes)))
  .catch(console.error);

