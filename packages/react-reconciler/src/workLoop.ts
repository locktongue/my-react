import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";
import { createWorkInProgress, FiberNode, FiberRootNode } from "./fiber";
import { HostRoot } from "./workTags";

let workInProgress: FiberNode | null = null;

// 开始工作时，让wip指向开始的FiberNode
function prepareFreshStack(root: FiberRootNode) {
    workInProgress = createWorkInProgress(root.current, {});
}

/*
  更新方法
    常见的触发更新的方式：
      - ReactDOM.createRoot().render
        or ReactDOM.render
      - this.setState
      - useState的dispatch方法

    目标：实现一套统一的更新机制，需求包括：
      - 兼容上述触发更新的方式
      - 方便后续扩展（优先级机制...）
    
    更新机制的组成部分
      代表更新的数据结构： Update
      消费Update的数据结构：UpdateQueue

      结构示意图：
      UpdateQueue
        shared.pending
          update
          update
*/

export function scheduleUpdateOnFiber(fiber: FiberNode) {
    // ToDo: 调度功能
    // root 即为 fiberRootNode
    const root = markUpdateFromFiberToRoot(fiber);
    renderRoot(root);
}

export function markUpdateFromFiberToRoot(fiber: FiberNode) {
    // 13:30
    let node = fiber;
    let parent = node.return;

    while (parent !== null) {
        node = parent;
        parent = node.return;
    }
    if (node.tag === HostRoot) {
        return node.stateNode;
    }
    return null;
}

function renderRoot(root: FiberRootNode) {
    // 初始化
    prepareFreshStack(root);

    do {
        try {
            workLoop();
            break;
        } catch (e) {
            console.warn(`workLoop发生错误`, e);

            workInProgress = null;
        }
    } while (true);
}

function workLoop() {
    while (workInProgress !== null) {
        performUnitOfWork(workInProgress);
    }
}

function performUnitOfWork(fiber: FiberNode) {
    const next = beginWork(fiber);
    fiber.memoizedProps = fiber.pendingProps;

    if (next === null) {
        completeUnitOfWork(fiber);
    } else {
        workInProgress = next;
    }
}

function completeUnitOfWork(fiber: FiberNode) {
    let node: FiberNode | null = fiber;
    do {
        completeWork(node);
        const sibling = node.sibling;
        if (sibling !== null) {
            workInProgress = sibling;
            return;
        }
        node = node.return;
        workInProgress = node;
    } while (node !== null);
}
