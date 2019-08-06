<template>
    <div class="saysPromoter">
        <div class="apply-con" v-html="content"></div>
        <div class="applyBtn" @click="applyBtn">申请成为推广员</div>
        <van-popup v-model="show" position="bottom">
            <div class="inputShow">
                <p>申请资料</p>
                <div class="inpt">
                    <van-cell-group>
                        <van-field v-model="value" label="用户姓名" :required="true" placeholder="请输入用户名"/>
                        <van-field v-model="phone" label="手机号" @blur="phoneBlur()" :required="true"
                                   placeholder="请输入手机号"/>
                        <van-field v-model="sms" center clearable placeholder="请输入短信验证码">
                            <van-button slot="button" size="small" type="primary" v-if="codeState" @click="getCode">
                                获取验证码
                            </van-button>
                            <van-button slot="button" size="small" style="background: #727272;color: white"
                                        :disabled="true" v-else @click="getCode">{{countdownTime}}&nbspS
                            </van-button>
                        </van-field>
                    </van-cell-group>
                    <div class="subBtn" @click="subBtn">提交</div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import Api from '../Api'
    import {Toast} from 'vant';

    export default {
        name: "SaysPromoter",
        data() {
            return {
                show: false,
                value: "",//用户名字
                phone: "",//手机号码
                sms: "",//验证码
                sendPhone: "",//传给后台的电话
                countdownTime:120,//倒计时时间
                codeState: true,//验证码发送的状态
                phoneCode: "",//返回的验证码
                content:"",//推广说明
            }
        },
        created() {
            this.getPageSet()
        },
        methods: {
            //下拉框
            applyBtn() {
                this.show = !this.show
            },
            //获取验证码
            getCode() {
                var reg = /^1[3456789]\d{9}$/
                if (reg.test(this.phone) && this.phone != "") {
                    // var param = new URLSearchParams()
                    // param.append("phone", this.sendPhone)
                    var param={};
                    param.phone=this.sendPhone;
                    param=this.$qs.stringify(param)
                    this.$axios({
                        url: Api.sendMsg,
                        method: "post",
                        data: param
                    }).then(resp => {
                        if (resp.data.code == 200) {
                            this.phoneCode = resp.data.datas.code
                            this.countdown()
                            this.codeState = false
                        }
                    })
                }
            },
            //验证码倒计时
            countdown() {
                var that = this
                var time = 120
                var setTimr = setInterval(function () {
                    if (time >= 0) {
                        that.countdownTime = time--;
                    } else {
                        that.codeState = true
                        clearInterval(setTimr)
                    }
                }, 1000)
            },
            //电话输入框失焦判断正则
            phoneBlur() {
                var reg = /^1[3456789]\d{9}$/
                if (reg.test(this.phone) && this.phone != "") {
                    this.sendPhone = this.phone
                } else {
                    Toast.fail('手机号码格式不正确');
                }
            },

            //提交申请
            subBtn() {
                // var param = new URLSearchParams();
                var param={}
                //获取上级userKey
                var bindUserKey = this.$root.bindUserKey
                if (bindUserKey) {
                    // param.append("fromUserKey", bindUserKey)
                    param.fromUserKey=bindUserKey;
                }
                if (this.value) {
                    // param.append("alias", this.value);
                    param.alias=this.value
                } else {
                    Toast.fail('姓名不能为空');
                    return;
                }
                if (this.sendPhone && this.sendPhone != "") {
                    // param.append("phone", this.sendPhone)
                    param.phone=this.sendPhone
                } else {
                    Toast.fail('手机号码格式不正确或为空');
                    return
                }
                if (this.phoneCode != this.sms) {
                    Toast.fail('验证码不正确');
                    return;
                }
                param=this.$qs.stringify(param)
                this.$axios({
                    url: Api.addDisUser,
                    method: "post",
                    data: param
                }).then(resp => {
                    if (resp.data.code==200) {
                        this.$router.push("/Audit")
                    }
                })
            },
            //获取推广说明
            getPageSet(){
                this.$axios({
                    url:Api.getRecruitPageSet,
                    method:"post",
                }).then(resp=>{
                    if (resp.data.code==200){
                        this.content=resp.data.datas.content
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .saysPromoter {

        .apply-con {
            font-size: 0.24rem;
            padding: 0 0.4rem;
        }
        .applyBtn {
            font-size: 0.28rem;
            background: #9b704e;
            color: white;
            text-align: center;
            height: 0.8rem;
            line-height: 0.8rem;
            position: fixed;
            width: 100%;
            bottom: 50px;
        }
    }

    .inputShow {
        /*border: 1px solid black;*/
        height: 230px;
        width: 100%;

        p {
            font-size: 0.28rem;
            text-align: center;
            /*border-bottom: 1px solid #f5f5f5;*/
            padding-bottom: 0.2rem;
        }

        .inpt {
            /*border: 1px solid black;*/
            padding: 0 0.3rem;
        }

        .subBtn {
            font-size: 0.28rem;
            background: #9b704e;
            color: white;
            text-align: center;
            height: 0.8rem;
            line-height: 0.8rem;
            position: fixed;
            width: 100%;
            bottom: 0px;
            left: 0;
        }
    }
</style>