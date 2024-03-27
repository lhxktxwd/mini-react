import React from '../core/react.js';


const Counter = ({num})=> <div>count {num}</div>

const CounterContainer = ()=> <Counter num={10}></Counter> 

const App = ()=>{
    return <div>
              mini hi
              <Counter num={10} /> 
            </div> 
} 

export default App