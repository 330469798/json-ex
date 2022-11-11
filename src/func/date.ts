export const dateFormat = (date: string | Date, formatString = `yyyy-MM-dd`) => {
    return date && Date.prototype.format ? new Date(date)?.format(formatString) : date
}

export const getNearestYear = (i) => {
    const currentYear = new Date().getFullYear();
    const yearList: any = [];
    for (let j = 0; j < i; j++) {
        yearList.push(currentYear - j);
    }

    return yearList
};