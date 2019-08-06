module.exports = {//跨域传参
    // 修改的配置
    // 将baseUrl: '/api',改为baseUrl: '/',
    // baseUrl: '/',
    devServer: {
        port: 8081,     // 端口
        proxy: {
            '/wx': {
                // target: 'http://manage.heidouinfo.com',//根据需求修改服务器地址
                target: 'http://192.168.2.100:8090/',//根据需求修改服务器地址
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/wx': '/wx'
                }
            }
        },
        disableHostCheck: true
    }
}