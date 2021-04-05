import {
  formatStyleToString,
} from './utils'

class ReactBaseComponent {
  constructor(vDom) {
    this._vDom = vDom
    this._rootId = vDom._rootId
  }
}

// 处理文本
class ReactTextComponent extends ReactBaseComponent {
  constructor(vDom) {
    super(vDom)
  }
  // 渲染
  mountComponent() {
    return this._vDom
  }

  // 更新
  updateComponent() {}
}
// 处理原生元素
class ReactDomComponent extends ReactBaseComponent {
  constructor(vDom) {
    super(vDom)
  }
  handlePropsValue(key, value) {
    if (key === 'className') {
      return `class="${value}"`
    }
    if (key === 'style') {
      if (Object.prototype.toString.call(value) === '[object Object]') {
        return `style="${formatStyleToString(value)}"`
      }
      return ''
    }
    return `${key}="${value}"`
  }
  // 渲染
  mountComponent(instance) {
    const {
      type,
      props,
      props: { children },
    } = this._vDom
    let propsStr = ` data-reactid=${this._rootId}`
    let content = ''
    for (const propKey in props) {
      // 事件处理
      if (/^on[A-Za-z]/.test(propKey)) {
        const eventType = propKey.replace('on', '').toLowerCase()
        document.addEventListener(eventType, e => {
          if (e.target.dataset && Number(e.target.dataset.reactid) === this._rootId) {
            props[propKey].call(instance, e.target)
          }
        })
      }
      else if (props[propKey] && propKey !== 'children') {
        const appendStr = this.handlePropsValue(propKey, props[propKey])
        if (appendStr) {
          propsStr += ` ${appendStr}`
        }
      }
    }
    children.forEach((item) => {
      const childComponent = instantiateReactComponent(item)
      // 得到子节点的渲染内容
      const childMarkup = childComponent.mountComponent(instance)
      content += childMarkup
    })
    return `<${type}${propsStr}>${content}</${type}>`
  }

  // 更新
  updateComponent() {}
}
// 处理组件
class ReactCompositeComponent extends ReactBaseComponent {
  constructor(vDom) {
    super(vDom)
  }
  // 渲染
  mountComponent() {
    const {
      type,
      props,
      props: { children },
    } = this._vDom
    // class组件
    if (type.prototype && type.prototype.isReactComponent) {
      const instance = new type(props)
      const vDom = instance.render()
      return instantiateReactComponent(vDom).mountComponent(instance)
    }
    // 函数式组件
    return instantiateReactComponent(type(props)).mountComponent()
  }

  // 更新
  updateComponent() {}
}

export const instantiateReactComponent = function (vDom) {
  // 文本节点的情况
  if (typeof vDom === 'string' || typeof vDom === 'number') {
    return new ReactTextComponent(vDom)
  }

  // 浏览器默认节点的情况
  if (typeof vDom === 'object' && typeof vDom.type === 'string') {
    return new ReactDomComponent(vDom)
  }

  // 自定义的元素节点
  if (typeof vDom === 'object' && typeof vDom.type === 'function') {
    return new ReactCompositeComponent(vDom)
  }
}

export default function (vDom, container) {
  const componentInstance = instantiateReactComponent(vDom)
  const markup = componentInstance.mountComponent()
  container.innerHTML = markup
}
