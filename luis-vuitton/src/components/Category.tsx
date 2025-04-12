import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import axios from "axios";
import { domain } from "../data/url";
import { Spin } from "antd";
interface CategoryCard {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
}
const Category: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryCard[]>([]);
  function handleClickCategory(id: number, slug: string) {
    navigate(`items/${slug}`, {
      state: {
        id,
        slug,
      },
    });
  }
  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const data = await axios.get(
          `${domain}/category/get-category?forClient=true`
        );

        setCategories(data.data.data);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategory();
  }, []);

  return (
    <>
      {isLoading && <Spin spinning={true} fullscreen />}
      <div className="grid grid-cols-4 gap-4 gap-y-16">
        {categories.map((item) => {
          return (
            <div key={item.id}>
              <div
                onClick={(e) => handleClickCategory(item.id, item.slug)}
                className="block w-full h-full"
              >
                <img
                  className="w-full h-full object-cover"
                  src={item.thumbnail}
                  alt="category_picture"
                />
                <div className="w-full text-center font-normal text-[0.8rem] mt-4">
                  {item.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Category;
