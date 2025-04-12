import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

interface Properties {
  currentModule: string;
  handleChangeMode: (mode: string) => void;
}
const SideBar: React.FC<Properties> = ({ currentModule, handleChangeMode }) => {
  const accessToken = Cookies.get("accessToken");
  const decoded: any = jwtDecode(accessToken!);
  const navigate = useNavigate();

  const selectionClassActive =
    "bg-green-500 rounded-sm cursor-pointer p-3 my-2 font-normal text-stone-950 transition-all";
  const selectionClassNormal =
    "hover:bg-stone-900 rounded-sm cursor-pointer p-3 my-2 transition-all";

  const handleSignout = () => {
    Cookies.remove("accessToken");
    navigate("/signin");
  };

  return (
    <div className="bg-stone-950 min-h-screen w-60 text-white p-6">
      <div className="flex items-center justify-between">
        <div className="font-extralight text-xl">Hi, {decoded.username}!</div>
        <div
          onClick={handleSignout}
          className="hover:scale-110 transition-all cursor-pointer"
        >
          <i className="fi fi-rr-sign-out-alt inline-block mt-2"></i>
        </div>
      </div>
      <div className="w-full h-[0.05rem] bg-white my-6"></div>
      <NavLink to={"/"}>
        <div className="w-full font-extralight text-sm my-6 hover:opacity-90 cursor-pointer transition-all hover:scale-105 ml-1">
          Go to homepage
        </div>
      </NavLink>
      <div className="w-full h-[0.05rem] bg-white my-6"></div>
      <div className="w-full font-extralight text-sm my-6">
        <i className="fi fi-rr-box-open-full mr-1"></i>
        Management
      </div>
      <div className="w-full">
        <ul className="w-full font-extralight text-sm">
          <li
            onClick={
              currentModule === "category"
                ? undefined
                : () => handleChangeMode("category")
            }
            className={
              currentModule === "category"
                ? selectionClassActive
                : selectionClassNormal
            }
            // className={selectionClassActive}
          >
            Category
          </li>
          <li
            onClick={
              currentModule === "product"
                ? undefined
                : () => handleChangeMode("product")
            }
            className={
              currentModule === "product"
                ? selectionClassActive
                : selectionClassNormal
            }
          >
            Product
          </li>
          <li
            onClick={
              currentModule === "order"
                ? undefined
                : () => handleChangeMode("order")
            }
            className={
              currentModule === "order"
                ? selectionClassActive
                : selectionClassNormal
            }
          >
            Order
          </li>
        </ul>
      </div>
      <div className="w-full h-[0.05rem] bg-white my-6"></div>
      <div className="w-full font-extralight text-sm my-6">
        <i className="fi fi-rr-chart-histogram mr-1"></i>
        Statistic
      </div>
      <div className="w-full">
        <ul className="w-full font-extralight text-sm">
          <li
            onClick={
              currentModule === "statistic"
                ? undefined
                : () => handleChangeMode("statistic")
            }
            className={
              currentModule === "statistic"
                ? selectionClassActive
                : selectionClassNormal
            }
            // className={selectionClassActive}
          >
            General statistics
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
