import { useEffect, useState } from "react";
import Items from "./../common/Items";
import aaveIcon from "../../img/tokens/aave.png";

const list = [
  [
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "12.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/1",
      id: 1,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "13.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/2",
      id: 2,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "14.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/3",
      id: 3,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "15.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/4",
      id: 4,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "16.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/5",
      id: 5,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "17.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/1",
      id: 6,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "18.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/2",
      id: 7,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "19.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/3",
      id: 8,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "20.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/4",
      id: 9,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "45.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/5",
      id: 10,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "12.50.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/1",
      id: 11,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "12.0230.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/2",
      id: 12,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "12.0120.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/3",
      id: 13,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "12.030.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/4",
      id: 14,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "12.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/5",
      id: 15,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "12.050.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/1",
      id: 16,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "34.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/2",
      id: 17,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "12.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/3",
      id: 18,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "56.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/4",
      id: 19,
    },
    {
      Token: { name: "AAVE", icon: aaveIcon },
      Symbol: "AAVE",
      Amount: "12.000.000.000",
      "Token Address": "0x5617...bf9",
      Action: "/tokens/5",
      id: 20,
    },
  ],
  [
    [
      "0x4CDcAA37CcB78B3aA9644BF3d0eD34CD2eAc79e8",
      "0x0000000000000000000000000000000000000000",
      100000,
      18,
      "Token of Prize Locker",
      "TPL",
    ],
  ],
];

export default function Tokens({
  lockers,
  getRegularLockers,
  fetchUserLocks,
  userLocks,
  lockersLoading,
}) {
  useEffect(() => {
    getRegularLockers();
    fetchUserLocks();
  }, []);

  return (
    <div className="tokens container">
      <h1 className="title title--page">Tokens</h1>
      <Items
        lockersLoading={lockersLoading}
        userLocks={userLocks}
        tokens={true}
        list={lockers}
        className="items--token"
      />
    </div>
  );
}
