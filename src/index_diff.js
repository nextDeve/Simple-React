import React from './react';
import ReactDOM from './react-dom';
class Counter extends React.Component { // 他会比较两个状态相等就不会刷新视图 PureComponent是浅比较
    constructor(props) {
        super(props);
        this.state = { number: 0 }
    }
    handleClick = () => {
        this.setState({ number: this.state.number + 1 });
    };
    render() {
        console.log(this.state.number);
        return (
            <div>
                <h1>{this.state.number}</h1>
                {this.state.number === 4 ? null : <ChildCounter count={this.state.number} />}
                <button onClick={this.handleClick}>+</button>
            </div>
        )
    }
}
class ChildCounter extends React.Component {
    render() {
        return <p>{this.props.count}</p>
    }
}
ReactDOM.render(<Counter />, document.getElementById('root'));
