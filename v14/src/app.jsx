import React from '../core/react.js';


let booCount = 1,fooCount = 1

const Foo = ()=>{
  console.log('Foo');
  const update = React.update()
  const fooClick = ()=> {
    fooCount++;
    update()
  }
  return <div>ff { fooCount } <button onClick={fooClick}>click</button></div>
} 

const Boo = ()=>{
  console.log('Boo');
  const update = React.update()
  const booClick = ()=> {
    booCount++;
    update()
  }
  return <div>bb { booCount } <button onClick={booClick}>click</button></div>
} 

const Counter = () => {
  console.log('Counter');
  return <div>
            mini react
            <Boo/>
            <Foo />
        </div> 
}

const App = () => {
  return <Counter></Counter>
} 

export default App