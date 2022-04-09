import React, { useState } from "react";
import { usePapaParse } from "react-papaparse";
import { ethers } from "ethers";
import { isAddress } from "../../blockchain/functions";

export default function ReadString({ handleAllocations, decimals, isLoading }) {
  const { readString } = usePapaParse();
  const [csvString, setCsvString] = useState(``);
  const [error, setError] = useState("");

  const handleReadString = async () => {
    //     const csvString = `Column 1,Column 2,Column 3,Column 4
    // 1-1,1-2,1-3,1-4
    // 2-1,2-2,2-3,2-4
    // 3-1,3-2,3-3,3-4
    // 4,5,6,7`;
    let addresses = [];
    let allocations = [];

    await readString(csvString, {
      worker: true,
      complete: async (results) => {
        setError(``);
        console.log(results.data);
        await Promise.all(
          results.data.map(async (el, index) => {
            let address = el[0].trim();
            let allocation = el[1].trim();

            console.log(allocation, address);

            if (el.length !== 2) {
              setError(`Arguments mismatch, line: ${index + 1}`);
              throw "exit";
            }

            if (!(await isAddress(address))) {
              setError(`Address not valid, line: ${index + 1}`);
              throw "exit";
            }
            if (Number(allocation) <= 0 || !Number(allocation)) {
              setError(
                `Allocation needs to be a valid number bigger than 0, line: ${
                  index + 1
                }`
              );
              throw "exit";
            }

            addresses.push(address);
            allocations.push(ethers.utils.parseUnits(allocation, decimals));
          })
        );
        console.log(addresses, allocations);
        handleAllocations(addresses, allocations);
      },
    });
  };

  return (
    <div className="popup--allocation-box">
      <h3>User Allocations</h3>
      <textarea
        value={csvString}
        onChange={(e) => setCsvString(e.target.value)}
        name="test"
        id=""
        cols="30"
        rows="10"
        className="popup--textarea"
        placeholder={`Insert address separate with break lines. The amount of each user separate by comma(,) symbol. The format just like CSV file, Ex:
        0x153B202F6C6e570f13C27371CdA6Ae2c8768Dca6, 150
        0xa50d7865597d5D59556257Be80df2aE731e24ec5, 2325
        0x2624528524A185aD23DD86847642a29c4EA83FED, 194`}
      ></textarea>
      {error && <h4>{error}</h4>}
      {/* <button onClick={() => handleReadString()}>readString</button>; */}
      <button
        disabled={isLoading}
        onClick={() => handleReadString()}
        className="button button--red details__button"
      >
        Set Allocations
      </button>
    </div>
  );
}
