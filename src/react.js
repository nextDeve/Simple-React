import Component, { PureComponent } from './Component'
import { wrapToVdom, shallowEqual } from './utils'
import {
    REACT_FORWARD_REF_TYPE,
    REACT_FRAGMENT,
    REACT_CONTEXT,
    REACT_PROVIDER,
    REACT_MEMO
} from './constants'
import {
    useState,
    useMemo,
    useCallback,
    useReducer,
    useEffect
} from './react-dom'
/**
 * 
 * @param {*} type  元素类型
 * @param {*} config 配置对象
 * @param {*} children 子元素
 */
function createElement(type, config, children) {
    let ref, key;
    if (config) {
        delete config.__self;
        delete config.__source;
        ref = config.ref;
        delete config.ref;
        key = config.key;
        delete config.key;
    }
    let props = { ...config };

    if (arguments.length > 3)
        props.children = wrapToVdom(Array.prototype.slice.call(arguments, 2));
    else {
        props.children = wrapToVdom(children)
    }
    return {
        type,
        props,
        ref,
        key
    };
}


function createRef() {
    return { current: null }
}

function forwardRef(render) {
    return {
        $$typeof: REACT_FORWARD_REF_TYPE,
        render
    };
}

/* function createContext() {
    function Provider({ value, children }) {
        Provider._value = value
        return children[0]
    }
    function Consumer({ children }) {
        return children[0](Provider._value)
    }
    return { Provider, Consumer }
} */
/**
 * 根据老元素克隆新元素
 * @param {*} oldElement 
 * @param {*} newProps 
 * @param {*} children 
 */
function cloneElement(oldElement, newProps, children) {
    let props = { ...oldElement.props, ...newProps }
    if (arguments.length > 3)
        props.children = wrapToVdom(Array.prototype.slice.call(arguments, 2));
    else
        props.children = wrapToVdom(children)
    return {
        ...oldElement,
        props
    }
}
/**
 * 
 * @returns 
 */
function createContext() {
    let context = {
        $$typeof: REACT_CONTEXT
    }
    context.Provider = {
        $$typeof: REACT_PROVIDER,
        _context: context
    }
    context.Consumer = {
        $$typeof: REACT_CONTEXT,
        _context: context
    }
    return context
}
/**
 * 
 * @param {*} type 
 * @param {*} compare 
 * @returns 
 */
function memo(type, compare = shallowEqual) {
    return {
        $$typeof: REACT_MEMO,
        type,
        compare
    }
}
function useContext(context) {
    return context._currentValue
}
const React = {
    createElement,
    Component,
    createRef,
    forwardRef,
    Fragment: REACT_FRAGMENT,
    createContext,
    cloneElement,
    PureComponent,
    memo,
    useState,
    useMemo,
    useCallback,
    useReducer,
    useContext,
    useEffect
}
export default React
