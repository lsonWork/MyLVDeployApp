import { useLocation, useParams } from "react-router-dom";
import { categories, items, Filters } from "../data/data-source";
import ItemComponent from "../components/ItemComponent";
import { useState, useEffect, useMemo } from "react";
import ViewMore from "../components/ViewMore";
import Filter from "../components/Filter";
import useScrollToTop from "../components/useScrollToTop";
import axios from "axios";
import { domain } from "../data/url";
import { Spin } from "antd";

interface ProductCard {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  price: number;
}
const Items: React.FC<{}> = () => {
  //fix scroll
  useScrollToTop();
  const params = useParams();
  const [filter, setFilter] = useState(Filters.ALL);

  const [dataProductByCategory, setDataProductByCategory] = useState<
    ProductCard[]
  >([]);
  const [totalItem, setTotalItem] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<{
    firstBanner: string;
    descriptionTitle: string;
    descriptionDetail: string;
    title: string;
    secondBanner: string;
  }>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [mode, setMode] = useState("normal");

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${domain}/product/${location.state.slug}?page=${page}&limit=${limit}`
        );
        setDataProductByCategory(data.data.data);
        setTotalItem(data.data.total);
      } catch (err: any) {
      } finally {
        setIsLoading(false);
      }
    };
    if (mode === "normal") {
      fetchData();
    }
  }, [limit, mode]);

  useEffect(() => {
    const fetchCategoryInfo = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(
          `${domain}/category/get-category?id=${location.state.id}`
        );
        setCurrentCategory({
          firstBanner: data.data.data[0].firstBanner,
          descriptionTitle: data.data.data[0].descriptionTitle,
          descriptionDetail: data.data.data[0].descriptionDetail,
          title: data.data.data[0].name,
          secondBanner: data.data.data[0].secondBanner,
        });
      } catch (err: any) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategoryInfo();
  }, []);

  //handle functions
  const handleClick = async () => {
    setLimit((prev) => (prev += 4));
    if (mode === "filter") {
      setIsLoading(true);
      try {
        const data = await axios.get(
          `${domain}/product/${location.state.slug}?page=1&limit=${
            limit + 4
          }&sort=${filter === "Ascending" ? "ASC" : "DESC"}`
        );
        setDataProductByCategory(data.data.data);
        // console.log(data.data.data);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleFilter: (filter: Filters) => void = async (filter: Filters) => {
    setMode("filter");
    if (filter !== "Default") {
      setIsLoading(true);
      try {
        const data = await axios.get(
          `${domain}/product/${
            location.state.slug
          }?page=1&limit=${limit}&sort=${
            filter === "Ascending" ? "ASC" : "DESC"
          }`
        );
        setDataProductByCategory(data.data.data);
        // console.log(data.data.data);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    } else {
      setMode("normal");
    }
    setFilter(filter);
  };

  return (
    <>
      {isLoading && <Spin spinning={true} fullscreen />}

      <div className="pt-20">
        <div className="w-full relative">
          <img className="w-full" src={currentCategory?.firstBanner} alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute bottom-10 w-80 text-stone-100 left-40">
            <h1 className="text-lg">{currentCategory?.descriptionTitle}</h1>
            <div className="text-sm pt-4">
              {currentCategory?.descriptionDetail}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full text-center py-12 text-3xl tracking-widest font-light">
        {currentCategory?.title}
        <div className="w-28 h-1 bg-stone-700 m-auto mt-3"></div>
      </div>
      <div className="flex justify-between items-center w-[21rem] py-5 gap-2 mr-52 ml-auto">
        <div className="flex justify-between items-center">
          <i className="fi fi-rr-filter"></i>
          <h1>Price:</h1>
        </div>
        <div className="flex justify-between items-center gap-2">
          <Filter
            filter={Filters.ASC}
            isSelected={filter === Filters.ASC}
            onFilter={() => handleFilter(Filters.ASC)}
          />
          <Filter
            filter={Filters.DESC}
            isSelected={filter === Filters.DESC}
            onFilter={() => handleFilter(Filters.DESC)}
          />
          <Filter
            filter={Filters.ALL}
            isSelected={filter === Filters.ALL}
            onFilter={() => handleFilter(Filters.ALL)}
          />
        </div>
      </div>
      <div>
        <div className="grid grid-cols-4 gap-y-24">
          {dataProductByCategory.map((item) => (
            <ItemComponent key={item.id} item={item} />
          ))}
        </div>
        {dataProductByCategory.length === 0 && (
          <div className="font-light text-center">No information</div>
        )}
      </div>
      <ViewMore
        onViewMore={handleClick}
        showBtn={dataProductByCategory.length < totalItem}
      />
      <div className="pt-36 w-full h-full">
        <img src={currentCategory?.secondBanner} alt="" className="w-full" />
      </div>
    </>
  );
};

export default Items;
