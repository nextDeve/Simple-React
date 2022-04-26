import React from './react';
import ReactDOM from './react-dom';

function Child(props, ref) {
    let childRef = React.useRef();
    //函数组件中自定义暴露给父组件的ref对象
    React.useImperativeHandle(ref, () => ({
        focus() {
            childRef.current.focus()
        }
    }))
    return <input ref={childRef}></input>
}

let ForwardChild = React.forwardRef(Child)

function Parent() {
    let [number, setNumber] = React.useState(0);
    let inputRef = React.useRef();
    const getFocus = () => {
        inputRef.current.focus();
    }
    return (
        <div>
            <ForwardChild ref={inputRef}></ForwardChild>
            <button onClick={getFocus}>获得焦点</button>
        </div>
    )
}


ReactDOM.render(<Parent></Parent>, document.getElementById('root'));
