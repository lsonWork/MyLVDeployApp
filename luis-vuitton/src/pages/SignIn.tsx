import { Link, useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import axios from "axios";
import { domain } from "../data/url";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Roles } from "../data/role";
import {
  GoogleCredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";

interface UserInfo {
  username: string;
  password: string;
  role: string;
  fullname: string;
  phone: string;
  email: string;
  status: boolean;
}

const Signin: React.FC<{}> = () => {
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [checkBtn, setCheckBtn] = useState(false);
  const [errState, setErrState] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  // const [user, setUser] = useState([]);
  // const [profile, setProfile] = useState([]);

  const navigate = useNavigate();
  const classBtnActive =
    "bg-stone-900 mt-1 w-full h-12 rounded-lg flex justify-center items-center text-white font-extralight hover:opacity-95 cursor-pointer transition-all ease-linear";
  const classBtnDisable =
    "bg-stone-700 mt-1 w-full h-12 rounded-lg flex justify-center items-center text-white font-extralight cursor-not-allowed transition-all ease-linear";

  const triggerBtn = () => {
    if (
      username.current?.value.length !== 0 &&
      password.current?.value.length !== 0
    ) {
      setCheckBtn(true);
    } else {
      setCheckBtn(false);
    }
  };

  const pressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && checkBtn) {
      signin();
    }
  };

  const signin = async () => {
    try {
      const signinObject = {
        username: username.current?.value,
        password: password.current?.value,
      };
      const data = await axios.post(`${domain}/auth/signin`, signinObject);
      const token = data.data.accessToken;

      const decoded: any = jwtDecode(token);

      Cookies.set("accessToken", token, { expires: 7 });
      if (decoded.role === Roles.CUSTOMER) {
        navigate("/");
      }
      if (decoded.role === Roles.SELLER) {
        navigate("/");
      }
      if (decoded.role === Roles.ADMIN) {
        navigate("/admin/home");
      }
    } catch (err: any) {
      if (err.response.status === 401) {
        setErrState(() => "Please check your information");
      }
    }
  };

  const handleLoginSuccess = async (response: GoogleCredentialResponse) => {
    if (!response.credential) {
      return;
    }

    const token = response.credential;
    try {
      const user = jwtDecode<UserInfo>(token);
      setUserInfo(user);

      try {
        const userGoogleInfo = {
          email: user.email,
        };
        const data = await axios.post(
          `${domain}/account/create-account-google`,
          userGoogleInfo
        );

        const token = data.data.accessToken;
        Cookies.set("accessToken", token, { expires: 7 });
        const decoded: any = jwtDecode(token);

        if (decoded.role === Roles.CUSTOMER) {
          navigate("/");
        }
        if (decoded.role === Roles.SELLER) {
          navigate("/seller/home");
        }
        if (decoded.role === Roles.ADMIN) {
          navigate("/admin/home");
        }
      } catch (err: any) {
        if (err.response.status === 401) {
          setErrState(() => "Please check your information");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLoginFailure = () => {
    console.log("Login Failed");
  };

  return (
    <div className="flex">
      <div className="w-2/3 h-screen">
        <img
          src="/picture/others/signin.png"
          className="w-full h-full object-cover"
          alt=""
        />
      </div>
      <div className="w-1/3 py-4 flex items-center">
        <div className="w-full">
          <div className="w-full text-center text-3xl font-light py-8">
            Welcome mate!
          </div>
          <div className="w-full text-center text-sm mb-1">
            Using your social network
          </div>
          <div className="w-fulltext-sm">
            <div className="flex justify-center">
              <div className="p-2 cursor-pointer">
                {/* <GoogleOAuthProvider
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
                > */}
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginFailure}
                />
                {/* </GoogleOAuthProvider> */}
              </div>
            </div>
          </div>
          <div className="w-full h-full px-12">
            <input
              type="text"
              className="text-xs py-4 px-6 my-2 border-2 outline-none border-stone-400 rounded-md w-full"
              placeholder="Username"
              ref={username}
              onChange={triggerBtn}
              onKeyDown={(e) => pressEnter(e)}
            />
            <input
              type="password"
              className="text-xs py-4 px-6 my-2 border-2 outline-none border-stone-400 rounded-md w-full"
              placeholder="Password"
              ref={password}
              onChange={triggerBtn}
              onKeyDown={(e) => pressEnter(e)}
            />
            {errState !== "" && (
              <div className="w-full font-normal text-xs text-red-600 py-2">
                {errState}
              </div>
            )}
            <div
              className={checkBtn ? classBtnActive : classBtnDisable}
              onClick={checkBtn ? signin : undefined}
            >
              Signin
            </div>
            <Link to={"/forgot"} className="my-8 block">
              <div className="text-center font-light text-xs cursor-pointer hover:opacity-90 hover:font-medium transition-all">
                Forgot password?
              </div>
            </Link>
            <Link to={"/signup"} className="my-8 block">
              <div className="text-center font-light text-xs cursor-pointer hover:opacity-90 hover:font-medium transition-all">
                Signup new account?
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
