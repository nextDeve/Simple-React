import React from './react';
import ReactDOM from './react-dom';



function Child({ data, hadleClick }) {
    console.log('Child render');
    return (
        <button onClick={hadleClick}>{data.count}</button>
    )
}
let MemoChild = React.memo(Child)

function App() {
    console.log('App render');
    const [name, setName] = React.useState('张山');
    const [count, setCount] = React.useState(0)
    let data = React.useMemo(() => ({ count }), [count])
    const hadleClick = React.useCallback(() => setCount(count + 1), [count])
    return (
        <div >
            <h1>{count}</h1>
            <input type='text' value={name} onChange={event => setName(event.target.value)}></input>
            <MemoChild data={data} hadleClick={hadleClick}></MemoChild>
        </div>
    )
}
ReactDOM.render(<App></App>, document.getElementById('root'));
