const fetch = require('node-fetch');
// const sendMail = require('./sendMail');

// const [user, pass, to] = process.argv.slice(2);
// process.env.user = user;
// process.env.pass = pass;
let score = 0;
const cookie = 'ttcid=223923626c6e4dffa92653a9ebc18ecb15; MONITOR_WEB_ID=1e0b7d68-ea3e-412f-a7a5-bb3c77ce0dc5; _ga=GA1.2.985649972.1632398926; passport_csrf_token_default=2cf3d362a91950e431b2e51cab069a18; passport_csrf_token=2cf3d362a91950e431b2e51cab069a18; n_mh=9-mIeuD4wZnlYrrOvfzG3MuT6aQmCUtmr8FxV8Kl8xY; sid_guard=9c50a894b5b340638027bd0879588bfa%7C1632499399%7C5183999%7CTue%2C+23-Nov-2021+16%3A03%3A18+GMT; uid_tt=bfa9229af782290d7f6768e367420c96; uid_tt_ss=bfa9229af782290d7f6768e367420c96; sid_tt=9c50a894b5b340638027bd0879588bfa; sessionid=9c50a894b5b340638027bd0879588bfa; sessionid_ss=9c50a894b5b340638027bd0879588bfa; sid_ucp_v1=1.0.0-KDY5N2E4NWUyNDYxZGM4N2RlZDYwOGY1OTFkZWE3YjZhMTQyYjY5NTMKFgjNieD6zYzeBxDH7beKBhiwFDgIQDgaAmxmIiA5YzUwYTg5NGI1YjM0MDYzODAyN2JkMDg3OTU4OGJmYQ; ssid_ucp_v1=1.0.0-KDY5N2E4NWUyNDYxZGM4N2RlZDYwOGY1OTFkZWE3YjZhMTQyYjY5NTMKFgjNieD6zYzeBxDH7beKBhiwFDgIQDgaAmxmIiA5YzUwYTg5NGI1YjM0MDYzODAyN2JkMDg3OTU4OGJmYQ; odin_tt=7f91b530db2f82ceb2662b4c7bf35f33a62346a4da076907fcb4474e0167eba0db463e338e16fca10321b260ff171bcf81dcfe2d22bc97b8cb23918ffbf88b16; tt_scid=vqAarVDMb0btDVDFtk0C4qgebcV5QfAI6BxtKE6zUA1r1FgOKddskRR94acET9LA3635'

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
    console.log(msg);
    return fetch('https://api.juejin.cn/growth_api/v1/get_cur_point', {
      headers,
      method: 'GET',
      credentials: 'include'
    }).then((res) => res.json());
  })
  .then((res) => {
    console.log(res);
    score = res.data;
    return drawFn();
  })
  .then((msg) => {
    console.log(msg);
    const data = {
      "token":token,
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
    console.log(res);
  })

const token = 'e9d0a329ba0b4fd185f13f9f530fdadb' 
const title= '掘金' 
const content ='签到信息' 
  // return sendMail({
  //   from: '掘金',
  //   to,
  //   subject: '定时任务',
  //   html: `
  //     <h1 style="text-align: center">自动签到通知</h1>
  //     <p style="text-indent: 2em">签到结果：${msg}</p>
  //     <p style="text-indent: 2em">当前积分：${score}</p><br/>
  //   `
  // }).catch(console.error);
  // .then(() => {
  //   console.log('邮件发送成功！');
  // })
  // .catch((err) => {
  //   sendMail({
  //     from: '掘金',
  //     to,
  //     subject: '定时任务',
  //     html: `
  //       <h1 style="text-align: center">自动签到通知</h1>
  //       <p style="text-indent: 2em">执行结果：${err}</p>
  //       <p style="text-indent: 2em">当前积分：${score}</p><br/>
  //     `
  //   }).catch(console.error);
  // });

// token = '你的token' #在pushpush网站中可以找到
// title= '标题' #改成你要的标题内容
// content ='内容' #改成你要的正文内容
// url = 'http://www.pushplus.plus/send'
// data = {
//     "token":token,
//     "title":title,
//     "content":content
// }
// body=json.dumps(data).encode(encoding='utf-8')
// headers = {'Content-Type':'application/json'}
// requests.post(url,data=body,headers=headers)