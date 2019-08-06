<template>
    <div class="AcceptInvitation">
        <div class="bgImg">
            <img src="../assets/imgs/ccc.jpg" alt="">
        </div>
        <div class="AcceptCon">
            <div class="userInfo">
                <div class="userImg">
                    <img :src="userInfo.avatar" alt="">
                </div>
                <div class="userText">
                    <p>{{userInfo.nickname}}</p>
                    <p>我在致富的路上等你，一起来吧！</p>
                </div>
            </div>
            <div class="accept-text">
                <p>邀请你一起加入</p>
                <p>推广成功赚佣金</p>
            </div>
            <div class="acceptBtn"><p @click="toToPromote">接受邀请</p></div>
        </div>
    </div>
</template>

<script>
    import Api from "../Api"

    export default {
        name: "AcceptInvitation",
        data() {
            return {
                userInfo: {}
            }
        },
        mounted() {
            var that = this;
            if(!this.$root.hasLogin){//未登录
                that.$root.initMain().then(that.superiorInfo)
            }else{
                that.superiorInfo();
            }
        },
        // created() {
        // },
        methods: {
            //获取上级的信息
            superiorInfo() {
                //获取上级的userKey
                var userKey = this.$root.GetUrlParame('userKey');
                // var param = new URLSearchParams()
                // param.append("userKey", userKey)
                var param={};
                param.userKey=userKey;
                param=this.$qs.stringify(param)
                this.$axios({
                    url: Api.getInviteUserInfo,
                    method: "post",
                    data: param
                }).then(resp => {
                    if (resp.data.code == 200) {
                        this.userInfo = resp.data.datas
                    }
                })

            },
            //点击接受要请直接到推广中心，如果要
            toToPromote() {
                this.$router.push("/ToPromote")
            }
        }
    }
</script>

<style scoped lang="less">
    .bgImg {
        /*border: 1px solid black;*/
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        bottom: 0;

        img {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            bottom: 0;
        }

    }

    .AcceptCon {
        /*border: 1px solid black;*/
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;

        .userInfo {
            /*border: 1px solid black;*/
            display: flex;
            justify-content: flex-start;
            padding: 0 0.5rem;
            margin-top: 0.6rem;

            .userImg {
                /*border: 1px solid red;*/
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
                overflow: hidden;
                position: relative;

                img {
                    position: absolute;
                    top: 0;
                    width: 1rem;
                    height: 1rem;
                }
            }

            .userText {
                /*border: 1px solid blue;*/
                margin-left: 0.2rem;

                p:nth-child(1) {
                    font-size: 0.32rem;
                    margin: 0;
                    margin-top: 0.1rem;
                    font-weight: bold;
                }

                p:last-child {
                    font-size: .24rem;
                    margin: 0;
                    margin-top: 0.1rem;
                }
            }

        }

        .accept-text {
            margin-top: 3.5rem;

            p {
                font-size: 0.6rem;
                margin: 0;
                text-align: center;
                color: darkred;
            }
        }

        .acceptBtn {
            /*border: 1px solid blue;*/
            display: flex;
            justify-content: center;
            margin-top: 2.5rem;

            p {
                background: #d4b537;
                font-size: 0.4rem;
                font-weight: bold;
                color: darkred;
                width: 50%;
                height: 0.9rem;
                text-align: center;
                line-height: 0.9rem;
                border-radius: 50px;
                border: 3px solid #fff77c;
            }
        }
    }
</style>