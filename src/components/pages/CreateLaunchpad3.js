import Form from "../common/Form";
import Input from "../common/Input";

export default function CreateLaunchpad3({ airdrop, extraInfo, setExtraInfo }) {
  return (
    <div className="launch container">
      <Form className="form--launchpad">
        <header className="form__header">
          <h2 className="title title--form">Additional Info</h2>
        </header>
        {airdrop && (
          <>
            <Input
              type="text"
              displayType="input"
              className="form__input-wrapper form__input-wrapper--first"
              placeholder=""
              title="Airdrop Title"
              name="title"
              // info="URL must end with a supported image extension png, jpg, jpeg or gif."
              value={extraInfo.title}
              onChange={(e) => {
                setExtraInfo({ ...extraInfo, title: e.target.value });
              }}
            />
            <div className="divider"></div>
          </>
        )}

        <Input
          type="text"
          displayType="input"
          className="form__input-wrapper form__input-wrapper--first"
          placeholder=""
          title="Logo URL"
          name="rate"
          info="URL must end with a supported image extension png, jpg, jpeg or gif."
          value={extraInfo.logo}
          onChange={(e) => {
            setExtraInfo({ ...extraInfo, logo: e.target.value });
          }}
        />

        <Input
          type="text"
          displayType="input"
          className="form__input-wrapper"
          placeholder=""
          title="Website"
          name="Website"
          value={extraInfo.website}
          onChange={(e) => {
            setExtraInfo({ ...extraInfo, website: e.target.value });
          }}
        />
        <Input
          type="text"
          displayType="input"
          className="form__input-wrapper"
          placeholder=""
          title="Facebook"
          name="Facebook"
          value={extraInfo.facebook}
          onChange={(e) => {
            setExtraInfo({ ...extraInfo, facebook: e.target.value });
          }}
        />
        <Input
          type="text"
          displayType="input"
          className="form__input-wrapper"
          placeholder=""
          title="Twitter"
          name="Twitter"
          value={extraInfo.twitter}
          onChange={(e) => {
            setExtraInfo({ ...extraInfo, twitter: e.target.value });
          }}
        />
        <Input
          type="text"
          displayType="input"
          className="form__input-wrapper"
          placeholder=""
          title="Github"
          name="Github"
          value={extraInfo.github}
          onChange={(e) => {
            setExtraInfo({ ...extraInfo, github: e.target.value });
          }}
        />

        <Input
          type="text"
          displayType="input"
          className="form__input-wrapper"
          placeholder=""
          title="Telegram"
          name="Telegram"
          value={extraInfo.telegram}
          onChange={(e) => {
            setExtraInfo({
              ...extraInfo,
              telegram: e.target.value,
            });
          }}
        />
        <Input
          type="text"
          displayType="input"
          className="form__input-wrapper"
          placeholder=""
          title="Instagram"
          name="Instagram"
          value={extraInfo.instagram}
          onChange={(e) => {
            setExtraInfo({
              ...extraInfo,
              instagram: e.target.value,
            });
          }}
        />
        <Input
          type="text"
          displayType="input"
          className="form__input-wrapper"
          placeholder=""
          title="Discord"
          name="Discord"
          value={extraInfo.discord}
          onChange={(e) => {
            setExtraInfo({
              ...extraInfo,
              discord: e.target.value,
            });
          }}
        />
        <Input
          type="text"
          displayType="input"
          className="form__input-wrapper"
          placeholder=""
          title="Reddit"
          name="Reddit"
          value={extraInfo.reddit}
          onChange={(e) => {
            setExtraInfo({
              ...extraInfo,
              reddit: e.target.value,
            });
          }}
        />

        <div className="divider"></div>

        <Input
          type="textarea"
          displayType="input"
          className="form__input-wrapper--100 input-textarea"
          placeholder=""
          title="Description"
          name="Description"
          value={extraInfo.description}
          onChange={(e) => {
            setExtraInfo({
              ...extraInfo,
              description: e.target.value,
            });
          }}
        />
      </Form>
    </div>
  );
}
