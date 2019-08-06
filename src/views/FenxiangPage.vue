<template>
    <div>
        <div class="fenxiangImg">
            <img src="../assets/imgs/1.jpg" alt="">
        </div>
        <div class="fenxiangContent">
            <div class="fenxiangContent-text">
                <div class="fenxiangIcon" ><van-icon class-prefix="my-icon" name="44" />发朋友圈示例</div>
                <div class="userText">
                    <div class="userImg">
                        <img src="../assets/imgs/6.jpg" alt="">
                    </div>
                    <div class="userContent">
                        <div class="userNum">
                            <p class="userName">username</p>
                            <p class="userNumber">1233466人已发朋友圈</p>
                        </div>
                        <div class="userText">
                            这是描述的内容这是描述的内容这是描述的内容这是描述的内容这是描述的内容的内容这是描述的内容的内容这是描述的内容
                        </div>
                        <div class="goodTitle">
                            <div class="goodsImg">
                                <img src="../assets/imgs/7.jpg" alt="">
                            </div>
                            <p class="goodsText"><span>爱情基因检测</span> | <span>你的爱情基因是什么属性</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="copy">
            <div class="copyText"><button class="tag-read" data-clipboard-text="我是可以复" @click="copy"> 复制朋友圈文案并分享</button></div>
        </div>
        
        <div class="copyTwo">
            <div class="copyTwo-img">
                <img src="../assets/imgs/2.jpg" alt="">
            </div>
            <div class="copyTwo-text">
                这里是复制文本 这里是复制文本 这里是复制文本 这里是复制文本 这里是复制文本这里是复制文本 这里是复制文本这里是复制文本 这里是复制文本这里是复制文本 这里是复制文本
            </div>
            <div class="copyTwo-link">
                <button class="tag-read" data-clipboard-text="我是第二额条的内容" @click="copyTwo"> 复制文案链接</button>
            </div>
        </div>
    </div>
</template>

<script>
    import Clipboard from 'clipboard';
    import { Toast } from 'vant';
    export default {
        name: "FenxiangPage",
        methods:{
            copy(){
                var clipboard = new Clipboard('.tag-read')
                clipboard.on('success', e => {
                    Toast.success('复制成功');
                    // 释放内存
                    clipboard.destroy()
                })
                clipboard.on('error', e => {
                    // 不支持复制
                    Toast.fail('该浏览器不支持自动复制');
                    // 释放内存
                    clipboard.destroy()
                })
            },
            copyTwo(){
                var clipboard = new Clipboard('.tag-read')
                clipboard.on('success', e => {
                    Toast.success('复制成功');
                    // 释放内存
                    clipboard.destroy()
                })
                clipboard.on('error', e => {
                    // 不支持复制
                    Toast.fail('该浏览器不支持自动复制');
                    // 释放内存
                    clipboard.destroy()
                })
            },
        },

    }
</script>

<style scoped lang="less">
.fenxiangImg{
    width: 100%;
    height: 260px;
    img{
        width:19.47rem;
        height:260px;
    }
}
    .fenxiangContent{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top:10px;
        .fenxiangContent-text{
            border: 1px solid rgba(0, 0, 0, 0.39);
            width:92%;
           padding-bottom: 10px;
            background:whitesmoke;
            position: relative;
            .fenxiangIcon{
                width:35%;
                font-size: 12px;
                text-align: center;
                position: absolute;
                top: -8px;
                right:98px;
                background: whitesmoke;
                padding-right: 2px;
            }
        }
    }
    .userText{
        display: flex;
        justify-content:space-between;
       padding: 5px 10px ;
        .userImg{
            width: 40px;
            height: 40px;
            border-radius: 2px;
            overflow: hidden;
            img{
                width: 40px;
                height: 40px;
            }
        }
        .userContent{
            width: 85%;
            .userNum{
                display: flex;
                justify-content: space-between;
                 padding-left:10px;
                .userNumber{
                    font-size: 12px;
                    color: #727272;
                    margin: 0;
                }
                .userName{
                    font-size: 12px;
                    color: blue;
                    margin: 0;
                }
            }
            .userText{
                font-size: 12px;
                color: black;
            }
        }
    }
    .goodTitle{
       display: flex;
        justify-content: center;
        flex-direction: row;
        padding: 5px 5px;
        background: wheat;
        .goodsImg{
            width: 25px;
            height: 25px;
            img{
                width: 25px;
                height: 25px;
            }
        }
        .goodsText{
            font-size: 14px;
            margin: 0;
            margin-left: 5px;
        }
    }
    .copy{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0;
        .copyText{
            font-size: 16px;
        }
    }
    .copyTwo{
        display: flex;
        justify-content: center;
        flex-direction:column;
        align-items: center;
        padding-bottom:80px;
        .copyTwo-img{
            width: 100%;
            height: 80px;
            img{
                width:19.73rem;
                height: 80px;
            }
        }
        .copyTwo-text{
            width: 92%;
            font-size: 14px;
            background: #e9e9e9;
            padding: 10px;
        }
        .copyTwo-link{
            font-size: 14px;
            color: burlywood;
            margin-top: 20px;
            button{
                border: none;
                background: whitesmoke;
            }
        }
    }
</style>