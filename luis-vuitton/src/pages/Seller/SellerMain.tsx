import { FC, useEffect, useMemo, useState } from "react";
import Search from "./Search";
import TableComponent from "./TableComponent";
import ButtonCreate from "./ButtonCreate";
import SideBar from "./SideBar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Button, Result } from "antd";
import { jwtDecode } from "jwt-decode";
import StatisticComponent from "./StatisticComponent";
import SellerViewDetail from "../SellerViewDetail";

const SellerMain: React.FC<{}> = () => {
  const [currentModule, setCurrentModule] = useState<string>("category");
  const [keySearch, setKeySearch] = useState(2);
  const [paginationKey, setPaginationKey] = useState(0);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [status, setStatus] = useState("PROCESSING");
  const [mode, setMode] = useState("");
  const [showDetail, setShowDetail] = useState(0);
  const [breadScrum, setBreadScrum] = useState(0);
  const [keyTable, setKeyTable] = useState(0);
  const [searchTxt, setSearchTxt] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useMemo(() => {
    const accessToken = Cookies.get("accessToken");
    if (typeof accessToken === "undefined") {
      console.log("Token không tồn tại");
      setIsUnauthorized(true);
    }
  }, []);

  useEffect(() => {
    if (location.state?.module) {
      setCurrentModule((prev) => location.state.module);
      navigate(location.pathname, { replace: true }); // `replace: true` để không ghi vào history
    }
  }, []);

  const handleChangeMode = (mode: string) => {
    setCurrentModule((prev) => mode);
    setKeySearch((prev) => ++prev);
    setPaginationKey((prev) => ++prev);
    setStatus("PROCESSING");
    setMode("normal");
    setShowDetail(0);
  };

  return (
    <>
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
      {!isUnauthorized && (
        <div className="flex w-full">
          <SideBar
            currentModule={currentModule}
            handleChangeMode={handleChangeMode}
          />
          <div className="flex-grow px-8">
            <div>
              {currentModule !== "statistic" && showDetail === 0 && (
                <TableComponent
                  keyTableRender={keyTable}
                  searchTxt={searchTxt}
                  setSearchTxt={setSearchTxt}
                  status={status}
                  mode={mode}
                  setMode={setMode}
                  setStatus={setStatus}
                  paginationKey={paginationKey}
                  setPaginationKey={setPaginationKey}
                  keySearch={keySearch}
                  module={currentModule}
                  handleChangeMode={handleChangeMode}
                  setShowDetail={setShowDetail}
                  breadScrum={breadScrum}
                  setBreadScrum={setBreadScrum}
                />
              )}
              {currentModule === "statistic" && (
                <StatisticComponent></StatisticComponent>
              )}
              {showDetail !== 0 && (
                <SellerViewDetail
                  setKeyTable={setKeyTable}
                  searchTxt={searchTxt}
                  setSearchTxt={setSearchTxt}
                  mode={mode}
                  setBreadScrum={setBreadScrum}
                  currentModule={currentModule}
                  idOrder={showDetail}
                  setShowDetail={setShowDetail}
                ></SellerViewDetail>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerMain;
