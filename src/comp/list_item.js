import LevelIndicator from './level_indicator.js';
import AddTaskAfterButton from './add_task_after_button.js';
import DragTaskButton from './drag_task_button.js';
import IndentButton from './indent_button.js';
import UnindentButton from './unindent_button.js';
import DeleteButton from './delete_button.js';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import React from 'react';

const ListItem = (props) => {
    return (
        <Draggable key={props.id} draggableId={"Item #" + props.id} index={props.idx}>
            {provided => (
                <div className='ListItem'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <LevelIndicator level={props.level}/>
                    
                    <span className="ItemText" >Idx: {props.idx}, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ID: {props.id}, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Parent: {props.parent}, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Children: {props.children}</span>

                    {/*
                    {props.isFocused &&
                        <textarea 
                            className="ItemText" 
                            rows="1" 
                            defaultValue={props.text} 
                            autoFocus 
                            onFocus={(e) => props.handleFocus(e)}
                            onBlur={() => props.outFocus(props.idx)}
                            onChange={(e) => props.handleTextChange(e, props.idx)}
                            onKeyDown={(e) => props.handleBlur(e)}
                            ></textarea>
                        }
                        {!(props.isFocused) &&
                            <span 
                            className="ItemText" 
                            onClick={() => props.inFocus(props.idx)}
                        >
                        {props.text}
                        </span>
                    }
                    */}
                    
                    <UnindentButton idx={props.idx} unindentTask={props.unindentTask}/>
                    <IndentButton idx={props.idx} indentTask={props.indentTask}/>
                    <AddTaskAfterButton 
                        idx={props.idx}
                        id={props.id}
                        level={props.level}  
                        parent={props.parent}  
                        children={props.children}
                        addTask={props.addTask}
                    />
                    <DeleteButton idx={props.idx} deleteTask={props.deleteTask}/>
                    <DragTaskButton />
                    {/* Need to add a delete task button */}
                </div>
            )}
        </Draggable>
    );
}

export default ListItem;    
