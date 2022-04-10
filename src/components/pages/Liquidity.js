import { useEffect, useState } from "react";
import Items from "../common/Items";
import AAVE from "../../img/tokens/aave.png";
import BSC from "../../img/icons/bsc.png";

const list = [
  [
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "12.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/1",
      id: 1,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "13.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/2",
      id: 2,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "14.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/3",
      id: 3,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "15.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/4",
      id: 4,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "16.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/5",
      id: 5,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "17.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/1",
      id: 6,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "18.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/2",
      id: 7,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "19.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/3",
      id: 8,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "20.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/4",
      id: 9,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "45.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/5",
      id: 10,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "12.50.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/1",
      id: 11,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "12.0230.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/2",
      id: 12,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "12.0120.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/3",
      id: 13,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "12.030.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/4",
      id: 14,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "12.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/5",
      id: 15,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "12.050.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/1",
      id: 16,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "34.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/2",
      id: 17,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "12.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/3",
      id: 18,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "56.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/4",
      id: 19,
    },
    {
      "Liquidity token": { name: "AAVE/Binance USD", icon: [AAVE, BSC] },
      Symbol: "AAVE/BUSD",
      Amount: "12.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/liquidity/5",
      id: 20,
    },
  ],
  [],
];

export default function Liquidity({
  getLiquidityLockers,
  lockers,
  fetchUserLocks,
  userLocks,
  lockersLoading,
}) {
  useEffect(() => {
    getLiquidityLockers();
    fetchUserLocks();
  }, []);
  return (
    <div className="tokens container">
      <h1 className="title title--page">Liquidity</h1>
      <Items
        userLocks={userLocks}
        list={lockers}
        lockersLoading={lockersLoading}
        className="items--liquidity"
      />
    </div>
  );
}
