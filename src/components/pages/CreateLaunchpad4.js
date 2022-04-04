import Form from "../common/Form";

// const refundTypeSelect = [
//   { title: "Burn", selected: true, id: 0 },
//   { title: "Burn 2", selected: false, id: 1 },
//   { title: "Burn 3", selected: false, id: 2 },
// ];

// const routerSelect = [
//   { title: "Standard token", selected: true, id: 0 },
//   { title: "Standard token 2", selected: false, id: 1 },
//   { title: "Standard token 3", selected: false, id: 2 },
// ];

export default function CreateLaunchpad4({ launchDetails }) {
  const getData = (time) => {
    let data = new Date(time * 1000).toString();
    let split = data.split(" ");

    return `${split[0]} ${split[1]} ${split[2]} ${split[3]} ${split[4]} ${split[5]}`;
  };

  return (
    <div className="launch container">
      <Form className="form--launchpad">
        <header className="form__header">
          <h2 className="title title--form">Launchpad Overview</h2>
        </header>
        {/* price: "", listingPrice: "", whitelist: false, softCap: "", hardCap: "",
        minBuy: "", maxBuy: "", startTime: "", endTime: "", lockupPeriod: "",
        liquidityPerc: "", uriData: "", tokenAddress: "", tokenDecimals: "",
        tokenName: "", tokenSymbol: "", isAllowed: false, */}
        <div className="form__overview">
          <div className="form__item-desc">
            <h1>Presale Price</h1>
            <h1>
              1 BNB = {launchDetails.price} {launchDetails.tokenSymbol}
            </h1>
          </div>

          <div className="item-desc">
            <h1>Listing Price</h1>
            <h1>
              1 BNB = {launchDetails.listingPrice} {launchDetails.tokenSymbol}
            </h1>
          </div>

          <div className="item-desc">
            <h1>Whitelist Active</h1>
            <h1>{`${launchDetails.whitelist}`}</h1>
          </div>
          <div className="item-desc">
            <h1>SoftCap</h1>
            <h1>{launchDetails.softCap} BNB</h1>
          </div>
          <div className="item-desc">
            <h1>HardCap</h1>
            <h1>{launchDetails.hardCap} BNB</h1>
          </div>
          <div className="item-desc">
            <h1>Minimum Buy</h1>
            <h1>{launchDetails.minBuy} BNB</h1>
          </div>
          <div className="item-desc">
            <h1>Maximum Buy</h1>
            <h1>{launchDetails.maxBuy} BNB</h1>
          </div>
          <div className="item-desc">
            <h1>Start Time</h1>
            <h1> {getData(launchDetails.startTime)}</h1>
          </div>
          <div className="item-desc">
            <h1>End Time</h1>
            <h1>{getData(launchDetails.endTime)}</h1>
          </div>
          <div className="item-desc">
            <h1>LockUp Period</h1>
            <h1>{launchDetails.lockupPeriod} Days</h1>
          </div>
          <div className="item-desc">
            <h1>Percentage Liquidity</h1>
            <h1>{launchDetails.liquidityPerc}%</h1>
          </div>
        </div>
      </Form>
    </div>
  );
}
