import React from './react';
import ReactDOM from './react-dom';

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
    const [state, dispatch] = React.useReducer(reducer, { number: 0 })
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
ReactDOM.render(<Counter></Counter>, document.getElementById('root'));
