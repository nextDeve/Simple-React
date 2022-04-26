import { addEvent } from './event'
import {
    REACT_TEXT,
    REACT_FORWARD_REF_TYPE,
    PLACEMENT,
    MOVE,
    REACT_FRAGMENT,
    REACT_CONTEXT,
    REACT_PROVIDER,
    REACT_MEMO
} from './constants'


let scheduleUpdate;
let hookSate = [];//存放所有状态
let hookIndex = 0;//当前执行的hook索引

function render(vdom, container) {
    mount(vdom, container)
    scheduleUpdate = () => {
        hookIndex = 0;
        compareVdom(container, vdom, vdom)
    }
}
/**
* 1.把vdom变成真实DOM
* 2.把vdom上的属性更新或同步到DOM上
* 3.把此虚拟DOM的子元素也都变成真实DOM挂载到自己的dom上，dom.appendChild
* 4.把自己挂载到容器上
* @param {*} vdom  要渲染的虚拟dom
* @param {*} container 虚拟dom容器
*/
function mount(vdom, container) {
    if (vdom) {
        const dom = createDOM(vdom);
        container.appendChild(dom);
    }
}

/**
 * useState
 * @param {*} initialState 
 * @returns 
 */
/* export function useState(initialState) {
    hookSate[hookIndex] = hookSate[hookIndex] !== undefined ? hookSate[hookIndex] : initialState;
    let currentIndex = hookIndex;
    function setState(newState) {
        hookSate[currentIndex] = newState;
        scheduleUpdate();
    }
    return [hookSate[hookIndex++], setState]
} */
export function useState(initialState) {
    return useReducer(null, initialState)
}
/**
 *useMemo
 * @param {*} factory 
 * @param {*} deps 
 * @returns 
 */
export function useMemo(factory, deps) {
    if (hookSate[hookIndex]) {
        let [lastMemo, lastDeps] = hookSate[hookIndex];
        let same = deps.every((item, index) => item === lastDeps[index])
        if (same) {
            hookIndex++;
            return lastMemo;
        } else {
            let newMemo = factory();
            hookSate[hookIndex++] = [newMemo, deps];
            return newMemo;
        }
    } else {
        let newMemo = factory();
        hookSate[hookIndex++] = [newMemo, deps];
        return newMemo;
    }
}
/**
 * useCallback
 * @param {*} callback 
 * @param {*} deps 
 * @returns 
 */
export function useCallback(callback, deps) {
    if (hookSate[hookIndex]) {
        let [lastCallback, lastDeps] = hookSate[hookIndex];
        let same = deps.every((item, index) => item === lastDeps[index])
        if (same) {
            hookIndex++;
            return lastCallback;
        } else {
            hookSate[hookIndex++] = [callback, deps];
            return callback;
        }
    } else {
        hookSate[hookIndex++] = [callback, deps];
        return callback;
    }
}
/**
 * 
 * @param {*} reducer 
 * @param {*} initialState 
 * @returns 
 */
export function useReducer(reducer, initialState) {
    hookSate[hookIndex] = hookSate[hookIndex] !== undefined ? hookSate[hookIndex] : initialState;
    let currentIndex = hookIndex
    function dispatch(action) {
        hookSate[currentIndex] = reducer ? reducer(hookSate[currentIndex], action) : action
        scheduleUpdate();
    }
    return [hookSate[hookIndex++], dispatch]
}
/**
 * 
 * @param {*} callBack 当前渲染任务完成下一个宏任务
 * @param {*} deps 依赖数组
 */
export function useEffect(callBack, deps) {
    //往后调用
    if (hookSate[hookIndex]) {
        // 获取上一次的销毁函数和状态
        let [lastDestroy, lastDeps] = hookSate[hookIndex];
        //比较状态
        let same = deps.every((item, index) => item === lastDeps[index]);
        if (same) {
            //一样的话不需要做什么
            hookIndex++;
        } else {
            // 不一样，执行回调，记录销毁函数
            if (typeof lastDestroy === 'function') lastDestroy();
            let newDestroy = callBack()
            hookSate[hookIndex++] = [newDestroy, deps]
        }
        //第一次进来时，只需要保存effect的销毁函数和依赖
    } else {
        setTimeout(() => {
            let destroy = callBack()
            hookSate[hookIndex++] = [destroy, deps]
        })
    }
}
/**
 * 
 * @param {*} callBack 
 * @param {*} deps 
 */
