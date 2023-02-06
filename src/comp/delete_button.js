const DeleteButton = (props) => {
    return (
        <span 
            className='DeleteButton' 
            onClick={() => props.deleteTask(props.idx)}
        >x</span>
    )
}

export default DeleteButton;    
