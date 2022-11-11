export function getSum(list, fixed = 2) {
    // eslint-disable-next-line no-eval
    return eval(list
        .map(item => Number(item))
        .filter(item => !isNaN(item))
        .join(`+`))
        ?.toFixed(fixed)
}

//[1,2,3,4,5,6]=>[[1,2,3],[4,5,6]]
export function ArrayGroup(array, n = 3) {
    const newArr: any[][] = []
    let currentArr: any[] = []
    array.forEach((item, i) => {
        if ((i + 1) % n !== 0) currentArr.push(item)
        else {
            currentArr.push(item)
            newArr.push([...currentArr])
            currentArr = []
        }
    })
    if (currentArr?.length) newArr.push(currentArr)

    return newArr
}