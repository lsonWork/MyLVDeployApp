import { items } from "../data/data-source";
import { clearCart } from "../data/localStorageItems";
import { useDispatch } from "react-redux";
import { cartAction } from "../store/Cart";
import { useEffect, useState } from "react";
import axios from "axios";
import { domain } from "../data/url";
type Props = {
  item: {
    idProduct: number;
    quantity: number;
  };
};
const ContentTable: React.FC<Props> = (props) => {
  const [selectedItem, setSelectedItem] = useState<{
    name: string;
    price: number;
    quantity: number;
  }>({
    name: "",
    price: 0,
    quantity: 0,
  });
  useEffect(() => {
    // clearCart();
    // dispatch(cartAction.resetCart());
    const fetchData = async () => {
      try {
        const data = await axios.get(
          `${domain}/product/detail/${props.item.idProduct}`
        );
        setSelectedItem(data.data);
      } catch (err: any) {
      } finally {
      }
    };
    fetchData();
  }, []);

  return (
    <tr className="bg-gray-200 border-b border-gray-300">
      <td className="px-6 py-4">{selectedItem.name}</td>
      <td className="px-6 py-4">{selectedItem.price}</td>
      <td className="px-6 py-4">{props.item.quantity}</td>
      <td className="px-6 py-4">{props.item.quantity * selectedItem!.price}</td>
    </tr>
  );
};

export default ContentTable;
