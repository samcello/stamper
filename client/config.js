/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
//https://312023381.leichaseal.com
var host = 'https://3wkn7yoo.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        // 申请印章接口
        applyUrl: `${host}/weapp/stamper/apply`,
        //获取印章接口
        getAllUrl: `${host}/weapp/stampers`,
        getOrdersUrl: `${host}/weapp/orders`,
        getOrderUrl: `${host}/weapp/order`,
        updateOrderUrl: `${host}/weapp/order/update`,
        getUserUrl: `${host}/weapp/user`,
        adminLoginUrl: `${host}/weapp/admin/login`,
        getOrdersByUser: `${host}/weapp/user/orders`,
        getOpenId: `${host}/weapp/openid`,
    }
};

module.exports = config;
