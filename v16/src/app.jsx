import React from '../core/react.js';



const Counter = () => {
  const [count,setCount] = React.useState(10)
  const [bar,setBar] = React.useState('bar')

  const handleClick = ()=>{
    setCount(v=> v+1)
    setBar('barbar')
  } 

  return <div>
            mini react
            <div>{count}</div>
            <div>{bar}</div>
            <button onClick={handleClick}>add</button>
        </div> 
}

const App = () => {
  return <Counter></Counter>
} 

export default App