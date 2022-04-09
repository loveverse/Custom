const fetch = require('node-fetch');


let score = 0;
const cookie = 'ttcid=686bafc1a05e44eeb4d30ab23d96e9f035; _tea_utm_cache_2608=undefined; _ga=GA1.2.1683813187.1646191008; MONITOR_WEB_ID=96515287-07dd-46ba-af21-348748c90097; __tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227070336511027398182%2522%252C%2522user_unique_id%2522%253A%25227070336511027398182%2522%252C%2522timestamp%2522%253A1646191008392%257D; passport_csrf_token=fc343a2566210cdff4080d24352bac8e; passport_csrf_token_default=fc343a2566210cdff4080d24352bac8e; n_mh=9-mIeuD4wZnlYrrOvfzG3MuT6aQmCUtmr8FxV8Kl8xY; _gid=GA1.2.1446631280.1649233825; s_v_web_id=verify_l1r8ms5e_MmCh61ZF_BGUw_4BaG_8x9S_ALMK7lk7mL2Q; tt_scid=i9pnrfL.4nk5TMjedXC.UKEHxSZ6eV4pLiHCaeLeq58LxZiUhYv47qPK9Z3EbiEP1cad; odin_tt=16beb27f3848993d6e52c63497244e08cfe0d9287c57dc82b5f4fbaec0b9bdce828dda307a8a69eb32b56884a2fc223069691f6c921b75dd912db6bb3fa501ef; sid_guard=6199568a248838755960c03b67678b5f%7C1649472318%7C5184000%7CWed%2C+08-Jun-2022+02%3A45%3A18+GMT; uid_tt=b704f6b95b6a54855798770968404b49; uid_tt_ss=b704f6b95b6a54855798770968404b49; sid_tt=6199568a248838755960c03b67678b5f; sessionid=6199568a248838755960c03b67678b5f; sessionid_ss=6199568a248838755960c03b67678b5f; sid_ucp_v1=1.0.0-KDNiNGY0ZTQwZmQyYjZjYTQxZWY1Yzk1OTQzOWExMzI5YTYxNzc0YWIKFQjX49D50IwxEL7mw5IGGLAUOAhAARoCbGYiIDYxOTk1NjhhMjQ4ODM4NzU1OTYwYzAzYjY3Njc4YjVm; ssid_ucp_v1=1.0.0-KDNiNGY0ZTQwZmQyYjZjYTQxZWY1Yzk1OTQzOWExMzI5YTYxNzc0YWIKFQjX49D50IwxEL7mw5IGGLAUOAhAARoCbGYiIDYxOTk1NjhhMjQ4ODM4NzU1OTYwYzAzYjY3Njc4YjVm; _gat=1'

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
  }).then((res) => res.json());

  if (today.err_no !== 0) return Promise.reject('已经签到！免费抽奖失败！');
  if (today.data.free_count === 0) return Promise.resolve('签到成功！今日已经免费抽奖！');

  // 免费抽奖
  const draw = await fetch('https://api.juejin.cn/growth_api/v1/lottery/draw', {
    headers,
    method: 'POST',
    credentials: 'include'
  }).then((res) => res.json());
  // console.log(draw);

  if (draw.err_no !== 0) return Promise.reject('已经签到！免费抽奖异常！');
  console.log('已经签到！免费抽奖异常！');
  if (draw.data.lottery_type === 1) score += 66;
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
      "content":content
    }
    // let body=json.dumps(data).encode(encoding='utf-8')
    return fetch('http://www.pushplus.plus/send', {
      headers,
      method: 'POST',
      body:data
    }).then((res) => res.json())

  })
  .then((res) => {
    console.log('4444',res);
  })