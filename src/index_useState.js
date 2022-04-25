import React from './react';
import ReactDOM from './react-dom';

//render props
function Counter() {
    let [count, setCount] = React.useState(0)
    const hadelonAdd = () => {
        setCount(count + 1)
    }
    return (
        <div >
            <h1>{count}</h1>
            <button onClick={hadelonAdd}>+</button>
        </div>
    )
}
ReactDOM.render(<Counter></Counter>, document.getElementById('root'));
