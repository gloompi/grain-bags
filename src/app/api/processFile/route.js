
import { Readable } from 'stream';
import readline from 'readline';

export async function POST(req) {
  const data = await req.formData();
  const file = data.get('file');

  if (!file) {
    return Response.json({ success: false })
  }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const res = await processFileStream(buffer);
    return Response.json({ status: 200, data: res });
  } catch (err) {
    return Response.json({ status: 500, error: "Error parsing the file" });
  }
}

function processFileStream(buffer) {
  return new Promise((resolve, _reject) => {
    const readStream = Readable.from(buffer.toString('utf-8'));
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity
    });

    let results = [];

    rl.on('line', (line) => {
      const [A, B, C] = line.split(',').map(Number);
      if (isNaN(A) || isNaN(B) || isNaN(C)) {
        return;
      }
  
      const result = findSolution(A, B, C);

      results.push({ A, B, C, result });
    });

    rl.on('close', () => {
      resolve(results);
    });
  });
}

function findSolution(A, B, C) {
  let visited = new Set();
  let queue = [[0, 0]];
  let steps = [];

  while (queue.length > 0) {
    let [a, b] = queue.shift();
    steps.push([a, b]);

    if (a === C || b === C) {
      return steps;
    }

    visited.add(`${a},${b}`);

    let nextSteps = [
      [A, b],
      [a, B],
      [0, b],
      [a, 0],
      [a - Math.min(a, B - b), b + Math.min(a, B - b)],
      [a + Math.min(b, A - a), b - Math.min(b, A - a)],
    ];

    for (let next of nextSteps) {
      if (!visited.has(`${next[0]},${next[1]}`)) {
        queue.push(next);
      }
    }
  }

  return "Impossible";
}
