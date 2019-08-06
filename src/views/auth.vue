<template>
  <div class="authimput">
    <div class="auth-top-img">
      <div class="authimg">
        <img src="@/assets/imgs/ok.png" />
      </div>
      <div class="auth-ok">绑定成功！</div>
      <div class="auth-span">请返回电脑端继续操作</div>
    </div>
    <div class="auth-footer">--心理测评管理，专注于心理测试与社群运营的聚合型工具--</div>
  </div>
</template>

<script>
export default {
  mounted(){
    this.$root.initMain();
  }
};
</script>

<style>
.authimput {
  width: 100%;
  height: 100%;
}
.auth-top-img {
  width: 80%;
  height: 60%;
  margin: 1.5rem auto;
  text-align: center;
  /* border: 1px solid red; */
}
.authimg {
  width: 1.5rem;
  height: 1.5rem;
  margin: 0 auto;
  padding-right: 0.2rem;
}
.authimg img {
  width: 100%;
  height: 100%;
}
.auth-ok {
  margin: 0.3rem 0;
  font-size: 0.5rem;
}
.auth-span {
  font-size: 0.3rem;
}
.auth-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 0.2rem;
  padding: 0.3rem 0;
  width: 100%;
  text-align: center;
  color: #888888;
}
</style>
