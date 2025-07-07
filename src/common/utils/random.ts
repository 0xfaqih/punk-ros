
export function selectRandomUnique<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function random(min: number = 10, max: number = 20) {
  const random = Math.floor(Math.random() * (max - min + 1)) + min;
  return random;
}
