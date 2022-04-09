const fetch = require('node-fetch');
const axios = require('axios');

const cookie = 'ttcid=686bafc1a05e44eeb4d30ab23d96e9f035; _tea_utm_cache_2608=undefined; _ga=GA1.2.1683813187.1646191008; MONITOR_WEB_ID=96515287-07dd-46ba-af21-348748c90097; __tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227070336511027398182%2522%252C%2522user_unique_id%2522%253A%25227070336511027398182%2522%252C%2522timestamp%2522%253A1646191008392%257D; _gid=GA1.2.1177143367.1648629437; s_v_web_id=verify_l1dbei86_Pa7B2vE6_8kxe_426s_8oQ3_75dDdNSNq3uA; passport_csrf_token=fc343a2566210cdff4080d24352bac8e; passport_csrf_token_default=fc343a2566210cdff4080d24352bac8e; odin_tt=d84b57e18dc290696d70a2eb886b982ab48c74dc98674f3d78a5af77254db66c1b17c51c9cd5d9630422f41f115dbf9827de1b3bbbbe4fb20c6885983ba22489; n_mh=9-mIeuD4wZnlYrrOvfzG3MuT6aQmCUtmr8FxV8Kl8xY; sid_guard=7a39dccc2b6f195c2f025e9fb2c8f8e4%7C1648629456%7C5184000%7CSun%2C+29-May-2022+08%3A37%3A36+GMT; uid_tt=b75ac0cb7d66ffced0012fbf8d88f057; uid_tt_ss=b75ac0cb7d66ffced0012fbf8d88f057; sid_tt=7a39dccc2b6f195c2f025e9fb2c8f8e4; sessionid=7a39dccc2b6f195c2f025e9fb2c8f8e4; sessionid_ss=7a39dccc2b6f195c2f025e9fb2c8f8e4; sid_ucp_v1=1.0.0-KGVjMmZiMTkyZGNkMzczYzlkYjIzOGY1ODcyMTY4MWMyNzYyMjExNzQKFgjdg4CLxIyNAhDQrZCSBhiwFDgIQAsaAmxmIiA3YTM5ZGNjYzJiNmYxOTVjMmYwMjVlOWZiMmM4ZjhlNA; ssid_ucp_v1=1.0.0-KGVjMmZiMTkyZGNkMzczYzlkYjIzOGY1ODcyMTY4MWMyNzYyMjExNzQKFgjdg4CLxIyNAhDQrZCSBhiwFDgIQAsaAmxmIiA3YTM5ZGNjYzJiNmYxOTVjMmYwMjVlOWZiMmM4ZjhlNA; _gat=1; tt_scid=HZA.V6WNWNEyYEGzuR2cpmrT6ARyddk9QxpQyAnNDA5KDeBCqKuvfDTvG4h.fC6Z346a'
const token = 'e9d0a329ba0b4fd185f13f9f530fdadb'

// 当前矿石，签到信息，抽奖信息
let score = 0,message,award

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
  'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  referer: 'https://juejin.cn/',
  accept: '*/*',
  cookie
};


// 抽奖
const drawFn = async () => {
  // 查询今日是否有免费抽奖机会
  const today = await fetch('https://api.juejin.cn/growth_api/v1/lottery_config/get', {
    headers,
    method: 'GET',
    credentials: 'include'
  }).then((res) => res.json());

  if (today.err_no !== 0) return Promise.reject('已经签到！免费抽奖失败！');
  if (today.data.free_count === 0) return Promise.resolve('签到成功！今日已经免费抽奖！');

  // 免费抽奖
  const draw = await fetch('https://api.juejin.cn/growth_api/v1/lottery/draw', {
    headers,
    method: 'POST',
    credentials: 'include'
  }).then((res) => res.json());

  if (draw.err_no !== 0) return Promise.reject('已经签到！免费抽奖异常！');
  console.log(JSON.stringify(draw, null, 2));
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
    return fetch('https://api.juejin.cn/growth_api/v1/get_cur_point', {
      headers,
      method: 'GET',
      credentials: 'include'
    }).then((res) => res.json());
  })
  .then((res) => {
    score = res.data;
    return drawFn();
  })
  .then(() => {
    console.log("当前矿石：", score);
    console.log("签到信息：", message);
    console.log("抽奖结果", award);
    return axios({
      method: 'post',
      url: 'http://www.pushplus.plus/send',
      data: {
        'token': token,
        'title': '签到通知',
        'content': `「掘金」\n当前矿石：${score}\n签到信息：${message}\n抽奖结果：${award}`
      }
    })

  })

