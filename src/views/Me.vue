<template>
  <div class="mePage">
    <div class="uerImg">
      <div class="bgimg">
        <img :src="userInfo.avatar" alt />
      </div>
      <div class="smollImg">
        <div class="user-smoll-ing">
          <img :src="userInfo.avatar" alt />
        </div>
        <span>{{ userInfo.nickname}}</span>
        <!--                <div class="chaKan">查看收益
                    <van-icon name="arrow"/>
        </div>-->
      </div>
    </div>
    <div class="mePageNav">
      <div class="mePageNav-text">
        <div
          class="listMePageNav-text"
          v-for="(item,index) in  mePageNavData"
          :key="index"
          ref="name"
        >
          <van-goods-action-mini-btn
            :icon="item.icon"
            :text="item.title"
            @click="onClickMiniBtn(index,item.path)"
          />
        </div>
      </div>
    </div>
    <div :class="mePageNavData.length >='5'? 'cePinText1' : 'cePinText2'"></div>
    <div class="cePinNav">
      <van-tabs v-model="active" @click="testPro">
        <van-tab title="未完成">
          <div class="MeContent">
            <div class="contentNone" v-if="completeData.length<=0">
              <div class="contentNoneIcon contentNoneCon">
                <van-icon name="goods-collect-o" />
              </div>
              <div class="contentNoneText contentNoneCon">没有任何测评</div>
              <div class="contentNoneText1 contentNoneCon">您已购买的测评会显示在这里</div>
              <div class="contentNoneBtn contentNoneCon">
                <van-button type="default" to="/classificationPage">去看看</van-button>
              </div>
            </div>
            <div class="anyContent" v-else>
              <div class="listContent" v-for="(item,index) in completeData" :key="index">
                <van-card
                  :tag="item.typeName"
                  :price="item.currentPriceStr"
                  :title="item.title"
                  :thumb="item.picAddr"
                  :origin-price="item.originalPriceStr"
                >
                  <div slot="footer">
                    <van-button
                      size="small"
                      style="background: rgba(255,226,104,0.36);border:1px solid rgba(255,164,0,0.48)"
                      @click="goodsPage(item.appraisalId,item.orderNo)"
                    >去测试</van-button>
                  </div>
                </van-card>
                <div class="order-time">
                  <div class="time">下单时间：{{item.createDateFormat}}</div>
                  <!--                                    <div class="order">订单编号：<span>{{item.order}}</span><button class="tag-read" data-clipboard-text="我是可以复" @click="copyOrder">复制</button></div>-->
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="已完成">
          <div class="MeContent">
            <div class="contentNone" v-if="unfinishedData.length<=0">
              <div class="contentNoneIcon contentNoneCon">
                <van-icon name="orders-o" />
              </div>
              <div class="contentNoneText contentNoneCon">没有任何测评</div>
              <div class="contentNoneText1 contentNoneCon">您已完成的测评会显示在这里</div>
              <div class="contentNoneBtn contentNoneCon">
                <van-button type="default" to="/classificationPage">去看看</van-button>
              </div>
            </div>
            <div class="anyContent" v-else>
              <div class="listContent" v-for="(item,index) in unfinishedData" :key="index">
                <van-card
                  :tag="item.typeName"
                  :price="item.currentPriceStr"
                  :title="item.title"
                  :thumb="item.picAddr"
                  :origin-price="item.originalPriceStr"
                >
                  <div slot="footer">
                    <van-button
                      size="small"
                      style="background: rgba(255,226,104,0.36);border:1px solid rgba(255,164,0,0.48);padding:0 4px"
                      @click="baoGao(item.orderNo,item.appraisalId)"
                    >查看报告</van-button>
                  </div>
                </van-card>
                <div class="order-time">
                  <div class="time">完成时间：{{item.testDateFormat}}</div>
                  <!--                                    <div class="order">订单编号：<span>{{item.order}}</span><button class="tag-read" data-clipboard-text="我是可以复" @click="copyOrder">复制</button></div>-->
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="收藏">
          <div class="MeContent">
            <div class="contentNone" v-if="collectionData.length<=0">
              <div class="contentNoneIcon contentNoneCon">
                <van-icon name="star-o" />
              </div>
              <div class="contentNoneText contentNoneCon">没有任和收藏</div>
              <div class="contentNoneText1 contentNoneCon">您所收藏的记录会显示在这里</div>
              <div class="contentNoneBtn contentNoneCon">
                <van-button type="default" to="/classificationPage">去看看</van-button>
              </div>
            </div>
            <div class="collection" v-else>
              <van-card
                style="margin-top: 5px"
                v-for="(item,index) in collectionData"
                :key="index"
                :tag="item.typeName"
                :price="item.currentPriceStr"
                :title="item.title"
                :thumb="item.picAddr"
                :origin-price="item.originalPriceStr"
                @click="collection(item.appraisalId)"
              ></van-card>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import { Toast } from "vant";
