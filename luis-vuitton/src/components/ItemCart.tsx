import { items, categories } from "../data/data-source";
import { useEffect, useState } from "react";
import Controls from "./Controls";
import axios from "axios";
import { domain } from "../data/url";
import { cartAction } from "../store/Cart";
import { useDispatch } from "react-redux";
type ItemCartType = {
  item: {
    idProduct: number;
    quantity: number;
  };
  triggerStateCart: () => void;
};
const ItemCart: React.FC<ItemCartType> = (props) => {
  const [quantity, setQuantity] = useState(props.item.quantity);

  const [itemInCart, setItemInCart] = useState<{
    category: any;
    id: number;
    name: string;
    productImages: any[];
    quantity: number;
    price: number;
    description: string;
    warehouse: any;
    thumbnail: string;
    isDeleted: boolean;
  }>({
    category: {},
    id: 0,
    name: "",
    productImages: [],
    quantity: 0,
    price: 0,
    description: "",
    warehouse: {},
    thumbnail: "",
    isDeleted: false,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(
        `${domain}/product/detail/${props.item.idProduct}`
      );
      setItemInCart(data.data);
    };
    fetchData();
  }, []);

  const removeItemInCart = (id: number) => {
    dispatch(cartAction.removeItem(id));
    // window.location.reload();
    props.triggerStateCart();
  };

  return (
    <div
      className={`flex mt-4 rounded-2xl w-full relative justify-between overflow-hidden py-2 ${
        itemInCart.isDeleted ? "bg-stone-400" : ""
      }`}
    >
      <div className="NAVLINK">
        <div className="flex">
          <img
            src={itemInCart!.thumbnail}
            alt=""
            className="w-28 h-28 border-[0.125rem] border-stone-600 rounded-2xl"
          />
          <div className="w-56 ml-4">
            <div className="truncate">{itemInCart!.name}</div>
            <div className="text-sm text-stone-700">
              {itemInCart.category.name}
            </div>
            <div className="mt-6">
              <span>Unit price:</span>
              <span className="ml-2 font-semibold">${itemInCart!.price}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-52 flex items-center">
        <div className="w-full">
          <Controls
            triggerStateCart={props.triggerStateCart}
            reset={false}
            quantity={quantity}
            idProduct={props.item.idProduct}
            isDeleted={itemInCart.isDeleted}
          />
          <div className="mt-4 font-bold">
            ${itemInCart!.price * props.item.quantity}
          </div>
        </div>
      </div>
      <div
        onClick={() => removeItemInCart(itemInCart.id)}
        className="absolute right-2 p-1 cursor-pointer hover:scale-125 transition-all"
      >
        <i className="fi fi-rr-trash mt-1 inline-block"></i>
      </div>
    </div>
  );
};

export default ItemCart;
