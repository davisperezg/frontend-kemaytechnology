import { RefObject } from "react";
import { InputChange } from "../../../lib/types";
import "./index.css";

interface Props {
  handleSearch: (e: InputChange) => void;
  searchComponent: RefObject<HTMLInputElement>;
  placeholder: string;
}

const SearchTable = ({ handleSearch, searchComponent, placeholder }: Props) => {
  return (
    <div>
      <input
        ref={searchComponent}
        onChange={handleSearch}
        className="search-vehicle"
        type="text"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchTable;
