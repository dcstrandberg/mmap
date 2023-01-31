// import './App.css';
import Header from './header.js';
import ListBody from './list_body.js';
import AddTaskButton from './add_task_button.js';
import AddTaskModal from './add_task_modal.js';

const TaskList = (props) => {
    // props of the form:
    return (
        <div className='TaskList' >
            <Header />
            <ListBody listItems={props.listItems}/>
            {/* <AddTaskButton /> */}
            {/* <AddTaskModal /> */}
        </div>
    );
}

export default TaskList;    
