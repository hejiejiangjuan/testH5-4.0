<template>
  <div>
    <div class="imgcenter">
      <img src="@/assets/imgs/liwu.png" alt />
      <h2>购买赠礼成功！</h2>
      <p>请到我的测评-我的赠礼中查看</p>
    </div>
    <div class="admmbtn" @click="pathTo">查看详情</div>
  </div>
</template>

<script>
export default {
  methods: {
    pathTo() {
      this.$router.push({
        path: "/mygift"
      });
    }
  }
};
</script>

<style  scoped lang="less">
.imgcenter {
  width: 60%;
  height: 5rem;
  margin: 0 auto;
  font-size: 0.3rem;
  // border: 1px solid #000000;
  text-align: center;
  margin-top: 2rem;
}
.imgcenter h2 {
  font-size: 0.26rem;
  color: #949494;
}
.admmbtn {
  font-size: 0.3rem;
  width: 80%;
  /* border: 1px solid; */
  height: 0.7rem;
  text-align: center;
  line-height: 0.7rem;
  margin: 0 auto;
  background: #fedd2c;
  border-radius: 0.1rem;
  color: #564845;
}
</style>
