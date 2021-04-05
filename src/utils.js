
export const formatStyleToString = options => {
  return Object.entries(options).reduce((pre, [key, value]) => {
    const attrStr = key.replace(/([A-Z])/g, val => `-${val.toLowerCase()}`)
    const valueStr = typeof value === 'number' && ![
      'lineHeight',
      'opacity',
    ].includes(key) ? `${value}px` : value
    return `${pre}${attrStr}: ${valueStr};`
  }, '')
}

export const eventCenterQueue = {
  queue: [],
  push(id, callback) {
    this.queue.push({
      id,
      callback,
    })
  },
}