export function useLayoutEffect(callBack, deps) {
    //往后调用
    if (hookSate[hookIndex]) {
        // 获取上一次的销毁函数和状态
        let [lastDestroy, lastDeps] = hookSate[hookIndex];
        //比较状态
        let same = deps.every((item, index) => item === lastDeps[index]);
        if (same) {
            //一样的话不需要做什么
            hookIndex++;
        } else {
            // 不一样，执行回调，记录销毁函数
            if (typeof lastDestroy === 'function') lastDestroy();
            let newDestroy = callBack()
            hookSate[hookIndex++] = [newDestroy, deps]
        }
        //第一次进来时，只需要保存effect的销毁函数和依赖
    } else {
        queueMicrotask(() => {
            let destroy = callBack()
            hookSate[hookIndex++] = [destroy, deps]
        })
    }
}
export function useRef(initialState) {
    if (hookSate[hookIndex]) {
        return hookSate[hookIndex++]
    } else {
        hookSate[hookIndex] = { current: null }
        return hookSate[hookIndex++]
    }
}
/**
 * 把vdom转换成DOM
 * @param {*} vdom 
 */
export function createDOM(vdom) {
    //处理vdom是数字或者是字符串的情况
    /*     if (typeof vdom === 'string' || typeof vdom === 'number') {
            return document.createTextNode(vdom)
        } */
    //否者 它就是一个虚拟DOM对象 也就是React元素
    let { type, props, ref } = vdom;
    let dom;
    //vdom为函数组件
    if (type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
        return mountForwardComponent(vdom);
    } else if (type === REACT_TEXT) {
        dom = document.createTextNode(props.content);
    } else if (type && type.$$typeof === REACT_MEMO) {
        return mountMemoCoponent(vdom);
    } else if (type === REACT_FRAGMENT) {
        dom = document.createDocumentFragment();
    } else if (type && type.$$typeof === REACT_CONTEXT) {
        return mountContextCoponent(vdom);
    } else if (type && type.$$typeof === REACT_PROVIDER) {
        return mountProviderCoponent(vdom);
    } else {
        if (typeof type === 'function') {
            if (type.isReactComponent) {
                return mountClassCoponent(vdom);
            }
            else {
                return mountFunctionComponent(vdom);
            }
        } else {//vdom为原生html组件
            dom = document.createElement(type);
        }
    }
    if (props) {
        // 使用vdom的属性更新刚创建出来的DOM属性
        updatedProps(dom, {}, props);
        //在这儿处理props.children
        if (typeof props.children === 'object' && props.children.type) {
            props.children.mountIndex = 0;
            render(props.children, dom);
            // 子元素不止一个，是一个数组的情况
        } else if (Array.isArray(props.children)) {
            reconcileChildren(props.children, dom)
        }
    }
    vdom.dom = dom
    if (ref) ref.current = dom //让current指向dom实例
    return dom;
}
/**
 * 使用vdom的属性更新刚创建出来的DOM属性
 * @param {*} dom  真实DOM
 * @param {*} newProps 
 */
function updatedProps(dom, oldProps, newProps) {
    for (let key in newProps) {
        if (key === 'children') continue;//不在此处处理
        else if (key === 'style') {
            let styleObj = newProps.style;
            for (let attr in styleObj) {
                dom.style[attr] = styleObj[attr];
            }
        } else if (key.startsWith('on')) {
            addEvent(dom, key.toLowerCase(), newProps[key]);
        }
        else {
            if (newProps[key])
                dom[key] = newProps[key];
        }
    }
}
/**
 * 
 * @param {*} childrens DOM的子元素，多个vdom
 * @param {*} dom 父节点DOM
 */
