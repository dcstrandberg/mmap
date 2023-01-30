import logo from './logo.svg';
import './App.css';
import TaskList from './comp/task_list.js';

function App() {
  
  // Eventually this will be provided by the server
  const listItems = [
    {
    id: 0,
    level: 0,
    text: 'First Item',
    parent: 0, 
    children: [1, ],
    },
    {
    id: 1,
    level: 1,
    text: 'Second Item',
    parent: 0, 
    children: [2, ],
    },
    {
    id: 2,
    level: 2,
    text: 'Third Item',
    parent: 1, 
    children: [],
    },
  ]

  // Also need to define all the functions that interact with the itemlist? Is that true? 
  // Or mabye the server should handle that

  return (
    <div className="App">
      <header className="App-header">
        <TaskList listItems={listItems}/>
      </header>
    </div>
  );
}

export default App;
