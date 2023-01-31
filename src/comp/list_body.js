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
    const listItems = props.listItems.map((item, i) =>    
        <ListItem 
            key={i}
            id={item.id}
            level={item.level}  
            text={item.text}  
            parent={item.parent}  
            children={item.children}
            addTask={props.addTask}  
        />  
    );
    return (
        <div className='ListBody' >
            {listItems}
        </div>
    );
}

export default ListBody;    
