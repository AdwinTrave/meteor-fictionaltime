export type EarthTimeBreakdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export type FictionalTimeObject = {
  units: string[]
  separators: string[]
  declarationLocation: 'before' | 'after' | 'both' | 'none'
  connectedToET: boolean
  beginning?: Date
}

export declare interface FictionalTimeConstructor {
  new (): FictionalTimeInitialized
}

export declare interface FictionalTimeInitialized {
  toTime(milliseconds: number): string | false
  toDate(milliseconds: number): string | false
  toUnit(milliseconds: number, unit: number): number
  unitToMilliseconds(count: number, unit: number): number
  millisecondsToET(milliseconds: number): EarthTimeBreakdown
  currentDateTime(): null | string
  countdownToTimeStart(): null | string
  addDeclarator(dateString: string): string

  calculate(milliseconds: number, date: boolean, shorten: boolean): string
  defaultZeroes(parts: string[]): string[]
  formatTime(parts: string[], minus: boolean, shorten: boolean): string
}
