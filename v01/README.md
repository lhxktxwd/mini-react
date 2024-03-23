# lesson 1

### 学到了什么
 本节课学习了React ` createElement /createTextNode/createRoot/ render ` 4个api的实现

### 问题

1. react将一个个元素先保存为元素对象再通过render来更新有什么好处？
2. 目前的实现有什么问题？

### 解答

1. 可以统一管理元素的渲染实现最优渲染，优化性能（后期课程vdom中应该有解答）
2. 需要通过createElement来创建元素非常麻烦、而且不直观（下节课将会通过jsx来解决这个问题）

#### 这节课重点

- react是如何通过元素对象来渲染页面的

```js 
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
````