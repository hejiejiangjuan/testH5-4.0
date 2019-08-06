<template>
  <div class="baoGao">
    <div class="loding" v-if="state">
      <van-loading type="spinner" color="#ffa500" />
      <p>加载中...</p>
    </div>

    <div class="baoGao-title" v-if="state==false">
      <div class="baoGao-title-content">
        <p class="baoGao-title-content-title">{{allContent.titleInfo.title}}</p>
        <p>测试者：{{allContent.titleInfo.nickname}}</p>
        <p>测试时间：{{allContent.titleInfo.testDate}}</p>
      </div>
    </div>

    <div v-if="allContent.payStage !='2'">
      <div
        class="baoGao-content"
        v-for="(item,index) in reportData"
        :key="index"
        v-if="state==false"
      >
        <div class="modueCon">
          <p v-if="reportData.length>1">{{item.dimName}}</p>
          <div class="text" v-html="item.content"></div>
        </div>
      </div>
      <div
        class="baoGao-content2"
        v-for="(item,index) in contData"
        :key="index"
        v-if="contData!=null && contData.length>0 && state==false"
      >
        <div class="modueCon">
          <p v-if="contData.length>=1">{{item.dimName}}</p>
          <div class="text" v-html="item.content"></div>
        </div>
      </div>
    </div>

    <!-- 测后显示 -->
    <div v-if="allContent.payStage =='2' && state==false">
      <div class="baoGao-content" v-for="(item,index) in reportData" :key="index">
        <div class="modueCon" v-if="item.payStage == '2' && allContent.orderStatus != '1'">
          <p v-if="reportData.length>1">{{item.dimName}}</p>
          <div class="text" v-html="item.content"></div>
        </div>
        <div class="modueCon" v-if="allContent.orderStatus == '1'">
          <p v-if="reportData.length>1">{{item.dimName}}</p>
          <div class="text" v-html="item.content"></div>
        </div>
      </div>
      <div class="van-btnpaystag">
        <van-button plain type="primary" v-show="pagesShow" @click="listAll">点击查看详细报告</van-button>
      </div>
      <div v-if="allContent.payStage == '2' && allContent.orderStatus == '1'">
        <div
          class="baoGao-content2"
          v-for="(item,index) in contData"
          :key="index"
          v-if="contData!=null && contData.length>0 && state==false"
        >
          <div class="modueCon">
            <p v-if="contData.length>=1">{{item.dimName}}</p>
            <div class="text" v-html="item.content"></div>
          </div>
        </div>
      </div>
    </div>

    <van-actionsheet v-model="shouHind">
      <div>
        <p class="price">
          合计
          <span>￥{{allContent.payment}}</span>
        </p>
        <div class="payment">
          <div class="paymentBtn" @click="Confirmpay(orderNo,'测后')">确认支付</div>
        </div>
        <p class="prompt">该款项仅供当前测试；可重复购买，购买成功后不予退款</p>
      </div>
    </van-actionsheet>

    <div class="testHeat" v-if="state==false">
      <div class="testHeat-content">
        <p>大家都在测试</p>
        <van-card
          v-for="(item,index) in allTest"
          :key="index"
          :tag="item.typeName"
          :price="item.payStage == '2'?'':item.currentPriceStr"
          :currency="item.payStage == '2'?'':'￥'"
          :desc="item.subhead"
          :title="item.title"
          :thumb="item.picAddr"
          @click="goGoodsDaitls(item.id)"
        >
          <div slot="footer">{{item.userNumStr}}人已测</div>
        </van-card>
      </div>
    </div>
    <div class="footText" v-if="state==false">黑豆提供内容及技术支持</div>
    <!-- 分享 -->
    <div class="footBtn" v-if="state==false">
      <div class="footBtn-text" @click="fenxiangList">
        <van-icon name="share" />
      </div>
    </div>
    <van-actionsheet v-model="showfenxiang">
      <div class="fenxiangtop">
        --分享至--
        <span @click="removue">
          <van-icon name="close" />
        </span>
      </div>
      <div class="fenxiangtupian">
        <div class="imgad" @click="fenxiangpengyou">
          <img src="@/assets/imgs/wx.png" alt />
          <span>微信好友</span>
        </div>
        <div class="imgad" @click="fenxiangcanva">
          <img src="@/assets/imgs/tp.png" alt />
          <span>生成海报</span>
        </div>
      </div>
    </van-actionsheet>
    <van-popup v-model="show1"></van-popup>
    <div class="maskImg" v-if="show1">
      <img src="../assets/imgs/point.png" alt />
      <p class="fenText">分享给指定好友或朋友圈</p>
    </div>
    <van-goods-action v-if="state==false">
      <div class="posi-font bacone" @click="migration">
        <van-icon name="envelop-o" />
        <span class="apsntops">迁移报告</span>
      </div>
      <div class="posi-font" @click="evaluationPage">
        <van-icon name="chat-o" id="chaticon" style="color:#ffdb30" />
        <span class="apsntops">发表评价</span>
      </div>
    </van-goods-action>
    <van-popup v-model="showtoon">
      <div class="toptop">
        <span class="spanposiasd" @click="removefalse">
          <van-icon name="close" />
        </span>
        <div class="emailtop">
          <img src="@/assets/imgs/zzb.png" alt />
          <div style="padding-top:0.3rem">报告准备中···</div>
        </div>
        <div class="emailint">
          <van-field v-model="email" placeholder="请输入邮箱" />
        </div>
        <div class="okemail" @click="oKemailList">确认</div>
      </div>
    </van-popup>
    <van-actionsheet v-model="show">
      <div class="modalposition">
        <div class="padtop">
          <div class="imgimg">
            <img src="@/assets/imgs/pdf.png" alt />
          </div>
          <div>
            <span>专业详细PDF报告</span>
            <br />
            <span class="fontspan">保存本地随时查看</span>
          </div>
        </div>
        <div class="checked">
          <div class="checkedtop">
            <div class="checkedleft">
              <img src="@/assets/imgs/si.png" alt />
              <span>测后即焚</span>
            </div>
            <div class="checkedbotton">焚该报告与订单，不在平台保留</div>
          </div>
          <div class="checkedright">
            <van-switch v-model="checked" size="24px" />
          </div>
        </div>
        <div class="youhuiwenti">
          <img src="@/assets/imgs/fan.png" alt />立即返
          <span>2元</span>优惠券
        </div>
        <div class="modal-btn" @click="qianBtn('迁移')">确认迁移(￥{{emailList.price}})</div>
      </div>
    </van-actionsheet>
  </div>
