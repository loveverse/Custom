const { juejin } = require('../config/config');
const { lotteryConfig, lottery, getTodayStatus, checkIn, getCurPoint, getUserInfo } = require('../api');

async function jjInit() {
  return await Promise.all(
    juejin.map(async item => {
      const headers = {
        'referer': 'https://juejin.cn/',
      };
      // 帐户信息，当前矿石，签到信息，抽奖结果
      const obj = {
        username: '',
        score: '',
        message: '',
        award: ''
      }
      if (!item.cookie) return
      headers.cookie = item.cookie

      // 抽奖
      function drawFn() {
        // 查询今日是否有免费抽奖机会
        return new Promise(async (resolve, reject) => {
          const today = await lotteryConfig(headers)
          if (today.err_no !== 0) return reject('已经签到！免费抽奖失败！')
          if (today.data.free_count === 0) return resolve('签到成功！今日已经免费抽奖！')

          // 免费抽奖
          const draw = await lottery(headers)
          if (draw.err_no !== 0) return reject('已经签到！免费抽奖异常！');
          // if (draw.data.lottery_type === 1) {
          //   score += parseInt(draw.data.lottery_name)
          // }
          obj.award = draw.data.lottery_name
          return resolve(`签到成功！恭喜抽到：${draw.data.lottery_name}`);
        })
      };

      // 签到
      function signIn() {
        return new Promise(async (resolve, reject) => {
          try {
            // 查询用户信息
            const result = await getUserInfo(headers)

            obj.username = result.data.user_name
            // 查询今日是否已经签到
            const today_status = await getTodayStatus(headers)
            if (today_status.err_no !== 0) return reject('签到失败！')
            if (today_status.data) return resolve('今日已经签到！')

            // 签到
            const check_in = await checkIn(headers)
            if (check_in.err_no !== 0) return reject('签到异常！')
            resolve(`签到成功！当前积分；${check_in.data.sum_point}`)
          } catch (error) {
            return resolve(500)
          }
        })
      }
      async function init() {
          const msg = await signIn()
          if(msg === 500) {
            obj.message = 'cookie失效，请重新设置！'
            console.log(obj);
            return Promise.resolve(obj)
          }
          obj.message = msg
          // 获取用户签到信息
          const result = await getCurPoint(headers);
          obj.score = result.data
          await drawFn()
          return Promise.resolve(obj)
      }
      return await init()
      // return 
    })
  )
}

module.exports = jjInit