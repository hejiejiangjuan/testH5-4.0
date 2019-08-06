<template>
  <div class="home">
    <div class="homeSearch">
      <Search></Search>
    </div>
    <div class="lunbo">
      <van-swipe :autoplay="3000">
        <van-swipe-item
          style="max-height:7.2rem;max-width:7.5rem"
          v-for="(item, index) in lunbo"
          :key="index"
          @click="lunBo(item.id,item.homeId,item.type,item.addr)"
        >
          <img style="width:7.2rem;height:4.2rem" class="swipImg" :src="item.imgAddr" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="day-card" v-if="dayAll != null || dayAll != ''">
      <div class="day-cardcenter">
        <div class="daytop">
          <img class="day-img" src="@/assets/imgs/day.jpg" alt />
          <div @click="dayList(1)">
            换一批
            <van-icon name="replay" />
          </div>
        </div>
        <ul class="dayul">
          <li v-for="(item,index) in dayAll" :key="index">
            <div class="dayli"  @click="toadyList(index)">
              <img class="dat-centerimg" :src="item.picAddr" alt />
              <p class="dayp">{{item.title}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="hotTitle">
      <div class="hotCon">
        <span class="hotText">热卖</span>
        <span class="hotTextA">爆款</span>
      </div>
      <div class="hotTextB">不容错过的精彩测评</div>
    </div>
    <div>
      <div class="swiper">
        <v-touch
          v-on:swipeleft="onSwipeLeft"
          v-on:swiperight="onSwipeRight"
          :swipe-options="{direction:'horizontal'}"
        >
          <div class="swiper-items" :style="{marginLeft: margin+'rem',width:width+'rem'}">
            <div
              class="swiper-item"
              v-for="(item,index) in  hotData"
              :key="index"
              @click="hotDetails(item.id,item.homeId,item.type)"
            >
              <div class="hotImg">
                <img :src="item.picAddr" alt />
              </div>
              <div class="hot-text">{{item.userNumStr}}人已测</div>
              <div class="hot-title">{{item.title}}</div>
              <div class="hotTPrice" v-if="item.payStage != '2'">
                ￥
                <span>{{item.currentPriceStr}}</span>
              </div>
            </div>
          </div>
        </v-touch>
      </div>
    </div>
    <div class="newGoods">
      <div class="newTitle">
        <span class="newText">新品</span>
        <span class="newText-a">首发</span>
        <div class="newText-b">用新的视角遇见更好的自己</div>
      </div>
      <div>
        <!--  <van-swipe style="background: white; border: 8px solid white;" :loop="false" :show-indicators="false"
                           :width="126">
                    <van-swipe-item style="width: 120px;height: 180px;margin: 2px;position: relative"
                                    v-for="(item,index) in newData" @click="newDetails(item.id)">
                        <div class="hotImg">
                            <img :src="item.picAddr" alt="">
                        </div>
                        <div class="hot-text">{{item.formatCreateDate}}</div>
                        <div class="hot-title">{{item.title}}</div>
                        <div class="hotTPrice">￥<span>{{item.currentPriceStr}}</span></div>
                    </van-swipe-item>
        </van-swipe>-->

        <div class="swiper">
          <v-touch
            v-on:swipeleft="newonSwipeLeft"
            v-on:swiperight="newonSwipeRight"
            :swipe-options="{direction:'horizontal'}"
          >
            <div class="swiper-items" :style="{marginLeft: newMargin+'rem',width:newidth+'rem'}">
              <div
                class="swiper-item"
                v-for="(item,index) in newData"
                :key="index"
                @click="newDetails(item.id,item.homeId,item.type)"
              >
                <div class="hotImg">
                  <img :src="item.picAddr" alt />
                </div>
                <div class="hot-text">{{item.formatCreateDate}}</div>
                <div class="hot-title">{{item.title}}</div>
                <div class="hotTPrice" v-if="item.payStage != '2'">
                  ￥
                  <span>{{item.currentPriceStr}}</span>
                </div>
              </div>
            </div>
          </v-touch>
        </div>
      </div>
    </div>
    <div class="moreGoods">
      <van-cell-group @click="goodsBtn">
        <van-cell title="精选测评" value="更多" is-link />
      </van-cell-group>
      <div
        class="listGoods"
        v-for="(item ,index) in moreData"
        :key="index"
        @click="GoodsDetails(item.id,item.homeId,item.type)"
      >
        <van-card
          :tag="item.typeName"
          :price="item.payStage == '2'?'':item.currentPriceStr"
          :currency="item.payStage == '2'?'':'￥'"
          :desc="item.subhead"
          :title="item.title"
          :thumb="item.picAddr"
        >
          <div slot="footer">{{item.userNumStr}}人已测</div>
        </van-card>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
import Footer from "../components/Footer";
import Search from "../components/SearchTop";
import Api from "../Api";
import { constants } from "crypto";

export default {
  name: "home",
  components: {
    Search,
    Footer
  },
  data() {
    return {
      width: 0, //爆款的款
      margin: 0, //爆款的移动距离
      newidth: 0, //新的款
      newMargin: 0, //新品的移动距离
      lunbo: [],
      hotData: [],
      newData: [],
      moreData: [],
      myDate: "",
      path: "",
      dayAll: [],
      currentPage: 1,
      pageSize: 3,
      num: 0,
      total:"",
    };
  },
  mounted() {
    var that = this;
    if (!this.$root.hasLogin) {
      //未登录
      that.$root.initMain().then(that.initHome, that.dayList());
    } else {
      that.initHome();
      that.dayList();
    }
  },
  // mounted() {

  // },
  beforeDestroy() {
    var endtime = new Date().getTime();
    this.$root.myDay(this.myDate, endtime, this.path);
  },
  methods: {
    //   每日一测
    dayList(index) {
      var that = this;
      var params = new URLSearchParams();
      params.append("tfk", localStorage.getItem("tfk"));
      if (index == 1) {
        if(that.total > this.currentPage*that.pageSize){
          this.currentPage = this.currentPage += 1;
           params.append("currentPage", this.currentPage);
        }else {
           this.currentPage = 1
           params.append("currentPage", this.currentPage);
        }
      } else {
        params.append("currentPage", that.currentPage);
        that.num = that.currentPage;
      }

      params.append("pageSize", that.pageSize);
      that.$axios.post("/wx/home/getEveryDayList", params).then(
        res => {
          if (res.data.code == "200") {
            that.dayAll = res.data.datas.list;
            that.total =  res.data.datas.total
          } else {
          }
        },
        err => {}
      );
    },
    // 每日一测点击跳转
    toadyList(index){
         this.statistical(this.dayAll[index].id, 5);
        this.$router.push({
          path: "/GoodsDetails",
          query: {
            id: this.dayAll[index].id
          }
        });
    },


    initHome() {
      var tfk = this.$root.GetUrlParame("tfk");
      if (!tfk) {
        tfk = localStorage.getItem("tfk");
      }
      var temp = { tfk: tfk };
      var param = this.$qs.stringify(temp);
      this.$axios({
        url: Api.homeData,
        method: "post",
        data: param
      }).then(resp => {
        let lunBo = resp.data.datas;
        if (resp.data.code == 200) {
          this.lunbo = lunBo;
        }
      });
      //热卖的数据
      this.$axios({
        url: Api.getHotList,
        method: "post",
        data: param
      }).then(resp => {
        let hotData = resp.data.datas;
        if (resp.data.code == 200) {
          for (var i in hotData) {
            if (
              hotData[i].currentPriceStr == "0.00" &&
              (hotData[i].payStage == null||hotData[i].payStage == '')
            ) {
              hotData[i].currentPriceStr = "免费";
            } else if (
              hotData[i].currentPriceStr == "0.00" &&
              hotData[i].payStage == "1"
            ) {
              hotData[i].currentPriceStr = "免费";
            }
          }
          this.hotData = hotData;
          this.width = hotData.length * 2.4;
        }
      });
      //获取新品的数据
      this.$axios({
        url: Api.getNewList,
        method: "post",
        data: param
      }).then(resp => {
        let newData = resp.data.datas;
        if (resp.data.code == 200) {
          for (var i in newData) {
            if (
              newData[i].currentPriceStr == "0.00" &&
              (newData[i].payStage == null||newData[i].payStage == '')
            ) {
              newData[i].currentPriceStr = "免费";
            } else if (
              newData[i].currentPriceStr == "0.00" &&
              newData[i].payStage == "1"
            ) {
              newData[i].currentPriceStr = "免费";
            }
          }
          this.newData = newData;
          this.newidth = newData.length * 2.4;
        }
      });
      //获取精选的数据
      this.$axios({
        url: Api.getChoicenessList,
        method: "post",
        data: param
      }).then(resp => {
        let moreData = resp.data.datas;
        if (resp.data.code == 200) {
          for (var i in moreData) {
            if (
              moreData[i].currentPriceStr == "0.00" &&
              (moreData[i].payStage == null||moreData[i].payStage == '')
            ) {
              moreData[i].currentPriceStr = "免费";
            } else if (
              moreData[i].currentPriceStr == "0.00" &&
              moreData[i].payStage == "1"
            ) {
              moreData[i].currentPriceStr = "免费";
            }
          }
          this.moreData = moreData;
        }
      });
      this.$root.createShare();
      this.myDate = new Date().getTime();
      this.path = window.location.hash;
    },
    // 爆款左边滑动
    onSwipeLeft() {
      if (this.margin > (this.hotData.length - 3) * -2.46) {
        this.margin += -2.46;
      }
    },
    //爆款右边滑动
    onSwipeRight() {
      if (this.margin < 0) {
        this.margin += 2.46;
      }
    },
    //新品左划
    newonSwipeLeft() {
      if (this.newMargin > (this.newData.length - 3) * -2.46) {
        this.newMargin += -2.46;
      }
    },
    //新品右划
    newonSwipeRight() {
      if (this.newMargin < 0) {
        this.newMargin += 2.46;
      }
    },
    //轮播跳转
    lunBo(id, homeId, type, addr) {
      //跳转外部链接

      if (type == 2) {
        window.location.href = addr;
      } else {
        this.$router.push({
          path: "/GoodsDetails",
          query: {
            id: id
          }
        });
      }
      this.statistical(homeId, 1);
    },
    //统计点击次数
    statistical(id, type) {
      // var param=new URLSearchParams()
      // param.append("homeId",id)
      // param.append("type",type)
      var param = {};
      param.homeId = id;
      param.type = type;
      param = this.$qs.stringify(param);
      this.$axios({
        url: Api.addClick,
        method: "post",
        data: param
      }).then(resp => {});
    },

    //跳转分类页
    goodsBtn() {
      this.$router.push("/classificationPage");
    },
    //精选跳转到详情页
    GoodsDetails(id, homeId, type) {
      this.$router.push({
        path: "/GoodsDetails",
        query: {
          id: id
        }
      });
      this.statistical(homeId, 4);
    },
    //跳转至热卖详细
    hotDetails(id, homeId, type) {
      this.$router.push({
        path: "/GoodsDetails",
        query: {
          id: id
        }
      });
      this.statistical(homeId, 2);
    },
    //跳转到新品详细
    newDetails(id, homeId, type) {
      this.$router.push({
        path: "/GoodsDetails",
        query: {
          id: id
        }
      });
      this.statistical(homeId, 3);
    }
  }
};
</script>
<style scoped lang="less">
/*.testClass{*/
/*    touch-action:pan-y!important*/
/*}*/
.home{
    overflow: hidden;
}
.swiper {
  width: 97%;
  overflow: hidden;
  border: 0.1rem solid white;
  background: white;
  .swiper-items {
    display: flex;
    /*border: 1px solid red;*/
    justify-content: space-between;
    flex-direction: row;
    transition: all 0.2s linear;
    .swiper-item {
      /*border: 1px solid blue;*/
      height: 3.8rem;
      width: 2.4rem;
      /*margin-right: 0.03rem;*/
      position: relative;
      background: white;
      .hotTPrice {
        font-size: 12px;
        color: orange;
        font-weight: bold;
        background: white;
        padding-top: 0.06rem;
        position: absolute;
        bottom: 0.06rem;
        /*text-align: center;*/
        width: 100%;
      }
    }
  }
}

.van-cell__title {
  span {
    font-weight: bold;
    font-size: 0.36rem;
  }
}

.van-card__title {
  font-size: 0.3rem;
  font-weight: bold;
  height: 0.32rem;
  /*line-height: 0.32rem;*/
  padding-top: 0.1rem;
  max-height: none;
}

.van-tag--mark {
  background: #fff77c;
}

.van-card__footer {
  color: #727272;
}

/deep/ .van-swipe__indicators {
  bottom: 29px;
}

/deep/ .van-card__thumb {
  img {
    border-radius: 2px;
  }
}

/deep/ .van-card__footer {
  position: absolute;
  bottom: 12px;
  right: 12px;
}

/deep/ .van-card__price {
  margin-top: 28px;
  color: #ffa500;
  font-weight: bold;
}

.listGoods {
  position: relative;
  padding-top: 0.2rem;
  background: white;
}

.lunbo {
  background: white;
  margin-top: 1.02rem;
}

.swipImg {
  width: 7.2rem;
  margin-left: 0.14rem;
  border-radius: 5px;
}

.hotImg {
  height: 2.2rem;
  width: 2.2rem;
  padding: 0.1rem;

  img {
    height: 2.2rem;
    width: 2.2rem;
    border-radius: 3px;
  }
}

.hot-text {
  font-size: 0.2rem;
  color: white;
  position: absolute;
  top: 1.9rem;
  left: 0.2rem;
}

.hot-title {
  font-size: 0.3rem;
  font-weight: bold;
  background: white;
  padding: 0 0.1rem;
  /*text-align: center;*/
}

.home {
  background: #e4e4e4;
  padding-bottom: 0.4rem;

  .homeSearch {
    width: 100%;
    background: rgba(255, 255, 255, 0.91);
    position: fixed;
    top: 0;
    z-index: 10;
  }
}

.hotCon {
  /*border: 1px solid red;*/
  /*height: 68px;*/
}
.hotTitle {
  /*border: 1px solid black;*/
  background: white;
  padding: 0 0.3rem;
  .hotCon {
    /*border: 1px solid black;*/
    font-size: 0.36rem;
    .hotText {
      font-weight: bold;
      color: red;
    }
    .hotTextA {
      font-weight: bold;
      color: black;
      font-size: 0.36rem;
    }
  }
  .hotTextB {
    font-size: 0.24rem;
    color: rgba(0, 0, 0, 0.42);
  }
}

.newTitle {
  background: white;
  margin-top: 1.4vh;
  padding: 0 0.3rem;
  padding-top: 0.2rem;
  /*border: 1px solid blue;*/
  font-size: 0.36rem;

  .newText {
    color: orange;
    font-weight: bold;
  }

  .newText-a {
    color: black;
    font-weight: bold;
  }

  .newText-b {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.42);
  }
}

.moreGoods {
  margin-top: 1.4vh;
}

.van-card {
  border-bottom: 1px solid rgba(0, 0, 0, 0.02);
  background: #ffffff;
}

.goodsBtn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 3.75vh;
}
.day-card {
  width: 100%;
  //   height: 3.5rem;
  padding: 0.3rem 0.3rem;
  background: #ffffff;
  box-sizing: border-box;
  .day-cardcenter {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    margin: 0 auto;
    box-shadow: 1px 1px 10px #f1f1f1;
    border-radius: 10px;
    .daytop {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.3rem 0.2rem;
      font-size: 0.28rem;
      color: #b2b2b2;
      box-sizing: border-box;
      .day-img {
        width: 2rem;
      }
    }
    .dayul {
      width: 100%;
      padding: 0.2rem 0;
      .dayli {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 0.2rem;
        .dat-centerimg {
          width: 0.7rem;
          height: 0.7rem;
          border-radius: 5px;
        }
        .dayp {
          width: 80%;
          font-size: 0.3rem;
          margin-left: 0.2rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
  }
}
</style>