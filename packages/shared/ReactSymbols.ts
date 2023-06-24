import { type ReactElement$$Typeof } from "./ReactTypes";

const supportSymbol = typeof Symbol === "function" && !!Symbol.for;

export const REACT_ELEMENT_TYPE: ReactElement$$Typeof = supportSymbol
    ? Symbol.for("react.element")
    : 0xeac7;
