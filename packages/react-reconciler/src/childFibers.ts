import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { ReactElementType } from "shared/ReactTypes";
import { createFiberFromElement, FiberNode } from "./fiber";
import { Placement } from "./fiberFlags";
import { HostText } from "./workTags";

/*
  shouldTrackEffects: update / mount流程中
    mount中不跟踪
    update时跟踪
*/
function ChildReconciler(shouldTrackEffects: boolean) {
    function reconcileSingleElement(
        returnFiber: FiberNode,
        currentFiber: FiberNode | null,
        element: ReactElementType
    ) {
        // 根据ReactElement创建Fiber
        const fiber = createFiberFromElement(element);
        fiber.return = returnFiber;
        return fiber;
    }

    function reconcileSingleTextNode(
        returnFiber: FiberNode,
        currentFiber: FiberNode | null,
        content: string | number
    ) {
        const fiber = new FiberNode(HostText, { content }, null);

        fiber.return = returnFiber;
        return fiber;
    }

    function placeSingleChild(fiber: FiberNode) {
        // 首次渲染 + 首屏
        if (shouldTrackEffects && fiber.alternate === null) {
            fiber.flags |= Placement;
        }
        return fiber;
    }

    return function reconcileChildFibers(
        returnFiber: FiberNode,
        // current Fiber树中对应的节点
        currentFiber: FiberNode | null,
        // 通过pendingProps传过来的children，所以是newChild
        newChild?: ReactElementType
    ): FiberNode | null {
        // 判断当前fiber的类型
        if (typeof newChild === "object" && newChild !== null) {
            switch (newChild.$$typeof) {
                case REACT_ELEMENT_TYPE:
                    return placeSingleChild(
                        reconcileSingleElement(
                            returnFiber,
                            currentFiber,
                            newChild
                        )
                    );

                default:
                    if (__DEV__) {
                        console.warn("未实现的reconcile类型", newChild);
                    }
                    break;
            }
        }

        // TODO 多节点的情况

        // HostText
        if (typeof newChild === "string" || typeof newChild === "number") {
            return placeSingleChild(
                reconcileSingleTextNode(returnFiber, currentFiber, newChild)
            );
        }

        return null;
    };
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
