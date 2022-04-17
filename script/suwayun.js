const { suwayun } = require('../config/config');
const { swyCheckIn } = require('../api');

async function swyInit(){
  return Promise.all(
    suwayun.forEach(item => {
      const headers = {
        'referer': 'https://m.ok4.icu/m/home',
      }
      if(!item.cookie && !item.token) return
      headers.cookie = item.cookie
      headers.authorizationmweb = item.token

      // 签到
      
    })
  )
}