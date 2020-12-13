
class VDom {
  constructor(type, key, props) {
    this.type = type
    this.key = key
    this.props = props
  }
}

const createElement = function (type, props, ...children) {
  const newProps = {}
  props = props || {}
  const { key = null } = props

  for (let propName in props) {
    if (propName !== 'key' && config.hasOwnProperty(propName)) {
      newProps[propName] = props[propName]
    }
  }

  if (children.length === 1) {
    props.children = children[0]
  } else {
    props.children = children
  }

  return new VDom(type, key, props)
}

export default createElement
