import React from './react';
import ReactDOM from './react-dom';


//逻辑复用，自定义hook，复用的是逻辑。而不是状态
function useConter(initialState) {
    let [number, setNumber] = React.useState(initialState);
    const handelClick = () => {
        setNumber(number + 1);
    }
    return [number, handelClick]
}

function Conter1(props, ref) {
    let [number, setNumber] = useConter(0);
    //函数组件中自定义暴露给父组件的ref对象

    return (
        <div>
            <h1>{number}</h1>
            <button onClick={setNumber}>+</button>
        </div>
    )
}

function Conter2(props, ref) {
    let [number, setNumber] = useConter(0);
    //函数组件中自定义暴露给父组件的ref对象
    return (
        <div>
            <h1>{number}</h1>
            <button onClick={setNumber}>+</button>
        </div>
    )
}

function Parent() {
    return (
        <div>
            <Conter1></Conter1>
            <Conter2 ></Conter2>
        </div>
    )
}


ReactDOM.render(<Parent></Parent>, document.getElementById('root'));
