import LevelIndicator from './level_indicator.js';
import AddTaskAfterButton from './add_task_after_button.js';
import DragTaskButton from './drag_task_button.js';
import IndentButton from './indent_button.js';
import UnindentButton from './unindent_button.js';

const ListItem = (props) => {
    return (
        <div className='ListItem' >
            <LevelIndicator level={props.level}/>
            
            <span className="ItemText">{props.text}</span>
            
            <AddTaskAfterButton />
            <DragTaskButton />
            <IndentButton />
            <UnindentButton />
        </div>
    )
}

export default ListItem;    
