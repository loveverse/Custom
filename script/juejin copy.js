const fetch = require('node-fetch');
const axios = require('axios');

const cookie = 'ttcid=21ec73858f9b476c8c43dd6d64a5d64431; MONITOR_WEB_ID=529f13f3-657f-45ae-afaf-ccd70f5475e2; _tea_utm_cache_2608=undefined; __tea_cookie_tokens_2608=%7B%22web_id%22%3A%227073283979609114147%22%2C%22user_unique_id%22%3A%227073283979609114147%22%2C%22timestamp%22%3A1646877273589%7D; _ga=GA1.2.2112200705.1646877274; _gid=GA1.2.1507555314.1649472122; s_v_web_id=verify_l1r945v6_cdV15r1h_LN4W_4AHr_BVKn_k5xpDAO4u6vq; passport_csrf_token=127f9414f8d614204c0612f670aecd05; passport_csrf_token_default=127f9414f8d614204c0612f670aecd05; _tea_utm_cache_2018=undefined; MONITOR_DEVICE_ID=76ec6464-8bae-40de-95f4-d4d0242de09c; odin_tt=0f40a03012d582ec81e8328a93c1ff9c8c50b4e9eb5eed93915760edf0cfee82a851c5fdc4b53f1e969ccc8bccb8d5651f7a5e7dfb0f7d95a0a085c4346af810; n_mh=LNz3wBFnXmvQdywTeu7WxxLQn-jXDTkSIpBm6Ne-VYw; passport_auth_status=7c3f64c0013554e5ed3be974b0b93ade,; passport_auth_status_ss=7c3f64c0013554e5ed3be974b0b93ade,; sid_guard=3a3d10c5d7aa1266735f53f9aee15850|1649487769|5184000|Wed,+08-Jun-2022+07:02:49+GMT; uid_tt=265a05620a478081ff10073958d6a9f3; uid_tt_ss=265a05620a478081ff10073958d6a9f3; sid_tt=3a3d10c5d7aa1266735f53f9aee15850; sessionid=3a3d10c5d7aa1266735f53f9aee15850; sessionid_ss=3a3d10c5d7aa1266735f53f9aee15850; sid_ucp_v1=1.0.0-KGY0NmM1MDRmYWFmNDM0MmY1OGVkYWQ2ODk5ZmE5NTdiMDQ3MjJmMzkKFwj4mcCX0YzFAhCZ38SSBhiwFDgCQOwHGgJsZiIgM2EzZDEwYzVkN2FhMTI2NjczNWY1M2Y5YWVlMTU4NTA; ssid_ucp_v1=1.0.0-KGY0NmM1MDRmYWFmNDM0MmY1OGVkYWQ2ODk5ZmE5NTdiMDQ3MjJmMzkKFwj4mcCX0YzFAhCZ38SSBhiwFDgCQOwHGgJsZiIgM2EzZDEwYzVkN2FhMTI2NjczNWY1M2Y5YWVlMTU4NTA; tt_scid=miIts5Vfqpx6CZ4Uq46qG5UZ6cSsvRzuv97uP5XxuK9dag02ySP1fWvbVadvM0KEbc5e'

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
  'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
  'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  referer: 'https://juejin.cn/',
  accept: '*/*',
  cookie
};
let score = 0, message, award

const token = 'e9d0a329ba0b4fd185f13f9f530fdadb' 
const title= '掘金' 
const content ='签到信息' 

// 抽奖
const drawFn = async () => {
  // 查询今日是否有免费抽奖机会
  const today = await fetch('https://api.juejin.cn/growth_api/v1/lottery_config/get', {
    headers,
    method: 'GET',
    credentials: 'include'
  }).then((res) =>{
    console.log(res);
    return res.json()
  });
  console.log("4343",today);
  if (today.err_no !== 0) return Promise.reject('已经签到！免费抽奖失败！');
  if (today.data.free_count === 0) return Promise.resolve('签到成功！今日已经免费抽奖！');




  // 免费抽奖
  const draw = await fetch('https://api.juejin.cn/growth_api/v1/lottery/draw', {
    headers,
    method: 'POST',
    credentials: 'include'
  }).then((res) => res.json());
  console.log("12222222222",draw);

  if (draw.err_no !== 0) return Promise.reject('已经签到！免费抽奖异常！');
  console.log('已经签到！免费抽奖异常！');
  if (draw.data.lottery_type === 1) score += 66;
  award = draw.data.lottery_name
  return Promise.resolve(`签到成功！恭喜抽到：${draw.data.lottery_name}`);
};




// 签到
(async () => {
  // 查询今日是否已经签到
  const today_status = await fetch('https://api.juejin.cn/growth_api/v1/get_today_status', {
    headers,
    method: 'GET',
    credentials: 'include'
  }).then((res) => res.json());
  console.log(today_status);
  if (today_status.err_no !== 0) return Promise.reject('签到失败！');
  if (today_status.data) return Promise.resolve('今日已经签到！');

  // 签到
  const check_in = await fetch('https://api.juejin.cn/growth_api/v1/check_in', {
    headers,
    method: 'POST',
    credentials: 'include'
  }).then((res) => res.json());

  if (check_in.err_no !== 0) return Promise.reject('签到异常！');
  return Promise.resolve(`签到成功！当前积分；${check_in.data.sum_point}`);
})()
  .then((msg) => {
    message = msg
    console.log('1111',msg);
    return fetch('https://api.juejin.cn/growth_api/v1/get_cur_point', {
      headers,
      method: 'GET',
      credentials: 'include'
    }).then((res) => res.json());
  })
  .then((res) => {
    console.log('2222',res);
    score = res.data;
    return drawFn();
  })
  .then((msg) => {
    console.log('3333',msg);
    const data = {
      "token":'e9d0a329ba0b4fd185f13f9f530fdadb',
      "title":title,
      "content":`「掘金」\n当前矿石：${score}\n签到信息：${message}\n抽奖结果：${award}`
    }
    // let body=json.dumps(data).encode(encoding='utf-8')
    return axios('http://www.pushplus.plus/send', {
      headers,
      method: 'POST',
      data
    }).then((res) => console.log(res.data))
  })