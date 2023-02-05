const IndentButton = (props) => {
    return (
        <span className='IndentButton' onClick={() => props.indentTask(props.idx)}>
            &gt;
        </span>
    )
}

export default IndentButton;    
