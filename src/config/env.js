
/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * imgBaseUrl: 图片所在域名地址
 *
 */

let baseUrl = '';
let imgBaseUrl = '';
let mobileBaseUrl = '';

if (process.env.NODE_ENV == 'development') { //开发中
  baseUrl = 'https://api.lhc114.com'
  mobileBaseUrl = 'https://m.lhc114.com'
}else if(process.env.NODE_ENV == 'production'){
  baseUrl = 'https://api.lhc114.com'
  mobileBaseUrl = 'https://m.lhc114.com'
}

export{
  baseUrl,
  imgBaseUrl,
  mobileBaseUrl
}
