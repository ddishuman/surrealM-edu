<template>
  <div id="AccountInfo">
    <Menu />
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/Admin/Login" />
    <div class="account-page">
      <div class="title-bar">
        <h1 class="title-txt">帳號管理</h1>
        <button class="title-btn" @click="ShowAddUser()">
          <img src="@/assets/img/SURREALM/Admin/icon_add.png" class="btn-icon" />
          個別新增
        </button>
        <button class="title-btn" @click="ShowImportUser()">
          <img src="@/assets/img/SURREALM/Admin/icon_import.png" class="btn-icon" />
          批次匯入
        </button>
        <button class="title-btn" @click="DownloadImportExample()">
          <img src="@/assets/img/SURREALM/Admin/icon_download.png" class="btn-icon" />
          匯入範例下載
        </button>
        <input class="title-search" type="text" v-model.trim="SearchKeyWord" placeholder="請輸入名稱或Email" />
      </div>

      <button :class="TabStyle('teacher')" @click="SwitchTab('teacher')">教師帳號</button>
      <button :class="TabStyle('student')" @click="SwitchTab('student')">學生帳號</button>
      <div class="data-area">
        <label class="data-desc">同時上線數 : </label>
        <label class="data-number" :style="GetTxtColor">{{ UserInfo.MaxOnlineNumber }}</label>
        <label class="data-desc">可使用數量 : </label>
        <label class="data-number" :style="GetTxtColor">{{ UserInfo.MaxNumber }}</label>
        <label class="data-desc">已使用數量 : </label>
        <label class="data-number" :style="GetTxtColor">{{ UserInfo.UsedNumber }}</label>
      </div>
      <div class="clear-both"></div>
      <div class="user-area">
        <UserTable :UserInfo="FilterUserInfo" :Type="CurrentTab" @show-del="ShowDelUser" />
      </div>
    </div>
    <Footer />
    <DialogDelUser :Show="dialogDelUser.Show" @close-dialog="CloseDelUser" @del-user="DelUser" />
    <DialogAddUser :Show="dialogAddUser.Show" @close-dialog="CloseAddUser" @add-down="AddDown" />
    <DialogMsg :Show="dialogMsg.Show" :Msg="dialogMsg.Msg" @close-dialog="CloseMsg" />
    <DialogImport :Show="dialogImport.Show" @close-dialog="CloseImportUser" @import-down="ImportDown" />
  </div>
</template>

<script>
import Header from '@/components/SURREALM/Admin/Header.vue';
import Menu from '@/components/SURREALM/Admin/Menu.vue';
import Footer from '@/components/SURREALM/Admin/Footer.vue';
//import UserItem from '@/components/SURREALM/Admin/UserItem.vue';
import UserTable from '@/components/SURREALM/Admin/UserTable.vue';
import DialogDelUser from '@/components/SURREALM/Admin/DialogDelUser.vue';
import DialogAddUser from '@/components/SURREALM/Admin/DialogAddUser.vue';
import DialogMsg from '@/components/SURREALM/Admin/DialogMsg.vue';
import DialogImport from '@/components/SURREALM/Admin/DialogImport.vue';
import { apiGetAdminAccount, apiDelAccount } from '@/request.js';

