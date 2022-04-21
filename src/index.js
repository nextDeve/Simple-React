import React from './react';
import ReactDOM from './react-dom';

/* let element1 = (
  <div className='title' style={{ color: 'red' }}>
    <span style={{ color: 'blue' }}>hello</span>
    world
    <p style={{ color: 'orange' }}>test!</p>
  </div>
) */

/* function Welcom(props) {
  return (
    <div className='title' style={{ color: 'red' }}>
      <span style={{ color: 'blue' }}>{props.name},</span>
      {props.children}
    </div>
  )
} */
function FunctionChild(props) {
  return (
    <div id='FunctionChild'>FunctionChild:{props.count}</div>
  )
}
class Count extends React.Component {
  static deaultProps = {
    name: '计数器'
  }
  constructor(props) {
    super(props)
    this.state = { count: 0 }
    console.log('constructor');
  }
  componentWillMount() {
    console.log('componentWillMount');
  }
  componentDidMount() {
    console.log('componentDidMount');
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('shuoldComponentUpdate', this.state.count);
    return nextState.count % 2 === 0 ? true : false
  }
  componentWillUpdate() {
    console.log('componentWillUpdate', this.state.count);
  }
  componentDidUpdate() {
    console.log('componentDidUpdate', this.state.count);
  }
  handelClick = (event) => {
    this.setState({ count: this.state.count + 1 })
  }
  render() {
    console.log('render');
    return (
      <div id={this.state.count}>
        <h1>Class:{this.state.count}</h1>
        {
          this.state.count % 2 === 0 ? null : <ChildCount count={this.state.count}></ChildCount>
        }
        <ChildCount count={this.state.count + 2}></ChildCount>
        <FunctionChild count={this.state.count + 3}></FunctionChild>
        <button onClick={this.handelClick}><span>++</span></button>
      </div>
    )
  }
}
class ChildCount extends React.Component {
  componentWillUnmount() {
    console.log('ChildCount componentWillUnmount');
  }
  componentWillMount() {
    console.log('ChildCount componentWillMount');
  }
  componentDidMount() {
    console.log('ChildCount componentDidMount');
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('ChildCount shuoldComponentUpdate');
    return true
  }
  componentWillUpdate() {
    console.log('ChildCount componentWillUpdate');
  }
  componentDidUpdate() {
    console.log('ChildCount componentDidUpdate');
  }
  componentWillReceiveProps(newProps) {
    console.log('ChildCount componentWillReceiveProps');
  }
  render() {
    console.log('ChildCount render');
    return (
      <div id='child'>
        ChildCount:{this.props.count}
      </div>
    )
  }
}

/* ReactDOM.render(
  <Welcom name='zpc'>
    <span>welcom!</span>
  </Welcom>
  , document.getElementById('root')) */
ReactDOM.render(<Count name='count'></Count>, document.getElementById('root'))
/* ReactDOM.render(element1, document.getElementById('root')) */

