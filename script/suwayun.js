const { suwayun } = require('../config/config.temp');
const { swyCheckIn, swyUserInfo } = require('../api');

async function swyInit() {
  return await Promise.all(
    suwayun.map(async item => {
      const headers = {
        'referer': 'https://m.ok4.icu/m/home',
      }
      // 帐户信息 签到后流量 签到信息
      const obj = {
        username: '',
        currentFlow: '',
        message: '',
      }
      if (!item.cookie || !item.authorizationmweb) return
      headers.cookie = item.cookie
      headers.authorizationmweb = item.authorizationmweb

      // 签到
      function signIn() {
        return new Promise(async (resolve, reject) => {
          try {
            // 查询用户信息
            const result = await swyUserInfo(headers)
            if(result.code !== 100) return reject('获取用户信息失败！')
            return resolve(result.data)
          } catch (error) {
            return resolve(500)
          }
        })
      }
      async function init() {
        const msg = await signIn()
        if(msg === 500){
          obj.message = 'cookie失效，请重新设置！'
          return Promise.resolve(obj)
        }
        obj.username = msg.name
        // 获取用户签到信息
        const result =  await swyCheckIn(headers)
        if(result.code === 100){
          obj.message = result.data.message
        }else{
          obj.message = result.message
        }
        const current = await signIn()
        // console.log(current);
        obj.currentFlow = current.unused_traffic
        // console.log(obj);
        return Promise.resolve(obj)
      }
      return await init()
    })
  )
}
module.exports = swyInit