</template>

<script>
import Api from "../Api";
import wx from "weixin-js-sdk";
import { Toast } from "vant";
export default {
  name: "BaoGao",
  data() {
    return {
      lodingone: false,
      show1: false,
      showfenxiang: false,
      email: "",
      checked: true,
      show: false,
      showtoon: false,
      allContent: {
        titleInfo: {}
      },
      myDate: "",
      path: "",
      allTest: [],
      appraisalId: "", //id
      footBtnVal: "去评价",
      contData: [],
      reportData: [],
      state: true,
      orderNo: "",
      payStage: "",
      payStageShow: false,
      pagesShow: false,
      shouHind: false,
      emailList: {}
    };
  },

  mounted() {
    this.getDoneAppraisalReport();
  },
  methods: {
    //未完成订单重新支付
    rePay(orderNo, payStage) {
      var that = this;
      // var param = new URLSearchParams();
      // param.append("orderNo", orderNo);
      var param = {};
      param.orderNo = orderNo;
      param = this.$qs.stringify(param);
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
            that.onBridgeReady(
              appId,
              timeStamp,
              nonceStr,
              packageValue,
              paySign,
              signType,
              orderNo,
              payStage
            );
          } else {
            Toast.success(res.data.message);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    onBridgeReady(
      appId,
      timeStamp,
      nonceStr,
      packageValue,
      paySign,
      signType,
      orderNo,
      payStage
    ) {
      var that = this;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: appId, //需要在微信绑定商户号，成功之后会生成有appid
          timeStamp: timeStamp, //时间戳，自1970年以来的秒数，前端需要从后台获取该数据
          nonceStr: nonceStr, //随机串，前端需要从后台获取该数据
          package: packageValue, //前端需要从后台获取该数据
          signType: signType, //微信签名方式,默认为"MD5",也可以从后台获取
          paySign: paySign //微信签名，前端需要从后台获取该数据
        },
        function(res) {
          console.log(res, "是否支付成功！");
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
                if (payStage == "迁移") {
                  that.showtoon = true;
                  that.show = false;
                  //  that.getDoneAppraisalReport();
                }
                if (payStage == "测后") {
                  that.shouHind = false;
                  that.getDoneAppraisalReport();
                }
              },
              err => {}
            );
          } else {
            //支付失败
            Toast.fail("支付失败");
          }
        }
      );
    },
    getDoneAppraisalReport() {
      this.myDate = new Date().getTime();
      this.path = window.location.hash;
      //获取订单
      this.appraisalId = this.$route.query.appraisalId;
      let orderNo = this.$route.query.orderNo;
      this.orderNo = this.$route.query.orderNo;
      // let reportIdStr = this.$route.query.reportIdStr
      // var param = new URLSearchParams()
      var param = {};
      if (orderNo) {
        // param.append("orderNo", orderNo)
        param.orderNo = orderNo;
      } else {
        // param.append("reportIdStr", reportIdStr)
      }
      param = this.$qs.stringify(param);
      this.$axios({
        url: Api.getDoneAppraisalReport,
        method: "post",
        data: param
      }).then(resp => {
        var dataAll = resp.data.datas;
        if (resp.data.code == 200) {
          this.allContent = dataAll;
          this.contData = dataAll.advice;
          this.reportData = dataAll.report;
          if (dataAll.payStage == "2" && dataAll.orderStatus != "1") {
            this.pagesShow = true;
          } else {
            this.pagesShow = false;
          }
          // if (this.allContent&&this.contData&&this.reportData){
          //     this.state=false
          // }
          this.state = false;
          if (dataAll.hasEvaluated == 1) {
            this.footBtnVal = "查看评价";
          } else {
            this.footBtnVal = "去评价";
          }
          this.$root.createShare(
            this.allContent.titleInfo.title,
            null,
            null,
            window.location.origin +
              "/#/BaoGao?orderNo=" +
              this.orderNo +
              "&appraisalId=" +
              this.allContent.appraisalId
          );
        }
      });
      //大家都在测试的数据
      // var para = new URLSearchParams()
      // para.append("appraisalId",appraisalId)
      let appraisalId = this.$route.query.appraisalId;
      var param = {};
      param.appraisalId = appraisalId;
      param = this.$qs.stringify(param);
      this.$axios({
        url: Api.getReportHot,
        method: "post",
        data: param
      }).then(resp => {
        if (resp.data.code == 200) {
          if (resp.data.datas) {
            this.allTest = resp.data.datas.splice(0, 3);
          }
        }
      });
      this.clookList();
    },
    // 分享
    fenxiangList() {
      this.showfenxiang = true;
    },
    removue() {
      this.showfenxiang = false;
    },
    // 分享朋友微信 BaoGao?orderNo=141564046218326&appraisalId=96
    fenxiangpengyou() {
      this.show1 = true;
      this.showfenxiang = false;
      this.$root.createShare(
        this.allContent.titleInfo.title,
        null,
        null,
        window.location.origin +
          "/#/BaoGao?orderNo=" +
          this.orderNo +
          "&appraisalId=" +
          this.allContent.appraisalId
      );
    },
    // 生成海报
    fenxiangcanva() {
      this.$router.push({
        path: "/BaoGaoCanvas",
        query: {
          allContent: JSON.stringify(this.allContent),
        }
      });
    },
    // 订单迁移
    qianBtn(title) {
      var params = new URLSearchParams();
      var orderStatus;
      if (this.checked == true) {
        orderStatus = 2;
      } else {
        orderStatus = 1;
      }
      var list = {
        price: this.emailList.price,
        orderNo: this.emailList.orderNo,
        appraisalId: this.appraisalId,
        orderStatus: orderStatus
      };
      params.append("param", JSON.stringify(list));
      this.$axios.post("/wx/mail/createOrder", params).then(
        res => {
          if (res.data.code == "200") {
            var wxPay = res.data.datas.wxPay;
            var orderNo = res.data.datas.orderNo;
            var emailOrderNo = res.data.datas.emailOrderNo;
            var appId = wxPay.appId;
            var timeStamp = wxPay.timeStamp;
            var nonceStr = wxPay.nonceStr;
            var packageValue = wxPay.packageValue;
            var paySign = wxPay.paySign;
            var signType = wxPay.signType;
            // this.$root.onBridgeReady(
            //   appId,
            //   timeStamp,
            //   nonceStr,
            //   packageValue,
            //   paySign,
            //   signType,
            //   orderNo,
            //   title
            // );
            this.onBridgeReady(
              appId,
              timeStamp,
              nonceStr,
              packageValue,
              paySign,
              signType,
              orderNo,
              title
            );
            this.emailOrderNo = emailOrderNo;
            // var that = this;
            // setTimeout(function() {
            //   if (that.$root.isShowOne) {
            //     that.$root.isShowOne = false;
            //     that.showtoon = true;
            //     that.show = false;
            //   }
            // }, 4000);
          }
        },
        err => {}
      );
    },
    // 查询订单
    clookList() {
      var params = new URLSearchParams();
      var list = {
        orderNo: this.orderNo
      };
      params.append("param", JSON.stringify(list));
      this.$axios.get("/wx/mail/getEmailOrderStatus", { params }).then(
        res => {
          if (res.data.code == "200") {
            this.emailList = res.data.datas;
          }
        },
        err => {}
      );
    },
    removefalse() {
      this.showtoon = false;
    },
    //测后付费查看更多。
    listAll() {
      this.shouHind = true;
    },
    //点击支付按钮
    Confirmpay(orderNo, payStage) {
      this.rePay(orderNo, payStage);
      // var that = this;
      // setTimeout(function() {
      //   if (that.$root.locastoritn) {
      //     that.$root.locastoritn = false;
      //     that.getDoneAppraisalReport();
      //     that.shouHind = false;
      //   }
      // }, 4000);
    },
    //报告迁移
    migration() {
      // Toast("暂未开通");
      if (this.emailList.needOrder == 2 && this.emailList.orderStatus == 1) {
        this.showtoon = true;
      } else {
        this.show = true;
      }
    },
    // 确认邮箱
    oKemailList() {
      var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (!myreg.test(this.email)) {
        Toast("请输入正确邮箱地址");
        return;
      }
      if (this.email == "") {
        Toast("请输入邮箱");
        return;
      }
      Toast.loading({
        mask: true,
        message: "提交中..."
      });
      var params = new URLSearchParams();
      var emailoder;
      if (this.emailOrderNo == "" || this.emailOrderNo == undefined) {
        emailoder = this.emailList.emailOrderNo;
      } else {
        emailoder = this.emailOrderNo;
      }
      var list = {
        toUser: this.email,
        orderNo: this.emailList.orderNo,
        emailOrderNo: emailoder
      };
      params.append("param", JSON.stringify(list));
      this.$axios.post("/wx/mail/sendSimpleMail", params).then(
        res => {
          if (res.data.code == "200") {
            Toast.success("提交成功！");
            this.showtoon = false;
            this.email = "";
            this.lodingone = false;
          } else {
            Toast.fail(res.data.message);
          }
        },
        err => {}
      );
    },
    //跳转到详情
    goGoodsDaitls(id) {
      this.$router.push({
        path: "/GoodsDetails",
        query: {
          id: id
        }
      });
    },
    //跳转到评价
    evaluationPage() {
      this.$router.push({
        path: "/EvaluationPage",
        query: {
          appraisalId: this.appraisalId,
          appUserRecordId: this.allContent.appUserRecordId
        }
      });
    }
  },
  beforeDestroy() {
    var endtim = new Date().getTime();
    this.$root.myDay(this.myDate, endtim, this.path);
  }
};
</script>
<style scoped>
.text >>> img {
  max-width: 100%;
}

