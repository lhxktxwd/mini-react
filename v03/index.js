let taskId = 0
function workLoop(deadline) {
  taskId++

  let shouldYeild = false

  
  while (!shouldYeild) {
    
    console.log(`taskid:${taskId}`);

    shouldYeild = deadline.timeRemaining() < 1
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)