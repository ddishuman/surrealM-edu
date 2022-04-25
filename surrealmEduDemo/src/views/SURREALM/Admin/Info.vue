<template>
  <div id="AccountInfo">
    <Menu />
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/Admin/Login" />
    <div class="info-page">
      <div class="title-bar">
        <h1 class="title-txt">個人設定</h1>
        <button class="title-btn" @click="ShowResetPWDialog()">
          <img src="@/assets/img/SURREALM/Admin/icon_edit.png" class="btn-icon" />
          修改密碼
        </button>
      </div>
      <div class="info-area">
        <img class="info-logo" src="@/assets/img/SURREALM/Admin/icon_info.png" />
        <div class="info-keyin-area">
          <h3 class="info-title">
            Admin 資料設定
            <button class="btn-edit" v-if="EditMode" @click="SwitchEditMode(false)"></button>
          </h3>
          <div class="keyin-desc">*單位名稱</div>
          <input class="keyin-input" type="text" v-model.trim="Info.Company" :disabled="EditMode" />
          <!-- <div class="keyin-hint">需與統一編號登記的單位名稱一致</div>
          <div class="keyin-desc">統一編號</div>
          <input class="keyin-input" type="text" v-model.trim="Info.TaxId" :disabled="EditMode" /> -->
          <div class="keyin-desc">*聯絡人姓名</div>
          <input class="keyin-input" type="text" v-model.trim="Info.ContactName" :disabled="EditMode" />
          <div class="keyin-desc">*聯絡人電話</div>
          <input class="keyin-input" type="text" v-model.trim="Info.ContactPhone" :disabled="EditMode" />
          <div class="keyin-desc">使用期限</div>
          <div class="keyin-input" style="background: white">{{ Info.ExpireDate }}</div>
          <hr style="margin-bottom: 40px" />
          <button class="btn-right" v-if="!EditMode" @click="UpdateAccountInfo()">儲存修改</button>
          <button class="btn-left" v-if="!EditMode" @click="SwitchEditMode(true)">取消</button>
        </div>
      </div>
    </div>
    <Footer />
    <DialogMsgTwoBtn
      :Show="dialogMsg.Show"
      :Title="dialogMsg.Title"
      :Msg="dialogMsg.Msg"
      :TxtLeftBtn="dialogMsg.TxtLeftBtn"
      :TxtRightBtn="dialogMsg.TxtRightBtn"
      @click-left="CloseResetPWDialog()"
      @click-right="ResetPW()"
    />
    <DialogMsg :Show="dialogHint.Show" :Msg="dialogHint.Msg" @close-dialog="CloseHintDialog()" />
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
import Header from '@/components/SURREALM/Admin/Header.vue';
import Menu from '@/components/SURREALM/Admin/Menu.vue';
import Footer from '@/components/SURREALM/Admin/Footer.vue';
import DialogMsgTwoBtn from '@/components/SURREALM/Admin/DialogMsgTwoBtn.vue';
import DialogMsg from '@/components/SURREALM/Admin/DialogMsg.vue';
import { apiGetAdminInfo, apiUpdateAdminInfo, apiGetResetPwEmail } from '@/request.js';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  mounted() {
    this.GetAccountInfo();
  },
  data() {
    return {
      Info: {
        Company: '',
        //TaxId: '',
        ContactName: '',
        ContactPhone: '',
        ExpireDate: '2022/12/31',
      },
      loadingInfo: {
        isLoading: false,
        color: '#fff',
        opacity: 0.9,
        bgColor: '#131217',
      },
      EditMode: true,
      dialogMsg: {
        Show: false,
        Title: '',
        Msg: '',
        TxtLeftBtn: '',
        TxtRightBtn: '',
      },
      dialogHint: {
        Show: false,
        Msg: '',
      },
    };
  },
  computed: {},
  methods: {
    GetAccountInfo() {
      //TODO API /admininfo (get) 79
      //不用再送Info.TaxId 教育版沒有統一編號
      apiGetAdminInfo().then((res) => {
        if (res.data.Status == 'ok') {
          this.Info = res.data;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    UpdateAccountInfo() {
      let ChkMsg = this.ChkInfo();
      if (ChkMsg == '') {
        this.Info.Password = '';
        //TODO API /adminaccount (patch) 72
        //不會再帶Info.TaxId過去 教育版沒有統一編號
        apiUpdateAdminInfo(this.Info).then((res) => {
          if (res.data.Status == 'ok') {
            this.SwitchEditMode(true);
            this.$toasted.show('修改完成', {
              icon: 'check',
              position: 'bottom-center',
              duration: 3500,
            });
          } else {
            this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
        });
      } else {
        this.$toasted.show(ChkMsg, {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      }
    },
    SwitchEditMode(bool) {
      this.EditMode = bool;
    },
    ChkInfo() {
      let ErrMsg = '';
      if (this.Info.Company.trim() == '') {
        ErrMsg = '請填寫單位名稱。';
      } else if (this.Info.ContactName.trim() == '') {
        ErrMsg = '請填寫聯絡人名稱。';
      } else if (this.Info.ContactPhone.trim() == '') {
        ErrMsg = '請填寫聯絡人電話。';
      }
      return ErrMsg;
    },
    ShowResetPWDialog() {
      this.dialogMsg.Show = true;
      this.dialogMsg.TxtLeftBtn = '取消';
      this.dialogMsg.TxtRightBtn = '確定';
      this.dialogMsg.Title = '確定要變更密碼嗎?';
      this.dialogMsg.Msg = '點擊確定後<br />後台將會寄出一封重設密碼信至您的信箱';
    },
    CloseResetPWDialog() {
      this.dialogMsg.Show = false;
    },
    ResetPW() {
      this.loadingInfo.isLoading = true;
      apiGetResetPwEmail().then((res) => {
        this.loadingInfo.isLoading = false;
        if (res.data.Status == 'ok') {
          this.CloseResetPWDialog();
          this.ShowHint();
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    ShowHint() {
      this.dialogHint.Show = true;
      this.dialogHint.Msg = '請至信箱收信依照指示變更密碼<br />並以新密碼重新登入';
    },
    CloseHintDialog() {
      this.dialogHint.Show = false;
      this.Logout();
    },
    Logout() {
      this.$store.dispatch('LOGOUT');
      this.$router.push({ path: '/SURREALM/Admin/Login' });
    },
  },
  components: {
    Header,
    Menu,
    Footer,
    DialogMsgTwoBtn,
    DialogMsg,
    Loading,
  },
};
</script>