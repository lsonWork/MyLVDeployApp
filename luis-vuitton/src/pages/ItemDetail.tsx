import React, { useEffect, useMemo, CSSProperties, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { categories, items } from "../data/data-source";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import useScrollToTop from "../components/useScrollToTop";
import ButtonAddToCart from "../components/ButtonAddToCart";
import Controls from "../components/Controls";
import { useDispatch, useSelector } from "react-redux";
import { cartAction } from "../store/Cart";
import { Spin } from "antd";
import axios from "axios";
import { domain } from "../data/url";

type Props = {};
const CustomArrow: React.FC<{
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}> = (props) => {
  useScrollToTop();
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "15px",
        height: "14.5px",
        backgroundColor: "grey",
        borderRadius: "50%",
        // cursor: "pointer",
      }}
      onClick={onClick}
    ></div>
  );
};
const ItemDetail: React.FC<Props> = (props) => {
  const params = useParams();
  const dispatch = useDispatch();
  const cartState = useSelector((state: any) => state.stateCart);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<{
    category: any;
    id: number;
    name: string;
    productImages: any[];
    quantity: number;
    price: number;
    description: string;
    warehouse: any;
  }>({
    category: {},
    id: 0,
    name: "",
    productImages: [],
    quantity: 0,
    price: 0,
    description: "",
    warehouse: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await axios.get(
          `${domain}/product/detail/${params.idProduct}`
        );
        setSelectedProduct(data.data);
      } catch (e: any) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  let settings = {
    dots: true,
    infinite: selectedProduct!.productImages.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomArrow />,
    prevArrow: <CustomArrow />,
  };

  const handleAddCart = () => {
    dispatch(
      cartAction.addItem({
        idProduct: selectedProduct!.id,
        quantity: cartState.quantity,
      })
    );
  };

  const temp = () => {};

  return (
    <>
      {isLoading && <Spin spinning={true} fullscreen />}
      <div className="container m-auto px-40 pt-20">
        <div className="my-8">
          <NavLink
            to={`/items/${selectedProduct.category.slug}`}
            state={{
              id: selectedProduct.category.id,
              slug: selectedProduct.category.slug,
            }}
          >
            Back to {selectedProduct.category.name}
          </NavLink>
        </div>
        <div className="grid grid-cols-2">
          <div className="px-8">
            <Slider {...settings}>
              {selectedProduct.productImages.map((item, index) => (
                <div key={index} className="">
                  <img className="" src={item.path} alt="" />
                </div>
              ))}
            </Slider>
          </div>
          <div className="pl-8 relative">
            <div className="absolute top-1/2 -translate-y-1/2 w-full">
              {selectedProduct.description && (
                <div className="text-sm font-light bg-stone-900 text-center text-white py-1 w-52 rounded-2xl">
                  {selectedProduct?.description}
                </div>
              )}
              <div className="text-xl mt-8 mb-4">{selectedProduct.name}</div>
              <div>
                <span className="text-xl inline-block mr-3">Price:</span>
                <div className="font-bold text-2xl inline-block">
                  ${selectedProduct.price}
                </div>
              </div>
              <div className="text-xl mt-3">
                <span className="text-lg inline-block mr-3">Quantity:</span>
                <div className="text-lg inline-block">
                  {selectedProduct.warehouse.quantity}
                </div>
              </div>
              <div className="my-4">
                <span className="text-lg inline-block mr-3">Quantity:</span>
                <Controls
                  triggerStateCart={temp}
                  reset={true}
                  quantity={1}
                  idProduct={selectedProduct.id}
                  isDeleted={false}
                />
              </div>
              <ButtonAddToCart onAddCart={handleAddCart} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemDetail;