import Api from "../Api";
export default {
  name: "Me",
  components: {},
  data() {
    return {
      active: 0,
      mePageNavData: [], //我的订单那行的单行
      completeData: [], //完成的订单
      unfinishedData: [], //未完成的订单
      collectionData: [], //收藏的数据
      userInfo: {}, //个人信息
      myDate: "",
      path: ""
    };
  },
  beforeCreate() {
    //个人信息的请求
    this.$axios({
      url: Api.getCurUserInfo,
      method: "get",
      data: ""
    }).then(resp => {
      if (resp.data.code == 200) {
        this.userInfo = resp.data.datas;
      }
    });
    // 初始加载
    this.$axios({
      url: Api.getUndoneOrder,
      method: "get",
      data: ""
    }).then(resp => {
      this.completeData = resp.data.datas;
    });
  },
  created() {
    this.myDate = new Date().getTime();
    this.path = window.location.hash;
  },
  mounted() {
    this.getTfk();
  },
  beforeDestroy() {
    var endtim = new Date().getTime();
    this.$root.myDay(this.myDate, endtim, this.path);
  },
  methods: {
    //判断有没有tfk
    getTfk() {
      var tfk = localStorage.getItem("tfk");
      if (tfk != 1) {
        this.mePageNavData = [
          {
            id: 1,
            icon: "location",
            title: "我的足迹",
            path: "/FootprintPage"
          },
          {
            id: 2,
            icon: "chat-o",
            title: "我的订单",
            path: "/ConsultingPage"
          },
          {
            id: 3,
            icon: "more-o",
            title: "意见反馈",
            path: "/Feedback"
          }
        ];
      } else {
        this.mePageNavData = [
          {
            id: 1,
            icon: "location",
            title: "我的足迹",
            path: "/FootprintPage"
          },
          {
            id: 2,
            icon: "chat-o",
            title: "我的订单",
            path: "/ConsultingPage"
          },
          {
            id: 3,
            icon: "friends-o",
            title: "推广中心",
            path: "/ToPromote"
          },
          {
            id: 4,
            icon: "more-o",
            title: "意见反馈",
            path: "/Feedback"
          },
          {
            id: 5,
            icon: "gift-o",
            title: "我的赠礼",
            path: "/mygift"
          }
        ];
      }
    },

    //测试进度
    testPro(index) {
      //未完成请求
      if (index == 0) {
        this.$axios({
          url: Api.getUndoneOrder,
          method: "get",
          data: ""
        }).then(resp => {
          this.completeData = resp.data.datas;
        });
      } else if (index == 1) {
        //已完成请求
        this.$axios({
          url: Api.getDoneOrder,
          method: "get",
          data: ""
        }).then(resp => {
          this.unfinishedData = resp.data.datas;
        });
      } else if (index == 2) {
        //收藏请求
        this.$axios({
          url: Api.getMyCollect,
          method: "get"
        }).then(resp => {
          this.collectionData = resp.data.datas;
        });
      }
    },
    //足迹，订单跳转
    onClickMiniBtn(index, path) {
      this.$router.push(path);
    },
    //拷贝订单号码
    copyOrder() {
      var clipboard = new Clipboard(".tag-read");
      clipboard.on("success", e => {
        Toast.success("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        Toast.fail("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    //点击跳转测前详情
    goodsPage(appraisalId, orderNo) {
      var obj = { appraisalId: appraisalId, orderNo: orderNo };
      this.$store.dispatch("checkPage", obj).then(resp => {
        var appraisalHomeContent = this.$store.state.checkPage
          .appraisalHomeContent;
        if (appraisalHomeContent != null && appraisalHomeContent.notice != "") {
          //去须知页面
          this.$router.push({
            path: "/XuZhi",
            query: { appraisalId: appraisalId, orderNo: orderNo }
          });
        } else {
          if (
            appraisalHomeContent != null &&
            appraisalHomeContent.content != ""
          ) {
            this.$router.push({
              path: "/QuestionTitle",
              query: {
                appraisalId: appraisalId,
                orderNo: orderNo
              }
            });
          } else if (appraisalHomeContent.divisiveSex == 1) {
            this.$router.push({
              path: "/CheckedSex",
              query: {
                appraisalId: appraisalId,
                orderNo: orderNo,
                testTime: appraisalHomeContent.testTime
              }
            });
          } else if (appraisalHomeContent.divisiveSex == 0) {
            this.$router.push({
              path: "/AnswerPage",
              query: {
                appraisalId: appraisalId,
                orderNo: orderNo,
                testTime: appraisalHomeContent.testTime
              }
            });
          } else if (
            (appraisalHomeContent.notice =
              null || appraisalHomeContent.notice == "")
          ) {
            this.$router.push({});
          }
        }
      });
    },
    //跳转报告页面
    baoGao(orderNo, id) {
      //还需要获取订单号
      this.$router.push({
        path: "/BaoGao",
        query: {
          orderNo: orderNo,
          appraisalId: id
        }
      });
    },
    //收藏页跳转到详情
    collection(id) {
      this.$router.push({
        path: "/GoodsDetails",
        query: {
          id: id
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.van-card {
  padding-top: 0.3rem;
  background: white;
}
.van-card__bottom {
  margin-top: 5px;
}
/deep/ .van-card__price {
  /*margin-top: 28px;*/
  color: #ffa500;
  font-weight: bold;
}
/deep/.van-tabs__line {
  background: #ffe268;
}
.van-card__title {
  font-size: 0.3rem;
  font-weight: bold;
  height: 0.32rem;
  line-height: 0.32rem;
  max-height: none;
  padding-top: 0.1rem;
}
/deep/ .van-card__thumb {
  img {
    /*border: 1px solid black;*/
    border-radius: 2px;
  }
}
.van-goods-action-mini-btn {
  font-size: 14px;
}

.mePage {
  padding-bottom: 1.4rem;
  .cePinNav {
    width: 100%;

    .contentNone {
      padding: 30px 0;
      height: 200px;
      width: 100%;
      background: whitesmoke;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .contentNoneCon {
        text-align: center;
      }

      .contentNoneIcon {
        font-size: 64px;
      }

      .contentNoneText {
        font-size: 16px;
        font-weight: bold;
        color: black;
      }

      .contentNoneText1 {
        margin-top: 10px;
        margin-bottom: 30px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.35);
      }
    }
  }

  .cePinText1 {
    background: whitesmoke;
    height: 100px;
    margin-top: 7px;
  }
   .cePinText2 {
    background: whitesmoke;
    height: 35px;
    margin-top: 7px;
  }

  position: relative;

  .uerImg {
    width: 100%;
    height: 160px;
    overflow: hidden;
    position: relative;
    .bgimg {
      img {
        transform: scale(4, 2);
        filter: blur(10px);
      }
    }

    .smollImg {
      position: absolute;
      top: 0;
      background: rgba(254, 254, 254, 0.2);
      width: 100%;
      height: 160px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .user-smoll-ing {
        width: 60px;
        height: 60px;
        border-radius: 50% 50%;
        overflow: hidden;
        margin-left: 20px;

        img {
          width: 60px;
          height: 60px;
        }
      }

      span {
        color: #727272;
        font-size: 14px;
        padding-left: 20px;
      }

      .chaKan {
        position: absolute;
        top: 20px;
        right: 10px;
        font-size: 12px;
        height: 14px;
        line-height: 14px;
      }
    }
  }

  .mePageNav {
    width: 100%;
    // height: 80px;
    position: absolute;
    top: 126px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    

    .mePageNav-text {
      background: white;
    //   height: 60px;
      width: 90%;
      border-radius: 6px;
      display: flex;
    //   justify-content: space-around;
    //   flex-direction: row;
    //   align-items: center;
      flex-wrap:wrap;
      padding-top: 10px;

      .listMePageNav-text {
        width: 25%;
        height: 60px;
        // padding-top: 10px;
      }
    }
  }
}
.listContent {
  margin-top: 5px;
  position: relative;
  /*padding-top: 0.1rem;*/
  background: #fafafa;
  .order-time {
    /*border: 1px solid black;*/
    width: 60%;
    position: absolute;
    top: 45px;
    left: 113px;
    margin-top: 19px;
    .time {
      font-size: 12px;
      color: #727272;
    }
    .order {
      font-size: 12px;
      color: #727272;
      span {
        color: black;
      }
      button {
        border-radius: 1px;
        border: none;
      }
    }
  }
}
</style>