const ajax = require('./axios');

exports.lotteryConfig = (headers) => ajax('https://api.juejin.cn/growth_api/v1/lottery_config/get',_, {headers})
exports.lottery = (headers) => ajax('https://api.juejin.cn/growth_api/v1/lottery/draw',_, {headers})

exports.getTodayStatus = (headers) => ajax('https://api.juejin.cn/growth_api/v1/get_today_status',_, {headers})