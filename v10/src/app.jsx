import React from '../core/react.js';


let count = 1
const Counter = ()=> {
  const handleClick = ()=>{
    console.log('click');
    count++;
    console.log('count',count);
    React.update()
  }

  return <div>count {count} <button onClick={handleClick}>click</button></div>
} 

const CounterContainer = ()=> <Counter ></Counter> 

const App = ()=>{
  return <div>
            mini hi
            <Counter  /> 
          </div> 
} 

export default App