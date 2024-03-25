
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
        return typeof child === 'string' ? createTextNode(child) : child
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

function updateProps(dom,work) {
      // 处理props
    Object.keys(work.props).forEach((key) => {
      if(key !== 'children'){
        dom[key] = work.props[key]
      }
    })
}

function initChild(fiber) {
  // 创建任务链表 设置好指针
  let prevChild = null
  const children = fiber.props.children
  children.forEach((child,index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    }
    if(index === 0){
      fiber.child = newFiber
    }else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
  })
}

function performWorkOfUnit(fiber) {

  if(!fiber.dom){
    const dom = (fiber.dom = createDom(fiber.type))

    // fiber.parent.dom.append(dom)

    updateProps(dom,fiber)
  }
  initChild(fiber)
  // 执行下一个任务
  if(fiber.child){
    return fiber.child
  }

  if(fiber.sibling){
    return fiber.sibling
  }

  return fiber.parent?.sibling
}

function commitRoot() {
  commitWork(root.child)
  root = null
}

function commitWork(fiber) {
  if(!fiber) return 
  fiber.parent.dom.append(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

let root = null
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

  // requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

const React = {
  createElement,
  render
}


export default React