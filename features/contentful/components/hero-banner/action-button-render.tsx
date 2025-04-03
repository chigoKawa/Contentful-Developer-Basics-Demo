import React, { FC } from "react";
import { IBaseButton } from "../../type";
import BaseButtonWrapper from "../base-button/base-button-wrapper";

interface IProps {
  buttons: IBaseButton[]; // Array of button objects with properties for rendering
}

const ActionButtonRender: FC<IProps> = ({ buttons }) => {
  return (
    <div className="flex md:flex-row gap-6 ">
      {/* Loop through the buttons array and render each button using BaseButtonWrapper */}
      {buttons?.map((button, index) => (
        <BaseButtonWrapper key={`key-${index}`} {...button} />
      ))}
    </div>
  );
};

export default ActionButtonRender;
