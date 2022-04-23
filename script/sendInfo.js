
const jjInit = require('./juejin');
const swyInit = require('./suwayun')
const { pushplus_token, pushplus_topic } = require('../config/config.temp');
const { sendInfo } = require('../api');

(async () => {
  const jjData = await jjInit()
  console.log("通知：", jjData);
  let str = ''
  jjData.forEach((item, index) => {
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
})();


(async () => {
  const swyData = await swyInit()
  console.log("通知：", swyData);
  let str = ''
  swyData.forEach((item, index) => {
    if (item.username) {
      str += `帐号${index + 1}🆔：${item.username}\n当前流量${item.currentFlow}\n签到信息：${item.message}\n------------------------------\n`
    } else {
      str += `帐号${index + 1}🆔：${item.message}\n------------------------------\n`
    }
  })
  
  const data = {
    token: pushplus_token,
    title: '速蛙云签到',
    content: str,
    topic: pushplus_topic
  }
  await sendInfo(data)
})()