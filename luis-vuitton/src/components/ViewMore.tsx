type propsType = {
  onViewMore: () => void;
  showBtn: boolean;
};
const ViewMore: React.FC<propsType> = (props) => {
  return (
    <>
      {props.showBtn && (
        <div
          onClick={props.onViewMore}
          className="hover:scale-105 duration-300 m-auto mt-24 border-[0.12rem] border-stone-700 rounded-full py-3 w-48 font-light text-center cursor-pointer hover:opacity-80"
        >
          View more
        </div>
      )}
    </>
  );
};
export default ViewMore;
