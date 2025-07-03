
export function selectRandomUnique<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function random(min: number = 95, max: number = 110) {
  const random = Math.floor(Math.random() * (max - min + 1)) + min;
  return random;
}
