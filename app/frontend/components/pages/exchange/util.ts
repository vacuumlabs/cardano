const findFirstCommonElement = <T>(array1: T[], array2: T[]): T | undefined => {
  for (const e of array1) {
    if (array2.includes(e)) return e
  }
  return undefined
}
