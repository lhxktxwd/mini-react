
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
  const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type);

  Object.keys(el.props).forEach((key) => {
    if(key !== 'children'){
      dom[key] = el.props[key]
    }
  })

  const children = el.props.children
  children.forEach(child => {
    render(child,dom)
  });

  container.append(dom)
}

const React = {
  createElement,
  render
}


export default React