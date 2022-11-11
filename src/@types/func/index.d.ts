interface Date {
    dateDiff(interval: 'y' | 'm' | 'd' | 'w' | 'h' | 'n' | 's' | 'l', date: Date): number

    dateAdd(interval: 's' | 'n' | 'h' | 'd' | 'w' | 'q' | 'm' | 'y', number: number): Date

    format(fmt: string): string
}