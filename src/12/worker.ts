declare const self: Worker;

self.addEventListener('message', onMessage);

function symbolToNumber(it: string) {
  switch (it) {
    case '?':
      return 2;
    case '#':
      return 1;
    case '.':
      return 0;
    default:
      throw new Error(`Symbol ${it} invalid`);
  }
}

function onMessage(event: MessageEvent) {
  const { row, part } = event.data;
  let result = 0;

  let [springString, valueString] = row.split(' ');
  const values: number[] = valueString
    .split(',')
    .map((it: string) => Number(it));

  const spring: number[] = springString
    .split('')
    .map((it: string) => symbolToNumber(it));

  const valueSum = values.reduce((a: number, b: number) => a + b, 0);

  let questionMarks: number = 0;
  let hashTags: number = 0;
  for (const char of spring) {
    switch (char) {
      case 2:
        ++questionMarks;
        break;
      case 1:
        ++hashTags;
    }
  }
  const combinations = 2 ** questionMarks;
  let cache: string[] = [];
  let msb = 0;
  let prev = 0;

  combinationLoop: for (let i = 0; i !== combinations; ++i) {
    let binary = i.toString(2);
    if (msb !== binary.length) cache = []
    msb = binary.length
    binary = `${'0'.repeat(questionMarks - binary.length)}${binary}`;
    if (
      cache.some((it) => binary.startsWith(it)) ||
      binary.split('').reduce((a, b) => a + Number(b), 0) !==
        valueSum - hashTags
    )
      continue;
    if (part === 1 && Math.floor((i / combinations) * 100) !== prev) {
      prev = Math.floor((i / combinations) * 100);
      console.log(`${Math.floor((i / combinations) * 100)}%`);
    }
    let questions = 0;
    let count = 0;
    let value = 0;
    for (let char of spring) {
      if (char === 2) char = Number(binary[questions++]);

      switch (char) {
        case 1:
          ++count;
          break;
        case 0:
          if (count !== 0 && count !== values[value++]) {
            if (questions < binary.length)
              cache.push(binary.slice(0, questions));
            continue combinationLoop;
          }
          count = 0;
          break;
      }
    }

    if (count !== 0 && count !== values[value]) continue;

    ++result;
  }
  postMessage({ result, part });
}
