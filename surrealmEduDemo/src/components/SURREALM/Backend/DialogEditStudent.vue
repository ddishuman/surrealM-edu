<template>
  <div class="pnlDialogFull" v-show="show" style="">
    <div class="pnlDialogGray">
      <!-- @click.self="CloseDialog" -->
      <div class="pnlDialogEditStudent">
        <div class="pnlTitle">
          <label>{{ $t('SURREALM.StudentManager.EditStudent') }}</label>
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
        </div>
        <div class="pnlContent">
          <label class="keyinTitle">{{ $t('SURREALM.StudentManager.StudentEmail') }}</label>
          <label class="labelContent">{{ Info.Email }}</label>
          <label class="keyinTitle">{{ $t('SURREALM.StudentManager.StudentName') }}</label>
          <input
            class="keyinContent"
            type="text"
            v-model.trim="Info.Name"
            maxlength="20"
            :placeholder="$t('SURREALM.StudentManager.Placeholder.Name')"
          />
          <label class="keyinTitle">{{ $t('SURREALM.StudentManager.StudentNickName') }}</label>
          <input
            class="keyinContent"
            type="text"
            v-model.trim="Info.NickName"
            maxlength="20"
            :placeholder="$t('SURREALM.StudentManager.Placeholder.Nickname')"
          />
          <div class="toolArea">
            <button class="btnNoBg" @click="CloseDialog">
              {{ $t('SURREALM.AccountInfo.BtnCancel') }}
            </button>
            <button class="btnNoBg" @click="EditStudent">
              {{ $t('SURREALM.AccountInfo.BtnSave') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { apiUpdateContact } from '@/request.js';
export default {
  name: 'DialogEditStudent',
  props: {
    show: Boolean,
    serial: Number,
    email: String,
    name: String,
    nickname: String,
  },
  data() {
    return {
      Info: {
        Serial: 0,
        Email: '',
        Name: '',
        NickName: '',
      },
    };
  },
  watch: {
    serial(num) {
      this.Info.Serial = num;
    },
    email(str) {
      this.Info.Email = str;
    },
    name(str) {
      this.Info.Name = str;
    },
    nickname(str) {
      this.Info.NickName = str;
    },
  },
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    CheckEditStudent() {
      let ErrMsg = '';
      if (this.Info.Name == '') {
        ErrMsg = this.$t('SURREALM.StudentManager.Placeholder.Name');
      }
      // else if(this.Info.NickName == '')
      // {
      //   ErrMsg = this.$t('SURREALM.StudentManager.Placeholder.Nickname');
      // }
      return ErrMsg;
    },
    EditStudent() {
      let ErrMsg = this.CheckEditStudent();
      if (ErrMsg == '') {
        let data = {
          Name: this.Info.Name,
          Nickname: this.Info.NickName,
        };
        apiUpdateContact(this.Info.Serial, data).then((res) => {
          if (res.data.Status == 'ok') {
            data.Serial = this.Info.Serial;
            this.$emit('edit-student', data);
            this.CloseDialog();
          } else {
            this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
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
};
</script>