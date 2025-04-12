import { Filters } from "../data/data-source";
type Props = {
  filter: string;
  onFilter: (filter: string) => void;
  isSelected: boolean;
};
const Filter: React.FC<Props> = (props) => {
  let content = Filters.ASC;
  if (props.filter === Filters.DESC) {
    content = Filters.DESC;
  } else if (props.filter === Filters.ALL) {
    content = Filters.ALL;
  }

  let classFilter =
    "hover:scale-105 duration-300 m-auto border-[0.12rem] border-stone-700 rounded-full py-1 px-4 w-32 font-light text-center cursor-pointer hover:opacity-80";

  if (props.isSelected) {
    classFilter += " bg-stone-900 text-white";
  }
  return (
    <div onClick={() => props.onFilter(props.filter)} className={classFilter}>
      {content}
    </div>
  );
};

export default Filter;
