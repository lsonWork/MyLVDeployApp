import { useRef } from "react";
import { useEffect } from "react";
import Category from "../components/Category";
import axios from "axios";
import { domain } from "../data/url";
import Cookies from "js-cookie";
const Home: React.FC<{}> = () => {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    video.current?.play();
  }, []);

  return (
    <>
      <div className="pt-20">
        <div className="w-full h-[35.1rem] relative">
          <video
            ref={video}
            width="auto"
            height="auto"
            className="w-full h-full object-cover"
            muted
            loop
          >
            <source
              src="/video/37dWIEgGOiDMNYWhTNfoHv0f_9.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute bottom-0 w-full text-center pb-10">
            <h3 className="text-white font-thin text-xs mb-4">WOMEN</h3>
            <span className="text-white font-extralight text-xl">
              Neverfull Inside Out
            </span>
          </div>
        </div>
        <div className="container mx-auto px-40">
          <div className="text-center">
            <div className="py-11">
              <div className="text-[1.7rem] font-light mb-4">Explore us</div>
              <div className="text-stone-500 text-[0.8rem]">
                Discover our luxurious collections
              </div>
            </div>
          </div>
          <Category />
          <div className="text-center">
            <div className="pb-11 pt-44">
              <h1 className="text-[1.7rem] font-light mb-4">
                Louis Vuitton Services
              </h1>
              <span className="text-stone-500 text-[0.8rem]">
                Louis Vuitton offers complementary wrapping on all orders,
                carefully packaged
              </span>
              <span className="block text-stone-500 text-[0.8rem]">
                in the Maison's iconic boxes.
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <img
                  src="/picture/service/Services.png"
                  alt=""
                  className="object-cover"
                />
                <div className="py-4">
                  <h2 className="font-normal mb-2">Services</h2>
                  <h3 className="font-light text-sm underline">Contact Us</h3>
                </div>
              </div>
              <div>
                <img
                  src="/picture/service/ArtOfGifting.png"
                  alt=""
                  className="object-cover"
                />
                <div className="py-4">
                  <h2 className="font-normal mb-2">Art of Gifting</h2>
                  <div className="flex gap-2 justify-center">
                    <h3 className="font-light text-sm underline">
                      Gift for Women
                    </h3>
                    <h3 className="font-light text-sm underline">
                      Gift for Men
                    </h3>
                  </div>
                </div>
              </div>
              <div>
                <img
                  src="/picture/service/Personalization.png"
                  alt=""
                  className="object-cover"
                />
                <div className="py-4">
                  <h2 className="font-normal mb-2">Personalization</h2>
                  <h3 className="font-light text-sm underline">Explore</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
