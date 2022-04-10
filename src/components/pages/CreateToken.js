import { useState } from "react";
import Form from "../common/Form";
import Input from "../common/Input";
import Select from "../common/Select";
import { deployToken } from "../../blockchain/functions";
import { useNavigate } from "react-router-dom";
import { svgIcons } from "../../Icons/svgIcons";

const selectList = [
  { title: "Standard Token", id: 0, selected: true },
  { title: "Liquidity Generator Token", id: 1, selected: false },
];

export default function CreateToken({ walletType, walletProvider }) {
  const navigate = useNavigate();
  const [tokenSelected, setTokenSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    decimals: "",
    totalSupply: "",
    charityAddress: "",
    taxFeeBps: "",
    liquidityFeeBps: "",
    charityFeeBps: "",
  });
  const [contractData, setContractData] = useState({
    address: "",
    tx: "",
  });

  function handleInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleCreate = async () => {
    setIsLoading(true);
    let receipt = await deployToken(
      tokenSelected,
      form,
      walletType,
      walletProvider
    );
    if (receipt) {
      console.log(receipt);
      setContractData({
        ...contractData,
        address: receipt.contractAddress,
        tx: receipt.transactionHash,
      });
    }
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractData.address);
  };

  return (
    <div className="container">
      <h1 className="title title--page">Create token</h1>
      {contractData.address ? (
        <Form className="form--token">
          <h2 className="title title--form form__title">
            Your token was created!
          </h2>
          <div className="input-wrapper form__input-wrapper">
            <div className="input-wrapper__header tokenDetails">
              <span className="label">Name Type</span>{" "}
              <h1 className="label">{form.name}</h1>
            </div>
            <div className="input-wrapper__header tokenDetails">
              <span className="label">Symbol</span>{" "}
              <h1 className="label">{form.symbol}</h1>
            </div>
            <div className="input-wrapper__header tokenDetails">
              <span className="label">Total Supply</span>{" "}
              <h1 className="label">{form.totalSupply}</h1>
            </div>
            <div className="input-wrapper__header tokenDetails">
              <span className="label">Token Address</span>{" "}
              <h1 className="label">
                {contractData.address.slice(0, 6)}...
                {contractData.address.slice(-6)}
              </h1>
            </div>
          </div>
          <div className="divider" />
          <div className="tokenButtons">
            <a
              href={`https://testnet.bscscan.com/tx/${contractData.tx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--red form__submit"
            >
              {/* <button className="button button--red form__submit"> */}
              View Transaction
              {/* </button> */}
            </a>
            <button
              onClick={copyToClipboard}
              type="submit"
              className="button button--red form__submit"
            >
              Copy Token Address
            </button>
            <button
              onClick={() =>
                navigate(`/create_launchpad/${contractData.address}`)
              }
              type="submit"
              className="button button--red form__submit"
            >
              Create Launchpad
            </button>
          </div>
        </Form>
      ) : (
        <Form className="form--token">
          <h2 className="title title--form form__title">
            Creating a new token
          </h2>
          <div className="input-wrapper form__input-wrapper">
            <div className="input-wrapper__header">
              <label className="label">Token Type</label>
            </div>
            <Select
              className="select--token"
              callback={(e) => setTokenSelected(e)}
              list={selectList}
              disabled={isLoading}
            />
          </div>
          <Input
            title="Name"
            displayType="input"
            placeholder="Ex: Sensei Swap"
            className="form__input-wrapper"
            type="text"
            name="name"
            disabled={isLoading}
            value={form.name}
            onChange={handleInput}
          />
          <Input
            title="Symbol"
            displayType="input"
            placeholder="Ex: $SENSEI"
            className="form__input-wrapper"
            type="text"
            name="symbol"
            disabled={isLoading}
            value={form.symbol}
            onChange={handleInput}
          />

          <Input
            title="Total Supply"
            displayType="input"
            placeholder="Ex: 100000000"
            className="form__input-wrapper form__input-wrapper--last"
            type="number"
            name="totalSupply"
            disabled={isLoading}
            value={form.totalSupply}
            onChange={handleInput}
          />
          {tokenSelected === 0 ? (
            <Input
              title="Decimals"
              displayType="input"
              placeholder="Ex: 18"
              className="form__input-wrapper"
              type="number"
              name="decimals"
              disabled={isLoading}
              value={form.decimals}
              onChange={handleInput}
            />
          ) : (
            <>
              <Input
                title="Tax Fee"
                displayType="input"
                placeholder="Ex: 3"
                className="form__input-wrapper"
                type="number"
                name="taxFeeBps"
                disabled={isLoading}
                value={form.taxFeeBps}
                onChange={handleInput}
              />
              <Input
                title="Liquidity Fee"
                displayType="input"
                placeholder="Ex: 4"
                className="form__input-wrapper"
                type="text"
                name="liquidityFeeBps"
                disabled={isLoading}
                value={form.liquidityFeeBps}
                onChange={handleInput}
              />
              <Input
                title="Charity Fee"
                displayType="input"
                placeholder="Ex: 18"
                className="form__input-wrapper"
                type="text"
                name="charityFeeBps"
                disabled={isLoading}
                value={form.charityFeeBps}
                onChange={handleInput}
              />
              <Input
                title="Charity Address"
                displayType="input"
                placeholder="Ex: 0x153B202F6C6e570f13C27371CdA6Ae2c8768Dca6"
                className="form__input-wrapper"
                type="text"
                name="charityAddress"
                disabled={isLoading}
                value={form.charityAddress}
                onChange={handleInput}
              />
            </>
          )}
          <div className="divider" />
          <button
            disabled={isLoading}
            onClick={handleCreate}
            type="submit"
            className="button button--red form__submit"
          >
            Create token
          </button>
        </Form>
      )}
    </div>
  );
}
