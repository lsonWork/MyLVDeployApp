import { getCart } from "../data/localStorageItems";
import ItemCart from "../components/ItemCart";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CheckOut from "../components/CheckOut";
const CartComponent: React.FC<{}> = () => {
  const [cartState, setCartState] = useState(getCart("cart"));
  const cartStateRedux = useSelector((state: any) => state.stateCart);
  const [isCartEmpty, setIsCartEmpty] = useState(false);

  const triggerStateCart = () => {
    setIsCartEmpty(true);
  };
  useEffect(() => {
    const cartStateLocal = getCart("cart");
    if (cartStateLocal.length === 0) {
      setIsCartEmpty(true);
    } else {
      setIsCartEmpty(false);
    }
    setCartState(cartStateLocal);
  }, [cartStateRedux]);

  return (
    <div className="pt-20">
      <div className="container mx-auto px-44">
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3">
            {cartState.length === 0 && <div>Your cart is empty</div>}
            {cartState.length !== 0 && (
              <div>
                {cartState.map((item: any) => {
                  return (
                    <ItemCart
                      triggerStateCart={triggerStateCart}
                      key={item.idProduct}
                      item={item}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <CheckOut isCartEmpty={isCartEmpty} />
        </div>
      </div>
    </div>
  );
};

export default CartComponent;
