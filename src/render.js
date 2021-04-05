
class ReactBaseComponent {
  constructor(vDom) {
    this._vDom = vDom
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
    return `${key}="${value}"`
  }
  // 渲染
  mountComponent() {
    const {
      type,
      props,
      props: { children },
    } = this._vDom
    let propsStr = ''
    let content = ''
    for (const propKey in props) {
      if (props[propKey] && propKey !== 'children' && !/^on[A-Za-z]/.test(propKey)) {
        propsStr += ` ${this.handlePropsValue(propKey, props[propKey])}`
      }
    }
    children.forEach((item) => {
      const childComponent = instantiateReactComponent(item)
      // 得到子节点的渲染内容
      const childMarkup = childComponent.mountComponent()
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
      return instantiateReactComponent(vDom).mountComponent()
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
