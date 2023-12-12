declare const self: Worker;

self.addEventListener('message', onMessage);

function onMessage(event: MessageEvent) {
  const { row, part } = event.data;
  let result = 0;

  let [spring, valueString] = row.split(' ');
  const values = valueString.split(',').map((it: string) => Number(it));

  let questionMarks: number = 0;
  for (const char of spring) {
    if (char === '?') ++questionMarks;
  }
  const combinations = 2 ** questionMarks - 1;
	let prev = 0;

  for (let i = 0; i <= combinations; ++i) {
		if (Math.floor(i / combinations * 100) !== prev) {
			prev = Math.floor(i / combinations * 100);
		console.log(`${Math.floor(i / combinations * 100)}%`);
		}
    let binary = i.toString(2);
    binary = `${'0'.repeat(questionMarks - binary.length)}${binary}`;
    let questions = 0;
    let count = 0;
    let results: number[] = [];
    for (let char of spring.split('')) {
      if (char === '?')
        if (Number(binary[questions++])) {
          char = '#';
        } else char = '.';

      switch (char) {
        case '#':
          ++count;
          break;
        case '.':
          if (count !== 0) results.push(count);
          count = 0;
          break;
      }
    }

    if (count !== 0) results.push(count);
    if (
      values.length === results.length &&
      values.every((it: number, i: number) => it === results[i])
    )
      ++result;
  }
	console.log(`Part: ${part}`);
  postMessage({ result, part });
}
