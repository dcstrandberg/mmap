import logo from './logo.svg';
import './App.css';
import TaskList from './comp/task_list.js';
import { useState } from 'react';

function App() {
    
  // Eventually this will be provided by the server
  const listItems = [...Array(5).keys()].map((x) => {
    return {
      id: x,
      level: x,
      text: 'Item #' + x,
      parent: (x > 0) ? x - 1 : x, 
      children: (x < 4) ? [x + 1, ] : [],
    }
  });
//   const listItems = [
//     {
//       id: 0,
//       level: 0,
//       text: 'First Item',
//     parent: 0, 
//     children: [1, ],
//   },
//     {
//       id: 1,
//       level: 1,
//     text: 'Second Item',
//     parent: 0, 
//     children: [2, ],
//   },
//   {
//     id: 2,
//     level: 2,
//     text: 'Third Item',
//     parent: 1, 
//     children: [],
//   },
// ];

// State stuff that will eventually be replaced by Reducer code
const [state, setState] = useState(listItems);
 
// Also need to define all the functions that interact with the itemlist? 
  // const 


  return (
    <div className="App">
      {/* <header className="App-header"> */}
        <TaskList listItems={listItems}/>
      {/* </header> */}
    </div>
  );
}

export default App;
