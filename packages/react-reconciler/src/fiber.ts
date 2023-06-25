import type { Props, Key, Ref } from "shared/ReactTypes";
import type { WorkTag } from "./workTags";
import { Flags, NoFlags } from "./fiberFlags";
import type { Container } from "hostConfig";

// ReactElement --- diff with ---> FiberNode --- gen ---> actions
//                                      |
//                                      |
//                                      |
//                                      v
// childReactElement             childFiberNode

/*
  e.g: 
    初始挂载 <div></div>

    // React Element <div></div>
    jsx('div')
    // 对应fiberNode
    null
    // 生成子FiberNode
    // 对应标记
    Placement

    将<div></div>更新为<p></p>
    // React Element <p></p>
    jsx('p')
    // 对应fiberNode
    FiberNode { type: 'div' ...}
    // 生成fiberNode
    // 对应标记
    Deletion   Placement

    当所有的ReactElement对比完后，会生成一颗FiberNode树。
    一共会存在2棵FiberNode树：
     - current: 与视图中真实UI对应的FiberNode树
     - workInProgress: 出发更新后，正在reconciler中计算的FiberNode树
    workInProgress树更新后会变成current，如此反复
*/

/*
  DFS遍历全部节点：
    - 有子节点，遍历子节点
    - 没有子节点，遍历兄弟节点

  例子：
    <Card>
      <h3>你好</h3>
      <p>My-React</p>
    </Card>

    Card -> h3 -> 你好 -> h3 -> p -> My-React -> p > h3

    整体是个递归过程，存在递、归两个阶段：
      - 递：对应beginWork
      - 归：对应completeWork
*/

/*
  ReactDOM.createRoot(rootElement).render(<App />)

      fiberRootNode
        |       ^
        |       |
    current   stateNode
        |       |
        v       |
      hostRootFiber
        |       ^
        |       |
      child   return
        |       |
        v       |
          App
*/

export class FiberNode {
    type: any;
    tag: WorkTag;
    pendingProps: Props;
    key: Key;
    stateNode: any;

    return: FiberNode | null;
    sibling: FiberNode | null;
    child: FiberNode | null;
    index: number;
    ref: Ref;

    memoizedProps: Props | null;
    memoizedState: any;

    flags: Flags;

    updateQueue: unknown;
    // current.alternate = workInProgress; workInprogress.altername = current;
    alternate: FiberNode | null;

    constructor(tag: WorkTag, pendingProps: Props, key: Key) {
        // 实例
        this.tag = tag;
        this.key = key;
        // e.g: HostComponent <div> => div DOM
        this.stateNode = null;
        // e.g: FunctionComponent () => {}
        this.type = null;

        this.ref = null;

        // 关系属性
        // 指向父fiberNode
        this.return = null;
        // 兄弟
        this.sibling = null;
        // 子
        this.child = null;
        // 父元素的第 index 个子元素
        this.index = 0;

        // 工作单元属性
        this.pendingProps = pendingProps;
        this.memoizedProps = null;
        this.memoizedState = null;

        this.alternate = null;
        this.updateQueue = null;

        // 副作用/全部标记
        this.flags = NoFlags;
    }
}

export class FiberRootNode {
    container: Container;
    current: FiberNode;
    finishedWork: FiberNode | null;
    constructor(container: Container, hostRootFiber: FiberNode) {
        this.container = container;
        this.current = hostRootFiber;
        hostRootFiber.stateNode = this;
        this.finishedWork = null;
    }
}

export const createWorkInProgress = (
    current: FiberNode,
    pendingProps: Props
): FiberNode => {
    let wip = current.alternate;

    // 首屏渲染时
    if (wip === null) {
        // mount
        wip = new FiberNode(current.tag, pendingProps, current.key);
        wip.stateNode = current.stateNode;

        wip.alternate = current;
        current.alternate = wip;
    } else {
        // update
        wip.pendingProps = current.pendingProps;
        wip.flags = NoFlags;
    }
    wip.type = current.type;
    wip.updateQueue = current.updateQueue;
    wip.memoizedProps = current.memoizedProps;
    wip.memoizedState = current.memoizedState;

    return wip;
};
