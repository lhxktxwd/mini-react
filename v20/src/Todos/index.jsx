import React from '../../core/react';


function Todos() {
  const [inputValue,setInputValue] = React.useState('')
  const [todos,setTodos] = React.useState([
    {
      title:'haha',
      id:crypto.randomUUID(),
      status:'active'
    },
    {
      title:'heihei',
      id:crypto.randomUUID(),
      status:'done'
    }
  ])

  function addTodo(todo) {
    setTodos([...todos,todo])
  }

  function handleAdd(){
    addTodo({title:inputValue,id:crypto.randomUUID()})
    setInputValue('')
  }


  function handeRemove(id){
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  function handleDone(id){
    setTodos(todos.map((todo) => {
      return {
        ...todo,
        status: todo.id === id ? 'done': todo.status
      }
    }))
  }

  function TodoItem({todo}) {

    return <li className={todo.status}>
              { todo.title }
              <button onClick={()=>handeRemove(todo.id)}>remove</button>
              <button onClick={()=>handleDone(todo.id)}>done</button>
            </li> 
  }

  return <div>
          <h1>Todos</h1>
          <div>
            <input type="text" value={inputValue} onChange={(e)=>setInputValue(e.target.value)} />
            <button onClick={handleAdd}>add</button>
          </div>
          <ul>
            {...todos.map((todo) => {
              return <TodoItem todo={todo} />
            })}
          </ul>
        </div>
  
}


export default Todos