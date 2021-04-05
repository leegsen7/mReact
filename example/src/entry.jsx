import React from 'react'

const Home = props => {
  return (
    <div>
      <span>这是函数式组件：</span>
      {props.name}
    </div>
  )
}

class Hello extends React.Component {
  state = {
    value: '1234',
  }
  render() {
    return (
      <div>
        <div style={{ marginTop: 10 }}>
          <span>这是输入框：</span>
          <input
            type="text"
            value={this.state.value}
            maxLength={7}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <span>这是props渲染：</span>
          {this.props.name}
        </div>
        <Home name={'Lee'} />
        <div style={{ marginTop: 10 }}>
          <span>这是按钮测试：</span>
          <button
            onClick={function (e) {
              console.log('click test')
              console.log(e)
              console.log(this)
            }}
          >点击
          </button>
        </div>
      </div>
    )
  }
}

const App = (
  <div style={{ border: '1px solid red' }}>
    哈哈，我是一个简单的文本
    <span>你说什么呢，我在span标签内</span>
    <div>我在div内</div>
    <Hello name={'leegsen'} />
    <Home name={'jack'} />
  </div>
)

React.render(App, document.getElementById('app'))
