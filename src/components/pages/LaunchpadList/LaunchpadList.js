import { useState, useEffect } from "react";
import Select from "./../../common/Select";
import Input from "./../../common/Input";
import Filter from "../../../Icons/Filter";
import Sort from "./../../../Icons/Sort";
import TokenCard from "./TokenCard";
import {
  launchpadsArray,
  contributionsArray,
} from "./../../../services/constants";

const filtersArray = [
  { title: "Filter by", id: 0, selected: true },
  { title: "Upcoming", id: 1, selected: false },
  { title: "Cancelled", id: 2, selected: false },
  { title: "Sale Live", id: 3, selected: false },
];

const sortArray = [
  { title: "Sort by", id: 0, selected: true },
  { title: "Lowest price first", id: 1, selected: false },
  { title: "Highest price first", id: 2, selected: false },
  { title: "Oldest first", id: 3, selected: false },
  { title: "Newest first", id: 4, selected: false },
];

export default function LaunchpadList({
  launchpadsLoading,
  userTokens,
  getLaunchpads,
  tokens,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    getLaunchpads();
  }, []);

  return (
    <div className="catalog container">
      <h1 className="title title--page">Launchpad List</h1>
      <ul className="catalog__tabs">
        <li className="catalog__tabs-item">
          <button
            className={"catalog__tabs-button" + (page === 0 ? " active" : "")}
            onClick={() => setPage(0)}
          >
            All Launchpads
          </button>
        </li>
        <li className="catalog__tabs-item">
          <button
            className={"catalog__tabs-button" + (page === 1 ? " active" : "")}
            onClick={() => setPage(1)}
          >
            My Contributions
          </button>
        </li>
      </ul>
      <div className="catalog__filters">
        <Select
          list={filtersArray}
          Icon={Filter}
          className="catalog__filter select--catalog select--filter"
        />
        <Select
          list={sortArray}
          Icon={Sort}
          className="catalog__filter select--catalog select--sort"
        />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="catalog__filter input-wrapper--search"
          placeholder="Search..."
        />
      </div>
      {launchpadsLoading && (
        <div className="loading-block">
          <h1>Loading last launchpads...</h1>
        </div>
      )}
      <ul className="cards-list cards-list--catalog">
        {page === 0 &&
          tokens.length > 0 &&
          tokens.map((item, index) => {
            return (
              <li className="cards-list__item" key={index}>
                <TokenCard item={item} />
              </li>
            );
          })}
        {page === 1 &&
          userTokens.map((item, index) => {
            return (
              <li className="cards-list__item" key={index}>
                <TokenCard item={item} />
              </li>
            );
          })}
      </ul>
    </div>
  );
}
