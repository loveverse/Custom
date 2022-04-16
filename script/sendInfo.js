
const init = require('./juejin');
const { pushplus_token,pushplus_topic } = require('../config/config');
const { sendInfo } = require('../api');

(async () => {
  const msgData = await init()
  console.log(msgData);
  let str = ''
  msgData.forEach((item, index) => {
    str += `帐号${index + 1}🆔：${item.username}\n当前矿石：${item.score}\n签到信息：${item.message}\n抽奖结果：${item.award}\n\n`
  })
  const data = {
    token: pushplus_token,
    title: '掘金签到',
    // content: `「掘金」${str}`
    content: str,
    topic: pushplus_topic
  }
  await sendInfo(data)
})()