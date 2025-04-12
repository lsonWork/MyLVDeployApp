import axios, { AxiosError } from "axios";
import { error } from "console";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { domain } from "../data/url";
import Loading from "../components/Loading";
import { message } from "antd";
const CustomerSchema = z
  .object({
    fullName: z
      .string()
      .regex(/^[A-Za-z ]+$/, "Fullname should contain only letters"),

    username: z
      .string()
      .regex(
        /^[A-Za-z0-9]+$/,
        "Username should contain only letters and numbers"
      ),

    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
        "Password must has length [8-16], contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),

    passwordConfirm: z.string(),
    phone: z
      .string()
      .regex(/^\d+$/, "Phone must contain numbers only")
      .min(10, "Phone must be 10 characters min")
      .max(15, "Phone must be 15 characters max"),
    email: z.string().email("Please provide correct email"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password does not match",
    path: ["passwordConfirm"],
  });

const Signup: React.FC<{}> = () => {
  type ObjError = {
    [key: string]: string;
  };
  let objError: ObjError = {};
  const [errorState, updateErrorState] = useState(objError);
  const [checkboxState, setCheckboxState] = useState(false);
  const [signupInfo, setSignupInfo] = useState({});
  const [dataFetch, setDataFetch] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [conflictState, setConflictState] = useState("");
  const fullName = useRef<HTMLInputElement>(null);
  const username = useRef<HTMLInputElement>(null);
  const phone = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const passwordConfirm = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const checkbox = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const classBtnNonClickable =
    "bg-stone-900 text-white p-4 text-center font-extralight rounded-lg mt-4 opacity-80 cursor-not-allowed mb-4";
  const classBtnClickable =
    "bg-stone-900 text-white p-4 text-center font-extralight rounded-lg mt-4 hover:opacity-95 cursor-pointer mb-4";

  const handleCreate = () => {
    const userInformation = {
      fullName: fullName.current?.value.trim(),
      username: username.current?.value.trim(),
      phone: phone.current?.value.trim(),
      password: password.current?.value.trim(),
      passwordConfirm: passwordConfirm.current?.value.trim(),
      email: email.current?.value.trim(),
    };
    try {
      CustomerSchema.parse(userInformation);
      setSignupInfo(() => {
        const { passwordConfirm, ...newObj } = userInformation;
        return newObj;
      });
      updateErrorState({});
    } catch (error) {
      // console.log(error);
      if (error instanceof z.ZodError) {
        const newErrorState: ObjError = {};
        error.errors.forEach((err) => {
          const prop = err.path[0] as string;
          newErrorState[prop] = err.message;
        });
        updateErrorState(newErrorState);
      } else if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  // const success = () => {
  //   messageApi.open({
  //     type: "success",
  //     content: "Signup successfully!",
  //   });
  // };

  const handleCheckbox = () => {
    setCheckboxState((old) => checkbox.current!.checked);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const bodyRequest = { ...signupInfo, role: "CUSTOMER" };
        // console.log(bodyRequest);
        const data = await axios.post(`${domain}/auth/signup`, bodyRequest);
        // messageApi.success("Signup successfully!");
        messageApi.success({
          content:
            "Signup successfully! You will be automatically redirected to the sign-in page",
          duration: 5,
        });
        setConflictState("");
        updateErrorState({});
        setTimeout(() => {
          navigate("/signin");
        }, 6000);
        setDataFetch(() => data);
      } catch (err: any) {
        console.log(err);

        if (err.status === 409) {
          setConflictState(err.response.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (signupInfo && Object.keys(signupInfo).length > 0) {
      fetchData();
    }
  }, [signupInfo]);
  // console.log(dataFetch);
  // console.log(signupInfo);
  console.log(isLoading);

  return (
    <>
      {isLoading && <Loading duration={20000} />}
      {contextHolder}
      <div className="flex">
        <div className="w-1/3 h-screen items-center justify-center flex">
          <div className="w-full px-10">
            <div className="text-center mb-4 text-3xl font-light ">
              Discover our world!
            </div>
            <input
              ref={fullName}
              type="text"
              placeholder="Fullname"
              className="w-full text-xs p-3 my-2 outline-none rounded-md border-2 border-stone-400"
            />
            <div className="font-normal text-xs text-red-600 ">
              {errorState["fullName"] ? errorState["fullName"] : undefined}
            </div>
            <input
              ref={phone}
              type="text"
              placeholder="Phone"
              className="w-full text-xs p-3 my-2 outline-none rounded-md border-2 border-stone-400"
            />
            <div className="font-normal text-xs text-red-600 ">
              {errorState["phone"] ? errorState["phone"] : undefined}
            </div>
            <input
              ref={username}
              type="text"
              placeholder="Username"
              className="w-full text-xs p-3 my-2 outline-none rounded-md border-2 border-stone-400"
            />
            <div className="font-normal text-xs text-red-600 ">
              {errorState["username"] ? errorState["username"] : undefined}
            </div>
            <input
              ref={password}
              type="password"
              placeholder="Password"
              className="w-full text-xs p-3 my-2 outline-none rounded-md border-2 border-stone-400"
            />
            <div className="font-normal text-xs text-red-600 ">
              {errorState["password"] ? errorState["password"] : undefined}
            </div>
            <input
              ref={passwordConfirm}
              type="password"
              placeholder="Password confirmation"
              className="w-full text-xs p-3 my-2 outline-none rounded-md border-2 border-stone-400"
            />
            <div className="font-normal text-xs text-red-600 ">
              {errorState["passwordConfirm"]
                ? errorState["passwordConfirm"]
                : undefined}
            </div>
            <input
              ref={email}
              type="email"
              placeholder="Email"
              className="w-full text-xs p-3 my-2 outline-none rounded-md border-2 border-stone-400"
            />
            <div className="font-normal text-xs text-red-600 ">
              {errorState["email"] ? errorState["email"] : undefined}
            </div>
            {conflictState.length !== 0 && (
              <div className="font-normal text-xs text-red-600 ">
                {conflictState}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <input type="checkbox" ref={checkbox} onClick={handleCheckbox} />
              <div className="text-xs">
                I agree to the Terms of Service and Privacy Policy.
              </div>
            </div>
            <div
              onClick={checkboxState ? handleCreate : undefined}
              className={
                checkboxState ? classBtnClickable : classBtnNonClickable
              }
            >
              Create new account
            </div>
            <Link to={"/signin"}>
              <div className="text-center font-light text-xs cursor-pointer hover:opacity-90 hover:font-medium transition-all">
                Signin
              </div>
            </Link>
          </div>
        </div>
        <div className="bg-[#E9EEF2] w-2/3 h-screen">
          <img
            src="/picture/others/signup.png"
            className="w-full h-full object-contain"
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default Signup;
