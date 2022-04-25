import React from 'react';
import ReactDOM from 'react-dom';

const Animation = () => {
    const ref = React.useRef();
    React.useLayoutEffect(()=>{
        ref.current.style.WebkitTransform = 'translate(500px)';
        ref.current.style.transition = 'all 500ms';
    },[])
    let style = {
        width: '100px',
        height: '100px',
        backgroundColor: 'red'
    }
    return <div style={style} ref={ref}></div>
}

ReactDOM.render(<Animation></Animation>, document.getElementById('root'));