.text >>> p {
  /*font-size: 14px;*/
  padding: 0 15px;
}
.text {
}
</style>

<style scoped lang="less">
.baoGao {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.loding {
  /*border: 1px solid black;*/
  position: absolute;
  top: 305px;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(114, 114, 114, 0.23);
  border-radius: 5px;
  /*top: 0;*/
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  p {
    font-size: 0.3rem;
    color: white;
  }
}
.footBtn {
  display: flex;
  justify-content: flex-end;
  /*border: 1px solid black;*/
  position: fixed;
  bottom: 60px;
  padding: 0 0.3rem;
  width: 90%;
  .footBtn-text {
    font-size: 0.2rem;
    width: 13%;
    text-align: center;
    height: 30px;
    line-height: 30px;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    div {
      height: 40px;
      line-height: 40px;
      margin-left: 0.1rem;
    }
    i {
      font-size: 0.6rem;
      color: orange;
    }
  }
  .footBtn-text:nth-child(1) {
    background: rgba(255, 226, 104, 0);
  }
}
.text {
  word-break: break-all;
}
.van-card__footer {
  color: #727272;
}

.price {
  text-align: right;
  font-size: 0.28rem;
  padding-right: 1.08rem;
  margin-top: 0.84rem;

  span {
    color: orange;
  }
}

.payment {
  display: flex;
  justify-content: center;
  width: 100%;

  .paymentBtn {
    width: 80%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    border-radius: 2px;
    background: #ffe268;
    font-size: 0.36rem;
  }
}
.prompt {
  font-size: 0.24rem;
  color: rgba(0, 0, 0, 0.34);
  text-align: center;
  margin-bottom: 20px;
}
/deep/ .van-card__price {
  margin-top: 28px;
  color: #ffa500;
  font-weight: bold;
}

.baoGao-title {
  /*border: 1px solid black;*/
  /*height: 1.2rem;*/
  width: 100%;
  display: flex;
  justify-content: center;

  .baoGao-title-content {
    margin: 0.3rem;
    /*border: 2px solid rgba(114, 114, 114, 0.38);*/
    width: 90%;
    border-radius: 10px;
    background: white;
    box-shadow: 0 0 2px #cccccc;
    .baoGao-title-content-title {
      font-size: 0.36rem;
      font-weight: bold;
      color: black;
    }

    p {
      font-size: 0.28rem;
      text-align: center;
      margin: 10px 0;
      color: #727272;
    }
  }
}

.baoGao-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .modueCon {
    /*border: 1px solid black;*/
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: white;
    box-shadow: 0 0 2px #cccccc;
    margin-top: 0.2rem;
    border-radius: 10px;
    p {
      font-size: 0.32rem;
      font-weight: bold;
      margin: 0;
      margin-top: 0.4rem;
      margin-bottom: 0.1rem;
    }
    .text {
      /*border: 2px solid rgba(114, 114, 114, 0.38);*/

      width: 90%;
      display: flex;
      align-items: center;
      flex-direction: column;
      font-size: 0.28rem;
    }
  }
}
.baoGao-content2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  /*border: 1px solid black;*/
  width: 100%;
  .modueCon {
    /*border: 1px solid black;*/
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: white;
    box-shadow: 0 0 2px #cccccc;
    margin-top: 0.2rem;
    border-radius: 10px;
    p {
      font-size: 0.32rem;
      font-weight: bold;
      margin: 0;
      margin-top: 0.4rem;
      margin-bottom: 0.1rem;
    }
    .text {
      /*border: 2px solid rgba(114, 114, 114, 0.38);*/
      border-radius: 10px;
      width: 90%;
      display: flex;
      align-items: center;
      flex-direction: column;
      font-size: 0.28rem;
    }
  }
}