function reconcileChildren(childrens, dom) {
    for (let i in childrens) {
        if (childrens[i])
            childrens[i].mountIndex = i;
        render(childrens[i], dom);
    }
}
/**
 * 挂载函数组件,把一个函数组件转化为DOM
 * @param {*} vdom 
 */
function mountFunctionComponent(vdom) {
    let { type: FunctionComponent, props } = vdom;
    let renderVdom = FunctionComponent(props);
    vdom.renderVdom = renderVdom
    return createDOM(renderVdom);
}
/**
 * 
 * @param {*} vdom 
 */
function mountForwardComponent(vdom) {
    let { type, props, ref } = vdom;
    let renderVdom = type.render(props, ref)
    vdom.renderVdom = renderVdom
    return createDOM(renderVdom);
}
/**
 * 挂载类组件
 * @param {*} vdom 
 */
function mountClassCoponent(vdom) {
    //结构类的定义和属性
    let { type: ClassComponent, props, ref } = vdom;
    // 新建类实例
    let classInstance = new ClassComponent(props);
    if (ClassComponent.contextType) {
        classInstance.context = ClassComponent.contextType._currentValue
    }
    let nextState = classInstance.state
    let partialState;
    if (classInstance.constructor.getDerivedStateFromProps) {
        partialState = classInstance.constructor.getDerivedStateFromProps.call(classInstance, props, nextState)
    }
    if (partialState) Object.assign(nextState, partialState)
    classInstance.state = nextState
    //让类组件的vdom的classInstance属性指向这个类组件的实例
    /* vdom.classInstance = classInstance */
    //将要挂载
    if (classInstance.componentWillMount) {
        classInstance.componentWillMount()
    }
    // 获取vdom来创建Dom
    let renderVdom = classInstance.render();
    //将将要渲染的vdom挂载到实例上
    classInstance.renderVdom = renderVdom
    vdom.renderVdom = renderVdom
    vdom.classInstance = classInstance
    // 创建DOM
    let dom = createDOM(renderVdom)
    if (classInstance.componentDidMount) {
        dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
        classInstance.componentDidMount()
    }
    //挂载dom到实例上，为更新做准备
    /*     classInstance.dom = dom */
    renderVdom.dom = dom
    if (ref) ref.current = classInstance
    return dom
}
/**
 * 挂载provider组件
 * @param {*} vdom 
 */
function mountProviderCoponent(vdom) {
    let { type, props } = vdom;
    type._context._currentValue = props.value;
    let renderVdom = props.children;
    vdom.renderVdom = renderVdom;
    return createDOM(renderVdom);
}
/**
 *挂载comsumer组件
 * @param {*} vdom 
 */
function mountContextCoponent(vdom) {
    let { type, props } = vdom;
    let renderVdom = props.children(type._context._currentValue);
    vdom.renderVdom = renderVdom;
    return createDOM(renderVdom);
}
/**
 * 挂载memo
 * @param {*} vdom 
 * @returns 
 */
function mountMemoCoponent(vdom) {
    let { type, props } = vdom;
    let renderVdom = type.type(props);
    vdom.renderVdom = renderVdom;
    return createDOM(renderVdom);
}
/**
 *对当前 组件进行DOM-DIFF
 * @param {*} dom 当前组件挂载父真实节点
 * @param {*} oldVdom  旧的vdom
 * @param {*} newVdom  新的vdom
 */
