import React from 'react';

const UnindentButton = (props) => {
    return (
        <span className='UnindentButton' onClick={() => props.unindentTask(props.idx)}>
            &lt;
        </span>
    )
}

export default UnindentButton;    
