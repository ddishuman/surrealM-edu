<template>
  <div id="SetInfo" class="admin-set-info">
    <div class="setting-area">
      <img class="setting-logo" src="@/assets/img/SURREALM/Admin/logo_1.png" />
      <div class="setting-keyin-area" v-show="CurrentStep == 1">
        <h2 class="setting-title">Admin 帳號設定</h2>
        <form>
          <div class="setting-desc">Email</div>
          <input class="setting-input" v-model.trim="Info.Email" type="text" placeholder="輸入帳號" />
          <br /><br />
          <div class="setting-desc">密碼</div>
          <input
            class="setting-input"
            v-model.trim="Info.Password"
            type="password"
            placeholder="輸入密碼"
            autocomplete="on"
          />
          <div class="setting-desc">再次確認密碼</div>
          <input
            class="setting-input"
            v-model.trim="Info.PasswordAgain"
            type="password"
            placeholder="輸入密碼"
            autocomplete="on"
          />
        </form>
        <br /><br />
        <hr class="setting-endline" />
        <button class="setting-btn" @click="NextStep()">下一步</button>
      </div>
      <div class="setting-keyin-area" v-show="CurrentStep == 2">
        <h2 class="setting-title">Admin 帳號設定</h2>
        <div class="setting-desc">*單位名稱</div>
        <input class="setting-input" v-model.trim="Info.Company" type="text" placeholder="" />
        <div class="setting-desc">*聯絡人姓名</div>
        <input class="setting-input" v-model.trim="Info.ContactName" type="text" placeholder="" />
        <div class="setting-desc">*聯絡人電話</div>
        <input class="setting-input" v-model.trim="Info.ContactPhone" type="text" placeholder="" />
        <br />
        <label class="setting-mark">*星號欄位必填</label>
        <hr class="setting-endline" />

        <button class="setting-btn" @click="NextStep()">確認送出</button>
        <button class="setting-btn" @click="PreStep()">上一步</button>
      </div>
      <div class="setting-keyin-area" v-show="CurrentStep == 3">
        <h2 class="setting-done-title">
          <img src="@/assets/img/SURREALM/Admin/done.png" class="setting-done-icon" />
          Admin帳號建立完成
        </h2>
        <div class="setting-done-text">
          恭喜您完成Surrealm管理者帳號的建立，您現在可以登入管理者後台，新增您方案底下的使用者了。
          <br />
          <br />
          請注意！使用者（無論教師或學生身分）必須先由管理者新增至系統中，並完成註冊程序，才能開始使用Surrealm共學平台。
        </div>
        <hr class="setting-endline" />
        <button class="setting-done-btn" @click="NextStep()">登入管理者後台</button>
      </div>
    </div>
    <DialogHint :Show="dialogHint.Show" @close-dialog="CloseHint" />
  </div>
</template>

<script>
import DialogHint from '@/components/SURREALM/Admin/DialogSetInfoHint.vue';
import { apicheckEmail, apiUpdateAdminAccount } from '@/request.js';
import sha256 from 'sha256';

export default {
  data() {
    return {
      CurrentStep: 1,
      Info: {
        Email: '',
        Password: '',
        PasswordAgain: '',
        Company: '',
        ContactName: '',
        ContactPhone: '',
      },
      QueryString: {
        Serial: '',
        Email: '',
      },
      dialogHint: {
        Show: false,
      },
    };
  },
  mounted() {
    this.QueryString.Serial = this.GetParameterByName('s');
    this.QueryString.Email = this.GetParameterByName('e');
    if (this.QueryString.Serial == null && this.QueryString.Email == null) {
      this.$router.push({ path: '/SURREALM/Admin/Login' });
    }
  },
  methods: {
    NextStep() {
      let ErrMsg = '';
      if (this.CurrentStep == 1) {
        //check
        ErrMsg = this.CheckStep1();
        if (ErrMsg != '') {
          this.$toasted.show(ErrMsg, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        } else {
          let data = {
            Email: this.Info.Email,
            Type: 'email',
          };
          this.CheckEmail(data)
            .then((success) => {
              if (success != '') {
                this.dialogHint.Show = true;
              } else {
                this.CurrentStep++;
              }
            })
            .catch((failcode) => {
              this.$toasted.show(this.$t('SURREALM.ApiErr') + failcode, {
                icon: 'warning',
                position: 'bottom-center',
                duration: 3500,
              });
            });
        }
      } else if (this.CurrentStep == 2) {
        ErrMsg = this.CheckStep2();
        if (ErrMsg != '') {
          this.$toasted.show(ErrMsg, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        } else {
          let data = {
            Serial: Number(this.QueryString.Serial),
            PurchaseEmail: this.QueryString.Email,
            Email: this.Info.Email,
            Password: sha256(this.Info.Password),
            Company: this.Info.Company,
            ContactName: this.Info.ContactName,
            ContactPhone: this.Info.ContactPhone,
          };

          apiUpdateAdminAccount(data).then((res) => {
            if (res.data.Status == 'ok') {
              this.CurrentStep++;
            } else {
              let ErrMsg = '';
              if (res.data.Code == '409') {
                ErrMsg = '此連結已被開通，無法重複使用！';
              } else {
                ErrMsg = this.$t('SURREALM.ApiErr') + `${res.data.Code} ,${res.data.Error}`;
              }
              this.$toasted.show(ErrMsg, {
                icon: 'warning',
                position: 'bottom-center',
                duration: 3500,
              });
            }
          });
        }
      } else if (this.CurrentStep == 3) {
        this.$router.push({ path: '/SURREALM/Admin/Login' });
      }
    },
    PreStep() {
      if (this.CurrentStep != 1) {
        this.CurrentStep--;
      }
    },

    CheckEmail(data) {
      return new Promise((resolve, reject) => {
        apicheckEmail(data).then((res) => {
          if (res.data.Status == 'ok') {
            if (res.data.Serial == -1) {
              resolve('');
            } else {
              resolve('此管理者帳號已存在');
            }
          } else {
            reject(res.data.Code);
          }
        });
      });
    },
    CheckStep1() {
      let ReturnErr = '';
      if (this.Info.Email.trim() == '') {
        ReturnErr = this.$t('SURREALM.Login.PlaceholderEmail');
      } else if (this.Info.Password.trim() == '' || this.Info.PasswordAgain.trim() == '') {
        ReturnErr = this.$t('SURREALM.Login.PlaceholderPw');
      } else if (!this.TestPassword(this.Info.Password)) {
        ReturnErr = this.$t('SURREALM.Register.ErrMsg.Password');
      } else if (this.Info.PasswordAgain != this.Info.Password) {
        ReturnErr = this.$t('SURREALM.Register.ErrMsg.PasswordAgain');
      }
      return ReturnErr;
    },
    CheckStep2() {
      let ReturnErr = '';
      if (this.Info.Company.trim() == '') {
        ReturnErr = '請輸入單位名稱';
      } else if (this.Info.ContactName.trim() == '') {
        ReturnErr = '請輸入聯絡人姓名';
      } else if (this.Info.ContactPhone.trim() == '') {
        ReturnErr = '請輸入聯絡人電話';
      }
      return ReturnErr;
    },
    CloseHint() {
      this.dialogHint.Show = false;
    },
  },
  components: {
    DialogHint,
  },
};
</script>
