import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { domain } from "../../data/url";
import { Button, Result, Spin } from "antd";
import Cookies from "js-cookie";
import ContentTable from "../../components/ContentTable";

const DetailOrder: React.FC<{}> = () => {
  const accessToken = Cookies.get("accessToken");
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDetail, setCurrentDetail] = useState<{
    id: number;
    account: any;
    address: string;
    orderDetails: any[];
    status: string;
    totalPrice: number;
    purchaseDate: string;
  }>({
    id: 0,
    account: {},
    address: "",
    orderDetails: [],
    status: "",
    totalPrice: 0,
    purchaseDate: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await axios.get(
          `${domain}/order/get-order?idOrder=${location.state}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setCurrentDetail(data.data[0]);
      } catch (err: any) {
        if (err.status === 403) {
          setIsRestricted(true);
        }
        if (err.status === 401) {
          setIsUnauthorized(true);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handeToViewOrders = () => {
    navigate("/profile/my-orders");
  };

  return (
    <>
      {isRestricted && (
        <Result
          className="fixed inset-1 z-10 bg-white"
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Link to={"/"}>
              <Button type="primary" className="bg-stone-950">
                Back Home
              </Button>
            </Link>
          }
        />
      )}
      {isUnauthorized && (
        <Result
          className="fixed inset-1 z-10 bg-white"
          status="error"
          title="401"
          subTitle="Sorry, please login to continue."
          extra={
            <Link to={"/signin"}>
              <Button type="primary" className="bg-stone-950">
                Signin
              </Button>
            </Link>
          }
        />
      )}
      {isLoading && <Spin spinning={true} fullscreen />}
      <div className="pt-20 w-full">
        <div className="w-2/3 m-auto mt-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-3xl">
              Order #{currentDetail.id}
            </div>
            <div
              onClick={handeToViewOrders}
              className="text-sm hover:scale-105 transition-all cursor-pointer"
            >
              View my orders
            </div>
          </div>
          <div className="my-3">
            <label className="font-semibold">Customer's name:</label>
            <label> {currentDetail.account.fullName}</label>
          </div>
          <div className="my-3">
            <label className="font-semibold">Address:</label>
            <label> {currentDetail.address}</label>
          </div>
          <div className="my-3">
            <label className="font-semibold">Phone:</label>
            <label> {currentDetail.account.phone}</label>
          </div>
          <div className="my-3">
            <label className="font-semibold">Purchase date:</label>
            <label>
              {" "}
              {new Date(currentDetail.purchaseDate).toLocaleDateString()}{" "}
              {new Date(currentDetail.purchaseDate).toLocaleTimeString()}
            </label>
          </div>
          <div className="mt-2">
            <label className="font-semibold">Status:</label>
            <label className="text-green-600 font-medium">
              {" "}
              {currentDetail.status}
            </label>
          </div>
          <div className="mt-6">
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
                  {currentDetail.orderDetails.map(
                    (item: any, index: number) => (
                      <tr
                        key={index}
                        className="bg-gray-200 border-b border-gray-300"
                      >
                        <td className="px-6 py-4">{item.product.name}</td>
                        <td className="px-6 py-4">{item.buyPrice}</td>
                        <td className="px-6 py-4">{item.quantity}</td>
                        <td className="px-6 py-4">
                          {item.quantity * item.buyPrice}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              <div className="float-right my-5">
                <span className="text-xl font-bold">TOTAL: </span>
                <span className="text-xl">${currentDetail.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailOrder;
