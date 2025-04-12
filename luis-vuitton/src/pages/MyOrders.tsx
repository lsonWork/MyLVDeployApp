import { Button, ConfigProvider, Pagination, Result, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { domain } from "../data/url";
import Cookies from "js-cookie";

const MyOrders: React.FC<{}> = () => {
  const accessToken = Cookies.get("accessToken");

  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState("PROCESSING");
  const data = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      role: "Editor",
    },
  ];
  const [dataOrders, setDataOrders] = useState<
    {
      address: string;
      id: number;
      orderDetails: any;
      status: string;
      totalPrice: number;
      purchaseDate: string;
    }[]
  >([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [paginationKey, setPaginationKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const data = await axios.get(
          `${domain}/order/my-orders?status=${selected}&page=1&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setDataOrders(data.data.data);
        setTotalOrders(data.data.total);
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
  }, [selected]);

  const onChangeTab = (mode: string) => {
    setSelected(mode);
    setPaginationKey((prev) => ++prev);
  };

  const changePage = async (page: number) => {
    try {
      setIsLoading(true);

      const data = await axios.get(
        `${domain}/order/my-orders?status=${selected}&page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDataOrders(data.data.data);
      setTotalOrders(data.data.total);
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

  const handleClickOrder = (id: number) => {
    navigate("/profile/detail-order", { state: id });
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
      <div className="pt-20">
        <div className="pt-10 flex items-center justify-center gap-20">
          <div
            onClick={() => onChangeTab("PROCESSING")}
            className={`cursor-pointer  px-4 py-1 ${
              selected === "PROCESSING"
                ? "bg-stone-600 rounded-sm text-slate-100"
                : ""
            } ${selected !== "PROCESSING" ? "hover:bg-stone-300" : ""}`}
          >
            Processing
          </div>
          <div
            onClick={() => onChangeTab("APPROVED")}
            className={`cursor-pointer px-4 py-1 ${
              selected === "APPROVED"
                ? "bg-stone-600 rounded-sm text-slate-100"
                : ""
            } ${selected !== "APPROVED" ? "hover:bg-stone-300" : ""}`}
          >
            Approved
          </div>
          <div
            onClick={() => onChangeTab("REJECT")}
            className={`cursor-pointer px-4 py-1 ${
              selected === "REJECT"
                ? "bg-stone-600 rounded-sm text-slate-100"
                : ""
            } ${selected !== "REJECT" ? "hover:bg-stone-300" : ""}`}
          >
            Reject
          </div>
        </div>
        <div className="container w-3/4 mx-auto mt-10">
          <div className="w-auto shadow-md rounded-lg">
            <table className="w-full text-sm text-center text-gray-700 bg-white">
              <thead className="bg-gray-100 text-xs uppercase font-medium text-gray-900 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Products
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Purchase date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataOrders.map((item, index) => (
                  <tr
                    onClick={() => handleClickOrder(item.id)}
                    key={item.id}
                    className={`cursor-pointer border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-6 py-4">{item.id}</td>
                    <td className="px-6 py-4 font-medium">
                      {item.orderDetails?.reduce((acc: number, item: any) => {
                        return acc + item.quantity;
                      }, 0)}{" "}
                      {`item${
                        item.orderDetails?.reduce((acc: number, item: any) => {
                          return acc + item.quantity;
                        }, 0) > 1
                          ? "s"
                          : ""
                      }`}
                    </td>
                    <td className="px-6 py-4">{item.totalPrice}</td>
                    <td className="px-6 py-4">{item.address}</td>
                    <td className="px-6 py-4">
                      {new Date(item.purchaseDate).toLocaleDateString()}{" "}
                      {new Date(item.purchaseDate).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4">{item.status}</td>
                  </tr>
                ))}
                {dataOrders.length === 0 && (
                  <tr>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">No information</td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "white",
              },
              components: {
                Pagination: {
                  itemActiveBg: "#0C0A09",
                },
                Modal: {},
              },
            }}
          >
            <Pagination
              key={paginationKey}
              defaultCurrent={1}
              total={totalOrders}
              showSizeChanger={false}
              pageSize={10}
              onChange={changePage}
              className="mt-8"
            />
          </ConfigProvider>
        </div>
      </div>
    </>
  );
};

export default MyOrders;
