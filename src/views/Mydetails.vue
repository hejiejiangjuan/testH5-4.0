<template>
  <div class="zhuanyetuo">
    <div class="admingposition">
      <div class="boder-position">
        <div class="center-border" @click="goDetails(appraisalId)">
          <img class="imgtopaa" :src="imgConfig+dataList.pic_addr" alt />
          <div class="ing-rightaa">
            <div class="title-img">{{dataList.title}}</div>
            <div class="spantitle">{{dataList.current_prace}}人已测试</div>
          </div>
          <img class="adminges"  v-if="dataList.status != '2'" src="@/assets/imgs/none.png" alt />
        </div>
      </div>
    </div>

    <div class="ceshibtm" v-if="dataList.status == '0'" @click="goodsPage(orderNo,appraisalId)">去测试</div>
    <div class="ceshibtm"  v-if="dataList.status == '1'" @click="baogao(orderNo,appraisalId)">查看报告</div>
    <div class="ceshibtm" v-if="dataList.status == '2'"  @click="lingquAll">领取</div>
    <ul class="ulpenpal">
      <li>领取后请到我的测评-我的赠礼中查看</li>
      <li>领取后仅限本人享用，不可转增。</li>
    </ul>
  </div>
</template>

<script>
import imgConfig from "../imgConfig";
import { Toast } from "vant";
import { Dialog } from "vant";
import Clipboard from "clipboard";
export default {
  data() {
    return {
      dataList: {},
      currentPage: 1,
      pageSize: 10,
      imgConfig: "",
      footerTex: "",
      orderNo: "",
      appraisalId:'',
    };
  },
  mounted() {
    this.imgConfig = imgConfig.imgServe;
     this.orderNo = this.$root.GetUrlParame("orderNo");
     this.appraisalId = this.$root.GetUrlParame("appraisalId");
    if(this.orderNo == undefined || this.orderNo == null){ 
      this.dataList = JSON.parse(this.$route.query.dataList);
      this.orderNo = this.dataList.orderNo;
      this.appraisalId = this.dataList.appraisalId;
    }
     this.listLiebiao()
  },
  methods: {
    listLiebiao() {
      var params = new URLSearchParams();
      params.append("orderNo", this.orderNo);
      this.$axios.get("/wx/present/getPresendDetailByOrderNo", { params }).then(
        res => {
          if (res.data.code == "200") {
            this.dataList = res.data.datas;
          }
        },
        err => {}
      );
    },
    lingquAll() {
      var params = new URLSearchParams();
      params.append("orderNo", this.orderNo);
      this.$axios.post("/wx/present/receiveGiftByOrderNo", params).then(
        res => {
          if (res.data.code == "200") {
            Toast.success("领取成功");
            this.listLiebiao();
          } else {
            Toast(res.data.message);
          }
        },
        err => {}
      );
    },
    // 去详细介绍
    goDetails(appraisalId){
      this.$router.push({
        path: "/GoodsDetails",
        query: {
          id: appraisalId
        }
      });
    },
    //点击跳转测前详情
    goodsPage(orderNo,appraisalId) {
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
    //页面跳转至详情
    GoodsDetails(id) {
      this.$router.push({
        path: "/GoodsDetails",
        query: {
          id: this.appraisalId
        }
      });
    },
    //查看报告
    baogao(oder,id) {
      //还需要获取订单号
      this.$router.push({
        path: "/BaoGao",
        query: {
          orderNo: this.orderNo,
          appraisalId: this.appraisalId
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
// html,body{
//   width: 100%;
//   height: 100%;
// }
// #app{
//   width:100%;
//   height: 100%;
// }
.ulpenpal {
  width: 76%;
  /* height: 30%; */
  margin: 0 auto;
  /* margin-top: 0.2rem; */
  font-size: 0.28rem;
  color: #959595;
}
.ulpenpal li {
  line-height: 0.5rem;
}
.ulpenpal li::before {
  content: "•"; /* 自定义图标，也可以使用字体图标 如：content: "\f105"; font-family: FontAwesome;*/
  color: #959595; /* 自定义颜色 */
}
.zhuanyetuo {
  width: 100%;
  height: 100%;
  background: url(../assets/imgs/bcgd.png) no-repeat 0 0;
  position: fixed;
  top: 0;
  left: 0;
  background-size: 100% 100%;
  box-sizing: border-box;
}
.admingposition {
  width: 90%;
  height: 2.8rem;
  background: #fefdff;
  margin: 0px auto;
  margin-top: 4.5rem;
  border-radius: 0.2rem;
  padding: 0.15rem;
  box-sizing: border-box;
}
.boder-position {
  width: 100%;
  height: 100%;
  border: 1.5px solid #f5d991;
  border-radius: 0.2rem;
  font-size: 0.3rem;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
.center-border {
  width: 100%;
  margin: 0.3rem 0.2rem 0.1rem 0.3rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}

.imgtopaa {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 5px;
}

.ing-rightaa {
  margin-left: 0.25rem;
  height: 1rem;
}
.spantitle {
  height: 0.6rem;
  color: #999999;
  font-size: 0.28rem;
  line-height: 0.6rem;
  color: #999999;
  font-size: 0.28rem;
}
.title-img {
  width: 100%;
  height: 0.7rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.adminges {
  width: 1rem;
  height: 0.9rem;
  position: absolute;
  bottom: -0.4rem;
  right: -0.2rem;
}
.ceshibtm {
  width: 90%;
  height: 1rem;
  text-align: center;
  line-height: 1rem;
  background: #fecd44;
  font-size: 0.36rem;
  color: #ffffff;
  margin: 0.8rem auto;
  border-radius: 0.5rem;
}
</style>
