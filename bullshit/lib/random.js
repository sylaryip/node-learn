export function randomInt(min, max) {
  const p = Math.random();
  return Math.floor(min * (1 - p) + max * p);
}

export function createRandomPick(arr) {
  arr = [...arr];
  function randomPick() {
    const len = arr.length - 1;
    const index = randomInt(0, len);
    const picked = arr[index];
    [arr[index], arr[len]] = [arr[len], arr[index]];
    return picked;
  }

  randomPick();
  return randomPick;
}
