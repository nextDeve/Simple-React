import React from './react';
import ReactDOM from './react-dom';
//render props
class MouseTraker extends React.Component {
    state = { x: 0, y: 0 }
    hadelonMouseMove = (event) => {
        this.setState({
            x: event.clientX,
            y: event.clientY
        })
    }
    render() {
        return (
            <div onMouseMove={this.hadelonMouseMove} style={{ width: '100%', height: '100%' }}>
                {this.props.children(this.state)}
            </div>
        )
    }
}

ReactDOM.render(<MouseTraker>
    {
        props => {
            return <div>
                <h1>移动鼠标</h1>
                <p>当前鼠标位置是x={props.x},y={props.y}</p>
            </div>
        }
    }
</MouseTraker>, document.getElementById('root'));
