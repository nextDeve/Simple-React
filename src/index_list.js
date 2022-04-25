import React from './react';
import ReactDOM from './react-dom';


class Ref extends React.Component {
    constructor(props) {
        super(props)
        this.state = { visible: true }
    }
    changeInfo = () => {
        this.setState({ visible: !this.state.visible })
    }
    render() {
        return (
            <div>
                <button onClick={this.changeInfo}>修改信息</button>
                {
                    this.state.visible ?
                        <ul>
                            <li key='A'>A</li>
                            <li key='B'>B</li>
                            <li key='C'>C</li>
                            <li key='D'>D</li>
                            <li key='E'>E</li>
                            <li key='F'>F</li>
                        </ul>
                        :
                        <ul>
                            <li key='A'>A</li>
                            <li key='C'>C</li>
                            <li key='E'>E</li>
                            <li key='B'>B</li>
                            <li key='G'>G</li>
                        </ul>
                }
            </div>
        )
    }
}

ReactDOM.render(<Ref name='implementDOMdiff'></Ref>, document.getElementById('root'))