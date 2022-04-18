<template>
  <div id="ForgetPW" class="admin-forget-pw">
    <div class="forget-area">
      <img src="@/assets/img/SURREALM/Admin/logo_2.png" class="forget-logo" />
      <div class="forget-keyin-area">
        <h2 class="forget-title">忘記密碼</h2>
        <div class="forget-desc">E-mail</div>
        <input type="text" class="forget-input" v-model.trim="Account" placeholder="輸入註冊信箱" />
        <button class="forget-btn-left" @click="BackLogin()">返回登入頁</button>
        <button class="forget-btn-right" @click="ForgetPWMail()">送出</button>
      </div>
    </div>
    <DialogMsgMaintain />
    <Loading
      :active.sync="loadingInfo.isLoading"
      :can-cancel="false"
      :is-full-page="true"
      :color="loadingInfo.color"
      :opacity="loadingInfo.opacity"
      :background-color="loadingInfo.bgColor"
    ></Loading>
  </div>
</template>

<script>
import DialogMsgMaintain from '@/components/SURREALM/Backend/DialogMsgMaintain.vue';
import { apiAdminForgetPW } from '@/request.js';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
//import sha256 from 'sha256';

export default {
  data() {
    return {
      Placeholder: {
        Email: this.$t('SURREALM.Login.PlaceholderEmail'),
        Pw: this.$t('SURREALM.Login.PlaceholderPw'),
      },
      Account: '',
      Password: '',
      loadingInfo: {
        isLoading: false,
        color: '#fff',
        opacity: 0.9,
        bgColor: '#131217',
      },
    };
  },
  methods: {
    BackLogin() {
      this.$router.push({ path: '/SURREALM/Admin/Login' });
    },
    ForgetPWMail() {
      if (this.Account.trim() != '') {
        this.loadingInfo.isLoading = true;
        apiAdminForgetPW(this.Account).then((res) => {
          this.loadingInfo.isLoading = false;
          if (res.data.Status == 'ok') {
            this.$toasted.show('信件已送出, 請至信箱修改密碼, 謝謝', {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
            this.$router.push({ path: '/SURREALM/Admin/Login' });
          } else {
            let ErrMsg = '';
            if (res.data.Code == '2001') {
              ErrMsg = '無此帳號';
            } else {
              ErrMsg = this.$t('SURREALM.ApiErr') + `${res.data.Code}, ${res.data.Error}`;
            }
            this.$toasted.show(ErrMsg, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
        });
      } else {
        this.$toasted.show('請輸入註冊信箱', {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      }
    },
  },
  components: {
    DialogMsgMaintain,
    Loading,
  },
};
</script>

