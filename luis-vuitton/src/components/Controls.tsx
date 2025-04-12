import { useState } from "react";
import { useDispatch } from "react-redux";
import { cartAction } from "../store/Cart";
import { useEffect } from "react";
const Controls: React.FC<{
  reset: boolean;
  quantity: number;
  idProduct: number;
  isDeleted: boolean;
  triggerStateCart: () => void;
}> = (props) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(
    props.reset ? 1 : props.quantity
  );

  const handleIncrease = () => {
    if (!props.isDeleted) {
      setInputValue((prev) => {
        return (prev += 1);
      });
    }
  };

  const handleDecrease = () => {
    if (!props.isDeleted) {
      setInputValue((prev) => {
        if (prev === 1) {
          if (props.reset) {
            return prev;
          } else {
            dispatch(cartAction.removeItem(props.idProduct));
            // window.location.reload();
            props.triggerStateCart();
          }
        }
        return (prev -= 1);
      });
    }
  };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const newValue = event.target.value;
  //   if (newValue) {
  //     if (Number(newValue) < 1) {
  //       console.log("xóa đi");
  //     }
  //   } else {
  //     console.log("ksao");
  //   }
  //   setInputValue(parseInt(newValue));
  // };

  useEffect(() => {
    if (!props.reset) {
      dispatch(
        cartAction.updateQuantity({
          idProduct: props.idProduct,
          newQuantity: inputValue,
        })
      );
    } else {
      dispatch(cartAction.holdQuantity(inputValue));
    }
  }, [inputValue, dispatch]);

  return (
    <div className="inline-flex items-center gap-3">
      <div
        onClick={handleDecrease}
        className="bg-stone-400 w-5 h-5 flex rounded-sm justify-center cursor-pointer hover: opacity-85"
      >
        <i className="fi fi-rr-minus-small"></i>
      </div>
      <input
        type="number"
        className="w-20 text-lg text-center"
        value={inputValue}
        readOnly={true}
      />
      <div
        onClick={handleIncrease}
        className="bg-stone-400 w-5 h-5 flex rounded-sm justify-center cursor-pointer hover: opacity-85"
      >
        <i className="fi fi-rr-plus-small"></i>
      </div>
    </div>
  );
};

export default Controls;
