<template>
  <div class="toPromote">
    <div class="openRecruitNone" v-if="openRecruit==0">暂时未开启招募，敬请期待!</div>
    <div v-if="openRecruit==1">
      <div class="userInfo" v-if="CurDisUser">
        <div class="userImg">
          <img :src="userInfo.avatar" alt />
        </div>
        <p class="userTitle">{{userInfo.nickname}}</p>
        <p class="userLevel" v-if="level==1">普通推广员</p>
        <p class="userLevel" v-if="level==2">高级推广员</p>
        <p class="userLevel" v-if="level==3">超级推广员</p>
        <p class="rules" @click="toPromotion">推广规则</p>
      </div>
      <div class="usrEarnings" v-if="CurDisUser">
        <div class="earnings">
          <p class="earnings-title">累计推广收益（元）</p>
          <div class="withdraw">
            <p class="money">{{userInfo.balance}}</p>
            <p class="drawBtn" @click="drawBtn">立即提现</p>
          </div>

          <div class="listCon" v-if="status==1">
            <div class="customer" @click="Customer">
              <p class="customer-title">累计客户（人）</p>
              <p class="numCon">{{userInfo.addupCustomer}}</p>
            </div>
            <div class="promote" @click="extensionWorkers">
              <p class="promote-title">下级推广人员（人）</p>
              <p class="numCon">{{userInfo.subUserCount}}</p>
            </div>
            <div class="order" @click="promoteOrder">
              <p class="order-title">推广订单（笔）</p>
              <p class="numCon">{{userInfo.addupInvite}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="storePromotion" v-if="status==1&&CurDisUser">
        <div class="store">
          <div class="store-icon">
            <van-icon name="bullhorn-o"></van-icon>
          </div>
          <div class="store-con">
            <p @click="canvarsShare">推广店铺</p>
            <p>客户越多赚钱越多</p>
          </div>
          <div class="store-icon">
            <van-icon name="arrow"></van-icon>
          </div>
        </div>
        <div class="lowerLevel">
          <div class="store-icon">
            <van-icon name="cluster-o"></van-icon>
          </div>
          <div class="store-con">
            <p @click="Development">发展下级</p>
            <p>邀请好友一起赚钱</p>
          </div>
          <div class="store-icon">
            <van-icon name="arrow"></van-icon>
          </div>
        </div>
      </div>
      <div class="applyFor" v-if="status==0&&CurDisUser">
        <div class="applycon">
          <van-icon name="info" />
          <span>您已被清退</span>
        </div>
        <div class="applyBtn">
          <p @click="aysPromoter">申请成为普通推广员</p>
        </div>
      </div>
      <div class="applyFor" v-if="!CurDisUser&&recruitAudit==1">
        <div class="applycon">
          <van-icon name="info" />
          <span>您还不是推广员</span>
        </div>
        <div class="applyBtn">
          <p @click="aysPromoter">申请成为普通推广员</p>
        </div>
      </div>
      <!--        <foot></foot>-->
    </div>
    <van-popup v-model="sucessShow" :close-on-click-overlay="false">
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
// import foot from "../components/FootToPro"
import Api from "../Api";

export default {
  name: "ToPromote",
  components: {
    // foot
  },
  data() {
    return {
      sucessShow: false,
      openRecruit: 1, //是否开启招募，默认是1
      status: 0, //是否清退，默认1
      userInfo: {}, //用户信息
      level: 1, //推销员等级默认1
      userKey: "", //当前用户的userKey
      CurDisUser: null,
      recruitAudit: 0 //是否需要审核，默认是0不需要
    };
  },
  created() {},
  beforeMount() {},
  mounted() {
    this.initUserKey();
  },
  methods: {
    //点击开始赚钱
    proBtn() {
      this.sucessShow = false;
      this.initUserKey();
    },
    //判断是否开启招募,开启招募才初始画页面
    getDisSystemSet() {
      this.$axios({
        url: Api.getDisSystemSet,
        method: "post"
      }).then(resp => {
        if (resp.data.code == 200) {
          var openRecruit = resp.data.datas.openRecruit; //招募是否开启
          this.recruitAudit = resp.data.datas.recruitAudit; //审核是否开启
          this.openRecruit = resp.data.datas.openRecruit;
          if (openRecruit == 1) {
            //开启招募
            //获取用户信息,判断是否是会员
            this.curDisUser();
          }
        }
      });
    },
    //判断是否是推销员
    curDisUser() {
      if (this.CurDisUser) {
        //是会员判断状态
        if (this.status == 2) {
          //如果注册过status=2待审核
          this.$router.push("/Audit");
        } else if (this.status == 1) {
          //正常请求数据
          this.getUSerInfo();
        } else if (this.status == 0) {
          this.getUSerInfo();
        }
      } else {
        //不是推销员去判断是否需要审核
        if (this.recruitAudit == 1) {
          // this.$router.push("/SaysPromoter")
        } else if (this.recruitAudit == 0) {
          //恭喜成为会员（直接成为会员）
          //开启招募不需要审核弹出“恭喜成为招募员”框
          if (!this.userKey) {
            // var param = new URLSearchParams()
            var fromUserKey = this.$root.bindUserKey;
            var param = {};
            if (fromUserKey) {
              // param.append("fromUserKey", fromUserKey)
              param.fromUserKey = fromUserKey;
              param = this.$qs.stringify(param);
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
          }
        }
      }
    },

    //获取当前用户userKey
    initUserKey() {
      this.$axios({
        url: Api.getCurDisUser,
        method: "post"
      }).then(resp => {
        if (resp.data.code == 200) {
          this.CurDisUser = resp.data.datas;
          if (resp.data.datas) {
            this.userKey = resp.data.datas.userKey;
            this.getDisSystemSet();
            // 如果等于0(清退)或者1（正常）
            this.status = resp.data.datas.status;
          } else {
            this.getDisSystemSet();
          }
        }
      });
    },
    //初始化获取用户信息
    getUSerInfo() {
      this.$axios({
        url: Api.getMyDisInfo,
        method: "post"
      }).then(resp => {
        if (resp.data.code == 200) {
          this.userInfo = resp.data.datas;
          this.level = resp.data.datas.level;
        }
      });
    },
    //跳转到我的推广订单
    promoteOrder() {
      this.$router.push("/PromoteOrder");
    },
    //跳转到我的下级推广人员
    extensionWorkers() {
      this.$router.push("/ExtensionWorkers");
    },

    //跳转到我的客户
    Customer() {
      this.$router.push("/Customer");
    },

    //发展下级跳转
    Development() {
      this.$router.push("/MyCanvas");
    },
    //跳转到推广员说明
    aysPromoter() {
      this.$router.push("/SaysPromoter");
    },
    //推广细则页面跳转
    toPromotion() {
      this.$router.push("/PromotionRules");
    },
    //提现页面跳转
    drawBtn() {
      this.$router.push("/Withdrawal");
    },
    //店铺推举分享
    canvarsShare() {
      this.$router.push("/MyCanvars");
    }
  }
};
</script>

<style scoped lang="less">
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

.openRecruitNone {
  font-size: 0.3rem;
  padding: 0.5rem;
}

.userInfo {
  /*border: 1px solid black;*/
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0.3rem;
  height: 0.68rem;

  .userImg {
    /*border: 1px solid black;*/
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
    overflow: hidden;
    position: relative;

    img {
      position: absolute;
      top: 0;
      height: 1rem;
      width: 1rem;
    }
  }

  p {
    font-size: 0.24rem;
    /*border: 1px solid black;*/
    line-height: 0.6rem;
    margin: 0 0 0 0.2rem;
    height: 0.6rem;
  }

  .rules {
    margin-left: 0.72rem;
    color: #2196f3;
  }

  .userTitle {
    font-weight: bold;
    font-size: 0.28rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 30%;
  }

  .userLevel {
    border: 1px solid #9b704e;
    border-radius: 10px;
    padding: 0 0.2rem;
    height: 0.4rem;
    line-height: 0.4rem;
    color: #9b704e;
  }
}

.usrEarnings {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0 0.3rem;

  .earnings {
    background: #ab905a;
    /*border: 1px solid black;*/
    height: auto;
    width: 90%;
    border-radius: 5px;
    padding: 0 0.3rem;
    padding-bottom: 0.4rem;

    .earnings-title {
      font-size: 0.24rem;
      color: white;
      margin-bottom: 0;
    }

    .withdraw {
      border-bottom: 1px solid rgba(255, 255, 255, 0.16);
      display: flex;
      justify-content: space-between;
      height: 40px;
      /*border: 1px solid white;*/
      align-items: center;

      p {
        /*border: 1px solid black;*/
        font-size: 0.24rem;
        color: white;
      }

      .money {
        font-size: 0.6rem;
        margin: 0;
        line-height: 42px;
        font-weight: bold;
      }

      .drawBtn {
        border: 1px solid white;
        border-radius: 10px;
        width: 20%;
        text-align: center;
        height: 0.5rem;
        line-height: 0.5rem;
      }
    }

    .listCon {
      /*border: 1px solid black;*/
      width: 100%;
      height: 1rem;
      display: flex;
      justify-content: space-between;
      margin-top: 0.2rem;

      .customer {
        border-right: 1px solid rgba(255, 255, 255, 0.16);

        .customer-title {
          font-size: 0.24rem;
          color: white;
          margin: 0;
        }
      }

      .promote {
        border-right: 1px solid rgba(255, 255, 255, 0.16);

        .promote-title {
          font-size: 0.24rem;
          color: white;
          margin: 0;
        }
      }

      .order {
        .order-title {
          font-size: 0.24rem;
          color: white;
          margin: 0;
        }
      }

      .numCon {
        font-size: 0.3rem;
        font-weight: bold;
        color: white;
        margin: 0;
        margin-top: 0.22rem;
      }
    }
  }
}

.storePromotion {
  display: flex;
  justify-content: space-between;
  padding: 0 0.3rem;
  margin-top: 0.4rem;

  .store {
    /*border: 1px solid black;*/
    width: 40%;
    height: 50px;
    border-radius: 3px;
    display: flex;
    justify-content: space-between;
    padding: 0.1rem 0.3rem;
    background: white;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.44);

    .store-icon {
      font-size: 0.36rem;
      line-height: 50px;
      color: #9b704e;
    }

    .store-con {
      p {
        font-size: 0.28rem;
        margin: 0;
        margin-top: 5px;
      }

      p:nth-child(2) {
        font-size: 0.2rem;
        color: #727272;
        margin: 0;
      }
    }
  }

  .lowerLevel {
    width: 40%;
    height: 50px;
    border-radius: 3px;
    display: flex;
    justify-content: space-between;
    padding: 0.1rem 0.3rem;
    background: white;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.44);

    .store-icon {
      font-size: 0.36rem;
      line-height: 50px;
      color: #9b704e;
    }

    .store-con {
      p {
        font-size: 0.28rem;
        margin: 0;
        margin-top: 5px;
      }

      p:nth-child(2) {
        font-size: 0.2rem;
        color: #727272;
        margin: 0;
      }
    }
  }
}

.applyFor {
  .applycon {
    font-size: 0.24rem;
    /*border: 1px solid black;*/
    padding: 0 0.3rem;
    margin: 0.2rem 0;

    i {
      color: orange;
    }

    span {
      padding-left: 0.2rem;
      color: #727272;
    }
  }

  .applyBtn {
    /*border: 1px solid black;*/
    display: flex;
    justify-content: center;

    p {
      border: 1px solid #9b704e;
      font-size: 0.28rem;
      color: #9b704e;
      padding: 0.1rem 0.1rem;
      border-radius: 3px;
    }
  }
}
</style>