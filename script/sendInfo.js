
const jjInit = require('./juejin');
const { pushplus_token, pushplus_topic } = require('../config/config');
const { sendInfo } = require('../api');

(async () => {
  const msgData = await jjInit()
  console.log(111, msgData);
  let str = ''
  msgData.forEach((item, index) => {
    if (item.username) {
      str += `帐号${index + 1}🆔：${item.username}\n当前矿石：${item.score}\n签到信息：${item.message}\n抽奖结果：${item.award}\n------------------------------\n`
    } else {
      str += `帐号${index + 1}🆔：${item.message}\n------------------------------\n`
    }
  })
  const data = {
    token: pushplus_token,
    title: '掘金签到',
    // template: 'txt',
    // content: `「掘金」${str}`
    content: str,
    topic: pushplus_topic
  }
  await sendInfo(data)
})()