<template>
  <div class="goodesDetails">
    <div class="topSearch" v-if="showPay">
      <Search></Search>
    </div>
    <div class="topBtn" v-else>
      <div class="topTitle">{{getAppraisalDeta.title}}</div>
      <div class="topPrice">
        <p v-if="getAppraisalDeta.payStage != '2'">￥{{getAppraisalDeta.currentPriceStr}}</p>
        <p
          class="topBtn-pay"
          @click="payBtn"
          v-if="getAppraisalDeta.needPay==1 && getAppraisalDeta.payStage == '1'"
        >立即购买</p>
        <p
          class="topBtn-pay"
          @click="payNoneBtn(getAppraisalDeta.id,getAppraisalDeta.currentPriceStr,1,'测后')"
          v-if="getAppraisalDeta.needPay==1 && getAppraisalDeta.payStage == '2'"
        >去测试</p>
        <p
          class="topBtn-pay"
          v-if="getAppraisalDeta.needPay != 1"
          @click="goTest(getAppraisalDeta.id,getAppraisalDeta.orderNo)"
        >去测试</p>
      </div>
    </div>
    <div class="goodsImg">
      <img :src="getAppraisalDeta.detailAddr" alt />
      <div class="fenxiang" @click="fenxiang" v-if="openRecruit==1&&commissionYuan">
        <div class="fenxiangIcon"></div>
        <p>赚￥{{commissionYuan}}</p>
      </div>
      <div class="fenxiang" @click="fenxiangB" v-else>
        <div class="fenxiangIcon"></div>
        <div>分享</div>
      </div>
    </div>
    <!-- 赠送好友 -->
    <div
      class="zensong"
      @click="zensongModal(10)"
      v-if="getAppraisalDeta.needPay==1 && getAppraisalDeta.payStage != '2'"
    >
      <img class="gifimg" src="@/assets/imgs/lw.gif" alt />
      <span class="gifspan">赠送他人</span>
    </div>
    <!-- -------------------------------------- -->
    <div class="goodsTitle">
      <div class="goodstext goodstext-title">{{getAppraisalDeta.title}}</div>
      <div class="goodstext goodstext-text">{{getAppraisalDeta.subhead}}</div>
      <div class="goodstext goodsPrice">
        <span
          class="Price"
          v-if="getAppraisalDeta.payStage != '2'"
        >￥{{getAppraisalDeta.currentPriceStr}}</span>
        <div
          class="originalPrice"
          v-if="getAppraisalDeta.payStage != '2' && getAppraisalDeta.currentPriceStr != '免费'"
        >
          ￥{{getAppraisalDeta.originalPriceStr}}
          <div class="xian"></div>
        </div>
      </div>
      <div
        class="goodsBtn goodstext"
        v-if="getAppraisalDeta.needPay==1 && getAppraisalDeta.payStage != '2'"
        @click="payBtn"
      >
        <van-button
          style="background: #ffe268;width: 4rem;height: 0.9rem;font-weight: bold;border: none"
          type="default"
        >立即购买</van-button>
      </div>
      <div
        class="goodsBtn goodstext"
        v-if="getAppraisalDeta.needPay==1 && getAppraisalDeta.payStage == '2'"
        @click="payNoneBtn(getAppraisalDeta.id,getAppraisalDeta.currentPriceStr,1,'测后')"
      >
        <van-button
          style="background: #ffe268;width: 4rem;height: 0.9rem;font-weight: bold;border: none"
          type="default"
        >去测试</van-button>
      </div>
      <div class="goodsBtn goodstext" v-if="getAppraisalDeta.needPay != 1"  @click="goTest(getAppraisalDeta.id,getAppraisalDeta.orderNo)">
        <van-button
          style="background: #ffe268;width: 4rem;height: 0.9rem;font-weight: bold;border: none"
          type="default"
         
        >去测试</van-button>
      </div>
      <div class="shuju">
        <van-row>
          <van-col span="8">
            <van-icon name="stop" />
            <span>{{getAppraisalDeta.questionNum}}道精选问题</span>
          </van-col>
          <van-col span="8">
            <van-icon name="stop" />
            <span>{{getAppraisalDeta.reportPageNum}}页专业报告</span>
          </van-col>
          <van-col span="8">
            <van-icon name="stop" />
            <span>{{getAppraisalDeta.userNumStr}}人测试过</span>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="introduce">
      <div class="introduceTitle">
        测评介绍
        <div class="line"></div>
      </div>
      <div>
        <div class="myText" v-html="getAppraisalDeta.introduce"></div>
      </div>
    </div>
    <div class="instructions">
      <div class="instructionsCon">
        <div class="introduceTitle">
          测评须知
          <div class="line"></div>
        </div>
        <div class="myText" v-html="getAppraisalDeta.readme"></div>
      </div>
    </div>

    <div class="userRatings">
      <div class="introduceTitle">
        用户评价
        <div class="line"></div>
      </div>
      <div class="progress" v-if="evaluateStatic!=null">
        <div class="pro-cir">
          <van-circle
            v-model="currentRate"
            layer-color="#f5f5f5"
            color="#ffe268"
            :stroke-width="70"
            size="60px"
            :rate="understand"
            :speed="100"
            :text="evaluateStatic.understandability+'分'"
          />
          <p>题目易懂性</p>
        </div>
        <div class="pro-cir">
          <van-circle
            v-model="currentRate1"
            layer-color="#f5f5f5"
            color="#ffe268"
            :stroke-width="70"
            size="60px"
            :rate="accurate"
            :speed="100"
            :text="evaluateStatic.veracity+'分'"
          />
          <p>结果准确度</p>
        </div>
        <div class="pro-cir">
          <van-circle
            v-model="currentRate2"
            layer-color="#f5f5f5"
            color="#ffe268"
            :stroke-width="70"
            size="60px"
            :rate="practical"
            :speed="100"
            :text="evaluateStatic.practicability+'分'"
          />
          <p>建议实用性</p>
        </div>
      </div>
      <div class="commentDetails" v-for="(item,index) in evaluateList" :key="index">
        <div class="userImg">
          <img :src="item.avatar" alt />
        </div>
        <div class="user-Details">
          <p>
            <span>{{item.nickname}}</span>
            <span>{{item.formatCreateTime}}</span>
          </p>
          <p>{{item.experience}}</p>
        </div>
      </div>
      <div
        class="progressBtn"
        v-if="evaluateStatic!=null"
        @click="progressBtn(getAppraisalDeta.id)"
      >查看全部评价</div>
      <p class="progressNone" v-else>暂无评价</p>
    </div>

    <div class="goodsElect">
      <div class="introduceTitle Elect">
        <span>相关推荐</span>
        <div class="line"></div>
      </div>
      <div
        class="listGoods"
        v-cloak
        v-for="(item ,index) in RecommendData"
        :key="index"
        @click="goodsPage(item.id)"
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
      <Footer></Footer>
    </div>
    <van-actionsheet v-model="show">
      <div class="zensongding-top" v-if="allindex == 10">
        <div class="zensongding-title">
          赠送数量
          <span class="positionspan" @click="removeshou">
            <van-icon name="close" />
          </span>
        </div>
        <ul class="zensongding-ul">
          <li @click="numberAll(1)" :class="number == 1 ? 'activenumber':''">1</li>
          <li @click="numberAll(2)" :class="number == 2 ? 'activenumber':''">2</li>
          <li @click="numberAll(5)" :class="number == 5 ? 'activenumber':''">5</li>
          <li @click="numberAll(10)" :class="number == 10 ? 'activenumber':''">10</li>
          <li @click="numberAll(15)" :class="number == 15 ? 'activenumber':''">15</li>
          <li @click="numberAll(20)" :class="number == 20 ? 'activenumber':''">20</li>
        </ul>
      </div>
      <div class="zensongding-number" v-if="allindex == 10">
        <span>修改数量</span>
        <div class="span-text">
          <span class="spanjiajian" @click="jiajianBtn(1)">-</span>
          <input class="intput" type="text" v-model="number" />
          <span class="spanjiajian" @click="jiajianBtn(2)">+</span>
        </div>
      </div>
      <div>
        <p class="price">
          合计
          <span v-if="allindex == 10">￥{{allMoney}}</span>
          <span v-else>￥{{getAppraisalDeta.currentPriceStr}}</span>
        </p>
        <div class="payment" v-if="allindex == 10">
          <div class="paymentBtn" @click="Confirmpay(getAppraisalDeta.id,allMoney,5,2)">确认支付</div>
        </div>
        <div class="payment" v-else>
          <div
            class="paymentBtn"
            @click="Confirmpay(getAppraisalDeta.id,getAppraisalDeta.currentPriceStr,null,1)"
          >确认支付</div>
        </div>
        <p class="prompt">该款项仅供当前测试；可重复购买，购买成功后不予退款</p>
      </div>
    </van-actionsheet>
    <div class="collection" :style="{color:color}" @click="collection">
      <van-icon name="star" />
    </div>
    <van-popup v-model="show1"></van-popup>
    <div class="maskImg" v-if="show1">
      <img src="../assets/imgs/point.png" alt />
      <p class="fenText">分享给指定好友或朋友圈</p>
    </div>
    <van-popup v-model="show2">
      <div class="Prompt">
        <div class="detPrompt">亲，该测评您于{{getAppraisalDeta.latelyPayedTime}}买过，是否确定再次购买？(重复支付不予退款)</div>
        <div class="detBtn">
          <p @click="payBtnB">去支付</p>
          <p
            @click="baoGao(getAppraisalDeta.orderNo,getAppraisalDeta.id)"
            v-if="getAppraisalDeta.hasTest==1"
          >查看报告</p>
          <p @click="toTest(getAppraisalDeta.orderNo,getAppraisalDeta.id)" v-else>去测试</p>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showPhone" position="bottom" :overlay="true">
      <div class="getPhone">
        <div class="getPhone-con">
          <van-cell-group>
            <van-field v-model="phone" center clearable label="手机号：" placeholder="请输入手机号码">
              <van-button slot="button" size="small" style="background: #d0d0d0">发送验证码</van-button>
            </van-field>
            <van-field v-model="sms" label="验证码：" placeholder="请输入验证码" />
            <van-field v-model="username" label="姓名：" placeholder="请输入姓名" />
          </van-cell-group>
          <div class="confirmBtn">
            <van-button slot="button" size="small" style="background:#ffe268 ">￥分享赚钱</van-button>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showShare" position="bottom">
      <div class="listShare">
        <div class="listShareBtn">
          <div class="iconImg" @click="shareFriend">
            <img src="../assets/imgs/weixin.png" alt />
            <p>分享给好友</p>
          </div>
          <button class="tag-read" :data-clipboard-text="shareUrl+'&tfk='+ tfk" @click="copyLink">
            <div class="iconImg">
              <img src="../assets/imgs/copy.png" alt />
              <p>复制链接</p>
            </div>
          </button>
          <div class="iconImg" @click="shareCanvas(getAppraisalDeta.id,shareUrl)">
            <img src="../assets/imgs/haibao.png" alt />
            <p>生成海报</p>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="sucessShow">
      <div class="promoters">
        <div class="proImg">
          <img src="../assets/imgs/jiang.png" alt />
        </div>
        <p class="proTitl">恭喜您成为推广员</p>
        <p class="proCon">现在邀请好友购买，即可赚取佣金</p>
        <div class="proBtn" @click="proBtn">开始赚钱</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import { Toast } from "vant";
