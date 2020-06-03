//将时间戳转化为对应的时间格式
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

/**
 * 从marked解析的md语法中找出标题来
 * md：传入的md语法字符串
 * 传出的md是一个对象
 * md.body：标题的id，对应锚点链接的href
 * md.level：标题等级，依次对应h1,h2,h3....
 */
// export function getArticleMenu(md) {
//   let reg_has = /#/gm  //匹配#
//   md = md.split("\n")  //以\n为分割符号分割成数组
//   md = md.filter(item => {  //过滤出标题
//     if(item.match(reg_has)) {
//       return item.match(reg_has).length >= 1
//     }
//   })
//   md = md.map(item => {  //根据#划分标题的等级
//     let obj = {}
//     obj.body = item
//     obj.title = item
//     obj.level = item.match(reg_has).length
//     return obj
//   })
//   md.forEach(item => {
//     item.body = item.body.replace(/#/gm, "")  //去掉#
//     item.body = item.body.trim()  //去掉字符串前后多余的空格
//     item.title = item.body
//     item.body = item.body.replace(/\.| |<|>|\[|\]|\(|\)|\=/gm, str => {  //转换.和空格
//       let tokenMap = {
//         '\.': '',
//         ' ': '-',
//         '<': '',
//         '>': '',
//         '\[': '',
//         '\]': '',
//         '\(': '',
//         '\)': '',
//         '\=': ''
//       }
//       return tokenMap[str]
//     })
//     item.body = item.body.replace(/[A-Z]/gm, word => {  //将所有大写单词转成小写
//       return word.toLowerCase()
//     })
//   })
//   return md
// }