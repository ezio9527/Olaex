// 数字格式化
let NumberFormat = function () {}

// 截取指定位数
NumberFormat.toFixed = function (number, places) {
  number = number + ''
  // 1.处理科学计数法
  if (/e/i.test(number)) {
    let a = number.split('e')[0]
    let b = Math.abs(parseInt(number.split('e')[1]))
    number = '0.00000000000000000000'.substring(0, b + 2) + a.replace('.', '')
  }
  // 2.NaN、单精度数据、截取位数错误;直接返回
  if (isNaN(number) || !/\./.test(number) || !parseInt(places)) {
    return number
  }
  // 3.截取字符串
  let end = number.indexOf('.') + places + 1
  number = number.substring(0, end)
  // 4.去零
  const length = number.length
  for (let i = 0; i < length; i++) {
    if (number === number.replace(/0$/, '')) {
      break
    } else {
      number = number.replace(/0$/, '')
    }
    if (/\.$/.test(number)) {
      number = number.replace(/\.$/, '')
      break
    }
  }
  return number
}

NumberFormat.install = function (Vue, options) {
  Vue.prototype.NumberFormat = NumberFormat
  Vue.NumberFormat = NumberFormat
}
export default NumberFormat
