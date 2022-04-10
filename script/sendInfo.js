
const getInfo = require('./juejin');
const { sendInfo } = require('../api');

console.log('getInfo', getInfo);

(async ()=>{

const info = await getInfo();
  (async () => {
    let str = ''
    info.forEach(item => {
      str += `\n帐号信息：${item.username}\n当前矿石：${item.score}\n签到信息：${item.message}\n抽奖结果：${item.award}`
    });
    const data = {
      token: 'e9d0a329ba0b4fd185f13f9f530fdadb',
      title: '掘金签到',
      content: `「掘金」${str}`
    }
    console.log(info);
    await sendInfo(data)
  })()

})()