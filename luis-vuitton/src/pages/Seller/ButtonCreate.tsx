interface Properties {
  module: string;
  bonusClass: string;
}
const ButtonCreate: React.FC<Properties> = ({ module, bonusClass }) => {
  return (
    <div
      className={`my-4 bg-stone-950 w-36 p-2 rounded-md flex gap-1 items-center justify-center font-extralight text-white text-sm cursor-pointer hover:scale-105 transition-all ${bonusClass}`}
    >
      <i className="fi fi-rr-plus-small mt-1"></i>
      Create {module}
    </div>
  );
};

export default ButtonCreate;
