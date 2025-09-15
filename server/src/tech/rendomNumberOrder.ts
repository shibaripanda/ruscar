export const rendomNumberOrder = (orderNumbers) => {
    orderNumbers.min = Math.ceil(orderNumbers.min)
    orderNumbers.max = Math.floor(orderNumbers.max)
    return Math.floor(Math.random() * (orderNumbers.max - orderNumbers.min) + orderNumbers.min)
}