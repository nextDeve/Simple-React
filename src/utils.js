import { REACT_TEXT } from './constants'
/**
 * 为了方便后面的DOM-DIFF，把文本节点进行单独的标识，全部包装成react元素的形式
 * @param {*} elements  
 * @returns 
 */
export function wrapToVdom(elements) {
    if (typeof elements === 'string' || typeof elements === 'number') {
        return { type: REACT_TEXT, props: { content: elements } }
    }
    if (elements !== undefined) {
        return elements.map((element) => {
            return (typeof element === 'string' || typeof element === 'number') ?
                { type: REACT_TEXT, props: { content: element } } : element
        })
    }
    else return elements
}