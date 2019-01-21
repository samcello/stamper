const userModel = require('../model/user.js')
const config = require('../config')
const _ = require('lodash');
const request = require("request");
module.exports = async (ctx, next) => {
    let { code } = ctx.query;
    let appId = config.appId;
    let secret = config.appSecret;
    let { js_code } = code;
    let opts = {
      url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`
    }
    request(opts, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        if(response.statusCode == 200){
            ctx.body = body;
        }
    }); 
}

