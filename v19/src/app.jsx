import React from '../core/react.js';



const Counter = () => {
  const [count,setCount] = React.useState(10)
  // const [bar,setBar] = React.useState('bar')
  console.log('fun init');
  const handleClick = ()=>{
    setCount(v=> v+1)
    // setBar('bar')
  } 
  React.useEffect(()=>{
    console.log('update');
    return ()=>{
      console.log('cleanup');
    }
  },[count])

  React.useEffect(()=>{
    console.log('update2');
    return ()=>{
      console.log('cleanup2');
    }
  },[])
  return <div>
            mini react
            <div>{count}</div>
            {/* <div>{bar}</div> */}
            <button onClick={handleClick}>add</button>
        </div> 
}

const App = () => {
  return <Counter></Counter>
} 

export default App