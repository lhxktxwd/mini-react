import React from '../core/react.js';

let isFoo = true

const Counter = () => {
  const Foo = <div>foo</div>
  const Boo = <p>boo
    <div>child1</div>
    <div>child2</div>
  </p>

  const changeComponent = ()=> {
    isFoo = !isFoo
    React.update()
  } 

  return <div>
            <div>{isFoo ? Foo : Boo}</div>
            <button onClick={changeComponent}>changeComponent</button>
        </div> 
}

const App = () => {
  return <Counter></Counter>
} 

export default App