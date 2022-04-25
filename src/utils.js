import { REACT_TEXT } from './constants'
/**
 * 为了方便后面的DOM-DIFF，把文本节点进行单独的标识，全部包装成react元素的形式
 * @param {*} elements  
 * @returns 
 */
export function wrapToVdom(elements) {
    if (typeof elements === 'string' || typeof elements === 'number') {
        return { type: REACT_TEXT, props: { content: elements } }
    } else if (Array.isArray(elements)) {
        return elements.map((element) => {
            return (typeof element === 'string' || typeof element === 'number') ?
                { type: REACT_TEXT, props: { content: element } } : element
        })
    } else {
        return elements
    }
}
export function shallowEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;
    let keys1 = Object.keys(obj1)
    let keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) return false;
    for (let key1 of keys1) {
        if (!obj2.hasOwnProperty(key1) || obj2[key1] !== obj1[key1]) return false;
    }
    return true;
};