export function compareVdom(parentDom, oldVdom, newVdom, nextDom, resolve) {
    // 老的vdom 和新的vdom都是null
    if (!oldVdom && !newVdom) {
        return null;
        //如果老的vdom有，新的vdom没有
    } else if (oldVdom && !newVdom) {
        let currentDOM = findDom(oldVdom); //先找到此vdom对应的DOM
        if (currentDOM) parentDom.removeChild(currentDOM)
        if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
            oldVdom.classInstance.componentWillUnmount()
        }
        return null
        //如果oldVdom为null，newVdom优值,新建DOM节点并插入
    } else if (!oldVdom && newVdom) {
        let newDom = createDOM(newVdom);
        if (nextDom)
            parentDom.insertBefore(newDom, nextDom);
        else
            parentDom.appendChild(newDom);
        return newVdom
        //oldVdom, newVdom都有值,但是类型不同
    } else if (oldVdom && newVdom && (oldVdom.type !== newVdom.type)) {
        let oldDom = findDom(oldVdom);
        let newDom = createDOM(newVdom);
        parentDom.replaceChild(oldDom, newDom)
        if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
            oldVdom.classInstance.componentWillUnmount()
        }
        return newVdom
        //oldVdom, newVdom都有值,且类型相同，几进行深度的DOM-DIFF
        // 一方面更新自己的属性，另一方面要深度比较子元素
    } else {
        updateElement(oldVdom, newVdom);
        if (resolve) resolve();
        return newVdom
    }
}

/**
 * 根据新的vdom和旧的vdom更新DOM
 * @param {*} currentDOM 
 * @param {*} oldChildren 
 * @param {*} newchildren 
 */
function updateChild(parentDOM, oldChildren, newchildren) {
    if (!oldChildren || !newchildren) return;
    oldChildren = Array.isArray(oldChildren) ? oldChildren : [oldChildren];
    newchildren = Array.isArray(newchildren) ? newchildren : [newchildren];
    let keyedOldMap = {};
    let lastIndex = 0;
    //将老的子元素映射到map中，方便diff算法查找元素
    oldChildren.forEach((item, index) => {
        let oldKey = item && item.key ? item.key : index;
        keyedOldMap[oldKey] = item;
    })
    let patch = [];
    newchildren.forEach((newVChild, index) => {
        if (newVChild)
            newVChild.mountIndex = index;
        let newKey = newVChild && newVChild.key ? newVChild.key : index;
        let oldVChild = keyedOldMap[newKey];
        if (oldVChild) {
            compareVdom(parentDOM, oldVChild, newVChild);
            if (oldVChild.mountIndex < lastIndex) {
                patch.push({
                    type: MOVE,
                    oldVChild,
                    newVChild,
                    mountIndex: index
                })
            }
            delete keyedOldMap[newKey]
            lastIndex = Math.max(lastIndex, oldVChild.mountIndex)
        } else {
            patch.push({
                type: PLACEMENT,
                newVChild,
                mountIndex: index
            })
        }
    });
    let childToMove = patch.filter(action => action.type === MOVE).map(action => action.oldVChild);
    Object.values(keyedOldMap).concat(childToMove).forEach((oldVChild) => {
        if (oldVChild) {
            let currentDOM = findDom(oldVChild);
            parentDOM.removeChild(currentDOM);
        }
    });
    patch.forEach((action) => {
        let { type, oldVChild, newVChild, mountIndex } = action;
        let childNodes = parentDOM.childNodes;
        if (type === PLACEMENT) {
            let newDOM = createDOM(newVChild);
            let childNode = childNodes[mountIndex];
            if (childNode) {
                parentDOM.insertBefore(newDOM, childNode);
            } else {
                parentDOM.appendChild(newDOM);
            }
        } else if (type === MOVE) {
            let oldDOM = findDom(oldVChild);
            let childNode = childNodes[mountIndex];
            if (childNode) {
                parentDOM.insertBefore(oldDOM, childNode);
            } else {
                parentDOM.appendChild(oldDOM);
            }
        }
    })
    /*     let maxLength = Math.max(oldChildren.length, newchildren.length);
        for (let i = 0; i < maxLength; i++) {
            if (!oldChildren[i]) {
                let nextVdom = oldChildren.find((item, index) => index > i && item && findDom(item));
                compareVdom(currentDOM, oldChildren[i], newchildren[i], nextVdom && findDom(nextVdom));
            }
            else
                compareVdom(currentDOM, oldChildren[i], newchildren[i]);
        } */
}

