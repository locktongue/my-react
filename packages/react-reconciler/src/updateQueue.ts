import { Action } from "shared/ReactTypes";

// 一次更新的数据结构
export interface Update<State> {
    /*
      action包含2种情况：
        setState({data: newData})
        setState(({data: oldData}) => {data: newData})
    */
    action: Action<State>;
}

// 更新队列
export interface UpdateQueue<State> {
    shared: {
        pending: Update<State> | null;
    };
}

// 工厂方法 —— 创建更新
export const createUpdate = <State>(action: Action<State>): Update<State> => {
    return {
        action
    };
};

// 工厂方法 —— 创建原始更新队列
export const createUpdateQueue = <State>() => {
    return {
        shared: {
            pending: null
        }
    } as UpdateQueue<State>;
};

// 快捷方法 —— 入列更新
export const enqueueUpdate = <State>(
    UpdateQueue: UpdateQueue<State>,
    update: Update<State>
) => {
    UpdateQueue.shared.pending = update;
};

// 操作方法 —— 执行更新
export const processUpdateQueue = <State>(
    baseState: State,
    pendingUpdate: Update<State> | null
): { memoizedState: State } => {
    const result: ReturnType<typeof processUpdateQueue<State>> = {
        memoizedState: baseState
    };
    if (pendingUpdate !== null) {
        const action = pendingUpdate.action;

        // baseState 1 update (x) => 4x -> memoizedState 4
        if (action instanceof Function) {
            result.memoizedState = action(baseState);
        } else {
            // baseState 1 update 2 -> memoizedState 2
            result.memoizedState = action;
        }
    }

    return result;
};
