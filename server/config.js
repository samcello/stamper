const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wx5eaf417dce92b3f0',

    // 微信小程序 App Secret
    appSecret: '1d9e29a5c6db925d4238c64ad3a6c93f',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     * 6oIQkp8m
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        else eself
         asdf123123123sdafasdfasdfasdfasdfasdfasdfpass: '6oIQkp8m',//wx5eaf417dce92b3f0
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
