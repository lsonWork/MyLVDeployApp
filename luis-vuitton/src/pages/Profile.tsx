import { Button, ConfigProvider, message, Modal, Result, Spin } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { ReactEventHandler, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { domain } from "../data/url";
import { jwtDecode } from "jwt-decode";

const Profile: React.FC<{}> = () => {
  const accessToken = Cookies.get("accessToken");
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
  const [isChange, setIsChange] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);

  const refUsername = useRef<HTMLInputElement>(null);
  const refFullname = useRef<HTMLInputElement>(null);
  const refPhone = useRef<HTMLInputElement>(null);
  const refEmail = useRef<HTMLInputElement>(null);
  const refAddress = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const navigate = useNavigate();

  const decoded: any = jwtDecode(accessToken!);
  useEffect(() => {
    const fetchData = async () => {
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
        setCurrentAccount(data.data[0]);
        if (data.data[0].password === null) {
          setIsGoogleAccount(true);
        }
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

  const handleSave = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneNumberRegex = /^[0-9]{10,15}$/;

    let allValid = true;
    if (!emailRegex.test(refEmail.current!.value.toString())) {
      message.error("Email is invalid!");
      allValid = false;
    }
    if (!phoneNumberRegex.test(refPhone.current!.value.toString())) {
      message.error("Phone is invalid!");
      allValid = false;
    }
    if (!refAddress.current?.value) {
      message.error("Address is invalid!");
      allValid = false;
    }
    if (!refFullname.current?.value) {
      message.error("Full name is invalid!");
      allValid = false;
    }
    if (allValid) {
      if (!isGoogleAccount) {
        setShowModalConfirm(true);
      } else {
        const newInfo = {
          fullName: refFullname.current?.value,
          phone: refPhone.current?.value,
          email: refEmail.current?.value,
          address: refAddress.current?.value,
        };
        try {
          const dataUpdated = await axios.patch(
            `${domain}/account/edit-profile`,
            newInfo,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          message.success(
            "Your profile update successfully! This popup will automatically close"
          );
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (err: any) {
          console.log(err);

          if (err.status === 403) {
            setIsRestricted(true);
          }
          if (err.status === 401) {
            setIsUnauthorized(true);
          }
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChange(true);
  };

  const handleCancel = () => {
    setShowModalConfirm(false);
  };
  const handleUpdateInfo = async () => {
    setIsLoading(true);
    try {
      const data = await axios.post(
        `${domain}/account/check-password`,
        {
          enteredPassword: refPassword.current?.value,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (data.data) {
        const newInfo = {
          fullName: refFullname.current?.value,
          phone: refPhone.current?.value,
          email: refEmail.current?.value,
          address: refAddress.current?.value,
        };
        try {
          const dataUpdated = await axios.patch(
            `${domain}/account/edit-profile`,
            newInfo,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          message.success(
            "Your profile update successfully! This popup will automatically close"
          );

          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (err: any) {
          console.log(err);

          if (err.status === 403) {
            setIsRestricted(true);
          }
          if (err.status === 401) {
            setIsUnauthorized(true);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        message.error("Your password is incorrect");
      }
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

  const handeToViewOrders = () => {
    navigate("/profile/my-orders");
  };

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#232121",
          },
          components: {
            Pagination: {
              itemActiveBg: "#0C0A09",
            },
            Modal: {},
          },
        }}
      >
        <Modal
          open={showModalConfirm}
          onCancel={handleCancel}
          onOk={handleUpdateInfo}
          title="You're updating your information!"
        >
          <div>To update your information, please provide your password.</div>
          <div className=" mt-2">
            <input
              ref={refPassword}
              type="password"
              name=""
              id=""
              className="outline-none border-2 text-sm font-light p-2"
            />
          </div>
        </Modal>
      </ConfigProvider>

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

      <div className="pt-20 px-40">
        <div className="flex items-center justify-between">
          <div className="text-2xl">Account information</div>
          <div
            onClick={handeToViewOrders}
            className="text-sm hover:scale-105 transition-all cursor-pointer"
          >
            View my orders
          </div>
        </div>
        <div className="">
          <table className="border-separate border-spacing-10 m-auto">
            <tbody>
              <tr className="my-4">
                <td>Username:</td>
                <td>
                  <input
                    defaultValue={currentAccount.username}
                    readOnly={true}
                    ref={refUsername}
                    type="text"
                    className="w-96 text-sm font-normal p-2 outline-none border-2"
                  />
                </td>
              </tr>
              <tr className="my-4">
                <td>Full name:</td>
                <td>
                  <input
                    onChange={handleChangeInputValue}
                    defaultValue={currentAccount.fullName}
                    ref={refFullname}
                    type="text"
                    className="w-96 text-sm font-normal p-2 outline-none border-2"
                  />
                </td>
              </tr>
              <tr className="my-4">
                <td>Email:</td>
                <td>
                  <input
                    readOnly={true}
                    onChange={handleChangeInputValue}
                    defaultValue={currentAccount.email}
                    ref={refEmail}
                    type="email"
                    className="w-96 text-sm font-normal p-2 outline-none border-2"
                  />
                </td>
              </tr>
              <tr>
                <td>Phone:</td>
                <td>
                  <input
                    onChange={handleChangeInputValue}
                    defaultValue={currentAccount.phone}
                    ref={refPhone}
                    type="number"
                    className="w-full text-sm font-normal p-2 outline-none border-2"
                  />
                </td>
              </tr>
              <tr>
                <td>Address:</td>
                <td>
                  <input
                    onChange={handleChangeInputValue}
                    defaultValue={currentAccount.address}
                    ref={refAddress}
                    type="text"
                    className="w-full text-sm font-normal p-2 outline-none border-2"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {!currentAccount.address && (
            <div className="text-red-600 text-sm font-light mb-6">
              [*]Please provide us your information so that you can order in our
              platform
            </div>
          )}
          {isChange && (
            <div className="w-full px-20">
              <div
                onClick={handleSave}
                className="float-end w-36 bg-stone-950 text-white font-light text-center p-2 text-sm rounded-md hover:opacity-90 cursor-pointer"
              >
                Save
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
