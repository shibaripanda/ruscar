export const rendomLetteOrder = () => {
    const letterAr = ['A', 'B', 'C', 'D', 'F', 'G', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'P', 'S', 'H', 'J', 'K', 'L', 'Z', 'X', 'V', 'N', 'M']
    const min = 0
    const max = letterAr.length - 1
    const rendomIndex = Math.floor(Math.random() * (max - min) + min)
    return letterAr[rendomIndex]
}