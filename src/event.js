import { updateQueue } from './Component'
/**
 * 给DOM添加时间处理函数
 * 为什么要这么做？合成事件？为什么要做事件委托或者事件代理
 * 1.做兼容处理 兼容不同浏览器 不同浏览器的event是不一样的
 * 2.可以在你写的事件处理函数之前和之后做一些事情
 * 比如：之前 updateQueue.isBatchingUpdate=true 之后 updateQueue.batchUpdate()
 * @param dom  DOM
 * @param eventType  事件类型
 * @param listener  监听函数
 */
export function addEvent(dom, eventType, listener) {
    let store = dom.store || (dom.store = {}); //将store对象挂载到绑定事件的DOM上
    store[eventType] = listener; //store.onclick=handelClick
    if (!document[eventType]) {
        //事件委托,不管给哪一个DOM元素绑定事件，最后都统一代理到document上去
        document[eventType] = dispatchEvent; //document.onclick = dispatchEvent
    }
};

/**syntheticEvent作用：兼容处理，提高性能
 * 合成事件里
 * 首先是批量更新模式，也就是在异步任务中是批量更新的
 * 当异步任务结束时（setState执行完毕），异步任务的回调会被一一执行
 * 在同步任务中（setTimeout、Promiss）,此时已不再是批量更新，每次调用setState都会成功！
 */
let syntheticEvent = {
    stoping: false,
    stop() {
        this.stoping = true
        console.log("阻止冒泡");
    }
}
function dispatchEvent(event) {
    let { target, type } = event; //target事件源，具体的DOM节点，type事件类型，比如click，change
    let eventType = `on${type}`;
    updateQueue.isBatchingUpdate = true //设置批量更新模式
    createSyntheticEvent(event)
    while (target) {
        let { store } = target;
        // 只冒泡到最近的父元素
        let listener = store && store[eventType];
        /*syntheticEvent.stop 在listener被第一次调用之后才会改变stoping的值，
        也就是说一定会触发一个eventType事件之后(即自己或最近父元素的eventType事件)才会停止冒泡*/
        listener && listener.call(target, syntheticEvent);
        
        if (syntheticEvent.stoping) {
            syntheticEvent.stoping = false
            break;
        }
        target = target.parentNode;
    }
    updateQueue.batchUpdate()
}

function createSyntheticEvent(nativeEvent) {
    for (let key in nativeEvent) {
        syntheticEvent[key] = nativeEvent[key]
    }
}