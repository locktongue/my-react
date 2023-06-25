export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;
export type ReactElement$$Typeof = symbol | number;

export interface ReactElementType {
    $$typeof: ReactElement$$Typeof;
    type: ElementType;
    key: KeyboardEvent;
    props: Props;
    ref: Ref;
    __mark: string;
}
