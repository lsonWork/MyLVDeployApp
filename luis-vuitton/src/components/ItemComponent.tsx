import React from "react";
import { Item } from "../data/data-source";
import { NavLink } from "react-router-dom";
import Loading from "./Loading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
interface ProductCard {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  price: number;
}
type props = {
  item: ProductCard;
};

const ItemComponent: React.FC<props> = ({ item }) => {
  return (
    <>
      <NavLink to={`/detail/${item.id}`}>
        <div className="relative w-full h-full hover:opacity-90 cursor-pointer text-center">
          <div className="bg-gradient-to-b inset-0 absolute from-black/20 to-transparent"></div>
          <img
            src={item.thumbnail}
            className="object-cover w-full h-full"
            alt=""
          />
          <div className="font-light text-sm text-stone-600">
            {item.description ? item.description : <br></br>}
          </div>
          <div className="text-center font-light">{item.name}</div>
          <div className=" text-center font-bold">${item.price}</div>
        </div>
      </NavLink>
    </>
  );
};

export default ItemComponent;
