import React from './react';
import ReactDOM from './react-dom';

class Ref extends React.Component {
    constructor(props) {
        super(props)
        this.state = { info: 'test' }
        this.infoRef = React.createRef()
    }
    changeInfo = () => {
        console.log(this.infoRef);
        this.setState({ info: this.infoRef.current.getInputInfo() })
    }
    render() {
        return (
            <div>
                <h1>信息{this.state.info}</h1>
                <TextInput ref={this.infoRef}></TextInput>
                <button onClick={this.changeInfo}>修改信息</button>
            </div>
        )
    }
}
class TextInput extends React.Component {
    constructor(props) {
        super(props)
        this.inputRef = React.createRef()
    }
    getInputInfo = () => {
        return this.inputRef.current.value
    }
    render() {
        return (
            <input ref={this.inputRef}></input>
        )
    }

}
ReactDOM.render(<Ref name='implementRef'></Ref>, document.getElementById('root'))