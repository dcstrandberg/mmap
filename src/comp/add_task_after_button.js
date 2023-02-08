import React from 'react';

const AddTaskAfterButton = (props) => {
    return (
        <span className='AddTaskAfterButton' onClick={() => props.addTask(props.idx, props.id, props.level, props.parent, (props.children.length > 0))}>
            +
        </span>
    )
}

export default AddTaskAfterButton;    
