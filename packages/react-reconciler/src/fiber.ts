import type { Props, Key } from "shared/ReactTypes";
import type { WorkTag } from "./workTags";

export class FiberNode {
    constructor(tag: WorkTag, pendingProps: Props, key: Key) {}
}
