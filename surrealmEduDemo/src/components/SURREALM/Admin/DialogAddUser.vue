<template>
  <div class="dialog-full" v-show="Show">
    <div class="dialog-gray">
      <div class="dialog-add-user">
        <div class="title-area">
          <img class="icon-alart" src="@/assets/img/SURREALM/Admin/icon_add_2.png" />
          <label class="title-txt">個別新增</label>
        </div>
        <div class="keyin-desc">帳號</div>
        <input class="keyin-input" type="text" v-model.trim="Account" placeholder="輸入帳號" />
        <div class="keyin-desc">姓名</div>
        <input class="keyin-input" type="text" v-model.trim="Name" placeholder="輸入姓名" />
        <div class="keyin-desc">身分</div>
        <select v-model="Type" class="keyin-input">
          <option v-for="option in TypeOptions" :key="option.Text" :value="option.Value">
            {{ option.Text }}
          </option>
        </select>

        <div class="btn-tool">
          <button class="btn-left" @click="CloseDialog()">取消</button>
          <button class="btn-right" @click="AddUser()">新增</button>
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
import { apiAddAccount } from '@/request.js';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  name: 'DialogAddUser',
  props: {
    Show: Boolean,
  },
  data() {
    return {
      Account: '',
      Name: '',
      Type: 'teacher',
      TypeOptions: [
        { Text: '老師', Value: 'teacher' },
        { Text: '學生', Value: 'student' },
      ],
      loadingInfo: {
        isLoading: false,
        color: '#fff',
        opacity: 0.9,
        bgColor: '#131217',
      },
    };
  },
  mounted() {},
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    AddUser() {
      let ChkMsg = this.ChkError();
      if (ChkMsg == '') {
        this.loadingInfo.isLoading = true;
        let data = {
          Account: this.Account,
          Name: this.Name,
          Type: this.FirstWordUpperCase(this.Type),
        };
        apiAddAccount(data).then((res) => {
          this.loadingInfo.isLoading = false;
          if (res.data.Status == 'ok') {
            this.$emit('close-dialog');
            this.$emit('add-down');
            this.$toasted.show('新增完成', {
              icon: 'check',
              position: 'bottom-center',
              duration: 3500,
            });
          } else {
            let ErrMsg = '';
            if (res.data.Code == '409') {
              ErrMsg = '新增資料中包含已存在/已停用帳號，如須恢復請洽客服人員';
            } else if (res.data.Code == '422') {
              ErrMsg = '已達使用人數上限';
            } else {
              ErrMsg = res.data.Error;
            }
            this.$toasted.show(ErrMsg, {
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
    ChkError() {
      let ErrMsg = '';
      if (this.Account.trim() == '') {
        ErrMsg = '請填寫帳號。';
      } else if (!this.TestEmail(this.Account.trim())) {
        ErrMsg = '信箱格式有誤, 請確認';
      }
      else if (this.Name.trim() == '') {
        ErrMsg = '請填寫姓名。';
      }
      return ErrMsg;
    },
  },
  components: {
    Loading,
  },
};
</script>