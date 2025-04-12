import {
  Button,
  ConfigProvider,
  message,
  Modal,
  Pagination,
  Result,
  Spin,
} from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { domain } from "../../data/url";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

interface UpdateDTO {
  id: number;
  fullName: string;
  phone: string;
  role: string;
}

const CustomerSchema = z.object({
  fullName: z
    .string()
    .regex(/^[A-Za-z ]+$/, "Fullname should contain only letters"),

  phone: z
    .string()
    .regex(/^\d+$/, "Phone must contain numbers only")
    .min(10, "Phone must be 10 characters min")
    .max(15, "Phone must be 15 characters max"),
});

type ObjError = {
  [key: string]: string;
};

const AdminMain: React.FC<{}> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataAccount, setDataAccount] = useState([]);
  const [totalAccount, setTotalAccount] = useState(0);
  const [typeState, setType] = useState("general");
  const [paginationKey, setPaginationKey] = useState(0);
  const [selectKey, setSelectKey] = useState(0);
  const roleValue = useRef<HTMLSelectElement>(null);
  const statusValue = useRef<HTMLSelectElement>(null);
  const searchValue = useRef<HTMLInputElement>(null);
  const [idDelete, setIdDelete] = useState(0);
  const [isDelete, setIsDelete] = useState(0);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isUpdate, setIsUpdate] = useState(0);
  const signout = useRef<HTMLDivElement>(null);
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const fullnameUpdate = useRef<HTMLInputElement>(null);
  const phoneUpdate = useRef<HTMLInputElement>(null);
  const roleUpdate = useRef<HTMLSelectElement>(null);
  const [dataUpdate, setDataUpdate] = useState<UpdateDTO>({
    id: 0,
    fullName: "",
    phone: "",
    role: "",
  });
  let objError: ObjError = {};
  const [errorState, updateErrorState] = useState(objError);

  const classItemActive = "hover:bg-stone-300";
  const classItemInActive = "bg-stone-300";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${domain}/account/get-account?page=1&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setType("general");
        setTotalAccount(data.data.total);
        setDataAccount(data.data.data);
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
  }, [isDelete, isUpdate]);

  const filter = async () => {
    const role = roleValue.current?.value;
    const status = statusValue.current?.value;

    try {
      setIsLoading(true);
      const data = await axios.get(
        `${domain}/account/get-account?page=1&limit=10&role=${role}&status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setType("filter");
      setTotalAccount(data.data.total);
      setDataAccount(data.data.data);
      setPaginationKey((prev) => prev + 1);
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

  const search = async () => {
    const username = searchValue.current?.value;
    setSelectKey((prev) => prev + 1);
    try {
      setIsLoading(true);
      const data = await axios.get(
        `${domain}/account/get-account?page=1&limit=10&username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setType("search");
      setTotalAccount(data.data.total);
      setDataAccount(data.data.data);
      setPaginationKey((prev) => prev + 1);
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

  const changePage = async (page: number, total: number) => {
    const role = roleValue.current?.value;
    const status = statusValue.current?.value;
    try {
      let url = "";
      if (typeState === "filter") {
        url = `${domain}/account/get-account?page=${page}&limit=10&role=${role}&status=${status}`;
      } else if (typeState === "search") {
        url = `${domain}/account/get-account?page=${page}&limit=10&username=${searchValue.current?.value}`;
      } else {
        url = `${domain}/account/get-account?page=${page}&limit=10`;
      }
      setIsLoading(true);
      const data = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTotalAccount(data.data.total);
      setDataAccount(data.data.data);
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

  const showModalDelete = (id: number) => {
    setIdDelete(id);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setPaginationKey((prev) => prev + 1);
    try {
      setIsLoading(true);
      const data = await axios.delete(
        `${domain}/account/delete-account/${idDelete}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setIsDelete((prev) => prev + 1);
    } catch (err: any) {
      if (err.status === 403) {
        setIsRestricted(true);
      }
      if (err.status === 401) {
        setIsUnauthorized(true);
      }
      if (err.response.data.message === "You can't remove admin account") {
        messageApi.error("You can't remove admin account");
      }
      console.log(err);
    } finally {
      setIsLoading(false);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalUpdateOpen(false);
    setDataUpdate((prev) => {
      return {
        id: 0,
        fullName: "",
        phone: "",
        role: "",
      };
    });

    updateErrorState((prev) => {
      return {};
    });
  };

  const handleRecovery = async (idUpdate: number) => {
    setPaginationKey((prev) => prev + 1);
    try {
      setIsLoading(true);
      const data = await axios.patch(
        `${domain}/account/recovery-account/${idUpdate}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setIsUpdate((prev) => prev + 1);
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
    setIsModalOpen(false);
  };

  const handleSignout = () => {
    Cookies.remove("accessToken");
    navigate("/signin");
  };

  const handleLoadUpdate = async (id: number) => {
    setIsModalUpdateOpen(true);
    try {
      const data = await axios.get(`${domain}/account/get-account/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setDataUpdate((prev) => data.data);
    } catch (err: any) {
      if (err.status === 403) {
        setIsRestricted(true);
      }
      if (err.status === 401) {
        setIsUnauthorized(true);
      }
    }
  };

  const handleUpdate = async (id: number) => {
    const userUpdate = {
      fullName: fullnameUpdate.current?.value,
      phone: phoneUpdate.current?.value,
      role: roleUpdate.current?.value,
    };
    try {
      CustomerSchema.parse(userUpdate);
      try {
        const data = await axios.patch(
          `${domain}/account/update-account/${id}`,
          {
            ...userUpdate,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        messageApi.success({
          content: "Update successfully!",
          duration: 5,
        });

        setIsUpdate((prev) => prev + 1);
        setPaginationKey((prev) => prev + 1);
      } catch (err: any) {
        if (err.status === 403) {
          setIsRestricted(true);
        }
        if (err.status === 401) {
          setIsUnauthorized(true);
        }
      }
    } catch (error) {
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

  return (
    <div className="relative pb-20">
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
      <div className="w-full h-screen p-14">
        <div className="flex justify-between">
          <div className="font-light text-3xl mb-10">Account management</div>
          <div className="text-2xl">
            <div
              ref={signout}
              onClick={handleSignout}
              className="cursor-pointer hover:scale-110 transition-all hover:brightness-105"
            >
              <i className="fi fi-rr-sign-out-alt inline-block mt-2"></i>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex mb-10">
            <input
              ref={searchValue}
              type="text"
              placeholder="Search by username..."
              className="outline-none border-2 text-sm px-4 border-stone-500 border-r-0 rounded-tl-lg rounded-bl-lg h-8"
            />
            <div
              onClick={search}
              className="bg-stone-950 rounded-tr-lg rounded-br-lg text-white w-16 h-8 flex justify-center items-center hover:opacity-95 transition-all cursor-pointer"
            >
              <i className="fi fi-rr-search mt-1"></i>
            </div>
          </div>
        </div>
        <div className="mb-3 flex justify-between">
          <div className="flex items-center gap-4">
            <i className="fi fi-rr-filter"></i>
            <div className="flex items-center">
              <div>Role:</div>
              <select
                key={selectKey}
                name=""
                id=""
                ref={roleValue}
                onChange={filter}
                className="outline-none cursor-pointer"
              >
                <option value="all">All</option>
                <option value="ADMIN">Admin</option>
                <option value="CUSTOMER">Customer</option>
                <option value="SELLER">Seller</option>
              </select>
            </div>
            <div>Status:</div>
            <select
              key={selectKey}
              ref={statusValue}
              onChange={filter}
              name=""
              id=""
              className="outline-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div className="w-full rounded-md overflow-hidden shadow-2xl">
          <table className="w-full text-center">
            <thead className="bg-stone-950 text-white text-sm font-extralight">
              <tr>
                <td className="py-4 w-12">#</td>
                <td className="py-4">Username</td>
                <td className="py-4">Role</td>
                <td className="py-4">Fullname</td>
                <td className="py-4">Phone</td>
                <td className="py-4">Email</td>
                <td className="py-4">Status</td>
                <td className="py-4"></td>
              </tr>
            </thead>
            <tbody className="cursor-pointer text-sm font-normal">
              {dataAccount.length !== 0 &&
                dataAccount.map((item: any, index) => (
                  <tr
                    key={index}
                    className={
                      item.status ? classItemActive : classItemInActive
                    }
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{item.username}</td>
                    <td className="py-2 px-4">{item.role}</td>
                    <td className="py-2 px-4">{item.fullName}</td>
                    <td className="py-2 px-4">{item.phone}</td>
                    <td className="py-2 px-4">{item.email}</td>
                    <td className="py-2 px-4">
                      {item.status ? "Active" : "Inactive"}
                    </td>
                    <td className="py-2 px-4">
                      <div className="w-full flex gap-1">
                        <div
                          onClick={() => handleLoadUpdate(item.id)}
                          className="flex-1 border-2 border-stone-700 text-stone-700 p-1 rounded-lg hover:bg-stone-600 hover:text-white"
                        >
                          <i className="fi fi-rr-pencil mt-1 inline-block"></i>
                        </div>
                        {item.status && (
                          <div
                            onClick={() => showModalDelete(item.id)}
                            className="flex-1 border-2 border-red-700 p-1 text-red-700 rounded-lg hover:bg-red-600 hover:text-white"
                          >
                            <i className="fi fi-rr-trash mt-1 inline-block"></i>
                          </div>
                        )}

                        {!item.status && (
                          <div
                            onClick={() => handleRecovery(item.id)}
                            className="flex-1 border-2 border-green-700 text-green-700 p-1 rounded-lg hover:bg-green-600 hover:text-white"
                          >
                            <i className="fi fi-rr-time-past mt-1 inline-block"></i>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              {dataAccount.length === 0 && (
                <tr>
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4">No information</td>
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-10">
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
            <>
              <Modal
                title="Warning"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                  <Button key="ok" type="text" onClick={handleOk}>
                    OK
                  </Button>,
                ]}
              >
                <p>
                  This action will soft delete this account, you can recovery it
                  later
                </p>
              </Modal>

              <Modal
                title="Update account information"
                width={360}
                open={isModalUpdateOpen}
                // onOk={handleUpdate}
                onCancel={handleCancel}
                footer={[
                  <Button
                    key="ok"
                    type="text"
                    onClick={() => handleUpdate(dataUpdate.id)}
                  >
                    OK
                  </Button>,
                ]}
              >
                <div className="flex gap-4 items-center justify-between my-4">
                  <div>Fullname: </div>
                  <input
                    value={dataUpdate.fullName}
                    onChange={(e) =>
                      setDataUpdate((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    type="text"
                    ref={fullnameUpdate}
                    className="outline-none border-2 border-stone-300 rounded-md w-56 text-xs p-2"
                  />
                </div>
                <div className="font-normal text-xs my-4 text-red-600 ">
                  {errorState["fullName"] ? errorState["fullName"] : undefined}
                </div>
                <div className="flex gap-4 items-center justify-between mb-4">
                  <div>Phone: </div>
                  <input
                    onChange={(e) =>
                      setDataUpdate((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    value={dataUpdate.phone}
                    ref={phoneUpdate}
                    type="number"
                    className="outline-none border-2 border-stone-300 rounded-md w-56 text-xs p-2"
                  />
                </div>
                <div className="font-normal text-xs my-4 text-red-600 ">
                  {errorState["phone"] ? errorState["phone"] : undefined}
                </div>
                <div className="flex gap-4 items-center justify-between mb-4">
                  <div>Role: </div>
                  <select
                    onChange={(e) =>
                      setDataUpdate((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }))
                    }
                    value={dataUpdate.role}
                    ref={roleUpdate}
                    className="outline-none border-2 border-stone-300 rounded-md w-56 text-xs p-2"
                    name=""
                    id=""
                  >
                    <option value={"CUSTOMER"}>CUSTOMER</option>
                    <option value={"SELLER"}>SELLER</option>
                    <option value={"ADMIN"}>ADMIN</option>
                  </select>
                </div>
              </Modal>
            </>
            <Pagination
              key={paginationKey}
              defaultCurrent={1}
              total={totalAccount}
              showSizeChanger={false}
              pageSize={10}
              onChange={changePage}
            />
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
