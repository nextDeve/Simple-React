import React from './react';
import ReactDOM from './react-dom';
let ThemeContext = React.createContext()
let { Provider, Consumer } = ThemeContext
class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state = { color: 'red' }
    }
    changeColor = (color) => {
        this.setState({ color })
    }
    render() {
        let value = { color: this.state.color, changeColor: this.changeColor }
        return (
            <Provider value={value}>
                <div style={{ margin: '10px', border: `5px solid ${this.state.color}`, padding: '5px', width: '250px' }}>
                    <Header></Header>
                    <Main></Main>
                    <Footer></Footer> 
                </div>
            </Provider>
        )
    }
}
class Header extends React.Component {
    static contextType = ThemeContext
    render() {
        return (
            <div style={{ margin: '10px', border: `5px solid ${this.context.color}`, padding: '5px' }}>
                头部
                <Title></Title>
            </div>
        )
    }
}
class Title extends React.Component {
    static contextType = ThemeContext
    render() {
        return (
            <div style={{ margin: '10px', border: `5px solid ${this.context.color}`, padding: '5px' }}>
                标题
            </div>
        )
    }
}
class Main extends React.Component {
    static contextType = ThemeContext
    render() {
        return (
            <div style={{ margin: '10px', border: `5px solid ${this.context.color}`, padding: '5px' }}>
                主体区
                <Content></Content>
            </div>
        )
    }
}
class Content extends React.Component {
    static contextType = ThemeContext
    render() {
        return (
            <div style={{ margin: '10px', border: `5px solid ${this.context.color}`, padding: '5px' }}>
                主体内容
                <button onClick={() => this.context.changeColor('red')}>变红</button>
                <button onClick={() => this.context.changeColor('green')}>变绿</button>
            </div>
        )
    }
}
function Footer() {
    return (
        <Consumer>
            {
                value =>
                    <div style={{ margin: '10px', border: `5px solid ${value.color}`, padding: '5px' }}>
                        页脚
                        <FooterInfo></FooterInfo>
                    </div>
            }
        </Consumer>
    )
}
function FooterInfo() {
    return (
        <Consumer>
            {
                value =>
                    <div style={{ margin: '10px', border: `5px solid ${value.color}`, padding: '5px' }}>
                        页脚内容
                    </div>
            }
        </Consumer>
    )
}
ReactDOM.render(<Page />, document.getElementById('root'));
