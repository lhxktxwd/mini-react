
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
  nextWorkOfUnit = {
    dom:container,
    props:{
      children: [el]
    }
  }
  root = nextWorkOfUnit
}

function createDom(type){
  // 创建dom
    return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type);
}

function updateProps(dom,nextProps,prevProps) {
    // 1. old 有, new 没 删除
    Object.keys(prevProps).forEach((key) => {
      if(key !== 'children'){
        if(!nextProps[key]){
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
            const eventType = key.slice(2).toLocaleLowerCase()
            dom.addEventListener(eventType,nextProps[key])
          }else{
            dom[key] = nextProps[key]
          }
        }
      }
    })
}

function initChild(fiber,children) {
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

    if(oldFiber){
      oldFiber = oldFiber.sibling
    }

    if(index === 0){
      fiber.child = newFiber
    }else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
  })
}


function updateFunctionComponet(fiber) {
  const children = [fiber.type(fiber.props)]
  initChild(fiber,children)
}

function updateHostComponent(fiber){
  if(!fiber.dom){
    const dom = (fiber.dom = createDom(fiber.type))
    updateProps(dom,fiber.props,{})
  }
  const children =  fiber.props.children
  initChild(fiber,children)
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

function commitRoot() {
  commitWork(root.child)
  currentRoot = root
  root = null
}

function commitWork(fiber) {
  if(!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  if(fiber.effectTag === 'update'){
    updateProps(fiber.dom,fiber.props,fiber.alternate?.props)
  }else if(fiber.effectTag === 'placement'){
    if(fiber.dom)
      fiberParent.dom.append(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

let root = null
let currentRoot = null
let nextWorkOfUnit = null
function workLoop(deadline) {

  let shouldYeild = false
  
  while (!shouldYeild && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
    
    shouldYeild = deadline.timeRemaining() < 1
  }

  // 上面执行完后会给nextWorkOfUnit赋值为undefined然后再执行下面的方法来进行统一渲染真实dom，记得执行完后给root设为null，不然会循环执行，此方法只需要执行一次
  if(root && !nextWorkOfUnit){
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function update(){
  nextWorkOfUnit = {
    dom: currentRoot,
    props: currentRoot.props,
    alternate: currentRoot
  }
  root = nextWorkOfUnit
}
const React = {
  createElement,
  update,
  render
}


export default React