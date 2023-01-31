import logo from './logo.svg';
import './App.css';
import TaskList from './comp/task_list.js';
import { useState } from 'react';

function App() {
    
  // Eventually this will be provided by the server
  const initList = [...Array(5).keys()].map((x) => {
    return {
      id: x,
      level: x,
      text: 'Item #' + x,
      parent: x - 1, 
      children: (x < 4) ? [x + 1, ] : [],
    }
  });

  const initNextID = 5;

  // State stuff that will eventually be replaced by Reducer code
  const [nextID, setNextID] = useState(initNextID);
  const [listItems, setListItems] = useState(initList);
  
  /*
  Alright, I need to figure out the exact behavior I want out of new task
  1) Adding task below when all are same level is pretty easy
  1.1) Gets added at same level with same parents and no children
  2) Adding a task from a task that is child to another task
  2.1) Gets added as child, needs to have parent designated
  3) Adding a task from a task that already has children
  3.1) I think it also gets added as a child to that task -- at same level as children

  */

  // Also need to define all the functions that interact with the itemlist? 
  const incrementTaskID = (currentID) => {
    const newID = currentID++
    setNextID(newID);
    return newID;
  }
  
  const addTaskBelow = (taskID, taskLevel, taskParent, hasChildren) => {
    console.log("In the callback")
    // Let's deal with the two cases of adding a task: 
    // 1) Task above has no children -- new task has same parent, same level as creator task 
    // 2) Task above has children already -- new task has creator task as parent, one level higher than parent
    const newLevel = hasChildren ? taskLevel + 1 : taskLevel;
    const newParent = hasChildren ? taskID : taskParent;
    const newID = nextID;
    // Question: Is it bad practice to just pull directly from the state for nextID, or should I pass it as props all the way down

    const newTask = {
      id: newID,
      level: newLevel,
      text: 'New Task...',
      parent: newParent, 
      children: [],
    };

    setListItems(listItems => listItems.concat([newTask]));
    
    const incrementedID = incrementTaskID(newID);

    return incrementedID;
  }


  return (
    <div className="App">
        <TaskList listItems={listItems} addTask={addTaskBelow}/>
    </div>
  );
}

export default App;
