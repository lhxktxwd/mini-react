
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
  nexrWorkOfUnit = {
    dom:container,
    props:{
      children: [el]
    }
  }
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

    fiber.parent.dom.append(dom)

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

let nexrWorkOfUnit = null
function workLoop(deadline) {

  let shouldYeild = false
  
  while (!shouldYeild && nexrWorkOfUnit) {
    nexrWorkOfUnit = performWorkOfUnit(nexrWorkOfUnit)
    
    shouldYeild = deadline.timeRemaining() < 1
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

const React = {
  createElement,
  render
}


export default React