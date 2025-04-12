import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { domain } from "../../data/url";
import Cookies from "js-cookie";

interface CategoryData {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  isDeleted: boolean;
}
interface SearchProps {
  module: string;
  handleUpdateDataCategory: (
    data: any[],
    totalItem: number,
    search: string
  ) => void;
  //   onSearch: (value: string) => void;
  resetFilter: () => void;
  reset: number;
  status: string;
  mode: string;
  searchTxt: string;
  setSearchTxt: React.Dispatch<React.SetStateAction<string>>;
}
const Search: React.FC<SearchProps> = ({
  module,
  handleUpdateDataCategory,
  resetFilter,
  reset,
  status,
  mode,
  searchTxt,
  setSearchTxt,
}) => {
  const searchValue = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const accessToken = Cookies.get("accessToken");

  const placeholder = `Search by ${module} ${
    module === "order" ? "id" : "name"
  }...`;

  const handleSearch = async () => {
    const searchTxtInner = searchValue.current!.value;
    setSearchTxt(searchTxtInner);
    if (module === "category") {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${domain}/category/get-category?page=1&limit=4&search=${searchTxtInner}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        handleUpdateDataCategory(
          data.data.data,
          data.data.total,
          searchTxtInner
        );
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
        const data = await axios.get(
          `${domain}/product?page=1&limit=4&search=${searchTxtInner}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        handleUpdateDataCategory(
          data.data.data,
          data.data.total,
          searchTxtInner
        );
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
    if (module === "order") {
      try {
        setIsLoading(true);
        if (searchTxtInner !== "") {
          const data = await axios.get(
            `${domain}/order/get-order-seller?page=1&limit=8
          
            &${searchTxtInner !== "" ? `&idOrder=${searchTxtInner}` : ""}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          handleUpdateDataCategory(
            data.data.data,
            data.data.total,
            searchTxtInner
          );
        } else {
          const data = await axios.get(
            `${domain}/order/get-order-seller?page=1&limit=8&status=PROCESSING`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          handleUpdateDataCategory(
            data.data.data,
            data.data.total,
            searchTxtInner
          );
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
    }
    resetFilter();
  };

  return (
    <div className="w-full flex justify-center mt-8">
      <div className="flex mb-4">
        <input
          key={reset}
          ref={searchValue}
          type="text"
          placeholder={placeholder}
          className="outline-none border-2 text-sm px-4 border-stone-500 border-r-0 rounded-tl-lg rounded-bl-lg h-8"
        />
        <div
          onClick={handleSearch}
          className="bg-stone-950 rounded-tr-lg rounded-br-lg text-white w-16 h-8 flex justify-center items-center hover:opacity-95 transition-all cursor-pointer"
        >
          <i className="fi fi-rr-search mt-1"></i>
        </div>
      </div>
    </div>
  );
};

export default Search;
