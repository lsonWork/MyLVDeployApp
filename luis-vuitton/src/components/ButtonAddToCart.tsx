const ButtonAddToCart: React.FC<{ onAddCart: () => void }> = (props) => {
  return (
    <>
      <div
        onClick={props.onAddCart}
        className="w-4/5 bg-stone-900 py-3 rounded-full text-center text-white mt-6 hover:opacity-90 hover:scale-105 duration-300 cursor-pointer"
      >
        Add to cart
      </div>
    </>
  );
};

export default ButtonAddToCart;
