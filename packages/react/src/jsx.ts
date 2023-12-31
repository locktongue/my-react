import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import type {
    Type,
    Key,
    Ref,
    Props,
    ElementType,
    ReactElementType
} from "shared/ReactTypes";

// ReactElement

const ReactElement = function (
    type: Type,
    key: Key,
    ref: Ref,
    props: Props
): ReactElementType {
    const element = {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref,
        props,
        __mark: "JFA"
    };

    return element;
};

export const jsx = function (
    type: ElementType,
    config: any,
    ...maybeChildren: any[]
): ReactElementType {
    let key: Key = null;
    const props: Props = {};
    let ref: Ref = null;

    for (const prop in config) {
        const val = config[prop];
        if (prop === "key") {
            if (val !== undefined) {
                key = String(val);
            }
            continue;
        }

        if (prop === "ref") {
            if (val !== undefined) {
                ref = val;
                continue;
            }
        }
        if ({}.hasOwnProperty.call(config, prop)) {
            props[prop] = val;
        }
    }

    const maybeChildrenLength = maybeChildren.length;
    if (maybeChildrenLength >= 1) {
        // [child] or [child1, child2, child3]
        if (maybeChildrenLength === 1) {
            props.children = maybeChildren[0];
        } else {
            props.children = maybeChildren;
        }
    }

    return ReactElement(type, key, ref, props);
};

export const jsxDEV = function (
    type: ElementType,
    config: any
): ReactElementType {
    return jsx(type, config);
};
