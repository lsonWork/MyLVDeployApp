import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Breadcrumb, Button, Result, Spin, Upload, message } from "antd";
import type { GetProp } from "antd";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { domain } from "../../data/url";
import Cookies from "js-cookie";

interface Combobox {
  id: number;
  name: string;
  slug: string;
}

const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
const convertFileListToBase64 = async (fileItem: any) => {
  if (!fileItem) {
    throw new Error("File item is empty or not provided");
  }

  if (fileItem.originFileObj) {
    return {
      name: fileItem.name,
      base64: await toBase64(fileItem.originFileObj),
    };
  }

  return { name: fileItem.name, base64: fileItem.url }; // Return URL directly if originFileObj doesn't exist
};

const CreateItem: React.FC<{}> = () => {
  const location = useLocation();
  const arrPath = location.pathname.split("/");
  const currentModule: string = arrPath[arrPath.length - 1].split("-")[1];
  const [fileThumbnailList, setFileThumbnailList] = useState<any[]>([]);
  const [fileBannerList, setFileBannerList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [dataCategoryCombobox, setDataCategoryCombobox] = useState<Combobox[]>(
    []
  );
  const comboboxRef = useRef<HTMLSelectElement>(null);

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const navigate = useNavigate();

  const limitation = currentModule === "category" ? 2 : 5;

  const accessToken = Cookies.get("accessToken");

  let fields: string[] = [];

  if (currentModule === "category") {
    fields = ["Category name", "Description title", "Description detail"];
  } else if (currentModule === "product") {
    fields = ["Product name", "Price", "Description", "Quantity"];
  }

  useEffect(() => {
    const fetchCombobox = async () => {
      const data = await axios.get(
        `${domain}/category/get-category?combobox=true`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDataCategoryCombobox(
        data.data.data.sort((a: Combobox, b: Combobox) => a.id - b.id)
      );
    };
    if (currentModule === "product") {
      fetchCombobox();
    }
  }, [currentModule]);

  const checkFileBeforeUpload = (file: File) => {
    const isImage = file.type === "image/jpeg" || file.type === "image/png";
    if (!isImage) {
      message.error("You can only upload JPG/PNG files!");
      return false;
    }
    const isSmallEnough = file.size / 1024 / 1024 < 5;
    if (!isSmallEnough) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }
    return true;
  };

  const handleChangeThumbnail = (info: any) => {
    const newFileList = info.fileList.slice(-1);
    setFileThumbnailList(newFileList);
  };

  const handleChangeBanner = (info: any) => {
    // const newFileList = info.fileList.slice(-2);
    console.log(info.fileList);

    setFileBannerList(info.fileList);
  };

  const handleCreate = async () => {
    let allFieldsValid = true;
    if (currentModule === "category") {
      if (!inputRefs.current["Category name"]?.value) {
        allFieldsValid = false;
        message.error(`Category name is required!`);
      }

      if (fileThumbnailList.length === 0) {
        allFieldsValid = false;
        message.error("Thumbnail image is required!");
      }
      if (fileBannerList.length !== 2) {
        allFieldsValid = false;
        message.error(
          "Banner images are required! Please select exactly 2 banners"
        );
      }
      if (allFieldsValid) {
        const thumbnailBase64 = await convertFileListToBase64(
          fileThumbnailList[0]
        );

        const bannerBase64 = await Promise.all(
          fileBannerList.map(async (item) => {
            const base64item = await convertFileListToBase64(item);
            return base64item;
          })
        );

        const newCategory = {
          name: inputRefs.current["Category name"]?.value,
          descriptionTitle: inputRefs.current["Description title"]?.value,
          descriptionDetail: inputRefs.current["Description detail"]?.value,
          thumbnail: thumbnailBase64["base64"],
          firstBanner: bannerBase64[0]["base64"],
          secondBanner: bannerBase64[1]["base64"],
        };

        console.log(newCategory);

        try {
          setIsLoading(true);
          const data = await axios.post(
            `${domain}/category/create-category`,
            newCategory,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          message.success("New category created successfully!");
          setTimeout(() => {
            navigate("/seller/home", { state: { module: currentModule } });
          }, 5000);
        } catch (err: any) {
          if (err.status === 403) {
            setIsRestricted(true);
          }
          if (err.status === 401) {
            setIsUnauthorized(true);
          }
          if (err.status === 409) {
            message.error("Category name is existed!");
          }
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      if (!inputRefs.current["Product name"]?.value) {
        allFieldsValid = false;
        message.error(`Product name is required!`);
      }
      if (!inputRefs.current["Price"]?.value) {
        allFieldsValid = false;
        message.error(`Price is required!`);
      }
      if (!inputRefs.current["Quantity"]?.value) {
        allFieldsValid = false;
        message.error(`Quantity is required!`);
      }
      if (fileThumbnailList.length === 0) {
        allFieldsValid = false;
        message.error("Thumbnail image is required!");
      }
      if (fileBannerList.length === 0) {
        allFieldsValid = false;
        message.error(
          "Product images are required! You can select up to 5 product images"
        );
      }
      if (allFieldsValid) {
        const thumbnailBase64 = await convertFileListToBase64(
          fileThumbnailList[0]
        );

        const bannerBase64 = await Promise.all(
          fileBannerList.map(async (item) => {
            const base64item = await convertFileListToBase64(item);
            return base64item;
          })
        );

        const arrProductImages = bannerBase64.map((item) => item.base64);

        const newProduct = {
          name: inputRefs.current["Product name"]?.value,
          price: Number(inputRefs.current["Price"]?.value),
          description: inputRefs.current["Description"]?.value,
          thumbnail: thumbnailBase64["base64"],
          idCategory: comboboxRef.current?.value,
          productImages: arrProductImages,
          quantity: Number(inputRefs.current["Quantity"]?.value),
        };

        console.log(newProduct);

        try {
          setIsLoading(true);
          const data = await axios.post(
            `${domain}/product/create-product`,
            newProduct,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          console.log(data);

          message.success("New product created successfully!");
          setTimeout(() => {
            navigate("/seller/home", { state: { module: currentModule } });
          }, 5000);
        } catch (err: any) {
          console.log(err);

          if (err.status === 403) {
            setIsRestricted(true);
          }
          if (err.status === 401) {
            setIsUnauthorized(true);
          }
          if (err.status === 409) {
            message.error("Product name is existed!");
          }
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const validKeys = /^[0-9]$/;

    if (
      !validKeys.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "Tab" &&
      e.key !== "Enter"
    ) {
      e.preventDefault();
    }
  };

  const base64Image =
    "data:image/jpeg;base64,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";

  return (
    <div className="">
      {isLoading && <Spin spinning={true} fullscreen />}
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
      <Breadcrumb
        className="m-4"
        items={[
          {
            title: (
              <Link to="/seller/home" state={{ module: currentModule }}>
                {currentModule.substring(0, 1).toUpperCase()}
                {currentModule.substring(1)} Management
              </Link>
            ),
          },
          {
            title: `Create new ${currentModule}`,
          },
        ]}
      />
      <div className="w-full py-4">
        <div className="m-auto w-[70%]">
          <div className="text-xl font-medium mb-4">
            {currentModule.substring(0, 1).toUpperCase()}
            {currentModule.substring(1)} basic information
          </div>
          <div>
            <table>
              <tbody>
                {currentModule === "product" && (
                  <tr className="">
                    <td>
                      <div className="text-sm">Category</div>
                    </td>
                    <td className="p-2">
                      <div className="w-full">
                        <select
                          ref={comboboxRef}
                          className="font-light text-sm outline-none"
                          name=""
                          id=""
                        >
                          {dataCategoryCombobox.map((item, index) => (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                )}
                <tr className="">
                  <td>
                    <div className="text-sm">Thumbnail</div>
                  </td>
                  <td className="p-2">
                    <div className="w-full">
                      <Upload
                        accept=".jpg,.jpeg,.png"
                        listType="picture-card"
                        className="font-light"
                        beforeUpload={(file) => {
                          const isValid = checkFileBeforeUpload(file);
                          return isValid ? false : Upload.LIST_IGNORE;
                        }}
                        onChange={handleChangeThumbnail}
                      >
                        {fileThumbnailList.length >= 1 ? null : "+ Upload"}
                      </Upload>
                    </div>
                  </td>
                </tr>
                {fields?.map((item, index) => (
                  <tr key={index}>
                    <td className="">
                      <div className="text-sm">{item}</div>
                    </td>
                    <td className="p-2">
                      <div className="w-full">
                        <input
                          ref={(el) => (inputRefs.current[item] = el)}
                          type="text"
                          placeholder={`Enter ${item
                            .substring(0, 1)
                            .toLowerCase()}${item.substring(1)} of category`}
                          className="text-sm p-2 w-96 rounded-md outline-none border-[1px] hover:border-stone-400"
                          onKeyDown={
                            item === "Price" || item === "Quantity"
                              ? handleNumberInput
                              : undefined
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="">
                  <td>
                    <div className="text-sm">
                      {currentModule === "category"
                        ? "Banner"
                        : "Product Images"}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="w-full">
                      <Upload
                        accept=".jpg,.jpeg,.png"
                        listType="picture-card"
                        className="font-light"
                        beforeUpload={(file) => {
                          const isValid = checkFileBeforeUpload(file);
                          return isValid ? false : Upload.LIST_IGNORE;
                        }}
                        onChange={handleChangeBanner}
                      >
                        {fileBannerList.length >= limitation
                          ? null
                          : "+ Upload"}
                      </Upload>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            onClick={handleCreate}
            className="bg-stone-950 w-32 float-end mt-8 hover:opacity-95 cursor-pointer p-3 font-extralight text-center rounded-md text-sm text-white"
          >
            Create
          </div>
          {/* <img src={base64Image} alt="Base64" /> */}
        </div>
      </div>
    </div>
  );
};

export default CreateItem;
