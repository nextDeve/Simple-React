import React from './react';
import ReactDOM from './react-dom';
let GrandFatherContext = React.createContext()
let FatherContext = React.createContext()
class GrandFather extends React.Component {
    render() {
        let grandFatherValue = { name: 'GrandFatherContext' }
        return (
            <GrandFatherContext.Provider value={grandFatherValue}>
                <div style={{ margin: '10px', border: `5px solid red`, padding: '5px', width: '400px' }}>
                    <Father></Father>
                </div>
            </GrandFatherContext.Provider>
        )
    }
}
class Father extends React.Component {
    render() {
        let fatherValue = { name: 'fatherValue' }
        return (
            <FatherContext.Provider value={fatherValue}>
                <div style={{ margin: '10px', border: `5px solid red`, padding: '5px' }}>
                    <Son></Son>
                </div>
            </FatherContext.Provider>
        )
    }
}

class Son extends React.Component {
    render() {
        return (
            <GrandFatherContext.Consumer >
                {
                    grandFatherValue => {
                        return (
                            <FatherContext.Consumer>
                                {
                                    fatherValue => {
                                        return <div>
                                            <p>GrandFather Name:{grandFatherValue.name}</p>
                                            <p>Father Name:{fatherValue.name}</p>
                                        </div>
                                    }
                                }
                            </FatherContext.Consumer>
                        )
                    }
                }
            </GrandFatherContext.Consumer>
        )
    }
}
ReactDOM.render(<GrandFather />, document.getElementById('root'));
