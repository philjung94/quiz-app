export function inArray(arr: any[], val: string) {
  return arr.some((cv) => cv == val);
}

export function count(arr: any[]) {
  return arr.length;
}

export function shuffle(arr: any[]) {
  const shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

export function sum(a: number, b: number) {
  return a + b;
}
