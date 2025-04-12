import { useLocation } from "react-router-dom";
import ContentTable from "../components/ContentTable";
import { clearCart, getCart } from "../data/localStorageItems";
import { items } from "../data/data-source";
import { useEffect, useState } from "react";
import axios from "axios";
import { domain } from "../data/url";
import { useDispatch } from "react-redux";
import { cartAction } from "../store/Cart";
const Bill: React.FC<{}> = (props) => {
  const location = useLocation();
  const { customer, address, phone } = location.state;
  const order = getCart("cart");
  const [selectedItems, setSelectedItems] = useState<
    {
      id: number;
      quantity: number;
    }[]
  >([]);
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = order.map(
          async (item: { idProduct: number; quantity: number }) => {
            const { data } = await axios.get(
              `${domain}/product/detail/${item.idProduct}`
            );
            return {
              id: data.id,
              name: data.name,
              price: data.price,
              quantity: item.quantity,
            };
          }
        );

        const results = await Promise.all(promises);

        const totalPrice = results.reduce(
          (
            acc: number,
            current: {
              id: number;
              name: string;
              price: number;
              quantity: number;
            }
          ) => {
            return acc + current.quantity * current.price;
          },
          0
        );

        setTotal(totalPrice);
        setSelectedItems(results);
        setTimeout(() => {
          clearCart();
          dispatch(cartAction.resetCart());
        }, 0);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pt-32">
      <div className="container m-auto px-40">
        <div className=" text-3xl font-semibold mb-8">
          Order successfully created!
        </div>
        <div className="my-2">
          <label className="font-semibold">Customer's name:</label>
          <label> {customer}</label>
        </div>
        <div className="my-2">
          <label className="font-semibold">Address:</label>
          <label> {address}</label>
        </div>
        <div className="my-2">
          <label className="font-semibold">Phone:</label>
          <label> {phone}</label>
        </div>
        <div className="mt-2">
          <label className="font-semibold">Status:</label>
          <label className="text-green-600 font-medium"> Processing...</label>
        </div>
        <div className="my-2 mb-9">
          <label className="font-normal">
            Thanks for choosing us! Hope you had a good shopping experience. We
            are always honored to serve you in the future.
          </label>
        </div>
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-500 text-xs uppercase font-medium text-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Product name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Unit price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.map((item: any, index: number) => (
                  <ContentTable key={index} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="float-right my-5">
          <span className="text-xl font-bold">TOTAL: </span>
          <span className="text-xl">${total}</span>
        </div>
      </div>
    </div>
  );
};

export default Bill;
