// TODO: Add undo feature

import React from 'react';
import './App.css';
import TaskList from './comp/task_list.js';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Set the max # of bullets an item can have (deepest the mind map can go):
const MAXLEVEL = 10;


function App() {
    
  // Eventually this will be provided by the server
  const initList = [...Array(5).keys()].map((x) => {
    return {
      id: x,
      level: x,
      text: 'Item #' + x,
      parent: x - 1, 
      children: (x < 4) ? [x + 1, ] : [],
      isFocused: false,
      isSelected: false,
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
    const newID = currentID += 1;
    setNextID(newID);
    return newID;
  }
  
  const addTaskBelow = (taskIdx, taskID, taskLevel, taskParent, hasChildren) => {

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
      isFocused: false,
      isSelected: false,
    };

    const newItems = [...listItems];
    newItems.splice(taskIdx + 1, 0, newTask)

    // Need to add the new task the the appropriate parent
    const parentIdx = getIndex(newParent, newItems);

    newItems[parentIdx].children = newItems[parentIdx].children.concat(newID).slice();

    setListItems(newItems);
    
    const incrementedID = incrementTaskID(newID);

    return incrementedID;
  }


  /***TEXT AREA CALLBACKS********************************************************************* */
  const inFocus = (idx) => {
    const newList = listItems.map((x, i) => {
      if (i === idx) {
        x.isFocused = true;
      }
      return x;
    }); 
    
    setListItems(newList);
    return idx;
  }
  

  const outFocus = (idx) => {
    const newList = listItems.map((x, i) => {
      // Just setting all isFocused to false, to prevent mulitple from having focus
      x.isFocused = false;
      return x;
    }); 
    
    setListItems(newList);
    return idx;
  }
  
  
  const handleTextChange = (event, idx) => {
    const newText = event.target.value;
    
    const newList = listItems.map((x, i) => {
      if (i === idx) {
        x.text = newText;
      }
      return x;
    }); 
    

    setListItems(newList);
    return newText;
  }
  
  
  const handleBlur = (event) => {
    if (event.keyCode === 13) {
      event.target.blur(); 
    }
    return event.target.value;
  }
  
  
  const handleFocus = (event) => {
    var val = event.target.value;
    event.target.value = '';
      event.target.value = val;
    return val;
  }
  
  /***HELPER FUNCTIONS**********************************************************************/
  // Takes in an item ID, a copy of the state object/list, and returns the index of that item
  const getIndex = (id, stateCopy) => {
    let idx = -1;
    
    const dummy = stateCopy.map((x, i) => {
      if (x.id === id) {
        idx = i;
      }
    });

    return idx;
  }
  

  // Takes an item index and finds the parents' index
  const findParentIndex = (idx, stateCopy) => {
    // const idx = getIndex(id);

    return getIndex(stateCopy[idx].parent, stateCopy);
  }
  
  
  // Returns a list of the indexes of any children of an item with the given index
  const findChildrenIndices = (idx, stateCopy) => {
    // const idx = getIndex(id);
    const childIDs = stateCopy[idx].children;
    const childIndices = childIDs.map((x) => getIndex(x, stateCopy));
    
    return childIndices;
  }
  
  
  // We need some sort of recursive function to traverse the tree so all children items get unindented - indented
  // Takes an item index, a copy of the state object / list, a callback function, and list of parameters and applies it to every child/grandchild/etc.
  // Returns modified state object / list
  const mapChildren = (idx, stateCopy, f, paramList = []) => {
    // First get the list of the current children and apply the function to it
    let childrenIndices = findChildrenIndices(idx, stateCopy);
    let returnArray = [];
    
    
    for (let i = 0; i < childrenIndices.length; i++){
      // apply the function to each child
      returnArray.push( f(stateCopy[childrenIndices[i]], ...paramList) );
      
      // Now for the recursive bit
      // Check to see if that child has any children
      if (stateCopy[childrenIndices[i]].children.length > 0) {
        returnArray.concat( mapChildren(childrenIndices[i], stateCopy, f, paramList) );
      }
    }


    return returnArray;
  }


  // Function to calc the depth of the list
  // Takes a state object and returns the level of the deepest object
  const getListDepth = (stateCopy) => {
    // Atually I don't think I need this -- this seems trivial
    return Math.max(stateCopy.map((x) => x.level));
  }


  // Function to find the nearest higher-up item that is a level lower than the current item -- to be used for assigning new parents when indenting / unindenting
  const findNewParent = (idx, stateCopy) => {
    const itemLevel = stateCopy[idx].level;

    for (let i = 1; i < idx + 1; i++) {
      if(stateCopy[idx - i].level < itemLevel) {
        return (idx - i); // stateCopy[idx - i].id;
      }
    }

  }


  // Function to find the children that a task should have (will be used primarily when unindeting grants new children)
  const findNewChildren = (idx, stateCopy) => {
    const itemLevel = stateCopy[idx].level;

    let childIndexList = [];

    // We also want to limit the list to direct children (not grandchildren)
    // So we need to determine the previous parents of the lowest level children...
    // let previousParent = [];

    
    // begin at the index and check each task until the level is equal to the item's
    for (let i = idx + 1; i < stateCopy.length; i++) {
      // If the item is not a child, then stop looking
      if (stateCopy[i].level <= itemLevel) {
        break;
      }
      
      // If it's the first iteration of the loop, check to see who the parent is
      // if (i === idx + 1) {
      //   previousParent = stateCopy[i].parent;
      // }

      // And if the child shares that parent, add it to the array
      // if (stateCopy[i].parent === previousParent) {
        childIndexList.push(i);
      // }
    }

    return childIndexList;
  }


  ////////// getDescendants()
  // Function to traverse all descendants -- Takes an item index and a stateCopy and returns list of IDs
  const getDescendants = (idx, stateCopy) => {
    // Define the function we'll pass to mapChildren
    const returnID = (child) => {
      return child.id;
    };

    return mapChildren(idx, stateCopy, returnID);
  }
  
  /***TASK LIST MANIPULATION CALLBACKS**********************************************************************/

  ////////// handleListClick()
  // Changes styling for items that are currently being clicked + dragged (since multi-select will be a thing)
  // const handleListClick = (event, idx, snapshot) => {
  //   snapshot.isDragging;
    

  // }

  const onBeforeCapture = (start) => {
    const draggableId = start.draggableId;
    let newList = [...listItems];
    const idx = getIndex(parseInt(draggableId), newList);
    
    
    newList[idx].isSelected = true;

    setListItems( newList );
    return;

  }


  ////////// reorderList()
  // Functions to help with reordering
  const reorderList = (stateCopy, startIndex, endIndex) => {
    const result = Array.from(stateCopy);
    const itemID = result[startIndex].id;

    // Logic to this to adjust parents, children, and levels
    // First we find the new parent
    const newParentIndex = findNewParent(endIndex, result);
    const newParentID = result[newParentIndex].id;

    // As well as the old parent
    const oldParentID = result[startIndex].parent;
    const oldParentIndex = getIndex(oldParentID, result);
    
    // Adjust the item's parent entry
    result[startIndex].parent = newParentID;

    // Then we add the item to the children of the new parent
    // First check to make sure the child isn't already in the parent's children
    if (result[newParentIndex].children.indexOf(itemID) === -1) {
      result[newParentIndex].children = result[newParentIndex].children.concat(itemID).slice();
    }

    // Remove it from children of the old parent
    if(result[oldParentIndex].children.indexOf(itemID) >= 0) {
      let newChildList = result[oldParentIndex].children;
      newChildList.splice( result[oldParentIndex].children.indexOf(itemID), 1 );

      result[oldParentIndex].children = newChildList.slice();  
    }

    // Figure out how many elements we need to shift (the item + all its descendants)
    const descendants = getDescendants(startIndex, result);
    const numDescendants = descendants.length;
    
    // And adjust levels as needed -- the item will be 1 level more indented than its new parent
    const levelDiff = (result[newParentIndex].level + 1) - result[startIndex].level;
    result[startIndex].level += levelDiff;
    mapChildren(startIndex, result, (x) => x.level += levelDiff);
    
    
    
    // Need to add logic to see if it's a task with children and include them in the drag....
    
    // And finally, perform the transposition of the item + descendants to new index
    const removed = result.splice(startIndex, numDescendants + 1);
    // console.log(...removed.map((x) => x.id));
    result.splice(endIndex, 0, ...removed);

    return result;
  };
  
  
  ////////// onDragEnd()
  // Functions to help with reordering
  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const newList = reorderList(
      listItems,
      result.source.index,
      result.destination.index
    );

    // Now set all listitems to be unselected
    newList.map(x => x.isSelected = false);

    setListItems( newList );
  }
  
  ////////// indentTask()
  // Takes the index of an item and increments its level, increments all children's levels, and sets parent as immediately above item
  const indentTask = (idx) => {
    
    // First get the ID of the current Item-of-Interest
    const id = listItems[idx].id
    
    // Get the indices of the parent 
    const parentIndex = findParentIndex(idx, listItems);
    

    // Things that need to be done: 
    // 1) Item-of-interest needs to have level changed
    // 2) IoI needs to have parent changed to nearest neighbor
    // 3) Parent needs to remove IoI from child list
    // 4) New parent needs to have IoI added to child list
    // 5) Children need to have their level incremented
        
    // 1)  Item-of-interest needs to have level changed
    // 2) IoI needs to have parent changed to nearest neighbor
    // --- We do both of these while generating the list we'll eventually use to set the new state
    let newList = [...listItems];
    const newLevel = Math.min(MAXLEVEL, newList[idx].level + 1);
    newList[idx].level = newLevel;
    
    // Now set the new parent 
    if (idx > 0) {
      newList[idx].parent = newList[findNewParent(idx, newList)].id; // newList[idx-1].id;
    }
    
    // 3) Parent needs to remove IoI from child list -- assuming it's got a parent
    if (parentIndex >= 0) {
      let parentsChildren = newList[parentIndex].children.slice();
      const removeIdx = parentsChildren.indexOf(id);
      parentsChildren.splice(removeIdx, 1);
      
      newList[parentIndex].children = parentsChildren;
    }
    
    // 4) New parent needs to have IoI added to child list
    // Need the slice() method here to change the array's reference in order to force a re-render
    if (idx > 0){
      const newChildList = newList[findNewParent(idx, newList)].children.concat(id).slice();
      newList[findNewParent(idx, newList)].children = newChildList;
    }
    
    // 5) Children need to have their level updated
    const increment = (x) => x.level += 1;
    mapChildren(idx, newList, increment);
    // newList = mapChildren(idx, newList, increment);
    
    setListItems(newList);
    return newLevel;
  }
  
  ////////// unindentTask()
  // Takes the index of an item and decrements its level, decrements all children's levels, and makes grandparent the new parent
  const unindentTask = (idx) => {
    
    // Have this in case you're already at the lowest depth
    if (listItems[idx].level === 0) {
      return;
    }
    
    // First get the ID of the current Item-of-Interest
    const id = listItems[idx].id
    
    // Get the indices of the parent 
    const parentIndex = findParentIndex(idx, listItems);
    const newParentIndex = findParentIndex(parentIndex, listItems);
    
    // Things that need to be done: 
    // 1) Item-of-interest needs to have level changed
    // 2) IoI needs to have parent changed to original grandparent
    // 3) Parent needs to remove IoI from child list
    // 4) New parent needs to have IoI added to child list
    // 5) Children need to have their level decremented
    // 6) THIS IS ONLY APPLICABLE TO UNINDENTS - Check to see if you've picked up any new children
    
    // 1)  Item-of-interest needs to have level changed
    // 2) IoI needs to have parent changed to original grandparent
    // --- We do both of these while generating the list we'll eventually use to set the new state
    let newList = [...listItems];
    const newLevel = Math.max(0, newList[idx].level - 1);
    newList[idx].level = newLevel;
    
    // Now set the new parent 
    // And anything about reassigning parent, etc. only needs to be done if the existing parent is now the same level (or higher) than the item
    // So let's check that
    const needsNewParent = ( newList[parentIndex].level >= newLevel);
    if (idx > 0 && needsNewParent) {
      newList[idx].parent = newList[parentIndex].parent;
    }
    
    // 3) Parent needs to remove IoI from child list -- assuming it's got a parent
    // And anything about reassigning parent, etc. only needs to be done if the existing parent is now the same level (or higher) than the item
    if (parentIndex >= 0 && needsNewParent) {
      let parentsChildren = newList[parentIndex].children.slice();
      const removeIdx = parentsChildren.indexOf(id);
      parentsChildren.splice(removeIdx, 1);
      
      newList[parentIndex].children = parentsChildren;
    }
    
    // 4) New parent needs to have IoI added to child list
    // And anything about reassigning parent, etc. only needs to be done if the existing parent is now the same level (or higher) than the item
    if (newParentIndex >= 0 && needsNewParent){
      newList[newParentIndex].children = newList[newParentIndex].children.concat(id).slice();
    }
  
    // 5) Children need to have their level updated
    // newList = mapChildren(idx, newList, (x) => x.level -= 1);
    mapChildren(idx, newList, (x) => x.level -= 1);
    
    // We also need to deal with finding children that get absorbed and 1) Remove them from the old parent and 2) Add them to the New Parent, and 3) Modify their parent
  
    // 6) THIS IS ONLY APPLICABLE TO UNINDENTS - Check to see if you've picked up any new children and add them to new task/remove them from old task
    // So we need to :
    // a. check to see if the item below (or group of items) has higher level BEFORE an item that's at <= level
    // b. IF SO, make their parent the item
    // c. remove them from the child list of the old parent
    // d. add them to the child list of the item
    // if (idx + 1 < newList.length) {
      if ((idx + 1 < newList.length ) && (newList[idx + 1].level > newList[idx].level)) {
        const childIndexList = findNewChildren(idx, newList);
        console.log("New Children: " + childIndexList);
        const childIDList = childIndexList.map((x) => newList[x].id);
        
        // Children might have different previous parents, so this needs to be a list
        const previousParentList = childIndexList.map((x) => getIndex(newList[x].parent, newList));
        
        // Set the item to be the parent of the children
        childIndexList.map((x) => {
          newList[x].parent = newList[idx].id;
        });
        
        // Now remove the children from the old parent's children list
        // Need to loop through each previous parent -- may be a smarter way to do this....
        let tempChildren = [];

        for (let j = 0; j < previousParentList.length; j++) {
          
          tempChildren = newList[previousParentList[j]].children;
          
          childIDList.map((id) => {
            // Check whether the child is in the previousParent's children list
            const tempIdx = tempChildren.findIndex((x) => x === id);
            if (tempIdx >= 0) {
              // If it is, cut it out
              tempChildren.splice(tempIdx, 1);
            }
          });
          
          // Need the slice() method here to change the array's reference in order to force a re-render
          newList[previousParentList[j]].children = tempChildren.slice();

        }

        // And finally, add them to the children list of the item
        newList[idx].children = newList[idx].children.concat(childIDList);      
      }
    // }
    
    setListItems(newList);
    return newLevel;
  }


  ////////// deleteTask()
  // Takes the index of a task and deletes it from the state object
  const deleteTask = (taskIdx) => {
 
    let newList = [...listItems];

    // Get the task ID
    const id = newList[taskIdx].id;
    
    // Need to remove the task from the appropriate parent
    const parentIndex = findParentIndex(taskIdx, newList);
    let parentsChildren = newList[parentIndex].children.slice();
    const removeIdx = parentsChildren.indexOf(id);
    parentsChildren.splice(removeIdx, 1);
    // newList[parentIndex].children = parentsChildren;

    // Add item's children to item's parent's children list
    const childrenList = newList[taskIdx].children;
    newList[parentIndex].children = parentsChildren.concat(childrenList).slice();
    
    // Iterate through children and alter parent
    
    childrenList.map((x) => {
      console.log("Children: " + x);
      newList[getIndex(x, newList)].parent = newList[parentIndex].id;
    })

    // And now bump down the level of all descendants
    // newList = mapChildren(taskIdx, newList, (x) => x.level -= 1);
    mapChildren(taskIdx, newList, (x) => x.level -= 1);

    // And remove the task last -- because otherwise we don't know what's going on 
    const removedTask = newList.splice(taskIdx, 1);
    
    setListItems(newList);
    
    return removedTask;
    
  }
  
  return (
    <div className="App">
        <TaskList 
          listItems={listItems} 
          addTask={addTaskBelow} 
          inFocus={inFocus} 
          outFocus={outFocus}
          handleTextChange = {handleTextChange}
          handleBlur = {handleBlur}
          handleFocus = {handleFocus}
          indentTask={indentTask}
          unindentTask = {unindentTask}
          deleteTask = {deleteTask}
          onDragEnd = {onDragEnd}
          onBeforeCapture = {onBeforeCapture}
        />
    </div>
  );
}

export default App;
