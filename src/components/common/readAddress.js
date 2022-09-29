import React, { useState } from "react";
import { usePapaParse } from "react-papaparse";
import { isAddress } from "../../blockchain/functions";

export default function ReadString({ handleWhitelisted, isLoading }) {
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

    await readString(csvString, {
      worker: true,
      complete: async (results) => {
        setError(``);
        console.log(results.data);
        await Promise.all(
          results.data.map(async (el, index) => {
            let address = el[0].trim();

            console.log(address, "address", el);

            if (el.length !== 1) {
              setError(`Arguments mismatch, line: ${index + 1}`);
              throw "exit";
            }

            if (!(await isAddress(address))) {
              setError(`Address not valid, line: ${index + 1}`);
              throw "exit";
            }

            addresses.push(address);
          })
        );
        console.log(addresses);
        handleWhitelisted(addresses);
      },
    });
  };

  return (
    <div className="popup--allocation-box">
      <h3>Whitelisted Users</h3>
      <textarea
        value={csvString}
        onChange={(e) => setCsvString(e.target.value)}
        name="test"
        id=""
        cols="30"
        rows="10"
        className="popup--textarea"
        placeholder={`Insert address separate with break lines. The format just like CSV file, Ex:
        0x153B202F6C6e570f13C27371CdA6Ae2c8768Dca6 
        0xa50d7865597d5D59556257Be80df2aE731e24ec5
        0x2624528524A185aD23DD86847642a29c4EA83FED`}></textarea>
      {error && <h4>{error}</h4>}
      {/* <button onClick={() => handleReadString()}>readString</button>; */}
      <button
        disabled={isLoading}
        onClick={() => handleReadString()}
        className="button button--red details__button">
        Set Whitelisted Addresses
      </button>
    </div>
  );
}
