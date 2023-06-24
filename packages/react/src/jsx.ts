import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import type {
    Type,
    Key,
    Ref,
    Props,
    ReactElement,
    ElementType
} from "shared/ReactTypes";

// ReactElement

const ReactElement = function (
    type: Type,
    key: Key,
    ref: Ref,
    props: Props
): ReactElement {
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
    ...maybeChildren: any
) {
    let key: Key = null;
    const props: Props = {};
    let ref: Ref = null;

    for (const prop in config) {
        const val = config[prop];
        if (prop === "key") {
            if (val !== undefined) {
                key = "" + val;
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
    if (maybeChildrenLength) {
        // [child] or [child1, child2, child3]
        if (maybeChildrenLength === 1) {
            props.children = maybeChildren[0];
        } else {
            props.children = maybeChildren;
        }
    }

    return ReactElement(type, key, ref, props);
};

export const jsxDev = jsx;
