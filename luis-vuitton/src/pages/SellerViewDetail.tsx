import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { domain } from "../data/url";
import { Breadcrumb, Button, Result, Spin } from "antd";
import { Link } from "react-router-dom";

const SellerViewDetail: React.FC<{
  mode: string;
  idOrder: number;
  currentModule: string;
  setBreadScrum: React.Dispatch<React.SetStateAction<number>>;
  setShowDetail: React.Dispatch<React.SetStateAction<number>>;
  searchTxt: string;
  setSearchTxt: React.Dispatch<React.SetStateAction<string>>;
  setKeyTable: React.Dispatch<React.SetStateAction<number>>;
}> = ({
  mode,
  idOrder,
  currentModule,
  setBreadScrum,
  setShowDetail,
  searchTxt,
  setSearchTxt,
  setKeyTable,
}) => {
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
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await axios.get(
          `${domain}/order/get-order-seller?idOrder=${idOrder}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setCurrentDetail(data.data.data[0]);
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

  const handleScrum = () => {
    // if (mode === "normal") {
    setBreadScrum((prev) => ++prev);
    setShowDetail(0);
    setKeyTable((prev) => ++prev);
    // } else {
    //   console.log("sợt" + searchTxt);
    //   setSearchTxt(searchTxt);
    //   setBreadScrum((prev) => ++prev);
    //   setShowDetail(0);
    // }
  };

  return (
    <>
      <Breadcrumb
        className="m-4"
        items={[
          {
            title: (
              <div
                onClick={handleScrum}
                className="hover:text-stone-900 cursor-pointer"
              >
                Order management
              </div>
            ),
          },
          {
            title: `Detail order`,
          },
        ]}
      />
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
      <div className="p-12 ">
        <div className="text-2xl font-semibold">Order id: #{idOrder}</div>
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
          <label
            className={`${
              currentDetail.status === "REJECT"
                ? "text-red-500"
                : "text-green-600"
            } font-medium`}
          >
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
                {currentDetail.orderDetails.map((item: any, index: number) => (
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
                ))}
              </tbody>
            </table>
            <div className="float-right my-5">
              <span className="text-xl font-bold">TOTAL: </span>
              <span className="text-xl">${currentDetail.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerViewDetail;
