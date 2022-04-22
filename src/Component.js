import { compareVdom } from './react-dom';
export let updateQueue = {
    isBatchingUpdate: false, //当前是否处于批量更新模式，默认是false
    updaters: [],
    batchUpdate() {
        for (let updater of this.updaters) {
            updater.updateComponent()
        }
        this.updaters.length = []
        this.isBatchingUpdate = false
    }
}
class Updater {
    constructor(classInstance) {
        this.classInstance = classInstance; //类组件实例
        this.pendingStates = []; //等待生效的状态，可能是一个对象，也可能是一个函数
        this.callBacks = []; //等待调用的回调
    }
    getState() { //计算最新的状态
        let { classInstance, pendingStates } = this
        let { state } = classInstance
        pendingStates.forEach((nextState) => {
            //如果pendingState是一个函数，调用函数返回新状态
            if (typeof nextState === 'function') {
                nextState = nextState(state)
            }
            state = { ...state, ...nextState }
        })
        pendingStates.length = 0
        return state
    }
    updateComponent() {
        let { classInstance, pendingStates, nextProps, callBacks } = this
        //如果有等待更新的状态
        if (nextProps || pendingStates.length > 0) {
            let nextState = this.getState() //计算最新state
            this.shuoldUpdate(classInstance, nextProps, nextState, callBacks)
        }
    }
    addState(partialState, callBack) {
        this.pendingStates.push(partialState);
        if (typeof callBack === 'function') this.callBacks.push(callBack);
        this.emitUpdate()

    }
    //一个组件不管属性变了，还是状态变了，都会更新
    emitUpdate(nextProps) {
        this.nextProps = nextProps
        if (updateQueue.isBatchingUpdate) { //如果当前为批量模式，先缓存updater
            updateQueue.updaters.push(this); //本次setState调用结束
        }
        else {
            this.updateComponent();
        }
    }
    /**
     * 判断组件是否需要更新
     * @param {*} classInstance 组件实例
     * @param {*} nextState 新的状态
     */
    shuoldUpdate(classInstance, nextProps, nextState, callBacks) {
        if (nextProps) {
            classInstance.props = nextProps
        }
        let props = nextProps ? nextProps : classInstance.props
        //不管组件需不需要更新，组件的状态值都会改变
        // 如果有这个方法，并且这个方法返回值为false，则不需要继续向下更新了
        let shouldUpdate = true;
        this.getDerivedStateFromProps(classInstance, nextProps, nextState)
        if (!classInstance.shouldComponentUpdate) { }
        else if (classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(props, nextState)) {
            shouldUpdate = false;
        }
        if (shouldUpdate) {
            if (classInstance.componentWillUpdate) {
                classInstance.componentWillUpdate()
            }
            classInstance.state = nextState
            classInstance.froceUpdate();
        } else {
            classInstance.state = nextState
        }
        callBacks.forEach((callback) => callback())
        callBacks.length = 0
    }
    getDerivedStateFromProps(classInstance, nextProps, nextState) {
        let prevState = classInstance.state;
        let partialState;
        if (classInstance.constructor.getDerivedStateFromProps) {
            partialState = classInstance.constructor.getDerivedStateFromProps(nextProps, prevState)
        }
        if (partialState) Object.assign(nextState, partialState)
    }
}

export default class component {
    static isReactComponent = true
    constructor(props) {
        this.props = props
        this.state = {}
        this.updater = new Updater(this)
    }
    setState(partialState, callBack) {
        this.updater.addState(partialState, callBack)
    }
    froceUpdate() {
        let newVdom = this.render() //重新调用render方法，获取新的vdom
        // 深度比较新旧vdom
        let promise = new Promise((resolve) => {
            this.renderVdom = compareVdom(this.renderVdom.dom.parentNode, this.renderVdom, newVdom, undefined, resolve)
        })
        /* updateClassComponent(this, newVdom) */
        promise.then(() => {
            if (this.componentDidUpdate) {
                this.componentDidUpdate()
            }
        })
    }
    render() {
        throw new Error('此方法为抽象方法，需要子类实现！')
    }
}

/**
 * 更新dom
 * @param {*} classInstance  类组件实例
 * @param {*} newVdom  类组件状态改变后，调用render重新生成的vdom
 */
/* function updateClassComponent(classInstance, newVdom) {
    let oldDom = classInstance.dom;
    let newDom = createDOM(newVdom);
    oldDom.parentNode.replaceChild(newDom, oldDom);
    classInstance.dom = newDom;
} */