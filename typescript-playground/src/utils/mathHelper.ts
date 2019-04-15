declare interface Math {
  randomFromRange(min: number, max: number, included?: boolean): number
}

Math.randomFromRange = function(
  min: number,
  max: number,
  included: boolean = false
): number {
  if (included) {
    min -= 1
    max += 1
  }
  return Math.floor(Math.random() * (max - min) + min)
}
