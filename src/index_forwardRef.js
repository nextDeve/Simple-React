import React from './react';
import ReactDOM from './react-dom';


let ForwardedTextInput = React.forwardRef(TextInput)
class Ref extends React.Component {
    constructor(props) {
        super(props)
        this.state = { info: 'test' }
        this.infoRef = React.createRef()
    }
    changeInfo = () => {
        this.setState({ info: this.infoRef.current.value })
    }
    render() {
        return (
            <div>
                <h1>信息{this.state.info}</h1>
                <ForwardedTextInput ref={this.infoRef}></ForwardedTextInput>
                <button onClick={this.changeInfo}>修改信息</button>
            </div>
        )
    }
}
function TextInput(props, ref) {
    return <input ref={ref}></input>
}
ReactDOM.render(<Ref name='implementRef'></Ref>, document.getElementById('root'))