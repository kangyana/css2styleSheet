type StrFunc = (str: string) => string
type ArrFunc = (str: string) => string[]
type BooFunc = (str: string) => boolean
type ObjFunc = (arr: string[]) => object[]
type Functor = (x: string | string[]) => any

// 短横线转小驼峰
const line2Hump: StrFunc = str => {
  let result = ""
  let arr = str
    .split("-")
    .map((v, i) => (i > 0 ? v.slice(0, 1).toUpperCase() + v.slice(1) : v))
  result = arr.join("")
  return result
}
// 是否为纯数字
const isNumber: BooFunc = str => {
  let result = false
  const reg = /^\d+$/
  if (reg.test(str)) {
    result = true
  }
  return result
}
// 去除空格
const trim: StrFunc = str => {
  let result = ""
  result = str.replace(/(^\s+)|(\s+$)/g, "")
  result = result.replace(/\s/g, "")
  return result
}
// 分组
const split: ArrFunc = str => {
  let result: string[] = []
  result = str.split("}")
  result = result.map(v => v + "}")
  result = result.slice(0, result.length - 1)
  return result
}
// 转对象
const toObject: ObjFunc = arr => {
  let result: any[] = []
  result = arr.map(v => {
    let key =
      v
        .match(/..*{/)[0]
        .replace(/./, "")
        .replace(/{/, "") || 0

    const value = v
      .match(/{.*}/)[0]
      .replace(/({|})/g, "")
      .split(";")
      .filter(v => v)
      .map(v => {
        let obj = {}
        const [key, value] = v.split(":")
        obj[line2Hump(key)] = isNumber(value) ? Number(value) : line2Hump(value)
        return obj
      })
      .reduce((p, v) => ({ ...p, ...v }), {})
    const obj = {}
    obj[key] = value
    return obj
  })
  result = result.reduce((p, v) => ({ ...p, ...v }), {})
  return result
}

// 函子容器
export const Box: Functor = x => ({
  map: (f: Functor) => Box(f(x)),
  fold: (f: Functor) => f(x),
})

// className转换StyleSheet
export const transformStyles = (classNames: string) => {
  const result = Box(classNames)
    .map(trim)
    .map(split)
    .fold(toObject)
  return result
}