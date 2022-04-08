import { useState, useEffect } from "react";
import {
  allAirdrops,
  myAirdrops,
  createdAirdrops,
} from "./../../../services/constants";
import AirdropCard from "./AirdropCard";

export default function AirdropList({
  launchpadsLoading,
  airdrops,
  getAirdropsDetails,
}) {
  const [tokens, setTokens] = useState(allAirdrops);

  useEffect(() => {
    getAirdropsDetails();
  }, []);

  return (
    <div className="catalog catalog--airdrop container">
      <h1 className="title title--page">Airdrop List</h1>
      <div className="catalog__stats">
        <div className="catalog__stats-column">
          <h3 className="catalog__stats-title">AIRDROP LAUNCHED</h3>
          <p className="catalog__stats-value">53</p>
        </div>
        <div className="catalog__stats-column">
          <h3 className="catalog__stats-title">PARTICIPANTS IN ALL-TIME</h3>
          <p className="catalog__stats-value">120</p>
        </div>
      </div>
      <ul className="catalog__tabs">
        <li className="catalog__tabs-item">
          <button
            className={
              "catalog__tabs-button" + (tokens === allAirdrops ? " active" : "")
            }
            onClick={() => setTokens(allAirdrops)}
          >
            All Airdrops
          </button>
        </li>
        <li className="catalog__tabs-item">
          <button
            className={
              "catalog__tabs-button" + (tokens === myAirdrops ? " active" : "")
            }
            onClick={() => setTokens(myAirdrops)}
          >
            My Airdrops
          </button>
        </li>
        <li className="catalog__tabs-item">
          <button
            className={
              "catalog__tabs-button" +
              (tokens === createdAirdrops ? " active" : "")
            }
            onClick={() => setTokens(createdAirdrops)}
          >
            Created by you
          </button>
        </li>
      </ul>
      <ul className="cards-list cards-list--catalog">
        {airdrops.map((item) => {
          return (
            <li className="cards-list__item" key={item.id}>
              <AirdropCard item={item} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
