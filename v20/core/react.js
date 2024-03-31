
/**
 * dom object
 * {
 *  type:'div',
 *  props:{
 *    id:'app'
 *    children:[]
 *  },
 * }
 */

// 创建文本节点对象
function createTextNode(text) {
  return {
    type:'TEXT_ELEMENT',
    props:{
      nodeValue:text,
      children:[]
    }
  }
  
}


// 创建元素节点对象
function createElement(type,props,...children) {
  return {
    type,
    props:{
      ...props,
      children:children.map((child) => {
        const isTextNode = typeof child === 'string' || typeof child === 'number'
        return isTextNode ? createTextNode(child) : child
      })
    }
  }
}

// 根据节点对象渲染为真实dom 
function render(el,container){
  wipRoot = {
    dom:container,
    props:{
      children: [el]
    }
  }
  nextWorkOfUnit = wipRoot
}

function createDom(type){
  // 创建dom
    return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type);
}

function updateProps(dom,nextProps,prevProps) {
    // 1. old 有, new 没 删除
    Object.keys(prevProps).forEach((key) => {
      if(key !== 'children'){
        if(!(key in nextProps)){
          dom.removeAttribute(key)
        }
      }
    })
    // 2. new 有 old 没 新增
    // 3. new 有 old 有 更新
    Object.keys(nextProps).forEach((key) => {
      if(key !== 'children'){
        if(nextProps[key] !== prevProps[key]){
          if(key.startsWith('on')){
            const eventType = key.slice(2).toLowerCase()
            // 每次动态生成dom组件都重新绑定事件，需要先删除之前绑定的事件
            dom.removeEventListener(eventType,prevProps[key])
            dom.addEventListener(eventType,nextProps[key])
          }else{
            dom[key] = nextProps[key]
          }
        }
      }
    })
}

function reconcileChild(fiber,children) {
  let oldFiber = fiber.alternate?.child
  // 创建任务链表 设置好指针
  let prevChild = null
  children.forEach((child,index) => {
    const isSameType = oldFiber && oldFiber.type === child.type
    let newFiber;
    if(isSameType){
      // update
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: 'update'
      }
    }else{
      if(child){
        // new 
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: 'placement'
        }
      }
      if(oldFiber)
        deletions.push(oldFiber)
    }

    if(oldFiber){
      oldFiber = oldFiber.sibling
    }

    if(index === 0){
      fiber.child = newFiber
    }else {
        prevChild.sibling = newFiber
    }
    if(newFiber)
      prevChild = newFiber
  })
  while (oldFiber) {
    deletions.push(oldFiber)
    oldFiber = oldFiber.sibling
  }
}


function updateFunctionComponet(fiber) {
  stateHooks = []
  stateHookIndex = 0
  effectHooks = []
  // wipFiber 开始节点
  wipFiber = fiber
  // React.update的关键点 因为children是动态生成的，所以可以修改后的children
  const children = [fiber.type(fiber.props)]
  reconcileChild(fiber,children)
}

function updateHostComponent(fiber){
  if(!fiber.dom){
    const dom = (fiber.dom = createDom(fiber.type))
    updateProps(dom,fiber.props,{})
  }
  const children =  fiber.props.children
  reconcileChild(fiber,children)
}

function performWorkOfUnit(fiber) {
  const isFuncComponent = typeof fiber.type === 'function'
  if(isFuncComponent){
    updateFunctionComponet(fiber)
  }else{
    updateHostComponent(fiber)
  }

  // 执行下一个任务
  if(fiber.child){
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if(nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}

function commitDeletion(fiber) {
  if(fiber.dom){
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent
    }
    fiberParent.dom.removeChild(fiber.dom)
  }else{
    commitDeletion(fiber.child)
  }
}

function commitRoot() {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child)
  commitEffectHook()
  wipRoot = null
  deletions = []
}

function commitEffectHook() {

  function run(fiber) {
    if(!fiber) return
    
    if(!fiber.alternate){
      fiber.effectHooks?.forEach((effectHook) => {
        effectHook.cleanup = effectHook.callback()
      })
    }else{
      fiber.alternate.effectHooks?.forEach((oldHook,hIndex) => {
        const effectHook = fiber.effectHooks[hIndex]
        const needUpdate = oldHook?.deps.some((dep,dIndex) => {
          return !dep !== effectHook.deps[dIndex]
        })
        needUpdate && (effectHook.cleanup = effectHook.callback())
      })
    }
    
    run(fiber.child)
    run(fiber.sibling)
  }

  function cleanupRun(fiber) {
    if(!fiber) return 

    fiber.alternate?.effectHooks?.forEach((effectHook) => {
      if(effectHook.deps.length > 0)
        effectHook.cleanup && effectHook.cleanup()
    })
    cleanupRun(fiber.child)
    cleanupRun(fiber.sibling)
  }

  cleanupRun(wipRoot)
  run(wipRoot)
}

function commitWork(fiber) {
  if(!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  if(fiber.effectTag === 'update'){
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  }else if(fiber.effectTag === 'placement'){
    if(fiber.dom)
      fiberParent.dom.append(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

// work in progress
let wipRoot = null
let wipFiber = null
let nextWorkOfUnit = null
let deletions = []
function workLoop(deadline) {

  let shouldYeild = false
  
  while (!shouldYeild && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
    // wipFiber 结束节点
    if(wipRoot?.sibling?.type === nextWorkOfUnit?.type){
      nextWorkOfUnit = undefined
    }
    shouldYeild = deadline.timeRemaining() < 1
  }

  // 上面执行完后会给nextWorkOfUnit赋值为undefined然后再执行下面的方法来进行统一渲染真实dom，记得执行完后给root设为null，不然会循环执行，此方法只需要执行一次
  if(wipRoot && !nextWorkOfUnit){
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

// function update(){
//   let currentFiber = wipFiber
//   return () => {
//     console.log('currentFiber',currentFiber);
//     wipRoot = {
//       // dom: currentRoot.dom,
//       // props: currentRoot.props,
//       // alternate: currentRoot
//       ...currentFiber,
//       alternate: currentFiber
//     }
//     nextWorkOfUnit = wipRoot
//   }
// }

let stateHooks, stateHookIndex; 
function useState(initial) {
  let currentFiber = wipFiber
  const oldStateHook = currentFiber?.alternate?.stateHooks[stateHookIndex]
  const stateHook = {
    state:oldStateHook ? oldStateHook.state : initial,
    queue: oldStateHook ? oldStateHook.queue : []
  }

  stateHook.queue.forEach((action) => {
    stateHook.state = action(stateHook.state)
  })

  stateHook.queue = []
  
  stateHooks.push(stateHook)
  stateHookIndex ++
  currentFiber.stateHooks = stateHooks
  const setState = (action)=> {
    console.log('action',action);
    const eagerstate = typeof action === 'function' ? action(stateHook.state) : action
    if(eagerstate === stateHook.state) return

    stateHook.queue.push(typeof action === 'function' ? action : ()=> action)
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }
    nextWorkOfUnit = wipRoot
  }
  return [stateHook.state,setState]
}

let effectHooks;
function useEffect(callback,deps) {
  const effectHook = {
    callback,
    deps,
    cleanup: null
  }

  effectHooks.push(effectHook)

  wipFiber.effectHooks = effectHooks
}


const React = {
  createElement,
  useState,
  useEffect,
  render
}


export default React