const { juejin } = require('../config/config');
const { lotteryConfig, lottery, getTodayStatus, checkIn, getCurPoint, sendInfo, getUserInfo } = require('../api');


const headers = {
  'content-type': 'application/json; charset=utf-8',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
  // 'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
  'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  referer: 'https://juejin.cn/',
  accept: '*/*',
  cookie: juejin[0].cookie
};
// 当前矿石，签到信息，抽奖结果
let score = 0, message, award


// 抽奖
const drawFn = async () => {
  // 查询今日是否有免费抽奖机会
  const today = await lotteryConfig(headers)
  if (today.err_no !== 0) return Promise.reject('已经签到！免费抽奖失败！')
  if (today.data.free_count === 0) return Promise.resolve('签到成功！今日已经免费抽奖！')

  // 免费抽奖
  const draw = await lottery(headers)
  if (draw.err_no !== 0) return Promise.reject('已经签到！免费抽奖异常！');
  if (draw.data.lottery_type === 1) {
    score += parseInt(draw.data.lottery_name)
  }
  award = draw.data.lottery_name
  return Promise.resolve(`签到成功！恭喜抽到：${draw.data.lottery_name}`);
};



(async () => {
  // 查询今日是否已经签到
  const today_status = await getTodayStatus(headers)
  if (today_status.err_no !== 0) return Promise.reject('签到失败！')
  if (today_status.data) return Promise.resolve('今日已经签到！')

  // 签到
  const check_in = await checkIn(headers)
  if (check_in.err_no !== 0) return Promise.reject('签到异常！')
  return Promise.resolve(`签到成功！当前积分；${check_in.data.sum_point}`)

})()
  .then(async msg => {
    message = msg
    const result = await getCurPoint(headers);
    score = result.data
    return drawFn()
  })
  .then(async () => {
    const result = await getUserInfo(headers)
    const data = {
      token: 'e9d0a329ba0b4fd185f13f9f530fdadb',
      title: '掘金签到',
      content: `「掘金」\n帐号信息：${result.data.user_name}\n当前矿石：${score}\n签到信息：${message}\n抽奖结果：${award}`
    }
    return sendInfo(data)
  })

