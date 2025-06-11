import * as array from './array'

type Options = {
  aloneValueName?: string
}

const defaultOptions: Options = {
  aloneValueName: '_@attribute'
}

interface StackItem {
  obj: Record<string, any>
  tag: string
  start: number
}

const splitChar = [' ', '/', '"', '\'', '<', '>']

export default function xml2Json(xmlStr: string, options = defaultOptions) {
  // remove commented lines
  xmlStr = xmlStr.replace(/<!--[\s\S]*?-->/g, '')
  // replace special characters
  xmlStr = xmlStr.replace(/[\n\t\r]/g, '')
  // replace leading spaces and tabs between elements
  xmlStr = xmlStr.replace(/>[ \t]+</g, '><')
  // delete docType tags
  xmlStr = xmlStr.replace(/<\?[^>]*\?>/g, '')

  const stack: StackItem[] = []
  let pos = 0

  function addData(key: string, value: any) {
    const item = stack[stack.length - 1]

    if (!item) {
      return
    }

    if (key !== options.aloneValueName && item.obj[options.aloneValueName] != null) {
      item.obj[options.aloneValueName] = [item.obj[options.aloneValueName], {
        tagName: key,
        ...value
      }]
      return
    }
    if (item.obj[key] == null) {
      item.obj[key] = value
    }
    else if (Array.isArray(item.obj[key])) {
      item.obj[key].push(value)
    }
    else {
      item.obj[key] = [item.obj[key], value]
    }
  }

  function gotoToken(token: string) {
    while (pos < xmlStr.length) {
      if (xmlStr[pos] === token) {
        return true
      }
      pos++
    }
    return false
  }

  function readIdentity() {
    skipSpace()
    let key = ''
    while (pos < xmlStr.length) {
      if (array.has(splitChar, xmlStr[pos])) {
        break
      }
      key += xmlStr[pos]
      pos++
    }
    return key
  }

  function skipSpace() {
    while (pos < xmlStr.length) {
      if (!/\s|\r|\n/.test(xmlStr[pos])) {
        break
      }
      pos++
    }
  }

  const emptyEndReg = /\s/
  const singleQuotation = /'/
  const doubleQuotation = /"/

  function readAttrValue() {
    if (pos >= xmlStr.length) {
      return true
    }
    skipSpace()
    // 默认属性值结束符为空格
    let end = emptyEndReg
    if (xmlStr[pos] === '"' || xmlStr[pos] == '\'') {
      // 属性值是引号开始则结束符也是引号
      end = xmlStr[pos] === '"' ? doubleQuotation : singleQuotation
      pos++
    }
    let value = ''
    while (pos < xmlStr.length) {
      if (end.test(xmlStr[pos])) {
        pos++
        break
      }
      value += xmlStr[pos]
      pos++
    }
    return value
  }

  function readAttr() {
    while (true) {
      skipSpace()
      // 判断标签属性结束
      if (xmlStr[pos] === '>' || xmlStr[pos] === '/') {
        break
      }
      let key = readIdentity()
      if (!key) {
        break
      }
      if (key[key.length - 1] === '=') {
        key = key.substring(0, key.length - 1)
      }
      else {
        gotoToken('=')
        pos++
      }
      const value = readAttrValue()
      addData(key, value)
    }
  }

  // innerText 当前位置到 < 之前
  function readText() {
    skipSpace()
    let text = ''
    while (pos < xmlStr.length) {
      if (xmlStr[pos] === '<') {
        break
      }
      text += xmlStr[pos]
      pos++
    }
    return text
  }


  function pop() {
    // 处理 </> 跳出当前 tag
    // 若是 <xx 则是子标签，进入下一次处理 
    while (xmlStr[pos] === '<') {
      const now = pos
      pos++
      skipSpace()
      if (xmlStr[pos] === '/') {
        pos++
        const tag = readIdentity()
        if (tag === stack[stack.length - 1].tag) {
          if (stack.length > 1) {
            const item = stack.pop()
            addData(item.tag, item.obj)
          }
          gotoToken('>')
          pos++
          skipSpace()
        }
        else {
          stack.pop()
          gotoToken('>')
          pos++
          skipSpace()
        }
      }
      else {
        pos = now
        break
      }
    }
  }

  function readTag() {
    if (pos >= xmlStr.length) {
      return
    }

    let start = pos
    skipSpace()
    // innerText 的后面部分，中间被标签分割出现这种情况，将其加入 context 中
    if (xmlStr[pos] !== '<') {
      pos = start
      addData(options.aloneValueName, readText())
      pop()
      return readTag()
    }

    let has = gotoToken('<')
    if (!has) {
      return
    }

    start = pos
    pos++

    const tag = readIdentity()
    stack.push({
      obj: {},
      tag,
      start
    })

    readAttr()
    skipSpace()
    // 自闭合 tag
    if (xmlStr[pos] === '/') {
      pos++
      if (stack.length > 1) {
        const item = stack.pop()
        addData(item.tag, item.obj)
      }
      gotoToken('>')
      pos++
      pop()
      return readTag()
    }

    has = gotoToken('>')
    if (!has) {
      return
    }
    pos++

    skipSpace()
    // 检查有 innerText 内容
    if (xmlStr[pos] !== '<') {
      addData(options.aloneValueName, readText())
      skipSpace()
    }
    pop()
    readTag()
  }

  readTag()

  return {
    [stack[0].tag]: stack[0].obj
  }
}
