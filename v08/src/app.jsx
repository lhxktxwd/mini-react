import React from '../core/react.js';

const handleClick = ()=>{
  console.log('click');
}


const Counter = ({num})=> <div>count {num} <button onClick={handleClick}>click</button></div>

const CounterContainer = ()=> <Counter num={10}></Counter> 

const App = ()=>{
  return <div>
            mini hi
            <Counter num={10} /> 
          </div> 
} 

export default App