export default {
  mounted() {
    this.GetTeacherOrStudentInfo();
  },
  data() {
    return {
      SearchKeyWord: '',
      UserInfo: [],
      CurrentTab: 'teacher',
      dialogDelUser: {
        Show: false,
        Serial: -1,
      },
      dialogAddUser: {
        Show: false,
      },
      dialogMsg: {
        Show: false,
        Msg: '',
      },
      dialogImport: {
        Show: false,
      },
    };
  },
  computed: {
    GetTxtColor() {
      return this.CurrentTab == 'teacher' ? { color: '#6058ad' } : { color: '#218da4' };
    },
    FilterUserInfo: function () {
      if (this.SearchKeyWord != '') {
        return this.UserInfo.Users.filter((u) => {
          let Name = u.Name.toLowerCase();
          let Account = u.Account.toLowerCase();
          let Keyword = this.SearchKeyWord.toLowerCase();
          return Name.indexOf(Keyword) != -1 || Account.indexOf(Keyword) != -1;
        });
      } else {
        return this.UserInfo.Users;
      }
    },
  },
  methods: {
    TabStyle(tab) {
      return this.CurrentTab == tab ? `tab-${tab}-select` : `tab-${tab}-unselect`;
    },
    SwitchTab(tab) {
      this.CurrentTab = tab;
      this.GetTeacherOrStudentInfo();
    },
    GetTeacherOrStudentInfo() {
      //TODO API /adminaccount/' + type (get) 多帶MaxOnlineNumber(同時上線人數)
      apiGetAdminAccount(this.FirstWordUpperCase(this.CurrentTab)).then((res) => {
        if (res.data.Status == 'ok') {
          this.UserInfo = res.data.UserInfo;
          this.UserInfo.MaxOnlineNumber = 80;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
      // this.UserInfo = {
      //   MaxOnlineNumber: 15
      //   MaxNumber: 15,
      //   UsedNumber: 6,
      //   Users: [
      //     { Serial: 1, Name: 'AAA', Account: 'aaa@teacher.com.tw', School: '任職單位1' },
      //     { Serial: 2, Name: 'BBB', Account: 'bbb@teacher.com.tw', School: '任職單位1' },
      //     { Serial: 3, Name: 'CCC', Account: 'CCC@teacher.com.tw', School: '任職單位1' },
      //     { Serial: 4, Name: 'DDD', Account: 'ddd@teacher.com.tw', School: '任職單位1' },
      //     { Serial: 5, Name: 'EEE', Account: 'eee@teacher.com.tw', School: '任職單位1' },
      //     { Serial: 6, Name: 'FFF', Account: 'fff@teacher.com.tw', School: '任職單位1' },
      //   ],
      // };
    },
    CloseImportUser() {
      this.dialogImport.Show = false;
    },
    ShowImportUser() {
      this.dialogImport.Show = true;
    },
    ImportDown() {
      this.GetTeacherOrStudentInfo();
    },
    ShowAddUser() {
      this.dialogAddUser.Show = true;
    },
    CloseAddUser() {
      this.dialogAddUser.Show = false;
    },
    AddDown() {
      this.dialogMsg.Msg =
        '新增教師或學生帳號後，系統會寄發註冊信至該使用者信箱，使用者須完成註冊流程，才能登入個人後台與VR端。請注意！使用者個人後台與本管理者後台為不同系統，您無法直接使用管理者帳號密碼作為教師或學生帳號使用。';
      this.dialogMsg.Show = true;
      this.GetTeacherOrStudentInfo();
    },
    ShowDelUser(Serial) {
      this.dialogDelUser.Show = true;
      this.dialogDelUser.Serial = Serial;
    },
    CloseDelUser() {
      this.dialogDelUser.Show = false;
    },
    DelUser() {
      let IndexOf = this.UserInfo.Users.findIndex((user) => user.Serial == this.dialogDelUser.Serial);
      console.log(`apiDelAccount  Serial:${this.dialogDelUser.Serial}`);
      if (IndexOf >= 0) {
        //TODO API 無法刪除 DELETE "http://192.168.1.98:5600/m/account/4" 
        // {"Error":"Error 1146: Table 'surrealm_edu.m01_accounts' doesn't exist","Status":"failed"} 
        // 應該是沒改到 m01? h01? 可能要檢查看看有沒有其他這種的BUG
        apiDelAccount(Number(this.dialogDelUser.Serial)).then((res) => {
          console.log(`apiDelAccount res: ${JSON.stringify(res.data)}`);
          if (res.data.Status == 'ok') {
            this.UserInfo.Users.splice(IndexOf, 1);
            this.CloseDelUser();
          } else {
            this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
        });
      }
    },
    CloseMsg() {
      this.dialogMsg.Show = false;
    },
    DownloadImportExample() {
      window.open('https://surreal-edu.s3.ap-northeast-1.amazonaws.com/surrealm/files/surrealm_admin_import.xlsx');
    },
  },
  components: {
    Header,
    Menu,
    Footer,
    //UserItem,
    DialogDelUser,
    DialogAddUser,
    DialogMsg,
    DialogImport,
    UserTable,
  },
};
</script>