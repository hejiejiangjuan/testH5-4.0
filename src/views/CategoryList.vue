<template>
    <div class="CategoryList">
        <p class="CategoryList-tetile" v-if="CategoryData!=null&&CategoryData.length>0">为您找到以下跟<span>'{{value}}'</span>有关的内容
        </p>
        <p class="CategoryList-tetile" v-else>没有为您找到以下跟<span>'{{value}}'</span>有关的内容</p>
        <div class="prinGoods" v-for="(item ,index) in CategoryData" :key="index" @click="goodsDatile(item.id)">
            <div class="">
                <van-card :tag="item.typeName" :price="item.currentPriceStr" :desc="item.subhead" :title="item.title"
                          :thumb="item.picAddr">
                    <div slot="footer">
                        {{item.userNumStr}}人已测
                    </div>
                </van-card>
            </div>
        </div>
    </div>
</template>

<script>
    import Api from "../Api"

    export default {
        name: "CategoryList",
        data() {
            return {
                CategoryData: [],
                value: "",
                curPage: 1,//当前页
                pageSize: 10,//获取条数
                myDate: "",
                path: "",
            }
        },
        created() {
            window.addEventListener('scroll', this.onScroll);
            this.CategoryData = this.$store.state.searchPage.serData
            this.value = this.$store.state.searchPage.value
            this.myDate = new Date().getTime()
            this.path = window.location.hash
        },
        beforeDestroy() {
            var endtim = new Date().getTime()
            this.$root.myDay(this.myDate, endtim, this.path)
        },
        //监听state的数据变化
        computed: {
            listenshowpage() {
                return this.$store.state.searchPage.value
            },
            searchData() {
                this.CategoryData = this.$store.state.searchPage.serData
            }
        },
        //监听computed的数据变化，再赋值给搜索框的value
        watch: {
            listenshowpage: function (old, newd) {
                this.value = old;
            },
            searchData(old, newd) {
                this.CategoryData = old
            }
        },
        methods: {
            goodsDatile(id) {
                this.$router.push({
                    path: "/GoodsDetails",
                    query: {
                        id: id
                    }
                })
            },
            onScroll() {
                //滚动条顶部的高度
                let innerHeight = document.documentElement.scrollTop || document.body.scrollTop;
                //屏幕尺寸高度
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                //可滚动容器超出当前窗口显示范围的高度
                let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                if (innerHeight + windowHeight == scrollHeight) {
                    //发起请求
                    let curPage = curPage += 1
                    // var parma = new URLSearchParams()
                    // parma.append("curPage", curPage);
                    // parma.append("content", this.value);
                    // parma.append("pageSize", this.pageSize)

                    var param={};
                    param.curPage=curPage;
                    param.content=this.value;
                    param.pageSize=this.pageSize;
                    param=this.$qs.stringify(param);
                    this.$axios({
                        url: Api.searchAppraisal,
                        method: "post",
                        data: param
                    }).then(resp => {
                        if (resp.data.code == 200) {
                            for (let i = 0; i < resp.data.datas.length; i++) {
                                this.CategoryData.push(resp.data.datas[i])
                            }
                        }
                    })

                }
            }
        }
    }
</script>

<style scoped lang="less">
    .van-card__footer {
        color: #727272;
    }
    /deep/ .van-card__price {
        color: #ffa500;
        font-weight: bold;
    }
    .van-card__title{
        font-weight: bold;
        font-size: 0.3rem;
        height: 0.32rem;
        line-height: 0.32rem;
        max-height: none;
    }
    /deep/ .van-card__footer {
        position: absolute;
        bottom: 12px;
        right: 12px;
    }

    /deep/ .van-card__price {
        margin-top: 28px;
    }

    .listGoods {
        position: relative;
    }

    .CategoryList-tetile {
        font-size: 14px;
        color: #727272;
        padding-left: 15px;

        span {
            color: black;
        }

    }
</style>