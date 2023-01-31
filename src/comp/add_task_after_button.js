const AddTaskAfterButton = (props) => {
    return (
        <span className='AddTaskAfterButton' onClick={() => props.addTask(props.id, props.level, props.parent, (props.children.length > 0))}>
            +
        </span>
    )
}

export default AddTaskAfterButton;    
