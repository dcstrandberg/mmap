import ListItem from './list_item.js';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import React from 'react';


const ListBody = (props) => {
    // items of the form:
    /*
        {
            id: 0,
            children: 0,
            text: '',
            parent: 0, 
            children: [],

        }
    */
    const listItems = props.listItems.map((item, i) => {
        return (<ListItem 
            key={item.id}
            idx={i}
            id={item.id}
            level={item.level}  
            text={item.text}  
            parent={item.parent}  
            children={item.children}
            isFocused={item.isFocused}
            isSelected = {item.isSelected}
            // callback functions
            addTask={props.addTask}  
            inFocus={props.inFocus} 
            outFocus={props.outFocus}
            handleTextChange = {props.handleTextChange}
            handleBlur = {props.handleBlur}
            handleFocus = {props.handleFocus}
            indentTask={props.indentTask}
            unindentTask = {props.unindentTask}
            deleteTask = {props.deleteTask}

        />)
    });
    return (
        <DragDropContext onBeforeCapture={props.onBeforeCapture} onDragEnd={props.onDragEnd}>
        <Droppable droppableId="list">
            {(provided, snapshot) => (
                // ref is for DND 
                <div className='ListBody' ref={provided.innerRef} {...provided.droppableProps}>
                    {listItems}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
        </DragDropContext>
            
    
    );
}

export default ListBody;    