.testHeat {
  display: flex;
  justify-content: center;
  width: 100%;
  .testHeat-content {
    width: 90%;
    /*border: 2px solid rgba(114, 114, 114, 0.38);*/
    background: white;
    margin-top: 0.3rem;
    border-radius: 10px;
    overflow: hidden;
    padding-bottom: 0.2rem;
    box-shadow: 0 0 2px #cccccc;
    .van-card {
      margin: 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.02);
      background: white;
      .van-card__title {
        font-weight: bold;
        font-size: 0.3rem;
      }
    }
    p {
      font-weight: bold;
      font-size: 0.32rem;
      text-align: center;
    }
  }
}
.footText {
  font-size: 10px;
  text-align: center;
  margin-top: 0.4rem;
}
.baoGao {
  padding-bottom: 2.2rem;
}
/deep/.van-button--primary {
  width: 3.6rem;
  height: 0.6rem;
  line-height: 0.6rem;
  border: 1px solid #ffa500;
}
/deep/.van-button--plain.van-button--primary {
  color: #ffa500;
}
.van-btnpaystag {
  width: 100%;
  text-align: center;
  line-height: 0.68rem;
}
/deep/.van-goods-action {
  height: 0.8rem;
}
.posi-font {
  width: 50%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.3rem;
}
.bacone {
  border-top-left-radius: 8px;
  background: #ffdb30;
}
.apsntops {
  padding-left: 0.1rem;
}
#chaticon {
  color: #ffdb30;
}
/deep/.van-switch--on {
  background: #fedd30;
}
.modalposition {
  width: 100%;
  height: 5rem;
  padding: 0 0.5rem;
  box-sizing: border-box;
}
.checked {
  width: 100%;
  height: 1.5rem;
  font-size: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0.2rem 0.28rem;
  border: 1px solid #ececec;
  box-sizing: border-box;
  border-radius: 0.2rem;
}
.checkedtop {
  width: 85%;
}
.checkedleft {
  display: flex;
  align-items: center;
}
.checkedleft img {
  width: 0.7rem;
  height: 0.7rem;
}
.checkedbotton {
  margin-top: 0.1rem;
}
.youhuiwenti {
  width: 100%;
  font-size: 0.3rem;
  padding: 0 0.2rem;
  display: flex;
  align-items: center;
  margin: 0.3rem 0;
}
.youhuiwenti img {
  width: 0.7rem;
  height: 0.7rem;
}
.modal-btn {
  font-size: 0.3rem;
  width: 100%;
  height: 0.8rem;
  background: #ffdb30;
  text-align: center;
  line-height: 0.8rem;
  border-radius: 0.5rem;
}
.padtop {
  width: 45%;
  height: 1rem;
  font-size: 0.3rem;
  position: relative;
  padding-left: 2.2rem;
  margin-top: 0.3rem;
}
.fontspan {
  color: #959597;
  font-size: 0.28rem;
}
.imgimg {
  position: absolute;
  top: -1.1rem;
  left: 0;
  width: 2rem;
  height: 2rem;
}
.imgimg img {
  width: 100%;
  height: 100%;
}
.toptop {
  width: 5.5rem;
  position: relative;
  margin-bottom: 0.4rem;
}
.spanposiasd {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  font-size: 0.35rem;
}
.emailtop {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  padding: 0.6rem 0;
  padding-top: 0.6rem;
  padding-bottom: 0.3rem;
  font-size: 0.28rem;
}
.emailtop img {
  max-width: 100%;
}
.okemail {
  width: 80%;
  height: 0.6rem;
  margin: 0.2rem auto;
  background: #ffdb30;
  font-size: 0.3rem;
  text-align: center;
  line-height: 0.6rem;
  border-radius: 10px;
}
.fenxiangtop {
  width: 100%;
  text-align: center;
  font-size: 0.3rem;
  padding: 0.5rem 0;
  position: relative;
}
.fenxiangtop span {
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
}
.fenxiangtupian {
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  justify-content: center;
  padding-bottom: 0.5rem;
}
.imgad {
  width: 30%;
  text-align: center;
}
.imgad img {
  width: 1rem;
  height: 1rem;
}
.imgad span {
  display: block;
  font-size: 0.26rem;
}
.maskImg {
  width: 3rem;
  height: 3rem;
  position: fixed;
  top: 29px;
  right: 27px;
  z-index: 2100;

  img {
    width: 3rem;
    height: 3rem;
  }
}

.fenText {
  color: white;
  font-size: 0.4rem;
  width: 100%;
}

.scoreText {
  font-size: 0.24rem;
  color: rgba(0, 0, 0, 0.41);
  text-align: center;
}
/deep/.van-cell__value {
  border: 1px solid #f1f1f1;
  height: 0.7rem;
  line-height: 0.7rem;
  padding: 0 0.2rem;
  border-radius: 5px;
}
/deep/.van-popup {
  // border-radius: 0.2rem;
}
/deep/.van-popup {
  overflow-y: inherit;
}
</style>