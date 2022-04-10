const { juejin } = require('../config/config');
const { lotteryConfig, lottery, getTodayStatus, checkIn, getCurPoint, sendInfo, getUserInfo } = require('../api');

async function getInfo() {

  const info = [];
  juejin.forEach(async item => {
    const headers = {
      'content-type': 'application/json; charset=utf-8',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
      // 'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      referer: 'https://juejin.cn/',
      accept: '*/*',
    };
    // 帐户信息，当前矿石，签到信息，抽奖结果
    const obj = {
      username: '',
      score: '',
      message: '',
      award: ''
    }
    if (item.cookie === '') return
    headers.cookie = item.cookie

    // 抽奖
    const drawFn = async () => {
      // 查询今日是否有免费抽奖机会
      const today = await lotteryConfig(headers)
      if (today.err_no !== 0) return Promise.reject('已经签到！免费抽奖失败！')
      if (today.data.free_count === 0) return Promise.resolve('签到成功！今日已经免费抽奖！')

      // 免费抽奖
      const draw = await lottery(headers)
      if (draw.err_no !== 0) return Promise.reject('已经签到！免费抽奖异常！');
      // if (draw.data.lottery_type === 1) {
      //   score += parseInt(draw.data.lottery_name)
      // }
      obj.award = draw.data.lottery_name
      return Promise.resolve(`签到成功！恭喜抽到：${draw.data.lottery_name}`);
    };


    const msg = await (async () => {
      // 查询用户信息
      const result = await getUserInfo(headers)
      obj.username = result.data.user_name
      // 查询今日是否已经签到
      const today_status = await getTodayStatus(headers)
      if (today_status.err_no !== 0) return Promise.reject('签到失败！')
      if (today_status.data) return Promise.resolve('今日已经签到！')

      // 签到
      const check_in = await checkIn(headers)
      if (check_in.err_no !== 0) return Promise.reject('签到异常！')
      return Promise.resolve(`签到成功！当前积分；${check_in.data.sum_point}`)

    })()
    obj.message = msg
    const result = await getCurPoint(headers);
    obj.score = result.data
    drawFn()
    info.push(obj)
    console.log('infos', info);


  })
  console.log('info', info)
  return Promise.resolve(info)
}


module.exports = getInfo