import { useState, useEffect } from "react";
import {
  allAirdrops,
  myAirdrops,
  createdAirdrops,
} from "./../../../services/constants";
import AirdropCard from "./AirdropCard";

export default function AirdropList({
  fetchUserAirdrops,
  userAirdrops,
  userAddress,
  airdropsLoading,
  airdrops,
  getAirdropsDetails,
}) {
  const [tokens, setTokens] = useState(allAirdrops);
  const [activeTab, setActiveTab] = useState(0);
  const [userCreated, setUserCreated] = useState([]);

  const getUserCreated = async () => {
    if (userAddress && airdrops) {
      let temp = [];
      airdrops.map((el) => {
        if (el.admin.toLowerCase() === userAddress.toLowerCase()) {
          temp.push(el);
        }
      });
      console.log(temp, "userCreated");
      setUserCreated(temp);
    }
  };

  useEffect(() => {
    getAirdropsDetails();
    fetchUserAirdrops();
    getUserCreated();
  }, []);

  useEffect(() => {
    getUserCreated();
  }, [userAddress, airdrops]);

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
              "catalog__tabs-button" + (activeTab === 0 ? " active" : "")
            }
            onClick={() => setActiveTab(0)}
          >
            All Airdrops
          </button>
        </li>
        <li className="catalog__tabs-item">
          <button
            className={
              "catalog__tabs-button" + (activeTab === 1 ? " active" : "")
            }
            onClick={() => setActiveTab(1)}
          >
            My Airdrops
          </button>
        </li>
        <li className="catalog__tabs-item">
          <button
            className={
              "catalog__tabs-button" + (activeTab === 2 ? " active" : "")
            }
            onClick={() => setActiveTab(2)}
          >
            Created by you
          </button>
        </li>
      </ul>
      {airdropsLoading && (
        <div className="loading-block">
          <h1>Loading last airdrops...</h1>
        </div>
      )}
      <ul className="cards-list cards-list--catalog">
        {activeTab === 0
          ? airdrops.map((item) => {
              return (
                <li className="cards-list__item" key={item.id}>
                  <AirdropCard item={item} />
                </li>
              );
            })
          : activeTab === 1
          ? userAirdrops.map((item) => {
              return (
                <li className="cards-list__item" key={item.id}>
                  <AirdropCard item={item} />
                </li>
              );
            })
          : userCreated.map((item) => {
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
