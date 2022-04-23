const { request, ajax } = require('./axios');

// -------------------------------掘金api-------------------------------
// 获取用户信息
exports.getUserInfo = (headers) => ajax('https://api.juejin.cn/user_api/v1/user/get', { headers })
// 是否有免费抽奖机会
exports.lotteryConfig = (headers) => ajax('https://api.juejin.cn/growth_api/v1/lottery_config/get', { headers })
// 免费抽奖
exports.lottery = (headers) => request('https://api.juejin.cn/growth_api/v1/lottery/draw', {}, { headers })
// 是否签到
exports.getTodayStatus = (headers) => ajax('https://api.juejin.cn/growth_api/v1/get_today_status', { headers })
// 签到
exports.checkIn = (headers) => request('https://api.juejin.cn/growth_api/v1/check_in', {}, { headers })
// 获取签到信息
exports.getCurPoint = (headers) => ajax('https://api.juejin.cn/growth_api/v1/get_cur_point', { headers })


// -------------------------------速蛙云api-------------------------------
exports.swyUserInfo = (headers) => ajax('https://m.ok4.icu/api_mweb/user/info', { headers })
exports.swyCheckIn = (headers) => request('https://m.ok4.icu/api_mweb/user/checkin', {}, { headers }, 'PUT')


// -------------------------------推送-------------------------------
exports.sendInfo = (data) => request('http://www.pushplus.plus/send', data)