import Clipboard from "clipboard";
import Search from "../components/SearchTop";
import Footer from "../components/Footer";
import Api from "../Api";
import { Dialog } from "vant";

export default {
  name: "GoodsDetails",
  components: {
    Search,
    Footer
  },
  data() {
    return {
      shareUrl: "",
      phone: "",
      sms: "",
      username: "",
      sucessShow: false, //招募U不需要审核弹出
      showShare: false, //分享给好友的状态
      show: false, //支付上拉框的状态
      show1: false, //分享给好友蒙板状态
      show2: false, //已经支付过的状态
      showPhone: false, //获取电话号码的上拉框状态
      currentRate: 0, //进度条数据
      currentRate1: 0, //进度条数据
      currentRate2: 0, //进度条数据
      showPay: true, //顶部按钮状态
      // collectionState:false,
      color: "#b9b9b9",
      value: 1, //进步器的值
      btnState: 0, //赠送数量按钮的状态
      sexBtn: 0, //性别按钮样式状态
      zengsong: false, //赠送按钮的状态
      showList: false, //礼券框的状态
      chosenCoupon: -1, //当前选中优惠券的索引
      getAppraisalDeta: {}, //请求返回数据
      RecommendData: [], //相关推举的数据
      myDate: "",
      path: "", //当前的路径
      evaluateList: [], //评价的数据
      evaluateStatic: {}, //统计分数
      understand: 0, //易懂性
      accurate: 0, //准确
      practical: 0, //实用
      userKey: "",
      goodsId: "", //当前商品的id
      commissionYuan: "", //当前商品分享佣金
      status: "", //0是清退，1是正常，2是待审核
      openRecruit: 1, //默认开启招募
      recruitAudit: 0, //默认不需要审核
      tfk: "",
      number: 1,
      allindex: 0,
      allMoney: ""
    };
  },
  // created() {},

  mounted() {
    var that = this;
    if (!this.$root.hasLogin) {
      //未登录
      that.$root.initMain().then(that.initCurpage());
    } else {
      that.initCurpage();
    }
  },
  beforeDestroy() {
    this.$root.createShare();
    var endtim = new Date().getTime();
    this.$root.myDay(this.myDate, endtim, this.path);
  },

  methods: {
    // 数量加减
    jiajianBtn(index) {
      if (index == 1 && this.number > 0) {
        this.number -= 1;
        var num = Number(this.getAppraisalDeta.currentPriceStr) * this.number;
        this.allMoney = num.toFixed(2);
      } else if (index == 2) {
        this.number += 1;
        var num = Number(this.getAppraisalDeta.currentPriceStr) * this.number;
        this.allMoney = num.toFixed(2);
      }
    },
    numberAll(index) {
      this.number = index;
      var num = Number(this.getAppraisalDeta.currentPriceStr) * this.number;
      this.allMoney = num.toFixed(2);
    },
    // 关闭赠送支付
    removeshou() {
      this.show = false;
      this.allindex = 0;
      this.number = 1;
    },
    //赠送打开支付-0.2,-0.95
    zensongModal(index) {
      this.allindex = index;
      this.show = true;
    },
    initCurpage() {
      var that = this;
      //请求页面数据
      // var tfk=localStorage.getItem("tfk");
      this.tfk = this.$root.GetUrlParame("tfk");
      if (!this.tfk) {
        this.tfk = localStorage.getItem("tfk");
      }

      this.myDate = new Date().getTime();
      this.path = window.location.hash;
      var goodsId = this.$route.query.id;
      this.goodsId = goodsId;
      var obj = { appraisalId: goodsId };
      this.$store.dispatch("checkPage", obj);

      var param = {};
      param.appraisalId = goodsId;
      param = this.$qs.stringify(param);
      // var param = new URLSearchParams();
      // param.append("appraisalId", goodsId);
      this.$axios({
        url: Api.getAppraisalDetail,
        method: "post",
        data: param
      }).then(resp => {
        if (resp.data.code == 200) {
          var listArr = resp.data.datas;
          if (
            listArr.currentPriceStr == "0.00" &&
            (listArr.payStage == null || listArr.payStage == "")
          ) {
            listArr.currentPriceStr = "免费";
          } else if (
            listArr.currentPriceStr == "0.00" &&
            listArr.payStage == "1"
          ) {
            listArr.currentPriceStr = "免费";
          }
          this.getAppraisalDeta = listArr;
          this.allMoney = listArr.currentPriceStr;
          sessionStorage.setItem(
            "questionType",
            this.getAppraisalDeta.questionType
          );
          if (this.tfk != 1) {
            this.openRecruit = 0;
            this.$root.createShare(
              this.getAppraisalDeta.title,
              this.getAppraisalDeta.subhead,
              this.getAppraisalDeta.picAddr,
              window.location.origin +
                "/#/GoodsDetails?id=" +
                this.getAppraisalDeta.id
            );
          } else {
            this.DisUser();
          }

          this.getAppraisalDis();
          if (this.getAppraisalDeta.collectType == 1) {
            this.color = "#ffe268";
          } else if (this.getAppraisalDeta.collectType == 0) {
            this.color = "#b9b9b9";
          }
          //相关推举的请求
          // var paramT = new URLSearchParams();
          // paramT.append("typeId", this.getAppraisalDeta.typeId);
          // paramT.append("appraisalId", goodsId);

          var paramT = {};
          paramT.typeId = this.getAppraisalDeta.typeId;
          paramT.appraisalId = goodsId;
          paramT.tfk = this.tfk;
          paramT = this.$qs.stringify(paramT);
          this.$axios({
            url: Api.getRecommendByTypeId,
            method: "post",
            data: paramT
          }).then(resp => {
            if (resp.data.code == 200) {
              var listArr = resp.data.datas;
              for (var i in listArr) {
                if (
                  listArr[i].currentPriceStr == "0.00" &&
                  (listArr[i].payStage == null || listArr[i].payStage == "")
                ) {
                  listArr[i].currentPriceStr = "免费";
                } else if (
                  listArr[i].currentPriceStr == "0.00" &&
                  listArr[i].payStage == "1"
                ) {
                  listArr[i].currentPriceStr = "免费";
                }
              }
              this.RecommendData = listArr;
            }
          });
        }
      });
      //添加至足迹
      this.$axios({
        url: Api.addBrowsing,
        method: "post",
        data: param
      }).then(resp => {});

      window.addEventListener("scroll", this.onScoll);
      //评论部分的数据
      var goodsId = this.$route.query.id;
      // var para = new URLSearchParams();
      // para.append("apprasailId", goodsId);
      // para.append("limit", 3);
      var para = {};
      para.apprasailId = goodsId;
      para.limit = 3;
      para = this.$qs.stringify(para);
      this.$axios({
        url: Api.getEvaluateList,
        method: "post",
        data: para
      }).then(resp => {
        if (resp.data.code == 200) {
          this.evaluateList = resp.data.datas;
        }
      });
      //评分的数据;
      // var parm = new URLSearchParams();
      // parm.append("appApprasailId", goodsId);

      var parm = {};
      parm.appApprasailId = goodsId;
      parm = this.$qs.stringify(parm);
      this.$axios({
        url: Api.getEvaluateStatic,
        method: "post",
        data: parm
      }).then(resp => {
        if (resp.data.code == 200 && resp.data.datas != null) {
          this.evaluateStatic = resp.data.datas;
          this.understand = parseInt(
            this.evaluateStatic.understandability * 20
          );
          this.practical = parseInt(this.evaluateStatic.practicability * 20);
          this.accurate = parseInt(this.evaluateStatic.veracity * 20);
        } else {
          this.evaluateStatic = null;
        }
      });
    },
    //获取单个商品的分销信息
    getAppraisalDis() {
      // var param = new URLSearchParams();
      // param.append("appraisalId", this.goodsId);

      var param = {};
      param.appraisalId = this.goodsId;
      param = this.$qs.stringify(param);
      this.$axios({
        url: Api.getAppraisalDis,
        method: "post",
        data: param
      }).then(resp => {
        if (resp.data.code == 200) {
          if (resp.data.datas != null) {
            this.commissionYuan = resp.data.datas.commissionYuan;
          }
        }
      });
    },
    //分享好友
    shareFriend() {
      this.show1 = !this.show1;
      this.showShare = false;
    },
    //分享链接
    copyLink() {
      var clipboard = new Clipboard(".tag-read");
      clipboard.on("success", e => {
        this.showShare = false;
        Toast.success("复制成功");
        //释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        Toast.fail("浏览器不兼容");
        clipboard.destroy();
      });
    },
    //生成海报
    shareCanvas(appraisalId, src) {
      if (!this.userKey) {
      } else {
        if (this.status == 2) {
          this.$router.push("/Audit");
        } else if (this.status == 0) {
          //开启招募并开启审核，跳转到填写招募信息页
          this.$router.push("/SaysPromoter");
        } else if (this.status == 1) {
          this.$router.push({
            path: "/shareCanvas",
            query: {
              appraisalId: appraisalId,
              sharUrl: src
            }
          });
        }
      }
    },

    //判断是否是分销员
    DisUser() {
      this.$axios({
        url: Api.getCurDisUser,
        method: "post"
      }).then(resp => {
        if (resp.data.code == 200) {
          if (resp.data.datas) {
            var userKey = resp.data.datas.userKey;
            this.userKey = userKey;
            this.DisSystemSet();
            this.status = resp.data.datas.status;
            if (userKey) {
              this.shareUrl =
                window.location.origin +
                "/#/GoodsDetails?id=" +
                this.getAppraisalDeta.id +
                "&userKey=" +
                userKey;
              this.$root.createShare(
                this.getAppraisalDeta.title,
                this.getAppraisalDeta.subhead,
                this.getAppraisalDeta.picAddr,
                window.location.origin +
                  "/#/GoodsDetails?id=" +
                  this.getAppraisalDeta.id +
                  "&userKey=" +
                  userKey
              );
            }
          } else {
            this.shareUrl =
              window.location.origin +
              "/#/GoodsDetails?id=" +
              this.getAppraisalDeta.id;
            this.$root.createShare(
              this.getAppraisalDeta.title,
              this.getAppraisalDeta.subhead,
              this.getAppraisalDeta.picAddr,
              window.location.origin +
                "/#/GoodsDetails?id=" +
                this.getAppraisalDeta.id
            );
          }
        }
      });
    },

    //点击分享按钮
    fenxiang() {
      // this.showPhone=!this.showPhone
      //判断是否为推销员，如果是直接分享，如果不是，判断是否开启招募，如果是判断是否需要审核
      this.yesDisSystemSet(this.recruitAudit);
    },
    fenxiangB() {
      this.show1 = !this.show1;
    },

    //判断是否开启招募,是否需要审核
    DisSystemSet() {
      this.$axios({
        url: Api.getDisSystemSet,
        method: "post"
      }).then(resp => {
        if (resp.data.code == 200) {
          var openRecruit = resp.data.datas.openRecruit;
          this.recruitAudit = resp.data.datas.recruitAudit;
          if (openRecruit == 1) {
            this.openRecruit = 1;
          } else if (openRecruit == 0) {
            // //如果没有开启招募直接分享
            this.openRecruit = 0;
          }
        }
      });
    },

    //判断开启招募的情况
    yesDisSystemSet(recruitAudit) {
      if (!this.userKey) {
        if (recruitAudit == 0) {
          //开启招募不需要审核弹出“恭喜成为招募员”框
          // var param = new URLSearchParams();
          // var fromUserKey = this.$root.bindUserKey;
          var param = {};
          if (fromUserKey) {
            // param.append("fromUserKey", fromUserKey)
            param.fromUserKey = fromUserKey;
            param.this.$qs.stringify(param);
          }
          this.$axios({
            url: Api.addDisUser,
            method: "post",
            data: param
          }).then(resp => {
            if (resp.data.code == 200) {
              this.sucessShow = true;
            }
          });
        } else if (recruitAudit == 1) {
          //判断是否是在审核中，如果是调到审核中页面
          if (this.status == 2) {
            this.$router.push("/Audit");
          } else if (this.status == 0) {
            //开启招募并开启审核，跳转到填写招募信息页
            this.$router.push("/SaysPromoter");
          } else if (this.status == 1) {
            this.showShare = !this.showShare;
          }
        }
      } else {
        //判断是否是在审核中，如果是调到审核中页面
        if (this.status == 2) {
          this.$router.push("/Audit");
        } else if (this.status == 0) {
          //开启招募并开启审核，跳转到填写招募信息页
          this.$router.push("/SaysPromoter");
        } else if (this.status == 1) {
          this.showShare = !this.showShare;
        }
      }
    },

    //开启招募不需要审核弹出“恭喜成为招募员”框，开始赚钱按钮
    proBtn() {
      this.showShare = !this.showShare;
      this.sucessShow = false;
    },
    //跳转评价页
    progressBtn(id) {
      this.$router.push({
        path: "/PingJia",
        query: {
          id: id
        }
      });
    },
    //点击跳转详情
    toTest(orderNo, appraisalId) {
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
      // this.$router.push({
      //     path: "/XuZhi",
      //     query: {appraisalId: appraisalId, orderNo: orderNo}
      // })
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

    goodsPage(id) {
      // var param = new URLSearchParams()
      // param.append("appraisalId", id)

      var param = {};
      param.appraisalId = id;
      param = this.$qs.stringify(param);
      this.$axios({
        url: Api.getAppraisalDetail,
        method: "post",
        data: param
      }).then(resp => {
        if (resp.data.code == 200) {
          this.getAppraisalDeta = resp.data.datas;
          window.scrollTo(0, 0);
        }
      });
    },
    // 侧后付费按钮
    payNoneBtn(appraisalId, currentPriceStr, useType, text) {
      if (this.$root.canClick) {
        this.$root.canClick = false;
        this.$root.wxPay(appraisalId, currentPriceStr, useType, text);
      }
    },
    //点击购买的按钮
    payBtn() {
      if (this.getAppraisalDeta.hasPayed == 0) {
        this.show = !this.show;
      } else {
        this.show2 = !this.show2;
      }
    },
    //第二次购买按钮
    payBtnB() {
      this.show = !this.show;
      this.show2 = !this.show2;
    },
    onChange(index) {
      this.showList = false;
      this.chosenCoupon = index;
    },
    //点击支付按钮
    Confirmpay(appraisalId, currentPriceStr, index, useType) {
      if (index == 5) {
        sessionStorage.setItem("commodityNum", this.number);
      }
      if (this.$root.canClick) {
        this.$root.canClick = false;
        this.$root.wxPay(appraisalId, currentPriceStr, useType, this.number);
      }
    },
    //免费测试
    goTest(appraisalId, orderNo) {
      //判断订单号，有直接去测试，没有生成订单号
      if (orderNo) {
        var obj = { appraisalId: appraisalId, orderNo: orderNo };
        this.$store.dispatch("checkPage", obj).then(resp => {
          var appraisalHomeContent = this.$store.state.checkPage
            .appraisalHomeContent;
          if (
            appraisalHomeContent != null &&
            appraisalHomeContent.notice != ""
          ) {
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
      } else {
        //创建免费测试的订单
        var param = {};
        param.appraisalId = appraisalId;
        param.yuanPrice = 0;
        param = this.$qs.stringify(param);
        this.$axios({
          url: "/wx/pay/createOrder",
          method: "post",
          data: param
        }).then(resp => {
          if (resp.data.code == 200) {
            var orderNo = resp.data.datas.orderNo;
            var appraisalHomeContent = this.$store.state.checkPage
              .appraisalHomeContent;
            if (
              appraisalHomeContent != null &&
              appraisalHomeContent.notice != ""
            ) {
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
          }
        });
      }
    },

    //点击收藏
    collection() {
      // this.collectionState=!this.collectionState
      var that = this;
      if (this.getAppraisalDeta.collectType == 1) {
        this.color = "#b9b9b9";
        let collectType = 0;
        // var param = new URLSearchParams()
        // param.append("appraisalId", this.$route.query.id)
        // param.append("collectType", collectType)
        var param = {};
        param.appraisalId = this.$route.query.id;
        param.collectType = collectType;
        param = this.$qs.stringify(param);
        this.$axios({
          url: Api.collect,
          method: "post",
          data: param
        }).then(resp => {
          if (resp.data.code == 200) {
            that.getAppraisalDeta.collectType = 0;
          }
        });
      } else if (this.getAppraisalDeta.collectType == 0) {
        this.color = "#ffe268";
        var collectType = 1;
        // var param1 = new URLSearchParams()
        // param1.append("appraisalId", this.$route.query.id)
        // param1.append("collectType", collectType)

        var param1 = {};
        param1.appraisalId = this.$route.query.id;
        param1.collectType = collectType;
        param1 = this.$qs.stringify(param1);
        this.$axios({
          url: Api.collect,
          method: "post",
          data: param1
        }).then(resp => {
          if (resp.data.code == 200) {
            that.getAppraisalDeta.collectType = 1;
          }
        });
      }
    },
    //滚动条高度监听
    onScoll() {
      let scollHeight =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scollHeight > 480) {
        this.showPay = false;
      } else {
        this.showPay = true;
      }
    }
  }
};
</script>


<style scoped>
.myText >>> img {
  max-width: 100%;
}

.myText >>> p {
  /*border: 1px solid black;*/
  margin: 0;
  text-align: left;
  margin-top: 0.2rem;
}
</style>
<style scoped lang="less">
.fenText {
  color: white;
  font-size: 0.4rem;
  width: 100%;
}

.promoters {
  /*border: 1px solid black;*/
  width: 6rem;
  padding: 0.8rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .proImg {
    /*border: 1px solid black;*/
  }

  .proTitl {
    font-size: 0.32rem;
    font-weight: bold;
  }

  .proCon {
    font-size: 0.3rem;
    margin: 0;
  }

  .proBtn {
    width: 5rem;
    height: 0.6rem;
    line-height: 0.6rem;
    color: white;
    background: #00b200;
    border-radius: 5px;
    font-size: 0.3rem;
    text-align: center;
    margin-top: 30px;
  }
}

.listShare {
  /*border: 1px solid black;*/
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;

  .listShareBtn {
    /*border: 1px solid black;*/
    height: 2.5rem;
    width: 90%;
    display: flex;
    justify-content: space-around;
    align-items: center;

    button {
      border: none;
      background: white;
    }

    .iconImg {
      /*border: 1px solid black;*/
      text-align: center;
      font-size: 0.25rem;

      p {
        font-size: 0.24rem;
        color: #727272;
        margin: 0;
      }
    }
  }
}

.progressNone {
  font-size: 0.28rem;
  color: #727272;
  text-align: center;
}

.getPhone {
  /*border: 1px solid black;*/
  height: 6rem;
  width: 99%;
  display: flex;
  justify-content: center;
  align-items: center;

  .getPhone-con {
    border: 2px solid rgba(0, 0, 0, 0.22);
    height: 4.4rem;
    border-radius: 3px;
    width: 80%;
    /*padding: 0.3rem 0;*/

    .confirmBtn {
      text-align: right;
      font-size: 0.5rem;
      /*border: 1px solid black;*/
      padding: 0 0.3rem;
    }
  }
}

/deep/ .van-circle__text {
  font-size: 0.3rem;
  /*border: 1px solid black;*/
  width: 66%;
  background: rgba(222, 184, 135, 0);
  margin-left: 0.2rem;
}

/deep/ .van-circle {
  padding: 1px;
}

.userRatings {
  background: white;
  padding: 0.4rem;

  .progress {
    display: flex;
    justify-content: space-between;
    /*border: 1px solid black;*/
    margin-top: 0.4rem;
    margin-bottom: 0.4rem;

    .pro-cir {
      /*border: 1px solid black;*/
      width: 23%;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.27);
      padding: 0.2rem 0.2rem;
      text-align: center;

      p {
        font-size: 0.24rem;
        text-align: center;
        margin: 0;
        color: #727272;
      }
    }
  }

  .commentDetails {
    margin-top: 0.2rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    display: flex;
    justify-content: space-between;
    padding-bottom: 0.2rem;

    .userImg {
      width: 0.6rem;
      height: 0.6rem;
      position: relative;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 0.6rem;
        height: 0.6rem;
        position: absolute;
        top: 0;
      }
    }

    .user-Details {
      width: 86%;

      p {
        font-size: 0.24rem;
        margin: 0;
        color: rgb(75, 75, 75);

        span {
          color: #727272;
          padding: 0 0.1rem;
        }
      }

      p:nth-child(2) {
        padding: 0.2rem 0;
        font-size: 0.28rem;
      }
    }
  }

  .progressBtn {
    border: 1px solid rgba(0, 0, 0, 0.14);
    font-size: 0.32rem;
    text-align: center;
    height: 0.8rem;
    line-height: 0.8rem;
    border-radius: 3px;
    color: #727272;
  }
}

.Prompt {
  width: 5.8rem;
  height: 4.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .detPrompt {
    font-size: 0.28rem;
    width: 80%;
    text-align: center;
    color: #727272;
  }

  .detBtn {
    display: flex;
    justify-content: space-between;
    width: 80%;

    p {
      font-size: 0.3rem;
      width: 45%;
      height: 0.6rem;
      line-height: 30px;
      text-align: center;
      background: #ffe268;
      border-radius: 3px;
    }
  }
}

/deep/ .van-card__price {
  margin-top: 28px;
  color: #ffa500;
  font-weight: bold;
}

.topBtn {
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  font-size: 0.24rem;
  position: fixed;
  top: 0;
  width: 92%;
  z-index: 2018;
  background: white;
  height: 50px;

  .topTitle {
    /*border: 1px solid black;*/
    line-height: 50px;
    font-size: 0.32rem;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .topPrice {
    display: flex;
    justify-content: space-between;
    /*border: 1px solid black;*/
    align-items: center;
    width: 40%;

    p {
      /*border: 1px solid black;*/
      color: orange;
    }

    .topBtn-pay {
      height: 30px;
      width: 80px;
      border-radius: 3px;
      text-align: center;
      line-height: 30px;
      background: #ffe268;
      color: black;
      font-weight: bold;
    }
  }
}

.van-actionsheet {
  min-height: 30%;
}

.van-card__title {
  font-weight: bold;
  font-size: 0.3rem;
  height: 0.32rem;
  line-height: 0.32rem;
  max-height: none;
}

.van-card {
  background: #f5f5f5;
}

.van-card__footer {
  color: #727272;
}

/deep/ .van-card__thumb {
  img {
    /*border: 1px solid black;*/
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
}

.listGoods {
  position: relative;
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

.van-circle__text {
  font-size: 8px;
}

.scoreText {
  font-size: 0.24rem;
  color: rgba(0, 0, 0, 0.41);
  text-align: center;
}

.introduceTitle {
  text-align: center;
  font-weight: bold;
  font-size: 0.32rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .line {
    border: 1px solid rgba(0, 0, 0, 0.35);
    border-radius: 5px;
    width: 40px;
    margin-top: 10px;
  }
}

.van-col {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.63);
  display: flex;
  justify-content: center;
  align-items: center;

  i {
    display: block;
  }
}

.goodesDetails {
  background: rgba(245, 245, 245, 0);
  padding-bottom: 0.4rem;
}

.goodsTitle {
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 20px 15px;
  position: relative;
  font-size: 12px;
  overflow: hidden;

  .zengSong-a {
    box-shadow: 0 0 2px blue;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 100px;
    position: absolute;
    right: -51px;
    top: 125px;
    line-height: 40px;
    border-radius: 50px 0 0 50px;
    overflow: hidden;
    transition: right 0.3s linear;

    .zengSongIcon {
      height: 30px;
      font-size: 20px;
      line-height: 30px;
    }

    .zengText {
      height: 30px;
      line-height: 30px;
    }
  }

  .zengSong {
    box-shadow: 0 0 2px blue;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 100px;
    position: absolute;
    right: 0px;
    top: 125px;
    line-height: 40px;
    border-radius: 50px 0 0 50px;
    overflow: hidden;
    transition: right 0.3s linear;

    .zengSongIcon {
      height: 30px;
      font-size: 20px;
      line-height: 30px;
    }

    .zengText {
      height: 30px;
      line-height: 30px;
    }
  }

  .goodstext {
    text-align: center;
  }

  .goodstext-title {
    font-size: 0.36rem;
    font-weight: bold;
  }

  .goodstext-text {
    font-size: 12px;
    margin-top: 10px;
    color: rgba(0, 0, 0, 0.53);
  }

  .goodsPrice {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 20px 0;

    .Price {
      font-size: 0.32rem;
      color: orange;
      font-weight: bold;
    }

    .originalPrice {
      color: rgba(0, 0, 0, 0.5);
      padding-left: 5px;
      position: relative;
      font-size: 12px;
      width: 11%;
      padding-top: 3px;

      .xian {
        border-bottom: 1px solid rgba(0, 0, 0, 0.39);
        position: relative;
        top: -8px;
        width: 30px;
        left: 10px;
      }
    }
  }

  .shuju {
    margin-top: 20px;
  }
}

.topSearch {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 10;
  background: white;
}

.goodsImg {
  margin-top: 51px;
  width: 100%;
  max-height: 16.8rem;
  overflow: hidden;
  background: #ffffff;

  img {
    width: 100%;
    max-height: 16.8rem;
  }

  .fenxiang {
    width: 1.2rem;
    box-shadow: 0 0 2px rgba(0, 0, 255, 0.46);
    height: 0.5rem;
    position: fixed;
    top: 1.5rem;
    right: 0px;
    border-radius: 50px 0 0 50px;
    font-size: 0.28rem;
    color: #727272;
    line-height: 0.5rem;
    background: white;
    display: flex;
    justify-content: center;
    z-index: 10;

    .fenxiangIcon {
      height: 0.64rem;
      padding-top: 5px;
      z-index: 10;
    }

    p {
      font-size: 0.24rem;
      margin: 0;
    }

    i {
      font-size: 20px;
      color: black;
    }

    span {
      color: red;
    }
  }
}

.introduce {
  margin-top: 10px;
  padding: 20px 15px;
  background: white;
}

.myText {
  font-size: 14px;
  margin-top: 15px;
  text-align: center;
  /*border: 1px solid black;*/
  color: rgba(0, 0, 0, 0.74);
}

.introduceText {
  font-size: 14px;
  margin-top: 10px;
  color: rgba(0, 0, 0, 0.74);
}

.instructions {
  width: 100%;
  background: white;
  display: flex;
  justify-content: center;
  flex-direction: row;

  .instructionsCon {
    background: rgba(135, 135, 135, 0.11);
    width: 94%;
    border: 3px;
    padding: 15px 15px;
  }
}

.codeBox {
  width: 100%;
  /*border-top: 1px solid rgba(0, 0, 0, 0.22);*/
  padding-top: 15px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;

  .codeImg {
    /*border: 1px solid black;*/
    width: 2.25rem;
    height: 2.25rem;

    img {
      width: 2.25rem;
      height: 2.25rem;
    }
  }

  .codeText {
    /*border: 1px solid black;*/
    width: 68%;
    height: auto;
    text-align: center;
    font-size: 14px;
    margin: auto;
  }
}

.evaluation {
  background: white;
  padding-top: 1.25rem;
}

.goodsScore {
  /*border: 1px solid black;*/
  background: white;
  width: 100%;
  display: flex;
  justify-content: space-around;

  .score {
    padding: 1.25rem;
    background: white;
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.15);
    margin-top: 1.25rem;
  }
}

.goodsScoreText {
  padding: 0 0.9357rem;
  margin-top: 1.25rem;

  .goodsItem {
    /*border-bottom: 1px solid rgba(0, 0, 0, 0.01);*/
    padding: 1.25rem 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;

    .userImg {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      overflow: hidden;

      img {
        height: 1.5rem;
        width: 1.5rem;
      }
    }

    .ScoreTime {
      width: 88%;
      margin-left: 0.625rem;
      font-size: 0.625rem;
      color: rgba(0, 0, 0, 0.38);

      .userScoreText {
        font-size: 0.775rem;
        color: rgba(0, 0, 0, 0.53);
        width: 100%;
      }
    }
  }
}

.viewBox {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .viewBtn {
    width: 92%;
    border: 1px solid rgba(0, 0, 0, 0.47);
    border-radius: 3px;
    text-align: center;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.43);
    height: 2.5rem;
    line-height: 2.5rem;
  }
}

.goodsElect {
  /*padding: 1.25rem 0;*/

  .listGoods {
    border-bottom: 1px solid rgba(0, 0, 0, 0.02);
  }

  .Elect {
    margin-bottom: 0.5rem;
    margin-top: 0.3rem;
  }
}

.btntext {
  font-size: 0.7rem;
  color: #727272;
  padding: 0 28px;
  margin: 0;
  margin-top: 15px;
}

.actionsheet {
  width: 17.5rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 20px;
  flex-wrap: wrap;
  /*border: 1px solid black;*/

  .sexBtn {
    margin: 5px 5px;

    .actionsText {
      font-size: 0.7rem;
      color: orangered;
      border: 1px solid orangered;
    }
  }
}

.coupons {
  padding: 0px 15px;

  .mycoupons {
    border-bottom: 1px solid rgba(0, 0, 0, 0.48);
  }
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

.stepper {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 90%;

  .stepperNum {
    background: white;
  }
}

.collection {
  /*background: #727272;*/
  width: 0.85rem;
  height: 0.8rem;
  line-height: 0.8rem;
  text-align: center;
  font-size: 0.36rem;
  border-radius: 50% 50%;
  padding-top: 2px;
  /*padding-left: 1px;*/
  position: fixed;
  top: 9.36rem;
  right: 0.4rem;
  color: white;
  z-index: 10;

  i {
    font-size: 40px;
  }
}

.zensong {
  width: 1.79rem;
  height: 0.5rem;
  position: fixed;
  top: 7rem;
  right: -0.5rem;
  overflow: hidden;
  background: #ffffff;
  z-index: 2000;
  border-radius: 12px;
  box-shadow: -1px 0px 4px #cccccc;
  display: flex;
  align-items: center;
  -webkit-animation: shake 20s infinite;
}
@-webkit-keyframes move {
  0% {
    right: -0.2rem;
    top: 7rem;
  }
  /*25%{
					left: 200px;
					top: 100px;
				}
				50%{
					left: 400px;
					top: 0px;
				}
				75%{
					left: 200px;
					top: 400px;
				}*/
  100% {
    right: -1rem;
    top: 7rem;
  }
}
.gifimg {
  width: 0.6rem;
  height: 0.5rem;
  /* border-radius: 50%; */
}
.gifspan {
  font-size: 0.24rem;
}
.zensongding-top {
  width: 80%;
  margin: 0 auto;
  font-size: 0.32rem;
}
.zensongding-title {
  position: relative;
  color: #858585;
  padding: 0.2rem 0.2rem;
  margin-top: 0.5rem;
}
.positionspan {
  position: absolute;
  right: -7px;
  top: -5px;
  font-size: 0.38rem;
}
.zensongding-ul {
  width: 100%;
  height: 2rem;
  // display: flex;
  // justify-content: space-around;
  // align-items: center;
  // flex-wrap: wrap;
}
.zensongding-ul li {
  width: 20%;
  height: 0.5rem;
  float: left;
  margin-left: 3%;
  margin-top: 4%;
  border: 1px solid #cccccc;
  text-align: center;
  line-height: 0.5rem;
  border-radius: 8px;
  background: #ffffff;
}
.activenumber {
  border: 1px solid #ffa500 !important;
  background: #fef9e6 !important;
}
.zensongding-number {
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.32rem;
  color: #858585;
}
.span-text {
  width: 1.5rem;
  height: 0.5rem;
}
.intput {
  width: 0.6rem;
  height: 100%;
  border: none;
  border-bottom: 1px solid #ffa500;
  text-align: center;
}
.spanjiajian {
  display: inline-block;
  width: 0.4rem;
  height: 100%;
  text-align: center;
  line-height: 0.4rem;
}
</style>