import ListItem from './list_item.js';

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
            key={i}
            idx={i}
            id={item.id}
            level={item.level}  
            text={item.text}  
            parent={item.parent}  
            children={item.children}
            isFocused={item.isFocused}
            addTask={props.addTask}  
            inFocus={props.inFocus} 
            outFocus={props.outFocus}
            handleTextChange = {props.handleTextChange}
            handleBlur = {props.handleBlur}
            handleFocus = {props.handleFocus}
            indentTask={props.indentTask}
            unindentTask = {props.unindentTask}


        />)
    });
    return (
        <div className='ListBody' >
            {listItems}
        </div>
    );
}

export default ListBody;    
