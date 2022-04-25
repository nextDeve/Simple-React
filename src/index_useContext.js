import React from './react';
import ReactDOM from './react-dom';

let CounterContext = React.createContext()

function reducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { number: state.number + action.data };
        case 'DECREMENT':
            return { number: state.number - action.data };
        default:
            return state
    }
}

function Counter() {
    const { state, dispatch } = React.useContext(CounterContext)
    const handelChange = (type) => {
        switch (type) {
            case 'INCREMENT':
                dispatch({ type, data: 1 })
                break
            case 'DECREMENT':
                dispatch({ type, data: 1 })
                break
            default:
                return;
        }
    }
    return (
        <div>
            <h1>{state.number}</h1>
            <p>
                <button onClick={() => handelChange('INCREMENT')}>+</button>
            </p>
            <p>
                <button onClick={() => handelChange('DECREMENT')}>-</button>
            </p>
        </div>

    )
}
function APP() {
    const [state, dispatch] = React.useReducer(reducer, { number: 0 })
    return (
        <CounterContext.Provider value={{ state, dispatch }}>
            <Counter></Counter>
        </CounterContext.Provider>
    )
}
ReactDOM.render(<APP></APP>, document.getElementById('root'));
