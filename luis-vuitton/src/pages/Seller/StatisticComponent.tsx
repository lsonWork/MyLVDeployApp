import { Button, Result, Spin, Statistic } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { domain } from "../../data/url";
import Cookies from "js-cookie";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { number } from "zod";

const StatisticComponent: React.FC<{}> = () => {
  const accessToken = Cookies.get("accessToken");

  const [isLoading, setIsLoading] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [revenue, setRevenue] = useState(0);
  const [sold, setSold] = useState(0);
  const [remain, setRemain] = useState(0);
  const [modeStatistic, setModeStatistic] = useState("monthly");
  const [dataTop3, setDataTop3] = useState<
    {
      productid: number;
      productname: string;
      productthumbnail: string;
      total_quantity: number;
    }[]
  >([
    {
      productid: 0,
      productname: "",
      productthumbnail: "",
      total_quantity: 0,
    },
  ]);
  const [dataDisplay, setDataDisplay] = useState<number[]>([]);
  const [dataYear, setDataYear] = useState<number[]>([]);
  const [dataChart, setDataChart] = useState<number[]>([]);
  const [yearMonthly, setYearMonthly] = useState<number>(0);
  const [yearDaily, setYearDaily] = useState<number>(0);
  const [monthDaily, setMonthDaily] = useState<number>(1);
  const [label, setLabel] = useState<(number | string)[]>([]);

  const months = [
    { id: 1, name: "January" },
    { id: 2, name: "February" },
    { id: 3, name: "March" },
    { id: 4, name: "April" },
    { id: 5, name: "May" },
    { id: 6, name: "June" },
    { id: 7, name: "July" },
    { id: 8, name: "August" },
    { id: 9, name: "September" },
    { id: 10, name: "October" },
    { id: 11, name: "November" },
    { id: 12, name: "December" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(`${domain}/order/get-statistic-data`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setRevenue(data.data.revenue);
        setSold(data.data.sold);
        setRemain(data.data.remain);
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
    const fetchTop3 = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(`${domain}/order/get-top-3`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setDataTop3(data.data);
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
    fetchTop3();
  }, []);

  const formatArrChartMonthly = (
    rawArr: {
      year: string;
      month: string;
      totalprice: string;
    }[]
  ) => {
    const outputArr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    rawArr.forEach((item, index) => {
      outputArr[parseInt(item.month) - 1] = parseInt(item.totalprice);
    });
    setDataChart(outputArr);
  };
  const formatArrChartDaily = (
    rawArr: {
      day: string;
      month: string;
      totalprice: string;
      year: string;
    }[]
  ) => {
    const totalDayInMonth = getDaysInMonth(yearDaily, monthDaily);
    const myLabelDaily = Array.from({ length: totalDayInMonth }, (_, i) => 0);
    rawArr.forEach((item, index) => {
      myLabelDaily[parseInt(item.day) - 1] = parseInt(item.totalprice);
    });

    setDataChart(myLabelDaily);
  };

  useEffect(() => {
    const getYear = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(`${domain}/order/get-statistic-order`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const years = data.data.map((item: any) =>
          new Date(item.purchasedate).getFullYear()
        );
        const arrYear: number[] = Array.from(new Set(years));

        setDataYear(arrYear);
        if (yearMonthly === 0) {
          setYearMonthly(arrYear[0]);
        }
        if (yearDaily === 0) {
          setYearDaily(arrYear[0]);
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
    const fetchByYear = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${domain}/order/get-statistic-by-year?year=${yearMonthly}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        formatArrChartMonthly(data.data);
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
    const fetchByYearMonth = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${domain}/order/get-statistic-by-year-month?month=${monthDaily}&year=${yearDaily}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        formatArrChartDaily(data.data);
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

    const totalDayInMonth = getDaysInMonth(yearDaily, monthDaily);
    const myLabelDaily = Array.from(
      { length: totalDayInMonth },
      (_, i) => i + 1
    );

    setLabel(myLabelDaily);

    if (modeStatistic === "monthly") {
      setLabel(months.map((item) => item.name));
      getYear();
      fetchByYear();
    }
    if (modeStatistic === "daily") {
      fetchByYearMonth();
    }
  }, [modeStatistic, yearMonthly, yearDaily, monthDaily]);

  const handleSelectMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModeStatistic(e.target.value);
  };

  const handleChangeYearMonthly = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setYearMonthly(Number(e.target.value));
  };
  const handleChangeYearDaily = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setYearDaily(Number(e.target.value));
  };
  const handleChangeMonthDaily = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setMonthDaily(Number(e.target.value));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
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
      <div className="mt-10">
        <div className="flex items-center justify-between px-20 py-4 border-b-2 border-stone-400">
          <Statistic
            title="Total revenue"
            value={revenue}
            formatter={(value) => `$${value.toLocaleString()}`}
          />
          <Statistic title="Number of sold products" value={sold} />
          <Statistic title="Number of products in stock" value={remain} />
        </div>
        <div className="border-b-2 border-stone-400 w-full p-12">
          <div className="text-sm text-stone-600 font-light mb-4">
            Best selling products
          </div>
          <div className="flex items-center justify-between">
            {dataTop3.map((item, index) => (
              <div key={index} className="flex-1 h-20">
                <div className="flex w-full h-full text-sm gap-4">
                  <img
                    src={item.productthumbnail}
                    alt=""
                    className="h-full rounded-lg"
                  />
                  <div className="flex flex-col justify-evenly">
                    <div className="text-base">{item.productname}</div>
                    <div>Sold: {item.total_quantity}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full px-12 py-4">
          <div className="text-sm text-stone-600 font-light mb-4">
            Revenue chart
          </div>
          <div className="text-sm flex justify-end gap-4 text-stone-600 font-light mb-4">
            {modeStatistic === "monthly" && (
              <select
                onChange={handleChangeYearMonthly}
                value={yearMonthly}
                className="px-2 py-1 outline-none rounded-sm"
              >
                {dataYear.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
            {modeStatistic === "daily" && (
              <div className="flex items-center gap-4">
                <select
                  onChange={handleChangeMonthDaily}
                  value={monthDaily}
                  className="px-2 py-1 outline-none rounded-sm"
                >
                  {months.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                of
                <select
                  onChange={handleChangeYearDaily}
                  value={yearDaily}
                  className="px-2 py-1 outline-none rounded-sm"
                >
                  {dataYear.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="border-l-2 border-stone-600"></div>
            <select
              // value={modeStatistic}
              onChange={handleSelectMode}
              className="px-2 py-1 outline-none rounded-sm"
            >
              <option value="monthly">Monthly</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          <Bar
            data={{
              labels: label,
              datasets: [
                {
                  label: "Revenue($)",
                  backgroundColor: ["#0C0A09"],
                  data: dataChart,
                },
              ],
            }}
            options={{
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: "Predicted world population (millions) in 2050",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
};
export default StatisticComponent;
