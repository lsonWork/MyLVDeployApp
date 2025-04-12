import {
  Button,
  ConfigProvider,
  message,
  Modal,
  Pagination,
  Popover,
  Result,
  Spin,
  Upload,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { domain } from "../../data/url";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import Search from "./Search";
import ButtonCreate from "./ButtonCreate";

interface Properties {
  module: string;
  keySearch: number;
  paginationKey: number;
  setPaginationKey: React.Dispatch<React.SetStateAction<number>>;
  handleChangeMode: (mode: string) => void;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
  setShowDetail: React.Dispatch<React.SetStateAction<number>>;
  breadScrum: number;
  setBreadScrum: React.Dispatch<React.SetStateAction<number>>;
  searchTxt: string;
  setSearchTxt: React.Dispatch<React.SetStateAction<string>>;
  keyTableRender: number;
}
interface CategoryData {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  isDeleted: boolean;
}
interface CategoryUpdateDTO {
  id: number;
  name: string;
  thumbnail: string;
  firstBanner: string;
  secondBanner: string;
  descriptionTitle: string;
  descriptionDetail: string;
}
interface ProductUpdateDTO {
  id: number;
  name: string;
  thumbnail: string;
  productImages: string[];
  description: string;
  price: number;
  category: any;
}
interface Combobox {
  id: number;
  name: string;
  slug: string;
}
const TableComponent: React.FC<Properties> = ({
  module,
  keySearch,
  paginationKey,
  setPaginationKey,
  handleChangeMode,
  status,
  setStatus,
  mode,
  setMode,
  setShowDetail,
  breadScrum,
  setBreadScrum,
  searchTxt,
  setSearchTxt,
  keyTableRender,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [resetSearch, setResetSearch] = useState(0);
  const [keyTable, setKeyTable] = useState(1);
  const [isDelete, setIsDelete] = useState(0);
  const [isUpdate, setIsUpdate] = useState(0);

  const [headerTable, setHeaderTable] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idDelete, setIdDelete] = useState(0);
  const [idUpdate, setIdUpdate] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const [dataCategory, setDataCategory] = useState<CategoryData[]>([]);
  const [dataDisplay, setDataDisplay] = useState<any[]>([]);
  const [totalItem, setTotalItem] = useState(0);
  const [searchTxtState, setSearchTxtState] = useState("");

  const [fileListThumbnailCategory, setFileListThumbnailCategory] = useState<
    any[]
  >([]);
  const [fileListFirstBannerCategory, setFileListFirstBannerCategory] =
    useState<any[]>([]);
  const [fileListSecondBannerCategory, setFileListSecondBannerCategory] =
    useState<any[]>([]);

  const [fileListThumbnailProduct, setFileListThumbnailProduct] = useState<
    any[]
  >([]);
  const [fileListProductImages, setFileListProductImages] = useState<any[]>([]);

  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataModalUpdate, setDataModalUpdate] = useState<CategoryUpdateDTO>({
    id: 0,
    name: "",
    thumbnail: "",
    firstBanner: "",
    secondBanner: "",
    descriptionTitle: "",
    descriptionDetail: "",
  });
  const [dataProductModalUpdate, setProductDataModalUpdate] =
    useState<ProductUpdateDTO>({
      id: 0,
      name: "",
      thumbnail: "",
      productImages: [],
      description: "",
      price: 0,
      category: {},
    });

  const [isNewThumbnail, setIsNewThumbnail] = useState(false);
  const [isNewFirstBanner, setIsNewFirstBanner] = useState(false);
  const [isNewSecondBanner, setIsNewSecondBanner] = useState(false);
  const [dataCategoryCombobox, setDataCategoryCombobox] = useState<Combobox[]>(
    []
  );
  const [dataCategoryFilter, setDataCategoryFilter] = useState<Combobox[]>([]);
  const [idCategoryOfProduct, setIdCategoryOfProduct] = useState(0);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [slugInCombobox, setSlugInCombobox] = useState("");
  const [isOpenUpdateQuantity, setIsOpenUpdateQuantity] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [openConfirm, setOpenConfirm] = useState("");
  const [idEditOrder, setIdEditOrder] = useState(0);
  const [idUndo, setIdUndo] = useState(0);

  const accessToken = Cookies.get("accessToken");

  const contentThumbnail = (
    <div>
      <p>This is thumbnail of category</p>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      if (module === "category") {
        setHeaderTable(() => ["Thumbnail", "Category name"]);
      } else if (module === "product") {
        setHeaderTable(() => [
          "Thumbnail",
          "Product name",
          "Category",
          "Price",
          "In stock",
        ]);

        try {
          const data = await axios.get(
            `${domain}/category/get-category-seller?combobox=true`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          setDataCategoryFilter([
            {
              id: 0,
              name: "All category",
              slug: "all-category",
            },
            ...data.data.data.sort((a: Combobox, b: Combobox) => a.id - b.id),
          ]);
        } catch (err: any) {
          if (err.status === 403) {
            setIsRestricted(true);
          }
          if (err.status === 401) {
            setIsUnauthorized(true);
          }
        } finally {
        }
      } else if (module === "order") {
        setHeaderTable(() => [
          "OrderID",
          "Customer",
          "Total item",
          "Total price",
          "Purchase date",
          "Status",
        ]);
      }
    };
    fetchData();
  }, [module]);

  useEffect(() => {
    const fetch = async () => {
      console.log("search: " + searchTxt);

      try {
        setIsLoading(true);
        const data = await axios.get(
          `${domain}/order/get-order-seller?page=1&limit=8&idOrder=${searchTxt}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // setSearchTxt("");
        setMode("search");
        setDataCategory(data.data.data);
        setDataDisplay(data.data.data);
        setTotalItem(data.data.total);
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
    if (keyTableRender !== 0) {
      fetch();
    }
  }, []);

  useEffect(() => {
    const fetchDataCategory = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${domain}/category/get-category-seller?page=1&limit=4`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setMode("normal");
        setDataCategory(data.data.data);
        setDataDisplay(data.data.data);
        setTotalItem(data.data.total);
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
    const fetchDataProduct = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(`${domain}/product?page=1&limit=4`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setMode("normal");
        setDataCategory(data.data.data);
        setDataDisplay(data.data.data);
        setTotalItem(data.data.total);
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
    const fetchDataOrder = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${domain}/order/get-order-seller?page=1&limit=8&status=${status}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setMode("normal");
        setDataCategory(data.data.data);
        setDataDisplay(data.data.data);
        setTotalItem(data.data.total);
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
    if (module === "category") {
      fetchDataCategory();
    } else if (module === "product") {
      fetchDataProduct();
    } else if (module === "order" && mode === "normal") {
      fetchDataOrder();
    }
  }, [isDelete, isUpdate, module, keyTable, status, breadScrum]);

  const showModalDelete = (id: number) => {
    setIdDelete(id);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setPaginationKey((prev) => prev + 1);
    if (module === "category") {
      try {
        setIsLoading(true);
        const data = await axios.delete(
          `${domain}/category/delete-category/${idDelete}`,
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
      } finally {
        setIsLoading(false);
      }
    }
    if (module === "product") {
      try {
        setIsLoading(true);
        const data = await axios.delete(
          `${domain}/product/delete-product/${idDelete}`,
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
      } finally {
        setIsLoading(false);
      }
    }

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    // setIsModalUpdateOpen(false);
    // setDataUpdate((prev) => {
    //   return {
    //     id: 0,
    //     fullName: "",
    //     phone: "",
    //     role: "",
    //   };
    // });

    // updateErrorState((prev) => {
    //   return {};
    // });
  };

  const handleRecovery = async (idUpdate: number) => {
    setPaginationKey((prev) => prev + 1);
    if (module === "category") {
      try {
        setIsLoading(true);
        const data = await axios.patch(
          `${domain}/category/recovery-category/${idUpdate}`,
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
    }
    if (module === "product") {
      try {
        setIsLoading(true);
        const data = await axios.patch(
          `${domain}/product/recovery-product/${idUpdate}`,
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
    }
    setIsModalOpen(false);
  };

  const changePage = async (page: number, total: number) => {
    if (module === "category") {
      try {
        setIsLoading(true);
        const url =
          mode === "normal"
            ? `${domain}/category/get-category-seller?page=${page}&limit=4`
            : `${domain}/category/get-category-seller?page=${page}&limit=4&search=${
                searchTxtState ? searchTxtState : ""
              }`;
        const data = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setDataCategory(data.data.data);
        setDataDisplay(data.data.data);
        setTotalItem(data.data.total);
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
    } else if (module === "product") {
      try {
        setIsLoading(true);
        let url = "";
        if (mode === "normal") {
          url = `${domain}/product?page=${page}&limit=4`;
        }
        if (mode === "search") {
          url = `${domain}/product?page=${page}&limit=4&search=${
            searchTxtState ? searchTxtState : ""
          }`;
        }
        if (mode === "filter") {
          url = `${domain}/product${
            slugInCombobox !== "all-category" ? `/${slugInCombobox}` : ""
          }?page=${page}&limit=4`;
        }
        const data = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setDataCategory(data.data.data);
        setDataDisplay(data.data.data);
        setTotalItem(data.data.total);
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
    } else if (module === "order") {
      try {
        setIsLoading(true);
        let url = "";
        if (mode === "normal") {
          url = `${domain}/order/get-order-seller?page=${page}&limit=8&status=${status}`;
        }
        if (mode === "search") {
          url = `${domain}/order/get-order-seller?page=${page}&limit=8&status=${status}&${
            searchTxtState ? searchTxtState : ""
          }`;
        }
        // if (mode === "filter") {
        //   url = `${domain}/product${
        //     slugInCombobox !== "all-category" ? `/${slugInCombobox}` : ""
        //   }?page=${page}&limit=4`;
        // }
        const data = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setDataCategory(data.data.data);
        setDataDisplay(data.data.data);
        setTotalItem(data.data.total);
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
    }
  };

  const handleUpdateDataCategory = (
    data: any[],
    totalItem: number,
    search: string
  ) => {
    setDataDisplay(data);
    setTotalItem(totalItem);
    if (search !== "") {
      setMode("search");
    }
    if (search === "") {
      setMode("normal");
    }
    setSearchTxtState(search);
    setPaginationKey((prev) => prev + 1);
    if (module === "order") {
      // console.log(data[0].status);
      setStatus(data[0].status);
    }
  };

  const handleLoadUpdate = async (id: number) => {
    setIdUpdate(id);
    setIsModalUpdateOpen(true);
    if (module === "category") {
      try {
        const data = await axios.get(
          `${domain}/category/get-category-seller?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setDataModalUpdate(data.data.data[0]);
        const uid = `${Date.now()}-${Math.random()}`;

        const originFileObj = new File([new Blob([])], "image.png", {
          type: "image/png",
        });

        (originFileObj as any).uid = uid;

        const thumb = {
          uid: uid,
          name: "image.png",
          status: "done",
          thumbUrl: data.data.data[0].thumbnail,
          originFileObj: originFileObj,
        };
        const first = {
          uid: uid,
          name: "image.png",
          status: "done",
          thumbUrl: data.data.data[0].firstBanner,
          originFileObj: originFileObj,
        };
        const second = {
          uid: uid,
          name: "image.png",
          status: "done",
          thumbUrl: data.data.data[0].secondBanner,
          originFileObj: originFileObj,
        };

        const thumbnailArr = [];
        thumbnailArr.push(thumb);
        setFileListThumbnailCategory(thumbnailArr);
        const firstBanner = [];
        firstBanner.push(first);
        setFileListFirstBannerCategory(firstBanner);
        const secondBanner = [];
        secondBanner.push(second);
        setFileListSecondBannerCategory(secondBanner);
      } catch (err: any) {
        if (err.status === 403) {
          setIsRestricted(true);
        }
        if (err.status === 401) {
          setIsUnauthorized(true);
        }
      } finally {
      }
    }
    if (module === "product") {
      try {
        const data = await axios.get(
          `${domain}/category/get-category-seller?combobox=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setDataCategoryCombobox(
          data.data.data.sort((a: Combobox, b: Combobox) => a.id - b.id)
        );

        const dataProduct = await axios.get(`${domain}/product/detail/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setProductDataModalUpdate(dataProduct.data);
        setIdCategoryOfProduct(dataProduct.data.category.id);

        const uid = `${Date.now()}-${Math.random()}`;

        const originFileObj = new File([new Blob([])], "image.png", {
          type: "image/png",
        });

        const thumb = {
          uid: uid,
          name: "image.png",
          status: "done",
          thumbUrl: dataProduct.data.thumbnail,
          originFileObj: originFileObj,
        };
        const productImages = dataProduct.data.productImages.map(
          (image: any) => ({
            uid: `${Date.now()}-${Math.random()}`,
            name: image.name || "image.png",
            status: "done",
            thumbUrl: image.path,
            originFileObj: new File([new Blob([])], image.name || "image.png", {
              type: image.type || "image/png",
            }),
          })
        );

        const thumbnailArr = [];
        thumbnailArr.push(thumb);
        setFileListThumbnailProduct(thumbnailArr);

        setFileListProductImages(productImages);
      } catch (err: any) {
        if (err.status === 403) {
          setIsRestricted(true);
        }
        if (err.status === 401) {
          setIsUnauthorized(true);
        }
      } finally {
      }
    }
  };

  const handleCancelUpdate = () => {
    setIsModalUpdateOpen(false);
    setIsNewThumbnail(false);
    setIsNewFirstBanner(false);
    setIsNewSecondBanner(false);
    setIsOpenUpdateQuantity(false);
  };

  const handleUpdateItem = async () => {
    if (module === "category") {
      let allValid = true;
      if (fileListThumbnailCategory.length === 0) {
        allValid = false;
        messageApi.error("Thumbnail is required!");
      }
      if (fileListFirstBannerCategory.length === 0) {
        allValid = false;
        messageApi.error("First banner is required!");
      }
      if (fileListSecondBannerCategory.length === 0) {
        allValid = false;
        messageApi.error("Second banner is required!");
      }
      if (dataModalUpdate.name.length === 0) {
        allValid = false;
        messageApi.error("Category name is required!");
      }
      if (allValid === true) {
        const updateObject = {
          id: idUpdate,
          name: dataModalUpdate.name,
          descriptionTitle: dataModalUpdate.descriptionTitle,
          descriptionDetail: dataModalUpdate.descriptionDetail,
        };

        if (isNewThumbnail) {
          Object.assign(updateObject, {
            thumbnail: fileListThumbnailCategory[0].thumbUrl,
          });
        }

        if (isNewFirstBanner) {
          Object.assign(updateObject, {
            firstBanner: fileListFirstBannerCategory[0].thumbUrl,
          });
        }

        if (isNewSecondBanner) {
          Object.assign(updateObject, {
            secondBanner: fileListSecondBannerCategory[0].thumbUrl,
          });
        }

        try {
          const data = await axios.patch(
            `${domain}/category/update-category`,
            updateObject,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          messageApi.success(`Category update successfully!`);
          setIsModalUpdateOpen(false);
          setKeyTable((prev) => ++prev);
          setPaginationKey((prev) => ++prev);
        } catch (err: any) {
          if (err.status === 403) {
            setIsRestricted(true);
          }
          if (err.status === 401) {
            setIsUnauthorized(true);
          }
        } finally {
        }
      }
    }
    if (module === "product") {
      let allValid = true;
      if (fileListThumbnailProduct.length === 0) {
        allValid = false;
        messageApi.error("Thumbnail is required!");
      }
      if (fileListProductImages.length === 0) {
        allValid = false;
        messageApi.error("Product images must have at least 1 picture!");
      }
      if (dataProductModalUpdate.name.length === 0) {
        allValid = false;
        messageApi.error("Product name is required!");
      }
      if (Number(dataProductModalUpdate.price) <= 0) {
        allValid = false;
        messageApi.error("Price must greater than 0!");
      }
      if (allValid === true) {
        const updateObject = {
          name: dataProductModalUpdate.name,
          description: dataProductModalUpdate.description,
          price: Number(dataProductModalUpdate.price),
          categoryId: idCategoryOfProduct,
          thumbnail: fileListThumbnailProduct[0].thumbUrl,
          productImages: fileListProductImages.map((item) => item.thumbUrl),
        };

        try {
          const data = await axios.patch(
            `${domain}/product/update-product-information/${idUpdate}`,
            updateObject,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          messageApi.success(`Product update successfully!`);
          setIsModalUpdateOpen(false);
          setKeyTable((prev) => ++prev);
          setPaginationKey((prev) => ++prev);
        } catch (err: any) {
          if (err.status === 403) {
            setIsRestricted(true);
          }
          if (err.status === 401) {
            setIsUnauthorized(true);
          }
          if (err.status === 404) {
            messageApi.error(
              "This product is not available, you can't edit it's information"
            );
          }
        } finally {
        }
      }
    }
  };
  const handleChangeUpdateThumbnail = (info: any) => {
    setFileListThumbnailCategory([info.fileList[info.fileList.length - 1]]);
    setIsNewThumbnail(true);
  };

  const handleChangeUpdateFirstBanner = (info: any) => {
    setFileListFirstBannerCategory([info.fileList[info.fileList.length - 1]]);
    setIsNewFirstBanner(true);
  };

  const handleChangeUpdateSecondBanner = (info: any) => {
    setFileListSecondBannerCategory([info.fileList[info.fileList.length - 1]]);
    setIsNewSecondBanner(true);
  };

  const handleChangeProduct = (info: any, check: string) => {
    if (check === "thumbnailProduct") {
      setFileListThumbnailProduct([info.fileList[info.fileList.length - 1]]);
    }
    if (check === "productImages") {
      setFileListProductImages((prev) => [
        ...prev,
        info.fileList[info.fileList.length - 1],
      ]);
    }
  };

  const handleRemove = (file: any, check: string) => {
    if (check === "thumbnailCategory") {
      setFileListThumbnailCategory((prev) =>
        prev.filter((item) => item.uid !== file.uid)
      );
    }
    if (check === "firstCategory") {
      setFileListFirstBannerCategory((prev) =>
        prev.filter((item) => item.uid !== file.uid)
      );
    }
    if (check === "secondCategory") {
      setFileListSecondBannerCategory((prev) =>
        prev.filter((item) => item.uid !== file.uid)
      );
    }
    if (check === "thumbnailProduct") {
      setFileListThumbnailProduct((prev) =>
        prev.filter((item) => item.uid !== file.uid)
      );
    }
    if (check === "productImages") {
      setFileListProductImages((prev) =>
        prev.filter((item) => item.uid !== file.uid)
      );
    }
    return false;
  };

  const handleChangeComboboxUpdate = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIdCategoryOfProduct(Number(event.target.value));
  };

  const handleLoadUpdateQuantity = async (id: number, quantity: number) => {
    setIsOpenUpdateQuantity(true);
    setIdUpdate(id);
    setCurrentQuantity(quantity);
  };
  const handleChangeQuantity = async () => {
    if (currentQuantity <= 0) {
      //tí sửa
      messageApi.error("Quantity must be greater than 0");
    } else {
      try {
        const data = await axios.patch(
          `${domain}/warehouse/change-quantity/${idUpdate}`,
          { newQuantity: currentQuantity },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setKeyTable((prev) => ++prev);
        setPaginationKey((prev) => ++prev);
        setIsOpenUpdateQuantity(false);
        messageApi.success("Quantity update successfully!");
      } catch (err: any) {
        if (err.status === 403) {
          setIsRestricted(true);
        }
        if (err.status === 401) {
          setIsUnauthorized(true);
        }
        if (err.status === 404) {
          messageApi.error(
            "This product is not available, you can't edit it's quantity"
          );
        }
      } finally {
      }
    }
  };

  const handleChangeFilter = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSlugInCombobox(event.target.value);
    const slug = event.target.value;
    setIsLoading(true);
    try {
      const url = slug !== "all-category" ? `/${slug}` : "";
      const data = await axios.get(`${domain}/product${url}?page=1&limit=4`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setDataDisplay(data.data.data);
      setTotalItem(data.data.total);
      setPaginationKey((prev) => ++prev);
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
    setMode("filter");
    setResetSearch((prev) => ++prev);
  };

  const resetFilter = () => {
    setSlugInCombobox("all-category");
  };

  const onChangeStatus = (status: string) => {
    setStatus(status);
  };

  const handleShowModalConfirm = (action: string, id: number) => {
    if (action === "APPROVED") {
      setOpenConfirm("approved");
    }
    if (action === "REJECT") {
      setOpenConfirm("reject");
    }
    setIdEditOrder(id);
  };

  const handleShowUndo = (id: number) => {
    setIdUndo(id);
    setShowUndo(true);
  };

  const closeConfirm = () => {
    setOpenConfirm("");
  };

  const closeUndo = () => {
    setShowUndo(false);
  };

  const handleEditStatus = async (openConfirm: string) => {
    try {
      setIsLoading(true);
      const data = await axios.patch(
        `${domain}/order/set-status-order/${idEditOrder}`,
        { newStatus: openConfirm === "approved" ? "APPROVED" : "REJECT" },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setOpenConfirm("");
      setKeyTable((prev) => ++prev);
      setPaginationKey((prev) => ++prev);
      messageApi.success(
        `${openConfirm.substring(0, 1).toUpperCase()}${openConfirm.substring(
          1
        )} order successfully!`
      );
    } catch (err: any) {
      console.log(err);
      console.log(err.response);
      if (
        err.response.data.message ===
        `You can't modify this order because it contains deleted product`
      ) {
        messageApi.error(
          "This order contain deleted product so it can't be approve, however you can reject it"
        );
        setOpenConfirm("");
      }
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
  const handleUndo = async () => {
    try {
      setIsLoading(true);
      const data = await axios.patch(
        `${domain}/order/set-status-order/${idUndo}`,
        { newStatus: "PROCESSING" },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowUndo(false);
      setKeyTable((prev) => ++prev);
      setPaginationKey((prev) => ++prev);
      messageApi.success(`Undo order successfully!`);
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
  const handleDetailOrder = (idOrder: number) => {
    setShowDetail(idOrder);
  };

  return (
    <>
      {contextHolder}
      <Search
        searchTxt={searchTxt}
        setSearchTxt={setSearchTxt}
        reset={resetSearch}
        key={keySearch}
        module={module}
        handleUpdateDataCategory={handleUpdateDataCategory}
        resetFilter={resetFilter}
        status={status}
        mode={mode}
      />
      {module === "order" && (
        <div className="my-6">
          <div className="flex items-center justify-around">
            <div
              onClick={
                mode === "search"
                  ? undefined
                  : () => onChangeStatus("PROCESSING")
              }
              className={`bg-stone-300 ${
                status !== "PROCESSING" ? "hover:opacity-80" : ""
              } cursor-pointer py-2 px-8 rounded-md ${
                status === "PROCESSING" ? "bg-stone-900 text-white" : ""
              }`}
            >
              Processing
            </div>
            <div
              onClick={
                mode === "search" ? undefined : () => onChangeStatus("APPROVED")
              }
              className={`bg-stone-300 ${
                status !== "APPROVED" ? "hover:opacity-80" : ""
              } cursor-pointer py-2 px-8 rounded-md ${
                status === "APPROVED" ? "bg-stone-900 text-white" : ""
              }`}
            >
              Approved
            </div>
            <div
              onClick={
                mode === "search" ? undefined : () => onChangeStatus("REJECT")
              }
              className={`bg-stone-300 ${
                status !== "REJECT" ? "hover:opacity-80" : ""
              } cursor-pointer py-2 px-8 rounded-md ${
                status === "REJECT" ? "bg-stone-900 text-white" : ""
              }`}
            >
              Reject
            </div>
          </div>
        </div>
      )}
      <div
        className={
          module === "product" ? "flex items-center justify-between" : ""
        }
      >
        {module === "product" && (
          <div>
            <select
              onChange={handleChangeFilter}
              className="font-light text-sm outline-none"
              name=""
              id=""
              value={slugInCombobox}
            >
              {dataCategoryFilter.map((item, index) => (
                <option key={index} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {module !== "order" && (
          <Link to={`/seller/create-${module}`}>
            <ButtonCreate
              module={module}
              bonusClass={module === "category" ? "float-end" : ""}
            />
          </Link>
        )}
      </div>
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
        <table key={keyTable} className="w-full text-center mb-4">
          <thead className="bg-stone-950 text-white text-sm font-extralight">
            <tr>
              <td className="py-4 w-12">#</td>
              {headerTable.map((item, index) => (
                <td className="py-4" key={index}>
                  {item}
                  <Popover placement="topRight" content={contentThumbnail}>
                    <i className="fi fi-rr-interrogation mt-1 ml-1 text-xs"></i>
                  </Popover>
                </td>
              ))}
              <td className="py-4">Activities</td>
            </tr>
          </thead>
          {module !== "order" && (
            <tbody className="cursor-pointer text-sm font-normal">
              {dataDisplay.map((item, index) => (
                <tr key={index} className="bg-stone-200 hover:bg-stone-300">
                  <td className="py-2 px-4">{++index}</td>
                  <td className="py-2 px-4">
                    <div className="w-full">
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="w-20 aspect-square object-cover m-auto shadow-md rounded-sm"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-4">{item.name}</td>
                  {module === "product" && (
                    <td className="py-2 px-4">{item.category?.name}</td>
                  )}
                  {module === "product" && (
                    <td className="py-2 px-4">{item.price}</td>
                  )}
                  {module === "product" && (
                    <td
                      className={`py-2 px-4 ${
                        item.warehouse?.quantity <= 5 ? "text-red-500" : ""
                      }`}
                    >
                      {item.warehouse?.quantity}
                    </td>
                  )}
                  <td className="py-2 px-4">
                    <div className="w-full flex gap-1">
                      <div
                        onClick={() => handleLoadUpdate(item.id)}
                        className="flex-1 border-2 border-stone-700 text-stone-700 p-1 rounded-lg hover:bg-stone-600 hover:text-white"
                      >
                        <i className="fi fi-rr-pencil mt-1 inline-block"></i>
                      </div>
                      {!item.isDeleted && (
                        <div
                          onClick={() => showModalDelete(item.id)}
                          className="flex-1 border-2 border-red-700 p-1 text-red-700 rounded-lg hover:bg-red-600 hover:text-white"
                        >
                          <i className="fi fi-rr-trash mt-1 inline-block"></i>
                        </div>
                      )}

                      {item.isDeleted && (
                        <div
                          onClick={() => handleRecovery(item.id)}
                          className="flex-1 border-2 border-green-700 text-green-700 p-1 rounded-lg hover:bg-green-600 hover:text-white"
                        >
                          <i className="fi fi-rr-time-past mt-1 inline-block"></i>
                        </div>
                      )}
                      {module === "product" && (
                        <div
                          onClick={() =>
                            handleLoadUpdateQuantity(
                              item.id,
                              item.warehouse.quantity
                            )
                          }
                          className="flex-1 border-2 border-blue-700 text-blue-700 p-1 rounded-lg hover:bg-blue-600 hover:text-white"
                        >
                          <i className="fi fi-rr-box-open mt-1 inline-block"></i>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {dataDisplay.length === 0 && (
                <tr>
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4">No information</td>
                  <td className="py-2 px-4"></td>
                </tr>
              )}
            </tbody>
          )}
          {module === "order" && (
            <tbody className="cursor-pointer text-sm font-normal">
              {dataDisplay.map((item, index) => (
                <tr
                  onClick={() => handleDetailOrder(item.id)}
                  key={index}
                  className="bg-stone-200 hover:bg-stone-300"
                >
                  <td className="py-2 px-4">{++index}</td>
                  <td className="py-2 px-4">{item.id}</td>
                  <td className="py-2 px-4">{item.account?.fullName}</td>
                  <td className="py-2 px-4">
                    {item.orderDetails?.reduce((acc: number, item: any) => {
                      return acc + item.quantity;
                    }, 0)}{" "}
                    {`item${
                      item.orderDetails?.reduce((acc: number, item: any) => {
                        return acc + item.quantity;
                      }, 0) > 1
                        ? "s"
                        : ""
                    }`}
                  </td>
                  <td className="py-2 px-4">{item.totalPrice}</td>
                  <td className="py-2 px-4">
                    {new Date(item.purchaseDate).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">{item.status}</td>
                  <td className="py-2 px-4">
                    {item.status === "PROCESSING" && (
                      <div className="flex items-center justify-center gap-2">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowModalConfirm("APPROVED", item.id);
                          }}
                          className="py-1 rounded-md cursor-pointer hover:scale-110 transition-all text-white px-4 bg-green-500"
                        >
                          <i className="mt-1 inline-block fi fi-rr-check"></i>
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowModalConfirm("REJECT", item.id);
                          }}
                          className="py-1 rounded-md cursor-pointer hover:scale-110 transition-all text-white px-4 bg-red-500"
                        >
                          <i className="mt-1 inline-block fi fi-rr-cross-small"></i>
                        </div>
                      </div>
                    )}
                    {item.status !== "PROCESSING" && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowUndo(item.id);
                        }}
                        className="py-1 rounded-md cursor-pointer hover:scale-110 transition-all text-white px-4 bg-stone-500"
                      >
                        <i className="fi fi-rr-undo-alt"></i>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {dataDisplay.length === 0 && (
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
          )}
        </table>
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
          <Modal
            title={`Update ${module} information`}
            width={440}
            open={isModalUpdateOpen}
            onCancel={handleCancelUpdate}
            footer={[
              <Button key="ok" type="text" onClick={() => handleUpdateItem()}>
                OK
              </Button>,
            ]}
          >
            {module === "category" && (
              <table>
                <tbody>
                  <tr>
                    <td>
                      <div>Thumbnail:</div>
                    </td>
                    <td>
                      <Upload
                        listType="picture-card"
                        fileList={fileListThumbnailCategory}
                        onRemove={(file) =>
                          handleRemove(file, "thumbnailCategory")
                        }
                        onChange={handleChangeUpdateThumbnail}
                        beforeUpload={() => false}
                      >
                        + Update
                      </Upload>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>Name:</div>
                    </td>
                    <td>
                      <input
                        onChange={(e) =>
                          setDataModalUpdate((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        value={dataModalUpdate.name}
                        type="text"
                        className="rounded-sm w-full outline-none border-2 border-stone-300 p-2 font-light text-sm"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>Description title:</div>
                    </td>
                    <td>
                      <input
                        onChange={(e) =>
                          setDataModalUpdate((prev) => ({
                            ...prev,
                            descriptionTitle: e.target.value,
                          }))
                        }
                        value={dataModalUpdate.descriptionTitle}
                        type="text"
                        className="rounded-sm w-full outline-none border-2 border-stone-300 p-2 font-light text-sm"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>Description detail:</div>
                    </td>
                    <td>
                      <textarea
                        onChange={(e) =>
                          setDataModalUpdate((prev) => ({
                            ...prev,
                            descriptionDetail: e.target.value,
                          }))
                        }
                        value={dataModalUpdate.descriptionDetail}
                        // type="text"
                        className="rounded-sm w-full outline-none border-2 border-stone-300 p-2 font-light text-sm"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>First Banner:</div>
                    </td>
                    <td>
                      <Upload
                        listType="picture-card"
                        fileList={fileListFirstBannerCategory}
                        onChange={handleChangeUpdateFirstBanner}
                        onRemove={(file) => handleRemove(file, "firstCategory")}
                        beforeUpload={() => false}
                      >
                        + Update
                      </Upload>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>Second Banner:</div>
                    </td>
                    <td>
                      <Upload
                        listType="picture-card"
                        fileList={fileListSecondBannerCategory}
                        onChange={handleChangeUpdateSecondBanner}
                        beforeUpload={() => false}
                        onRemove={(file) =>
                          handleRemove(file, "secondCategory")
                        }
                      >
                        + Update
                      </Upload>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
            {module === "product" && (
              <table>
                <tbody>
                  <tr>
                    <td>
                      <div>Thumbnail:</div>
                    </td>
                    <td>
                      <Upload
                        listType="picture-card"
                        fileList={fileListThumbnailProduct}
                        onChange={(file) =>
                          handleChangeProduct(file, "thumbnailProduct")
                        }
                        onRemove={(file) =>
                          handleRemove(file, "thumbnailProduct")
                        }
                        beforeUpload={() => false}
                      >
                        + Update
                      </Upload>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>Product Name:</div>
                    </td>
                    <td>
                      <input
                        onChange={(e) =>
                          setProductDataModalUpdate((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        value={dataProductModalUpdate.name}
                        type="text"
                        className="rounded-sm w-full outline-none border-2 border-stone-300 p-2 font-light text-sm"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>Price:</div>
                    </td>
                    <td>
                      <input
                        onChange={(e) =>
                          setProductDataModalUpdate((prev) => ({
                            ...prev,
                            price: Number(e.target.value),
                          }))
                        }
                        value={dataProductModalUpdate.price}
                        type="number"
                        className="rounded-sm w-full outline-none border-2 border-stone-300 p-2 font-light text-sm"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>Description:</div>
                    </td>
                    <td>
                      <textarea
                        onChange={(e) =>
                          setProductDataModalUpdate((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        value={dataProductModalUpdate.description}
                        // type="text"
                        className="rounded-sm w-full outline-none border-2 border-stone-300 p-2 font-light text-sm"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>Product images:</div>
                    </td>
                    <td>
                      <Upload
                        listType="picture-card"
                        fileList={fileListProductImages}
                        onChange={(file) =>
                          handleChangeProduct(file, "productImages")
                        }
                        onRemove={(file) => handleRemove(file, "productImages")}
                        beforeUpload={() => false}
                      >
                        + Update
                      </Upload>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>Category:</div>
                    </td>
                    <td>
                      <select
                        onChange={handleChangeComboboxUpdate}
                        className="font-light text-sm outline-none"
                        name=""
                        id=""
                        value={idCategoryOfProduct}
                      >
                        {dataCategoryCombobox.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </Modal>
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
            {module === "category" && (
              <p>
                This action will soft delete this category, you can recovery it
                later. By the way, this deleted category can't be used to create
                new product. However, this category's products will be remain
                but still unavailable.
              </p>
            )}
            {module === "product" && (
              <p>
                This action will soft delete this product, you can recovery it
                later. Deleted product will not be available for customers.
              </p>
            )}
          </Modal>
          <Modal
            title={`Update quantity`}
            width={440}
            open={isOpenUpdateQuantity}
            onCancel={handleCancelUpdate}
            footer={[
              <Button
                key="ok"
                type="text"
                onClick={() => handleChangeQuantity()}
              >
                OK
              </Button>,
            ]}
          >
            <table>
              <tbody>
                <tr>
                  <td>
                    <div>Current quantity:</div>
                  </td>
                  <td>
                    <input
                      onChange={(e) =>
                        setCurrentQuantity((prev) => Number(e.target.value))
                      }
                      value={currentQuantity}
                      type="number"
                      className="rounded-sm w-full outline-none border-2 border-stone-300 p-2 font-light text-sm"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </Modal>
          <Modal
            title={`Warning`}
            width={440}
            open={openConfirm !== "" ? true : false}
            onCancel={closeConfirm}
            footer={[
              <Button
                key="ok"
                type="text"
                onClick={() => handleEditStatus(openConfirm)}
              >
                OK
              </Button>,
            ]}
          >
            You're going to {openConfirm} this order, you can change it back
            anytime
          </Modal>
          <Modal
            title={`Warning`}
            width={440}
            open={showUndo}
            onCancel={closeUndo}
            footer={[
              <Button key="ok" type="text" onClick={() => handleUndo()}>
                OK
              </Button>,
            ]}
          >
            You're going to undo this order, this order status will be
            processing again
          </Modal>
          <Pagination
            key={paginationKey}
            defaultCurrent={1}
            total={totalItem}
            showSizeChanger={false}
            pageSize={module === "order" ? 8 : 4}
            onChange={changePage}
          />
        </ConfigProvider>
      </>
    </>
  );
};

export default TableComponent;
