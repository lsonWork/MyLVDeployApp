type CartType = {
    idProduct: number,
    quantity: number
}
type Cart = Array<CartType>
export const setCart = (cart: Cart) => {
    localStorage.setItem('cart', JSON.stringify(cart))
}

export const getCart = (key: string) => {
    const cart = localStorage.getItem(key);
    return cart ? JSON.parse(cart) : [];
}

export const clearCart = () => {
    setCart([])
}