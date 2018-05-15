# React笔记

> ## 生命周期

- 组件DOM渲染周期

-> constructor()

-> componentWillMount()

-> render()

// 然后构造 DOM 元素插入页面

-> componentDidMount()

// ...

// 即将从页面中删除

-> componentWillUnmount()

// 从页面中删除

- 组件的更新渲染周期

-> shouldComponentUpdate(nextProps, nextState)：控制组件是否重新渲染

如果返回 false 组件就不会重新渲染。这个生命周期在 React.js 性能优化上非常有用。

-> componentWillReceiveProps(nextProps)：组件从父组件接收到新的 props 之前调用。

-> componentWillUpdate()：组件开始重新渲染之前调用。

-> componentDidUpdate()：组件重新渲染并且把更改变更到真实的 DOM 以后调用


> ## ref

```javascript
class AutoFocusInput extends Component {
  componentDidMount () {
    this.input.focus()
  }

  render () {
    return (
      <input ref={(input) => this.input = input} />
    )
  }
}

ReactDOM.render(
  <AutoFocusInput />,
  document.getElementById('root')
)
// 此时input的dom节点就被存放在this.input属性下
```

> ## props.children

```javascript
class Card extends Component {
  render () {
    return (
      <div className='card'>
        <div className='card-content'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Card>
    <h2>React.js 小书</h2>
    <div>开源、免费、专业、简单</div>
    订阅：<input />
  </Card>,
  document.getElementById('root')
)
// 此时 props.children 是一个存放解析jsx之后的js对象的数组

```

> ## dangerouslySetHTML 和 style 属性

因为react默认会将html的格式转义，为了直接能插入dom，需要使用`dangerouslySetHTML`

```javascript
class Editor extends Component {
  constructor() {
    super()
    this.state = {
      content: '<h1>React.js 小书</h1>'
    }
  }

  render () {
    return (
      <div 
        className='editor-wrapper' 
        dangerouslySetInnerHTML={{__html: this.state.content}}>
      </div>
    )
  }
}
// 相当于innerHtml
```

> ## props.type

```javascript
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Comment extends Component {
  static propTypes = {
    comment: PropTypes.object
  }

  render () {
    const { comment } = this.props
    return (
      <div className='comment'>
        <div className='comment-user'>
          <span>{comment.username} </span>：
        </div>
        <p>{comment.content}</p>
      </div>
    )
  }
}
```

> ## 高阶组件

就是一个函数，传给他一个组件，返回一个新的组件。