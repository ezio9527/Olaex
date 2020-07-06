
/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * imgBaseUrl: 图片所在域名地址
 *
 */

let baseUrl = '';
let imgBaseUrl = '';

if (process.env.NODE_ENV == 'development') { //开发中
  // baseUrl = 'http://192.168.0.116:8080'
  baseUrl = 'https://bitaex.hnscf.cn'
}else if(process.env.NODE_ENV == 'production'){
    baseUrl = 'https://bitaex.hnscf.cn'
}

export{
    baseUrl,
    imgBaseUrl
}
