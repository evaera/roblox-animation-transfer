export const extract = <T>(transform: (value: string) => T, data: string, regex: RegExp, errorText: string): T => {
  const match = data.match(regex)

  if (match == null || !match[1]) {
    throw new Error(errorText)
  }

  return transform(match[1])
}
