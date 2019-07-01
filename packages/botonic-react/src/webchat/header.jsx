import React, { useContext } from "react";
import { WebchatContext } from "../contexts";
import Logo from "./botonic_react_logo100x100.png";

const CloseButton = props => {
  const { webchatState, triggerWebchat } = useContext(WebchatContext);
  return (
    <div
      style={{
        cursor: "pointer",
        fontSize: "16px",
        color: "black",
        position: "absolute",
        right: "10px",
        top: "9px"
      }}
      onClick={event => {
        triggerWebchat(!webchatState.isWebchatOpen);
        event.preventDefault();
      }}
    >
      ✕
    </div>
  );
};

const InnerHeader = props => {
  const { webchatState, staticAssetsUrl } = useContext(WebchatContext);
  return (
    <div
      style={{
        ...(props.style || {}),
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#b0c4de",
        color: "#295179"
      }}
    >
      <img
        style={{
          height: 24,
          margin: "0px 12px"
        }}
        src={staticAssetsUrl + (webchatState.theme.brandIconUrl || Logo)}
      />
      <h4
        style={{
          margin: 0,
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        {webchatState.theme.title || "Botonic"}
      </h4>
    </div>
  );
};

export const WebchatHeader = props => {
  const { webchatState } = useContext(WebchatContext);
  const Header = webchatState.theme.customHeader
    ? webchatState.theme.customHeader
    : InnerHeader;
  const CloseBtn = webchatState.theme.customCloseButton
    ? webchatState.theme.customCloseButton
    : CloseButton;
  return (
    <div
      {...props}
      style={{
        position: "relative",
        ...(props.style || {}),
        paddingBottom: 19
      }}
    >
      <Header />
      <CloseBtn />
    </div>
  );
};
