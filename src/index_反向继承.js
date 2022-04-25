import React from './react'
import ReactDOM from './react-dom';

class AntDesignButton extends React.Component {
    state = { name: '张山' }
    componentWillMount() {
        console.log('AntDesignButton componentWillMount');
    }
    componentDidMount() {
        console.log('AntDesignButton componentDidMount');
    }
    render() {
        console.log('AntDesignButton render');
        return (
            <button name={this.state.name}>{this.props.title}</button>
        )
    }
}

const wrapper = OldComponent => {
    return class extends OldComponent {
        state = { ...this.state, number: 0 }
        componentWillMount() {
            console.log('wrapper componentWillMount');
            super.componentWillMount();
        }
        componentDidMount() {
            console.log('wrapper componentDidMount');
            super.componentDidMount();
        }
        handelClick = () => {
            this.setState({ number: this.state.number + 1 })
        }
        render() {
            console.log('wrapper render');
            let renderElement = super.render()
            console.log(renderElement);
            let newProps = {
                onClick: this.handelClick,
                ...this.props
            }
            let cloneElement = React.cloneElement(renderElement, newProps, this.state.number)
            console.log(cloneElement);
            return cloneElement
        }
    }
}
let WrappedAntDesignButton = wrapper(AntDesignButton)
ReactDOM.render(<WrappedAntDesignButton title="按钮标题" />, document.getElementById('root'))
