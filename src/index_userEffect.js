import React from './react';
import ReactDOM from './react-dom';

function APP() {
    const [count, setCount] = React.useState(0)
    React.useEffect(() => {
        console.log("开启一个定时器", count);
        let timer = setTimeout(() => {
            console.log("执行定时器", count);
            setCount(count + 1)
        }, 1000)
        return () => {
            console.log('关闭一个定时器', count);
            clearInterval(timer)
        }
    }, [count])
    return (
        <div>
            <h1>{count}</h1>
            <button onClick={() => { setCount(count + 1) }}>{count}</button>
        </div>
    )
}
ReactDOM.render(<APP></APP>, document.getElementById('root'));
