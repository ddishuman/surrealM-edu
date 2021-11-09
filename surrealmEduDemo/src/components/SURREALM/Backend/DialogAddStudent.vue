<template>
  <div class="pnlDialogFull" v-show="show" style="">
    <div class="pnlDialogGray">
      <!-- @click.self="CloseDialog" -->
      <div class="pnlDialogAddStudent">
        <div class="pnlTitle">
          <label>{{ $t('SURREALM.StudentManager.AddStudent') }}</label>
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
        </div>
        <div class="pnlContent">
          <label class="keyinTitle">{{ $t('SURREALM.StudentManager.StudentEmail') }}</label>
          <input
            class="keyinContent"
            type="text"
            v-model.trim="Email"
            maxlength="40"
            :placeholder="$t('SURREALM.StudentManager.Placeholder.Email')"
          />
          <label class="keyinTitle">{{ $t('SURREALM.StudentManager.StudentName') }}</label>
          <input
            class="keyinContent"
            type="text"
            v-model.trim="Name"
            maxlength="20"
            :placeholder="$t('SURREALM.StudentManager.Placeholder.Name')"
          />
          <div class="toolArea">
            <button class="btnNoBg" @click="CloseDialog">
              {{ $t('SURREALM.AccountInfo.BtnCancel') }}
            </button>
            <button class="btnNoBg" @click="AddStudent">
              {{ $t('SURREALM.AccountInfo.BtnSave') }}
            </button>
          </div>
        </div>
      </div>
    </div>
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
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { apiAddContact } from '@/request.js';

export default {
  name: 'DialogAddStudent',
  props: {
    show: Boolean,
    tagSerial: Number,
  },
  data() {
    return {
      loadingInfo: {
        isLoading: false,
        color: '#fff',
        opacity: 0.9,
        bgColor: '#131217',
      },
      Email: '',
      Name: '',
    };
  },
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    CheckAddStudent() {
      let ErrMsg = '';
      if (this.Email == '') {
        ErrMsg = this.$t('SURREALM.StudentManager.Placeholder.Email');
      } else if (!this.TestEmail(this.Email)) {
        ErrMsg = this.$t('SURREALM.Register.ErrMsg.Account');
      } else if (this.Name == '') {
        ErrMsg = this.$t('SURREALM.StudentManager.Placeholder.Name');
      }
      return ErrMsg;
    },
    AddStudent() {
      let data = {
        Email: this.Email,
        Name: this.Name,
        TagSerial: this.tagSerial,
      };

      let ErrMsg = this.CheckAddStudent();
      if (ErrMsg == '') {
        this.loadingInfo.isLoading = true;
        apiAddContact(data).then((res) => {
          console.log('apiAddContact' + JSON.stringify(res.data));
          if (res.data.Status == 'ok') {
            data.Serial = res.data.Serial;
            data.Selected = false;
            data.Nickname = this.Name;
            //this.$emit('add-student', data);
            this.$emit('add-student');
            this.CloseDialog();
          } else {
            let errmsg = '';
            switch (res.data.Code) {
              case 409:
                errmsg = this.$t('SURREALM.StudentManager.Err.RepeatAdd');
                break;
              case 2001:
                errmsg = this.$t('SURREALM.StudentManager.Err.InvalidAcc');
                break;
              default:
                errmsg = this.$t('SURREALM.ApiErr') + res.data.Code;
                break;
            }
            this.$toasted.show(errmsg, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
          this.loadingInfo.isLoading = false;
        });
      } else {
        this.$toasted.show(ErrMsg, {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      }
    },
  },
  components: {
    Loading,
  },
};
</script>