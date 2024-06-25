export type EarthTimeBreakdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

/*
{
  unit: number | number[] // from previous unit
  name: string // intl
  separator: string // from previous unit
  equivalentTo: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year' | 'decade' | 'century'
  offsetUnit: boolean // Timezones by hour equivalent
}[]
 */
// TODO look into: https://tc39.es/proposal-temporal/docs/

export type FictionalTimeObject = {
  // From smallest unit, starting with initial units from milliseconds
  // [1000, 100, 100, 10, 500]
  // [1000, 100, 100, [20, 22, 20, 22, 20, 25, 2], 7] <= 7 is calculated automatically - in the UI? - from the total of the array
  // challenge: [1000, 100, 100, [20, 22, 20, 22, 20, 25, 2], [6, 7]]
  units: number[] | number[][]
  // ['minutes', 'hours', 'days', 'months', 'years'] // TODO intl
  names: string[]
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
  // TODO calulate between two fictional times
}
