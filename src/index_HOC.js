import React from './react'
import ReactDOM from './react-dom';

const withLoading = (OldComponent) => {
    return class extends React.Component {
        constructor(props) {
            super(props)
            let loding = document.createElement('h1')
            loding.innerHTML = 'Loding'
            loding.id = 'Loding'
            this.LodingRef = React.createRef()
            this.state = { loding }
        }
        show = () => {
            this.LodingRef.current.appendChild(this.state.loding)
        }
        hide = () => {
            this.LodingRef.current.removeChild(this.state.loding)
        }
        render() {
            return <OldComponent {...this.props} Loding={this.LodingRef} show={this.show} hide={this.hide} />
        }
    }
}
@withLoading
class Panel extends React.Component {
    render() {
        return (
            <div>
                <div ref={this.props.Loding} >
                </div>
                <p>
                    <button onClick={this.props.show}>显示</button>
                    <button onClick={this.props.hide}>隐藏</button>
                </p>
            </div>
        )
    }
}
ReactDOM.render(<Panel />, document.getElementById('root'))
