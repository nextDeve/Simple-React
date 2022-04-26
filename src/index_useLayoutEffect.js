import React from 'react';
import ReactDOM from 'react-dom';

const Animation = () => {
    //useEffect在绘制之后执行，useLayoutEffect在绘制之前执行
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
