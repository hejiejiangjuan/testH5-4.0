import wx from 'weixin-js-sdk';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'//引入自定义vuex
import axios from 'axios'
import Vant from 'vant'
import 'vant/lib/index.css';
import "./assets/css/iconfont.css";
import '../src/libs/rem';
import animate from 'animate.css';
import utils from './utils';
import { Toast } from 'vant';
import Api from './Api'
import VueTouch from 'vue-touch'
import qs from 'qs'

Vue.prototype.$qs = qs
Vue.use(VueTouch, { name: 'v-touch' });
VueTouch.config.swipe = {
    threshold: 50  //手指左右滑动距离 
};
import { WSAETIMEDOUT } from 'constants';

Vue.use(animate)
Vue.use(Vant);
Vue.prototype.$baseUrl = utils.getUrlKey();
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
axios.interceptors.request.use
axios.interceptors.request.use(
    config => {
        if (localStorage.getItem("openid")) {
            config.headers.openid = localStorage.getItem("openid");
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

new Vue({
    data: {
        hasLogin: false,
        tenantName: '',
        logo: '',
        canClick: true,
        code: '',
        bindUserKey: '',//绑定分销员上下级的上级userKey
        isShowOne: false,
        locastoritn: false,
    },
    mounted: function () {
        // this.initMain();
        //页面跳转后回到顶部
        router.afterEach((to, from, next) => {
            window.scrollTo(0, 0);
        })
    },
    beforeCreate() {
    },
    methods: {
        initMain() {//初始化main.js
            var that = this;
            var p = new Promise(function (resolve, reject) {
                //获取userkey、tfk
                that.getUserkey()
                that.getLogo();
                that.getWxConfig();//初始化微信菜单等
                //登录或者跳转授权
                that.$root.code = that.GetUrlParame('code');//获取网页地址上的code
                var openid = that.GetUrlParame('openid');//获取网页的open的id
                if (!openid) {
                    openid = localStorage.getItem("openid")
                }
                if (that.$root.code || openid) {
                    //登录(成功后可能跳转走)
                    that.doLogin(openid).then(function (res) {
                        that.hasLogin = true;
                        resolve('ok')
                    });
                } else {
                    that.toAuthUrl();
                }

            });
            return p;
        },
        getLogo() {
            var that = this;
            var temp = { 'tfk': localStorage.getItem('tfk') };
            this.$axios.post("/wx/home/getLogo", this.$qs.stringify(temp)).then(
                res => {
                    if (res.data.code == 200) {
                        that.tenantName = res.data.datas.title;
                        that.logo = res.data.datas.logo;
                    }
                },
                err => {
                }
            );
        },
        myDay(startTime, endTime, pageUrl) {
            // let param = new URLSearchParams()
            // param.append("startTime", startTime)
            // param.append("endTime", endTime)
            // param.append("pageUrl", pageUrl)


            var param = {};
            param.startTime = startTime
            param.endTime = endTime
            param.pageUrl = pageUrl;
            param = this.$qs.stringify(param)
            this.$axios({
                url: Api.addStayTime,
                method: "post",
                data: param
            }).then(resp => {
            })
        },
        getWxConfig() {
            var that = this;
            var conUrl = window.location.href;
            conUrl = conUrl.split('#')[0];
            // var param = new URLSearchParams();
            // param.append('url', conUrl);
            var param = {}
            param.url = conUrl
            param = this.$qs.stringify(param)
            this.$axios.post("/wx/login/getWxConfig", param).then(
                res => {
                    if (res.data.code == 200) {
                        var datas = res.data.datas;
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: datas.appId, // 必填，公众号的唯一标识
                            timestamp: datas.timestamp, // 必填，生成签名的时间戳
                            nonceStr: datas.nonceStr, // 必填，生成签名的随机串
                            signature: datas.signature,// 必填，签名
                            jsApiList: ['hideMenuItems', 'updateAppMessageShareData', 'updateTimelineShareData', 'chooseImage', 'uploadImage'] // 必填，需要使用的JS接口列表
                        });
                        wx.ready(function () {
                            wx.hideMenuItems({
                                // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
                                menuList: [
                                    "menuItem:share:qq",
                                    // "menuItem:copyUrl",
                                    // "menuItem:openWithSafari",
                                    "menuItem:openWithQQBrowser",
                                    "menuItem:share:QZone",
                                    "menuItem:share:weiboApp"
                                ]
                            });
                        });
                    }
                },
                err => {
                }
            );
        },

        createShare(title, desc, imgUrl, shareUrl) {
            if (!title) {
                title = '黑豆测评'
            }
            if (!desc) {
                desc = '专业心理测评，深入认识自己，成就更好的你'
            }
            if (!imgUrl) {
                imgUrl = 'https://file.heidouinfo.com/logo/logoh.png'
            }
            var curUserKey = localStorage.getItem("curUserKey")//当前用户的userKey
            var tfk = this.GetUrlParame('tfk');
            if (!tfk) {
                tfk = localStorage.getItem('tfk');
            }
            if (!shareUrl) {
                if (!curUserKey) {
                    shareUrl = window.location.origin + '/#/?tfk=' + tfk
                } else {
                    shareUrl = window.location.origin + '/#/?userKey=' + curUserKey + '&tfk=' + tfk
                }
            } else {
                if (shareUrl.indexOf('?') > 0) {
                    shareUrl = shareUrl + '&tfk=' + tfk
                } else {
                    shareUrl = shareUrl + '?tfk=' + tfk
                }
            }
            wx.ready(function () {
                wx.updateAppMessageShareData({//分享给朋友
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: imgUrl, // 分享图标
                    success: function () {
                        // 设置成功
                    }
                });
                wx.updateTimelineShareData({
                    title: title, // 分享标题
                    link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: imgUrl, // 分享图标
                    success: function () {
                        // 设置成功
                    }
                })
            });
        },

        //创建订单
        wxPay(appraisalId, yuanPrice, payStage, number) {
            //需要先判断是否是微信浏览器，并且微信内置包是否加载完成
            //有时会出现当触发事件的时候微信内置包还未加载完成，必须加上下面判断
            var that = this;
            //执行下面方法
            // var param = new URLSearchParams();
            // param.append('appraisalId', appraisalId);
            // param.append('yuanPrice', yuanPrice);

            var param = {};
            param.appraisalId = appraisalId
            param.yuanPrice = yuanPrice
            param.useType = payStage
            param.tfk = localStorage.getItem("tfk")
            if (number != "测后") {
                param.commodityNum = number
            }
            if (localStorage.getItem("shareUserKey")) {
                // param.append('userKey', localStorage.getItem("shareUserKey"));
                // param.append('shareTime', localStorage.getItem("shareUserKeyTime"));
                param.userKey = localStorage.getItem("shareUserKey")
                param.shareTime = localStorage.getItem("shareUserKeyTime")
            }
            param = this.$qs.stringify(param)
            this.$axios.post("/wx/pay/createOrder", param).then(
                res => {
                    if (res.data.code == 200) {
                        if (payStage != '2') {
                            if (number == "测后") {
                                var orderNo = res.data.datas.orderNo;
                                that.checkPageMin(appraisalId, res.data.datas.orderNo)
                            } else {
                                var wxPay = res.data.datas.wxPay;
                                var orderNo = res.data.datas.orderNo;
                                var appId = wxPay.appId;
                                var timeStamp = wxPay.timeStamp;
                                var nonceStr = wxPay.nonceStr;
                                var packageValue = wxPay.packageValue;
                                var paySign = wxPay.paySign;
                                var signType = wxPay.signType;
                                if (typeof WeixinJSBridge == "undefined") {
                                    this.$root.canClick = true;
                                    if (document.addEventListener) {
                                        document.addEventListener('WeixinJSBridgeReady', that.onBridgeReady(appId, timeStamp, nonceStr, packageValue, paySign, signType, orderNo), false);
                                    } else if (document.attachEvent) {
                                        document.attachEvent('WeixinJSBridgeReady', that.onBridgeReady(appId, timeStamp, nonceStr, packageValue, paySign, signType, orderNo));
                                        document.attachEvent('onWeixinJSBridgeReady', that.onBridgeReady(appId, timeStamp, nonceStr, packageValue, paySign, signType, orderNo));
                                    }
                                } else {

                                    that.onBridgeReady(appId, timeStamp, nonceStr, packageValue, paySign, signType, orderNo);
                                }
                            }

                        } else {
                            var wxPay = res.data.datas.wxPay;
                            var orderNo = res.data.datas.orderNo;
                            var appId = wxPay.appId;
                            var timeStamp = wxPay.timeStamp;
                            var nonceStr = wxPay.nonceStr;
                            var packageValue = wxPay.packageValue;
                            var paySign = wxPay.paySign;
                            var signType = wxPay.signType;
                            that.onBridgeReady(appId, timeStamp, nonceStr, packageValue, paySign, signType, orderNo, payStage);
                        }
                    } else {
                        this.$root.canClick = true;
                        Toast.fail(res.data.message);
                    }
                },
                err => {
                    this.$root.canClick = true;
                }
            );


        },
        //未完成订单重新支付
        rePay(orderNo, payStage) {
            var that = this;
            // var param = new URLSearchParams();
            // param.append("orderNo", orderNo);
            var param = {};
            param.orderNo = orderNo;
            param = this.$qs.stringify(param)
            this.$axios.post("/wx/pay/rePay", param).then(
                res => {
                    if (res.data.code == 200) {
                        var wxPay = res.data.datas.wxPay;
                        var orderNo = res.data.datas.orderNo;
                        var appId = wxPay.appId;
                        var timeStamp = wxPay.timeStamp;
                        var nonceStr = wxPay.nonceStr;
                        var packageValue = wxPay.packageValue;
                        var paySign = wxPay.paySign;
                        var signType = wxPay.signType;
                        that.onBridgeReady(appId, timeStamp, nonceStr, packageValue, paySign, signType, orderNo, payStage);
                    } else {
                        Toast.success(res.data.message);
                    }
                },
                err => {
                    console.log(err)
                }
            );
        },
        //api方法
        onBridgeReady(appId, timeStamp, nonceStr, packageValue, paySign, signType, orderNo, payStage) {
            var that = this;
            this.$root.canClick = true;
            this.isShowOne = false;
            this.locastoritn = false;

            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId": appId, //需要在微信绑定商户号，成功之后会生成有appid
                    "timeStamp": timeStamp, //时间戳，自1970年以来的秒数，前端需要从后台获取该数据
                    "nonceStr": nonceStr, //随机串，前端需要从后台获取该数据
                    "package": packageValue,//前端需要从后台获取该数据
                    "signType": signType, //微信签名方式,默认为"MD5",也可以从后台获取
                    "paySign": paySign //微信签名，前端需要从后台获取该数据
                },
                function (res) {
                    console.log(res, "是否支付成功！")
                    //这个步骤非常重要，调试期间会报上相应的错误信息，因为微信调试工具是无法实际支付的，并且微信上是无法调试的，只能在这里alert
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        //获取订单最新数据
                        // var param = new URLSearchParams();
                        // param.append("orderNo", orderNo);
                        var param = {};
                        param.orderNo = orderNo;
                        param = that.$qs.stringify(param);
                        that.$axios.post("/wx/pay/getOrder", param).then(
                            res => {
                                if (res.data.code == 200 && res.data.datas.appraisalId) {
                                    if (payStage == 2) {
                                        that.$router.push({
                                            path: "/okbuy",
                                        })
                                    }else {
                                        that.checkPageMin(res.data.datas.appraisalId, orderNo)
                                    }
                                }
                            },
                            err => {
                            }
                        );
                    } else {
                        //支付失败
                        Toast.fail("支付失败");
                    }
                }
            );
        },
        //支付成功后判断页面跳转
        checkPageMin(appraisalId, orderNo) {
            //判断是否需要进男女选择页
            var that = this
            var param = {}
            param.appraisalId = appraisalId
            param = that.$qs.stringify(param)
            return axios({
                url: Api.getAppraisalHomeContent,
                method: "post",
                data: param
            }).then(resp => {
                if (resp.data.code == 200) {
                    var appraisalHomeContent = resp.data.datas;
                    if (appraisalHomeContent && appraisalHomeContent.notice) {
                        //去须知页面
                        that.$router.push({
                            path: "/XuZhi",
                            query: { appraisalId: appraisalId, orderNo: orderNo }
                        })
                    } else {
                        if (appraisalHomeContent && appraisalHomeContent.content) {
                            that.$router.push({
                                path: "/QuestionTitle",
                                query: {
                                    appraisalId: appraisalId,
                                    orderNo: orderNo
                                }
                            });
                        } else if (appraisalHomeContent.divisiveSex == 1) {
                            that.$router.push({
                                path: "/CheckedSex",
                                query: {
                                    appraisalId: appraisalId,
                                    orderNo: orderNo,
                                    testTime: appraisalHomeContent.testTime
                                }
                            })
                        } else if (appraisalHomeContent.divisiveSex == 0) {
                            that.$router.push({
                                path: "/AnswerPage",
                                query: {
                                    appraisalId: appraisalId,
                                    orderNo: orderNo,
                                    testTime: appraisalHomeContent.testTime
                                }
                            })
                        }
                    }
                }
            })
        },

        //自动登录
        doLogin(openid) {
            var that = this;
            var p = new Promise(function (resolve, reject) {
                that.$axios.post("/wx/login/doLogin", { code: that.$root.code, openid: openid }).then(
                    res => {
                        if (res.data.code == 200) {
                            localStorage.setItem("openid", res.data.datas.openid);
                            if (res.data.datas.userKey) {
                                localStorage.setItem("curUserKey", res.data.datas.userKey);//当前分销员的userkey
                            }
                        }
                        //后台提现绑定
                        var backKey = that.GetUrlParame('key');
                        if (backKey) {
                            var param = { 'key': backKey, 'openid': localStorage.getItem('openid') }
                            that.$axios.post("/api/backstage/account/authByCode", that.$qs.stringify(param)).then(
                                res => {
                                    if (res.data.code == 200) {
                                        console.log('后台绑定成功')
                                    }
                                },
                                err => {
                                }
                            );
                        }
                        resolve('ok')
                        var firstUrl = localStorage.getItem("firstUrl");
                        if (firstUrl) {
                            localStorage.setItem("firstUrl", '')
                            that.toPage(window.location.origin + '/' + firstUrl);
                        }

                    },
                    err => {
                    }
                );
            })
            return p
        },
        //截取地址参数值
        GetUrlParame(parameName) {
            /// 获取地址栏指定参数的值
            /// <param name="parameName">参数名</param>
            // 获取url中跟在问号后面的部分
            var parames = window.location.href;
            parames = parames.substring(parames.indexOf('?'));
            // 检测参数是否存在
            if (parames.indexOf(parameName) > -1) {
                var parameValue = ''
                parameValue = parames.substring(parames.indexOf(parameName), parames.length)
                // 检测后面是否还有参数
                if (parameValue.indexOf('&') > -1) {
                    // 去除后面多余的参数, 得到最终 parameName=parameValue 形式的值
                    parameValue = parameValue.substring(0, parameValue.indexOf('&'))
                }
                // 去掉参数名, 得到最终纯值字符串
                parameValue = parameValue.replace(parameName + '=', '')
                return parameValue
            }
        },
        //获取上级userkey并保存
        getUserkey() {
            var that = this;
            var userKey = this.GetUrlParame('userKey');
            var tfk = this.GetUrlParame('tfk');
            // localStorage.setItem("curUserKey",userKey)//当前分销员userKey，在登录时候获取再存
            if (userKey) {
                localStorage.setItem("shareUserKey", userKey)//除分销员邀请外接收的userKey，绑定客户关系的userKey
                localStorage.setItem("shareUserKeyTime", new Date().getTime())
                that.bindUserKey = userKey//上级的userKey
            }
            if (tfk) {
                localStorage.setItem('tfk', tfk);
            } else {
                if (!localStorage.getItem('tfk')) {
                    localStorage.setItem('tfk', 1);
                }
            }

        },
        getDispacth() {
            var temp = { 'tfk': localStorage.getItem('tfk') };
            this.$store.dispatch("getLogo", temp)
        },

        toAuthUrl() {
            //请求授权地址
            var that = this;
            var firstUrl = window.location.hash;
            localStorage.setItem('firstUrl', firstUrl);
            // var param = new URLSearchParams();
            var param = {}
            var formatUri = window.location.hash;
            if (formatUri.indexOf('?') > -1) {
                formatUri = formatUri.substring(0, formatUri.indexOf('?'));
            }
            // param.append("toUrl", formatUri);
            param.toUrl = formatUri
            param = this.$qs.stringify(param)
            this.$axios.post("/wx/login/getAuthUrl", param).then(
                res => {
                    if (res.data.code == 200) {
                        that.toPage(res.data.datas);
                    }
                },
                err => {
                }
            );
        },
        toPage(url) {
            window.location.href = url;
        }
    },
    router,
    store,
    render: h => h(App)

}).$mount('#app')
