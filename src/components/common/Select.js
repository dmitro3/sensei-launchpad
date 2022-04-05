import React, { useEffect, useState } from "react";
import Arrow from "../../Icons/Arrow";
import { checkForScrollbar } from "../../services/scrollbarService";

export default function Select({
  className,
  list,
  callback,
  Icon,
  CustomArrow,
  disabled,
}) {
  const [selectList, setSelectList] = useState(list);
  const [opened, setOpened] = useState(false);
  let selectedTitle = selectList.find((item) => item.selected === true).title;

  function selectItem(index) {
    setSelectList((state) =>
      state.map((item, itemIndex) => ({
        ...item,
        selected: itemIndex === index ? true : false,
      }))
    );
    callback && callback(index);
  }

  function toggleSelect() {
    setOpened((state) => !state);
  }

  useEffect(() => {
    function handleDocumentClick() {
      if (opened) {
        toggleSelect();
      }
    }

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [opened]);

  return (
    <div
      className={
        "select " +
        (className || "") +
        (opened ? " opened" : "") +
        (checkForScrollbar() ? " scroll-visible" : "")
      }
    >
      <button
        className="select__button"
        disabled={disabled}
        onClick={toggleSelect}
      >
        {Icon && <Icon className="select__button-icon" />}
        <span className="select__button-text">{selectedTitle}</span>
        {CustomArrow ? (
          <CustomArrow className="select__button-arrow" />
        ) : (
          <Arrow className="select__button-arrow" />
        )}
      </button>
      <div className="select__list-wrapper">
        <ul className="select__list scrollwrapper select__scrollwrapper">
          {selectList.map((item, index) => {
            return (
              <li className="select__item" key={item.id}>
                <button
                  className={
                    "select__item-button" + (item.selected ? " selected" : "")
                  }
                  onClick={() => {
                    selectItem(index);
                  }}
                >
                  {item.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
