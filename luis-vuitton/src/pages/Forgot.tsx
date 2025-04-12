import { message, Spin } from "antd";
import axios from "axios";
import { ReactHTML, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { domain } from "../data/url";

const Forgot: React.FC<{}> = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const refEmail = useRef<HTMLInputElement>(null);
  const refOTP = useRef<HTMLInputElement>(null);
  const refPass = useRef<HTMLInputElement>(null);
  const refConfirm = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const [errOTP, setErrOTP] = useState("");
  const [openOTP, setOpenOTP] = useState(false);
  const [correctOTP, setCorrectOTP] = useState(false);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const onClickGetOTP = async () => {
    if (refEmail.current?.value.length !== 0) {
      setIsLoading(true);
      try {
        const data = await axios.post(`${domain}/account/check-email`, {
          email: refEmail.current?.value,
        });
        setErr("");
        setEmail(refEmail.current!.value);
        messageApi.success("An OTP has been sent to your email!");
        setOpenOTP(true);
      } catch (e: any) {
        if ((e.response.data.statusCode = 404)) {
          setErr(e.response.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onClickCheckOTP = async () => {
    if (refOTP.current?.value.length !== 0) {
      setIsLoading(true);
      try {
        const data = await axios.post(`${domain}/account/check-otp`, {
          email: email,
          otp: refOTP.current?.value,
        });
        setErrOTP("");
        setCorrectOTP(true);
      } catch (e: any) {
        setCorrectOTP(false);
        if ((e.response.data.statusCode = 404)) {
          setErrOTP(e.response.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onCreatePass = async () => {
    let valid = true;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (refPass.current?.value !== refConfirm.current?.value) {
      valid = false;
      messageApi.error("Password does not match");
    } else {
      if (!regex.test(refPass.current!.value)) {
        valid = false;
        messageApi.error(
          "Password must has length [8-16], contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        );
      }
    }

    if (valid) {
      setIsLoading(true);
      try {
        const data = await axios.patch(`${domain}/auth/forgot-password`, {
          email: email,
          newPassword: refPass.current?.value,
        });
        messageApi.success(
          "Your password has changed successfully! We'll direct you to signin page"
        );
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } catch (e: any) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {contextHolder}

      {isLoading && <Spin spinning={true} fullscreen />}
      <div className="w-full h-screen relative">
        <img
          className="w-full h-full brightness-50"
          src="/picture/others/forgot.png"
          alt=""
        />
        <div className=" bg-slate-200 rounded-xl z-10 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 p-6 text-center">
          {!correctOTP && (
            <>
              <div className="w-full text-center text-2xl font-light">
                Forgot password
              </div>
              {!openOTP && (
                <div className="w-full text-center text-sm font-light my-4">
                  Please provide us your email, we'll send you an OTP that
                  available for 15 minutes
                </div>
              )}
              {openOTP && (
                <div className="w-full text-center text-sm font-light my-4">
                  Enter your OTP
                </div>
              )}
              {!openOTP && (
                <input
                  ref={refEmail}
                  type="email"
                  className="border-2 border-stone-400 outline-none w-72 px-2 py-1 font-light text-xs"
                  placeholder="Email"
                />
              )}
              {openOTP && (
                <input
                  ref={refOTP}
                  type="string"
                  className="border-2 border-stone-400 outline-none w-52 px-2 py-1 font-light text-xs"
                  placeholder="OTP"
                />
              )}
              {err && (
                <div className="my-2 font-light text-xs text-red-500">
                  {err}
                </div>
              )}
              {errOTP && (
                <div className="my-2 font-light text-xs text-red-500">
                  {errOTP}
                </div>
              )}
              {!openOTP && (
                <div
                  onClick={onClickGetOTP}
                  className={`w-full bg-stone-900 text-white text-sm font-extralight py-2 ${
                    !err && "mt-4"
                  } rounded-md cursor-pointer hover:opacity-95`}
                >
                  Get OTP
                </div>
              )}
              {openOTP && (
                <div
                  onClick={onClickCheckOTP}
                  className={`w-full bg-stone-900 text-white text-sm font-extralight py-2 ${
                    !errOTP && "mt-4"
                  } rounded-md cursor-pointer hover:opacity-95`}
                >
                  Check
                </div>
              )}
            </>
          )}
          {correctOTP && (
            <div>
              <div className="w-full px-20 text-center text-2xl font-light mb-2">
                Setup new password
              </div>
              <input
                ref={refPass}
                type="password"
                className="block m-auto border-2 border-stone-400 outline-none w-72 px-2 py-1 font-light text-xs my-4"
                placeholder="New password"
              />
              <input
                ref={refConfirm}
                type="password"
                className="block m-auto border-2 border-stone-400 outline-none w-72 px-2 py-1 font-light text-xs my-4"
                placeholder="Password confirm"
              />
              <div
                onClick={onCreatePass}
                className={`w-72 m-auto bg-stone-900 text-white text-sm font-extralight py-2 rounded-md cursor-pointer hover:opacity-95`}
              >
                Create
              </div>
            </div>
          )}
          <Link
            to={"/signin"}
            className="font-light text-xs hover:font-medium mt-4 inline-block transition-all"
          >
            Signin
          </Link>
        </div>
      </div>
    </>
  );
};

export default Forgot;