/**
 * 深度比较
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateElement(oldVdom, newVdom) {
    // 更新文本节点
    if (oldVdom.type === REACT_TEXT) {
        let currentDOM = newVdom.dom = oldVdom.dom;
        //新的文本节点值改变才调用
        if (oldVdom.props.content !== newVdom.props.content)
            currentDOM.textContent = newVdom.props.content;
    }
    // 先更新属性
    else if (typeof oldVdom.type === 'string') { //说明是个原生组件 div h2 span
        let currentDOM = newVdom.dom = oldVdom.dom; //复用老的DOM
        updatedProps(currentDOM, oldVdom.props, newVdom.props) //更新自己的属性
        updateChild(currentDOM, oldVdom.props.children, newVdom.props.children) //更新子元素
    } else if (oldVdom.type === REACT_FRAGMENT) {
        document.createDocumentFragment();
    } else if (oldVdom.type && oldVdom.type.$$typeof === REACT_PROVIDER) {
        updateProviderComponent(oldVdom, newVdom);
    } else if (oldVdom.type && oldVdom.type.$$typeof === REACT_CONTEXT) {
        updateContextComponent(oldVdom, newVdom);
    } else if (oldVdom.type && oldVdom.type.$$typeof === REACT_MEMO) {
        updateMemoComponent(oldVdom, newVdom);
    } else if (typeof oldVdom.type === 'function') {
        if (oldVdom.type.isReactComponent) {
            newVdom.classInstance = oldVdom.classInstance;  //复用类的实例
            newVdom.renderVdom = oldVdom.renderVdom; // 上一次这个类组件的虚拟dom
            updateClassComponent(newVdom); //老的和新的都是类组件
        }
        else {
            newVdom.renderVdom = oldVdom.renderVdom
            updateFunctionComponent(newVdom); //老的和新的都是函数组件 
        }
    }
}
/**
 * 
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateProviderComponent(oldVdom, newVdom) {
    let parentDom = findDom(oldVdom).parentNode;
    let { type, props } = newVdom;
    type._context._currentValue = props.value
    let renderVdom = props.children
    newVdom.renderVdom = renderVdom
    compareVdom(parentDom, oldVdom.renderVdom, renderVdom)
}
/**
 * 
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateContextComponent(oldVdom, newVdom) {
    let parentDom = findDom(oldVdom).parentNode;
    let { type, props } = newVdom;
    let renderVdom = props.children(type._context._currentValue)
    newVdom.renderVdom = renderVdom
    compareVdom(parentDom, oldVdom.renderVdom, renderVdom)
}
/**
 * 
 * @param {*} newVdom 
 */
function updateFunctionComponent(newVdom) {
    let parentDom = findDom(newVdom).parentNode;
    let { renderVdom } = newVdom
    let { type, props } = newVdom;
    let newRenderVdom = type(props)
    compareVdom(parentDom, renderVdom, newRenderVdom)
    newVdom.renderVdom = newRenderVdom
}
/**
 * 老的和新的都是类组件,更新子类组件
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateClassComponent(newVdom) {
    let classInstance = newVdom.classInstance;
    //组件收到新的属性
    if (classInstance.componentWillReceiveProps) {
        classInstance.componentWillReceiveProps();
    }
    //触发组件更新，并将新的属性传回
    classInstance.updater.emitUpdate(newVdom.props)
}
/**
 * 
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateMemoComponent(oldVdom, newVdom) {
    let { props, type } = oldVdom
    let nextProps = newVdom.props
    if (type.compare(props, nextProps)) {
        newVdom.renderVdom = oldVdom.renderVdom
    } else {
        let parentDom = findDom(oldVdom).parentNode;
        let renderVdom = type.type(nextProps)
        newVdom.renderVdom = renderVdom
        compareVdom(parentDom, oldVdom.renderVdom, renderVdom)
    }
}
/**
 * 查找vdom对应的DOM
 * @param {*} vdom 
 */
function findDom(vdom) {
    let { type } = vdom;
    let dom;
    if (typeof type === 'string' || type === REACT_CONTEXT) {
        dom = vdom.dom
    } else {
        dom = findDom(vdom.renderVdom)
    }
    return dom
}
const ReactDOM = { render };
export default ReactDOM

