import Component from './Component'
import { wrapToVdom } from './utils'
/**
 * 
 * @param {*} type  元素类型
 * @param {*} config 配置对象
 * @param {*} children 子元素
 */
function createElement(type, config, children) {
    let ref, key;
    if (config) {
        delete config.__self
        delete config.__source
        ref = config.ref
        delete config.ref
        key = config.key
        delete config.key
    }
    let props = { ...config }
    props.children = wrapToVdom(Array.prototype.slice.call(arguments, 2))
    return {
        type,
        props,
        ref,
        key
    }
}
const React = { createElement, Component }
export default React
