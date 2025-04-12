import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { getCart } from "../data/localStorageItems";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import axios from "axios";
import { domain } from "../data/url";
import { jwtDecode } from "jwt-decode";
import { Button, message, Result, Spin } from "antd";

const CustomerSchema = z.object({
  customer: z.string().nonempty("This field is required"),

  address: z.string().nonempty("This field is required"),

  phone: z
    .string()
    .min(10, "Phone must be 10 characters min")
    .max(15, "Phone must be 15 characters max"),
});

const CheckOut: React.FC<{
  isCartEmpty: boolean;
}> = ({ isCartEmpty }) => {
  type ObjError = {
    [key: string]: string;
  };

  let objError: ObjError = {};
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const customer = useRef<HTMLInputElement>(null);
  const address = useRef<HTMLInputElement>(null);
  const phone = useRef<HTMLInputElement>(null);
  const [errorState, getErrorState] = useState(objError);
  const [isComplete, setIsComplete] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<{
    id: number;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
  }>({
    id: 0,
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      const decoded: any = jwtDecode(accessToken!);
      try {
        setIsLoading(true);

        const data = await axios.get(
          `${domain}/account/get-profile?myId=${decoded.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const hasNullValue = Object.entries(data.data[0]).some(
          ([key, value]) =>
            key !== "password" &&
            key !== "otp" &&
            key !== "otpExpired" &&
            value === null
        );

        if (hasNullValue) {
          setIsComplete(false);
        } else {
          setIsComplete(true);
        }

        setCurrentAccount(data.data[0]);
      } catch (err: any) {
        if (err.status === 403) {
          setIsRestricted(true);
        }
        if (err.status === 401) {
          // setIsUnauthorized(true);
          Cookies.remove("accessToken");
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (accessToken) {
      fetchData();
    }
  }, []);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const cart = getCart("cart");

      const data = await axios.post(
        `${domain}/order/create-order`,
        { cart: cart },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const objEmail = {
        id: data.data.id,
        fullName: data.data.account.fullName,
        phone: data.data.account.phone,
        address: data.data.address,
        product: data.data.orderDetails.map((item: any) => ({
          buyPrice: item.buyPrice,
          name: item.product.name,
          quantity: item.quantity,
        })),
        total: data.data.totalPrice,
      };
      const decoded: any = jwtDecode(accessToken!);
      const myAccount = await axios.get(
        `${domain}/account/get-profile?myId=${decoded.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const to = myAccount.data[0].email;

      try {
        setIsLoading(true);
        const email = await axios.post(
          `${domain}/mail/send`,
          { to: to, subject: "Here is your order!", objEmail },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (err: any) {
      } finally {
        setIsLoading(false);
      }

      const objectData = {
        customer: data.data.account.fullName,
        address: data.data.account.address,
        phone: data.data.account.phone,
      };
      navigate("/bill", { state: objectData });
    } catch (err: any) {
      if (err.status === 403) {
        setIsRestricted(true);
      }
      if (err.status === 401) {
        setIsUnauthorized(true);
      }
      if (err.status === 400) {
        err.response.data.message.forEach((item: string) => {
          messageApi.error(item);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}

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
      <div className="col-span-2 px-10 bg-stone-800 py-10 rounded-2xl ">
        {accessToken && (
          <>
            <div className="font-semibold text-4xl mb-8 text-slate-200">
              Check out
            </div>
            <table className=" text-slate-200 border-spacing-y-4 border-spacing-x-2 border-separate">
              <tbody>
                <tr>
                  <td>Customer:</td>
                  <td className="truncate inline-block w-full">
                    {currentAccount.fullName}
                  </td>
                </tr>
                <tr>
                  <td>Phone:</td>
                  <td className="truncate inline-block w-full">
                    {currentAccount.phone}
                  </td>
                </tr>
                <tr>
                  <td>Address:</td>
                  <td className="truncate inline-block w-full">
                    {currentAccount.address}
                  </td>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td className="truncate inline-block w-full">
                    {currentAccount.email}
                  </td>
                </tr>
              </tbody>
            </table>
            {!isComplete && (
              <div className="text-slate-200 font-light text-sm italic">
                Notice: your information is incomplete, please edit your profile
                so that you can purchase your order
              </div>
            )}
            {isCartEmpty && (
              <div className="text-slate-200 font-light text-sm italic">
                Your cart is empty, you can't purchase
              </div>
            )}
            {!isCartEmpty && isComplete && (
              <div
                onClick={!isCartEmpty ? handlePurchase : undefined}
                className="mt-8 py-3 bg-slate-100 text-center rounded-xl font-bold text-xl hover:opacity-85 cursor-pointer"
              >
                Purchase
              </div>
            )}
          </>
        )}
        {!accessToken && (
          <div className="">
            <div className="text-center ">
              <div className="text-white">
                You're not signin, please signin to continue purchase your order
              </div>
              <NavLink to={"/signin"}>
                <div className="mt-8 py-3 bg-slate-100 text-center rounded-xl font-bold text-xl hover:opacity-85 cursor-pointer">
                  Signin
                </div>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CheckOut;
