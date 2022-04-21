import { addEvent } from './event'
import { REACT_TEXT } from './constants'
/**
* 1.把vdom变成真实DOM
* 2.把vdom上的属性更新或同步到DOM上
* 3.把此虚拟DOM的子元素也都变成真实DOM挂载到自己的dom上，dom.appendChild
* 4.把自己挂载到容器上
* @param {*} vdom  要渲染的虚拟dom
* @param {*} container 虚拟dom容器
*/
function render(vdom, container) {
    if (vdom) {
        const dom = createDOM(vdom);
        container.appendChild(dom);
        dom.componentDidMount && dom.componentDidMount()
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
    let { type, props } = vdom;
    let dom;
    //vdom为函数组件
    if (type === REACT_TEXT) {
        dom = document.createTextNode(props.content)
    } else {
        if (typeof type === 'function') {
            if (type.isReactComponent) {
                return mountClassCoponent(vdom)
            }
            else {
                return mountFunctionComponent(vdom)
            }
        } else {//vdom为原生html组件
            dom = document.createElement(type);
        }
    }

    // 使用vdom的属性更新刚创建出来的DOM属性
    updatedProps(dom, {}, props);
    //在这儿处理props.children
    //子元素是一个文本节点
    if (typeof props.children === 'string' || typeof props.children === 'number') {
        dom.textContent = props.children;
        // 子元素是一个html节点
    } else if (typeof props.children === 'object' && props.children.type) {
        render(props.children, dom);
        // 子元素不止一个，是一个数组的情况
    } else if (Array.isArray(props.children)) {
        reconcileChildren(props.children, dom)
    } else {
        document.textContent = props.children ? props.children.content : '';
    }
    vdom.dom = dom
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
            let styleObj = newProps.style
            for (let attr in styleObj) {
                dom.style[attr] = styleObj[attr]
            }
        } else if (key.startsWith('on')) {
            addEvent(dom, key.toLowerCase(), newProps[key])
        }
        else {
            dom[key] = newProps[key]
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
        render(childrens[i], dom)
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
 * 挂载类组件
 * @param {*} vdom 
 */
function mountClassCoponent(vdom) {
    //结构类的定义和属性
    let { type: ClassComponent, props } = vdom;
    // 新建类实例
    let classInstance = new ClassComponent(props);
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
        dom.componentDidMount = classInstance.componentDidMount.bind(classInstance)
    }
    //挂载dom到实例上，为更新做准备
    /*     classInstance.dom = dom */
    renderVdom.dom = dom
    return dom
}
/**
 *对当前 组件进行DOM-DIFF
 * @param {*} dom 当前组件挂载父真实节点
 * @param {*} oldVdom  旧的vdom
 * @param {*} newVdom  新的vdom
 */
export function compareVdom(parentDom, oldVdom, newVdom, nextDom) {
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
        updateComponent(oldVdom, newVdom);
        return newVdom
    }
}

/**
 * 根据新的vdom和旧的vdom更新DOM
 * @param {*} currentDOM 
 * @param {*} oldChildren 
 * @param {*} newchildren 
 */
function updateChild(currentDOM, oldChildren, newchildren) {
    oldChildren = Array.isArray(oldChildren) ? oldChildren : [oldChildren];
    newchildren = Array.isArray(newchildren) ? newchildren : [newchildren];
    let maxLength = Math.max(oldChildren.length, newchildren.length)
    for (let i = 0; i < maxLength; i++) {
        if (!oldChildren[i]) {
            let nextVdom = oldChildren.find((item,index) => index > i && item && findDom(item))
            compareVdom(currentDOM, oldChildren[i], newchildren[i], nextVdom && findDom(nextVdom))
        }
        else
            compareVdom(currentDOM, oldChildren[i], newchildren[i])
    }
}

/**
 * 深度比较
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
function updateComponent(oldVdom, newVdom) {
    // 更新文本节点
    if (oldVdom.type === REACT_TEXT && newVdom.type === REACT_TEXT) {
        let currentDOM = newVdom.dom = oldVdom.dom;
        currentDOM.textContent = newVdom.props.content
    }
    // 先更新属性
    else if (typeof oldVdom.type === 'string') { //说明是个原生组件 div h2 span
        let currentDOM = newVdom.dom = oldVdom.dom; //复用老的DOM
        updatedProps(currentDOM, oldVdom.props, newVdom.props) //更新自己的属性
        updateChild(currentDOM, oldVdom.props.children, newVdom.props.children) //更新子元素
    }
    else if (typeof oldVdom.type === 'function') {
        if (oldVdom.type.isReactComponent) {
            newVdom.classInstance = oldVdom.classInstance  //复用类的实例
            newVdom.renderVdom = oldVdom.renderVdom // 上一次这个类组件的虚拟dom
            updateClassComponent(newVdom) //老的和新的都是类组件
        }
        else {
            newVdom.renderVdom = oldVdom.renderVdom
            updateFunctionComponent(newVdom) //老的和新的都是函数组件 
        }
    }
}
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
 * 查找vdom对应的DOM
 * @param {*} vdom 
 */
function findDom(vdom) {
    let { type } = vdom;
    let dom;
    if (typeof type === 'function') {
        dom = findDom(vdom.renderVdom)
    } else {
        dom = vdom.dom
    }
    return dom
}
const ReactDOM = { render };
export default ReactDOM

