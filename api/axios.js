const axios = require('axios');
var iconv = require('iconv-lite');
const http = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  timeout: 50000,
  withCredentials: false,
})
http.interceptors.request.use(config => {
  return config;
})
http.interceptors.response.use(response => {
  // console.log(response);
  return response;
}, error => {
  // 错误响应信息
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求'
        break;
      case 401:
        error.message = '未授权，请重新登录'
        break;
      case 403:
        error.message = '拒绝访问'
        break;
      case 404:
        error.message = '请求错误,未找到该资源'
        break;
      case 405:
        error.message = '请求方法未允许'
        break;
      case 408:
        error.message = '请求超时'
        break;
      case 500:
        error.message = '服务器端出错'
        break;
      case 501:
        error.message = '网络未实现'
        break;
      case 502:
        error.message = '网络错误'
        break;
      case 503:
        error.message = '服务不可用'
        break;
      case 504:
        error.message = '网络超时'
        break;
      case 505:
        error.message = 'http版本不支持该请求'
        break;
      default:
        error.message = `连接错误${error.response.status}`
    }
  } else {
    error.message = "连接到服务器失败"
  }
  return Promise.reject(error.message)
})

exports.request = function (url, data = {}, config = {}, type = "POST") {
  // data作为请求体发送的的数据只适用put,post,patch
  let promiseData;
  return new Promise((resolve, reject) => {
    switch (type) {
      case "POST":
        promiseData = http.post(url, data, { headers: config })
        break;
      case "PUT":
        promiseData = http.put(url, data, { headers: config })
        break;
      case "PATCH":
        promiseData = http.patch(url, data, { headers: config })
        break;
      default:
        break;
    }
    try {
      promiseData.then(result => resolve(result.data))
        // 处理失败的请求
        .catch(error => console.log("错误：", error))
    } catch (error) {
      console.log(error);
    }
  })
}
exports.ajax = function (url, config = {}, type = "GET") {
  // 非data作为请求体发送的的数据只适用get,delete,head,options
  // config = {Headers: config}
  let promise;
  return new Promise((resolve, reject) => {
    switch (type) {
      case "GET":
        promise = http.get(url, { headers: config })
        // console.log(promise);
        break;
      case "DELETE":
        promise = http.delete(url, { headers: config })
        break;
      case "HEAD":
        promise = http.head(url, { headers: config })
        break;
      case "OPTIONS":
        promise = http.options(url, { headers: config })
        break;
      default:
        break;
    }
    try {
      promise.then(result => resolve(result.data))
        // 处理失败的请求
        .catch(error => console.log("错误：", error))
    } catch (error) {
      console.log(error);
    }
  })
}

// axios({
//   url: 'https://api.juejin.cn/growth_api/v1/lottery_config/get',
//   method: 'get',
//   headers: {
//     'content-type': 'application/json; charset=utf-8',
//     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
//     'accept-encoding': 'gzip, deflate, br',
//     'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
//     'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
//     'sec-ch-ua-mobile': '?0',
//     referer: 'https://juejin.cn/',
//     accept: '*/*',
//     cookie: "ttcid=21ec73858f9b476c8c43dd6d64a5d64431; MONITOR_WEB_ID=529f13f3-657f-45ae-afaf-ccd70f5475e2; _tea_utm_cache_2608=undefined; __tea_cookie_tokens_2608=%7B%22web_id%22%3A%227073283979609114147%22%2C%22user_unique_id%22%3A%227073283979609114147%22%2C%22timestamp%22%3A1646877273589%7D; _ga=GA1.2.2112200705.1646877274; _gid=GA1.2.1507555314.1649472122; s_v_web_id=verify_l1r945v6_cdV15r1h_LN4W_4AHr_BVKn_k5xpDAO4u6vq; passport_csrf_token=127f9414f8d614204c0612f670aecd05; passport_csrf_token_default=127f9414f8d614204c0612f670aecd05; _tea_utm_cache_2018=undefined; MONITOR_DEVICE_ID=76ec6464-8bae-40de-95f4-d4d0242de09c; odin_tt=0f40a03012d582ec81e8328a93c1ff9c8c50b4e9eb5eed93915760edf0cfee82a851c5fdc4b53f1e969ccc8bccb8d5651f7a5e7dfb0f7d95a0a085c4346af810; n_mh=LNz3wBFnXmvQdywTeu7WxxLQn-jXDTkSIpBm6Ne-VYw; passport_auth_status=7c3f64c0013554e5ed3be974b0b93ade,; passport_auth_status_ss=7c3f64c0013554e5ed3be974b0b93ade,; sid_guard=3a3d10c5d7aa1266735f53f9aee15850|1649487769|5184000|Wed,+08-Jun-2022+07:02:49+GMT; uid_tt=265a05620a478081ff10073958d6a9f3; uid_tt_ss=265a05620a478081ff10073958d6a9f3; sid_tt=3a3d10c5d7aa1266735f53f9aee15850; sessionid=3a3d10c5d7aa1266735f53f9aee15850; sessionid_ss=3a3d10c5d7aa1266735f53f9aee15850; sid_ucp_v1=1.0.0-KGY0NmM1MDRmYWFmNDM0MmY1OGVkYWQ2ODk5ZmE5NTdiMDQ3MjJmMzkKFwj4mcCX0YzFAhCZ38SSBhiwFDgCQOwHGgJsZiIgM2EzZDEwYzVkN2FhMTI2NjczNWY1M2Y5YWVlMTU4NTA; ssid_ucp_v1=1.0.0-KGY0NmM1MDRmYWFmNDM0MmY1OGVkYWQ2ODk5ZmE5NTdiMDQ3MjJmMzkKFwj4mcCX0YzFAhCZ38SSBhiwFDgCQOwHGgJsZiIgM2EzZDEwYzVkN2FhMTI2NjczNWY1M2Y5YWVlMTU4NTA; tt_scid=miIts5Vfqpx6CZ4Uq46qG5UZ6cSsvRzuv97uP5XxuK9dag02ySP1fWvbVadvM0KEbc5e"
//   },
//   withCredentials: false, // default
//   responseType: 'blob',
// }).then(res => {
//   // let str = iconv.decode(Buffer.from(res.data), 'gbk')
//   console.log('666', res.data)
// })