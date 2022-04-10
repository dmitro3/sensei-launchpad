import { useState } from "react";
import Form from "../common/Form";
import Input from "../common/Input";
import DateTimePicker from "react-datetime-picker";
import { svgIcons } from "../../Icons/svgIcons";
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

export default function CreateLaunchpad2({
  launchDetails,
  setLaunchDetails,
  errors,
}) {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const getTimeZone = () => {
    var timedifference = new Date().getTimezoneOffset();

    return `UTC ${timedifference < 0 ? "+" : ""}${timedifference / -60}`;
  };

  const getTokensNeeded = () => {
    let tokensToDistribute = launchDetails.price * launchDetails.hardCap;
    let tokensToLiquidity =
      (launchDetails.listingPrice *
        launchDetails.hardCap *
        launchDetails.liquidityPerc) /
      100;
    let tokensNeeded = tokensToDistribute + tokensToLiquidity;

    return tokensNeeded.toLocaleString();
  };

  return (
    <div className="launch container">
      <Form className="form--launchpad">
        <header className="form__header">
          <h2 className="title title--form">DeFi Launchpad Info</h2>
        </header>

        <Input
          type="number"
          displayType="input"
          className="form__input-wrapper form__input-wrapper--first"
          placeholder="0"
          title="Presale Rate"
          name="rate"
          required={true}
          info="If I spend 1 BNB how many tokens will I receive?"
          value={launchDetails.price}
          onChange={(e) => {
            setLaunchDetails({ ...launchDetails, price: e.target.value });
          }}
        />
        <div className="input-wrapper form__input-wrapper form__input-wrapper--100">
          <div className="input-wrapper__header">
            <h1 className="label">
              Sale Method - (Can be changed at any moment)
            </h1>
          </div>
          <ul className="form__checkboxes">
            <li className="form__checkbox checkbox">
              <label className="checkbox__label">
                <input
                  type="radio"
                  name="method"
                  className="checkbox__input"
                  checked={!launchDetails.whitelist}
                  onChange={() =>
                    setLaunchDetails({ ...launchDetails, whitelist: false })
                  }
                />
                <div className="checkbox__fake"></div>
                <p className="checkbox__text">Public</p>
              </label>
            </li>
            <li className="form__checkbox checkbox">
              <label className="checkbox__label">
                <input
                  type="radio"
                  name="method"
                  className="checkbox__input"
                  checked={launchDetails.whitelist}
                  onChange={() =>
                    setLaunchDetails({ ...launchDetails, whitelist: true })
                  }
                />
                <div className="checkbox__fake"></div>
                <p className="checkbox__text">Whitelist only</p>
              </label>
            </li>
          </ul>
        </div>
        <Input
          type="number"
          displayType="input"
          className="form__input-wrapper"
          placeholder="0"
          title="SoftCap (BNB)"
          name="softcap"
          required={true}
          value={launchDetails.softCap}
          onChange={(e) => {
            setLaunchDetails({ ...launchDetails, softCap: e.target.value });
          }}
        />
        <Input
          type="number"
          displayType="input"
          className="form__input-wrapper"
          placeholder="0"
          title="HardCap (BNB)"
          name="hardcap"
          required={true}
          value={launchDetails.hardCap}
          onChange={(e) => {
            setLaunchDetails({ ...launchDetails, hardCap: e.target.value });
          }}
        />
        <Input
          type="number"
          displayType="input"
          className="form__input-wrapper"
          placeholder="0"
          title="Minimum buy (BNB)"
          name="min"
          required={true}
          value={launchDetails.minBuy}
          onChange={(e) => {
            setLaunchDetails({ ...launchDetails, minBuy: e.target.value });
          }}
        />
        <Input
          type="number"
          displayType="input"
          className="form__input-wrapper"
          placeholder="0"
          title="Maximum buy (BNB)"
          name="max"
          required={true}
          value={launchDetails.maxBuy}
          onChange={(e) => {
            setLaunchDetails({ ...launchDetails, maxBuy: e.target.value });
          }}
        />
        {/* <div className="input-wrapper form__input-wrapper">
          <div className="input-wrapper__header">
            <label className="label">Refund Type</label>
          </div>
          <Select
            list={refundTypeSelect}
            callback={(index) =>
              setForm({ ...form, refundType: refundTypeSelect[index].title })
            }
            className="select--token"
          />
        </div>
        <div className="input-wrapper form__input-wrapper">
          <div className="input-wrapper__header">
            <label className="label label--required">Router</label>
          </div>
          <Select
            list={routerSelect}
            callback={(index) =>
              setForm({ ...form, refundType: routerSelect[index].title })
            }
            className="select--token"
          />
        </div> */}
        <Input
          type="number"
          displayType="input"
          className="form__input-wrapper"
          placeholder="0"
          title="Liquidity (%)"
          name="listingRate"
          required={true}
          value={launchDetails.liquidityPerc}
          onChange={(e) => {
            setLaunchDetails({
              ...launchDetails,
              liquidityPerc: e.target.value,
            });
          }}
        />
        <Input
          type="number"
          displayType="input"
          className="form__input-wrapper"
          placeholder="0"
          title="Listing Rate"
          name="listingRate"
          required={true}
          info={`1 BNB = ${launchDetails.listingPrice} ${launchDetails.tokenSymbol}`}
          value={launchDetails.listingPrice}
          onChange={(e) => {
            setLaunchDetails({
              ...launchDetails,
              listingPrice: e.target.value,
            });
          }}
        />
        <p className="form__text">
          Enter the percentage of raised funds that should be allocated to
          Liquidity on (Min 51%, Max 100%) If I spend 1 BNB on how many tokens
          will I receive? Usually this amount is lower that presale rate to
          allow for a higher listing price on.
        </p>
        <h1 className="title title--form form__title form__title--mb">
          Select start time & end time (UTC)
        </h1>
        <div className="input-wrapper input-wrapper--icon form__input-wrapper">
          <div className="input-wrapper__header">
            <label className="label label--required">
              Start Date ({getTimeZone()})
            </label>
          </div>
          <div className="input-wrapper__row">
            <DateTimePicker
              className={"calendar"}
              onChange={(e) => {
                setStartTime(e);
                if (e) {
                  setLaunchDetails({
                    ...launchDetails,
                    startTime: e.getTime() / 1000,
                  });
                  console.log("time", e.getTime() / 1000);
                }
              }}
              disableClock={true}
              calendarIcon={svgIcons.calendar}
              value={startTime}
            />
          </div>
        </div>
        <div className="input-wrapper input-wrapper--icon form__input-wrapper">
          <div className="input-wrapper__header">
            <label className="label label--required">
              End Date ({getTimeZone()})
            </label>
          </div>
          <div className="input-wrapper__row">
            <DateTimePicker
              className={"calendar"}
              onChange={(e) => {
                setEndTime(e);
                if (e) {
                  setLaunchDetails({
                    ...launchDetails,
                    endTime: e.getTime() / 1000,
                  });
                  console.log("time", e.getTime() / 1000);
                }
              }}
              disableClock={true}
              calendarIcon={svgIcons.calendar}
              value={endTime}
            />
          </div>
        </div>

        {/* <div className="input-wrapper input-wrapper--icon form__input-wrapper"></div> */}

        <Input
          type="number"
          displayType="input"
          className="form__input-wrapper form__input-wrapper--last"
          placeholder="0"
          required={true}
          title="Listing Lockup (days)"
          name="listingLockup"
          value={launchDetails.lockupPeriod}
          onChange={(e) => {
            setLaunchDetails({
              ...launchDetails,
              lockupPeriod: e.target.value,
            });
          }}
        />
        {/* <div className="form__buttons">
          <button className="button button--grey button--border form__button">
            Back
          </button>
          <button className="button button--red form__button">Next</button>
        </div> */}
        <div className="divider"></div>
        <div className="tokenCount">
          <h1>you need {getTokensNeeded()} tokens to create</h1>
        </div>
        {errors.length > 0 && (
          <div className="tokenCount errorMessage">
            <h1 className="input-wrapper__error">{errors[0]}</h1>
          </div>
        )}
      </Form>
    </div>
  );
}
