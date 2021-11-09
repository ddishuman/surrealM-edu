<template>
  <div class="pnlDialogFull" v-show="show" style="">
    <div class="pnlDialogGray">
      <!-- @click.self="CloseDialog" -->
      <div class="pnlDialogChangePW">
        <div class="pnlTitle">
          <label>{{ $t('SURREALM.AccountInfo.ChangePW') }}</label>
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
        </div>
        <div class="pnlContent">
          <label class="keyinTitle">{{ $t('SURREALM.AccountInfo.OldPW') }}</label>
          <input
            class="keyinContent"
            type="password"
            v-model.trim="oldPW"
            maxlength="12"
            :placeholder="$t('SURREALM.AccountInfo.PlaceholderOldPW')"
          />
          <label class="keyinTitle">{{ $t('SURREALM.AccountInfo.NewPW') }}</label>
          <input
            class="keyinContent"
            type="password"
            v-model.trim="newPw"
            maxlength="12"
            :placeholder="$t('SURREALM.AccountInfo.PlaceholderNewPW')"
          />
          <label class="keyinTitle">{{ $t('SURREALM.AccountInfo.NewPWAgain') }}</label>
          <input
            class="keyinContent"
            type="password"
            v-model.trim="newPwConfirm"
            maxlength="12"
            :placeholder="$t('SURREALM.AccountInfo.PlaceholderNewPWAgain')"
          />
          <div class="toolArea">
            <button class="btnNoBg" @click="CloseDialog">
              {{ $t('SURREALM.AccountInfo.BtnCancel') }}
            </button>
            <button class="btnNoBg" @click="ChangePW">
              {{ $t('SURREALM.AccountInfo.BtnSave') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { apiChangePW } from '@/request.js';
import sha256 from 'sha256';

export default {
  name: 'DialogChangePW',
  props: {
    show: Boolean,
  },
  data() {
    return {
      oldPW: '',
      newPw: '',
      newPwConfirm: '',
    };
  },
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    ChangePW() {
      let ChkMsg = this.CheckPW();
      if (ChkMsg == '') {
        let data = {
          OldPW: sha256(this.oldPW),
          NewPW: sha256(this.newPw),
        };
        apiChangePW(data).then((res) => {
          if (res.data.Status == 'ok') {
            this.CloseDialog();
            this.$toasted.show(this.$t('SURREALM.AccountInfo.ChangePWOK'), {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          } else {
            this.$toasted.show(res.data.Error, {
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
    CheckPW() {
      let errMsg = '';
      if (this.oldPW.trim() == '' || this.newPw.trim() == '' || this.newPwConfirm.trim() == '') {
        errMsg = this.$t('SURREALM.Register.ErrMsg.AccPwNull');
      } else if (!this.TestPassword(this.newPw)) {
        errMsg = this.$t('SURREALM.Register.ErrMsg.Password');
      } else if (this.newPwConfirm != this.newPw) {
        errMsg = this.$t('SURREALM.Register.ErrMsg.PasswordAgain');
      }
      return errMsg;
    },
  },
};
</script>