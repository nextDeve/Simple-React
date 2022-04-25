import React from './react';
import ReactDOM from './react-dom';
//render props
function SubCount(props) {
    console.log('SubCount render');
    return (<div>{props.count}</div>)
}
let Memo = React.memo(SubCount)
class Counter extends React.Component {
    state = { count: 0 }
    inputRef = React.createRef()
    hadelonAdd = () => {
        let amount = Number(this.inputRef.current.value)
        this.setState({
            count: this.state.count + amount
        })
    }
    render() {
        console.log('Counter render');
        return (
            <div >
                <h1>{this.state.count}</h1>
                <Memo count={this.state.count} ></Memo>
                <input ref={this.inputRef} />
                <button onClick={this.hadelonAdd}>+</button>
            </div>
        )
    }
}

ReactDOM.render(<Counter></Counter>, document.getElementById('root'));
