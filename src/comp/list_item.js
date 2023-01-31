import LevelIndicator from './level_indicator.js';
import AddTaskAfterButton from './add_task_after_button.js';
import DragTaskButton from './drag_task_button.js';
import IndentButton from './indent_button.js';
import UnindentButton from './unindent_button.js';

const ListItem = (props) => {
    return (
        <div className='ListItem' >
            <LevelIndicator level={props.level}/>
            
            {/* <input type="text" className="ItemText" defaultValue={props.text}></input> */}
            <textarea className="ItemText" rows="1">{props.text}</textarea>
            
            <IndentButton />
            <UnindentButton />
            <AddTaskAfterButton />
            <DragTaskButton />
        </div>
    )
}

export default ListItem;    
