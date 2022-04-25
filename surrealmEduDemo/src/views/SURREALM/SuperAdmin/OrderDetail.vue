<template>
  <div id="OrderDetail">
    <Menu />
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/SuperAdmin/Login" />
    <div class="order-detail-page" v-if="Info != null">
      <div class="title-bar">
        <img src="@/assets/img/SURREALM/SuperAdmin/icon_back.png" class="title-img" @click="BackOrderList()" />
        <h1 class="title-txt" @click="BackOrderList()">
          {{ `訂單編號 ${Info.PurchaseInfo.OrderId}` }}
        </h1>
      </div>
      <button :class="TabStyle('OrderInfo')" @click="SwitchTab('OrderInfo')">訂單資訊</button>
      <button :class="TabStyle('Teacher')" @click="SwitchTab('Teacher')">教師帳號</button>
      <button :class="TabStyle('Student')" @click="SwitchTab('Student')">學生帳號</button>
      <div class="clear-both"></div>
      <div class="detail-area">
        <template v-if="Tab == 'OrderInfo'">
          <div class="content-area">
            <div class="detail-title">購買信箱</div>
            <div class="detail-content">{{ Info.PurchaseInfo.Email }}</div>
            <div class="detail-title">單位名稱</div>
            <div class="detail-content">{{ Info.PurchaseInfo.Company }}</div>
            <!-- <div class="detail-title">統一編號</div>
            <div class="detail-content">{{ Info.PurchaseInfo.TaxId }}</div> -->
            <div class="detail-title">聯絡人姓名</div>
            <div class="detail-content">{{ Info.PurchaseInfo.Name }}</div>
            <div class="detail-title">聯絡人電話</div>
            <div class="detail-content">{{ Info.PurchaseInfo.Phone }}</div>
          </div>
          <div class="content-area">
            <div class="detail-title" style="height: 63px">Admin帳號</div>
            <div class="detail-content" style="min-height: 63px">{{ Info.AdminInfo.Account == '' ? '未開通' : Info.AdminInfo.Account }}</div>
            <div class="detail-title">可用帳號數</div>
            <div class="detail-content">
              <div class="detail-subtitle">教師</div>
              <input class="account-no" type="text" v-model.trim="Info.AdminInfo.TeacherNo" placeholder="數字" />
              <div class="clear-both"></div>
              <div class="detail-subtitle">學生</div>
              <input class="account-no" type="text" v-model.trim="Info.AdminInfo.StudentNo" placeholder="數字" />
            </div>
            <div class="detail-title" style="height: 63px">同時上線數</div>
            <div class="detail-content" style="min-height: 63px">
              <input class="account-no" type="text" v-model.trim="Info.AdminInfo.MaxOnlineNo" placeholder="數字" />
              <div class="clear-both"></div>
            </div>
            <div class="detail-title" style="height: 62px">使用期限</div>
            <div class="detail-content" style="min-height: 62px">
              <Datepicker
                v-model="Info.AdminInfo.ExpireDate"
                format="YYYY-MM-DD"
                value-type="format"
                placeholder="Select date"
                class="select-date"
              ></Datepicker>
            </div>
            <div class="detail-title" style="height: 188px">使用權限</div>
            <div class="detail-content">
              <div class="detail-subtitle">教室類型</div>
              <Multiselect
                :List="Info.AdminInfo.LectureType"
                :Hint="'請勾選可用類型'"
                :Value="'Type'"
                :Text="'Text'"
                :Multi="true"
              ></Multiselect>
              <div class="clear-both"></div>
              <div class="detail-subtitle">課程權限</div>
              <Multiselect
                :List="Info.AdminInfo.LectureAuth"
                :Hint="'請勾選可用權限'"
                :Value="'Type'"
                :Text="'Text'"
                :Multi="false"
              ></Multiselect>
              <div class="clear-both"></div>
              <div class="detail-subtitle">直播功能</div>
              <div :class="CheckBoxClass(Info.AdminInfo.Stream)" :Text="'Text'" @click="CheckBoxClick('Stream')"></div>
              <div class="clear-both"></div>
              <div class="detail-subtitle">自由空間</div>
              <div :class="CheckBoxClass(Info.AdminInfo.PublicArea)" @click="CheckBoxClick('PublicArea')"></div>
              <div class="clear-both"></div>
            </div>
          </div>
          <div class="content-area">
            <div class="detail-title">備註</div>
            <textarea v-model.trim="Info.Desc" class="detail-desc"></textarea>
          </div>
          <div class="clear-both"></div>
          <div class="btn-tool">
            <button class="btn-left" @click="EditOrderCancel()">取消</button>
            <button class="btn-right" @click="EditOrder()">儲存修改</button>
          </div>
        </template>
        <template v-else-if="Tab == 'Teacher' && TacherInfo != null">
          <div class="data-area">
            <label class="data-desc">可使用數量 : </label>
            <label class="data-number" :style="GetTxtColor">{{ TacherInfo.MaxNumber }}</label>
            <label class="data-desc">已使用數量 : </label>
            <label class="data-number" :style="GetTxtColor">{{ TacherInfo.UsedNumber }}</label>
          </div>
          <div class="clear-both"></div>
          <div class="user-area">
            <UserItem v-for="i in TacherInfo.Users" :Type="Tab.toLowerCase()" :UserInfo="i" :key="i.Serial" />
          </div>
        </template>
        <template v-else>
          <div class="data-area" v-if="StudentInfo != null">
            <label class="data-desc">可使用數量 : </label>
            <label class="data-number" :style="GetTxtColor">{{ StudentInfo.MaxNumber }}</label>
            <label class="data-desc">已使用數量 : </label>
            <label class="data-number" :style="GetTxtColor">{{ StudentInfo.UsedNumber }}</label>
          </div>
          <div class="clear-both"></div>
          <div class="user-area" v-if="StudentInfo != null">
            <UserItem v-for="i in StudentInfo.Users" :Type="Tab.toLowerCase()" :UserInfo="i" :key="i.Serial" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/SURREALM/SuperAdmin/Header.vue';
import Menu from '@/components/SURREALM/SuperAdmin/Menu.vue';
import Datepicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import Multiselect from '@/components/SURREALM/SuperAdmin/Multiselect/Multiselect.vue';
import UserItem from '@/components/SURREALM/SuperAdmin/UserItem.vue';
import { apiGetAdmindetail, apiGetAdminAccountdetail, apiPatchAdminDetail } from '@/request.js';

export default {
  mounted() {
    this.Serial = this.GetParameterByName('s');
    if (this.Serial == null) {
      this.$router.push({ path: '/SURREALM/SuperAdmin/Order' });
    } else {
      this.GetAdminInfo(this.Serial);
    }
  },
  data() {
    return {
      Serial: '',
      Info: null,
      Tab: 'OrderInfo',
      TacherInfo: null,
      StudentInfo: null,
    };
  },
  computed: {
    GetTxtColor() {
      return this.Tab == 'Teacher' ? { color: '#6058ad' } : { color: '#218da4' };
    },
  },
  methods: {
    TabStyle(TabName) {
      return this.Tab == TabName ? 'detail-tab-select' : 'detail-tab-unselect';
    },
    SwitchTab(TabName) {
      this.Tab = TabName;

      if (TabName == 'OrderInfo') {
        this.GetAdminInfo();
      } else if (TabName == 'Teacher') {
        this.GetTeacherInfo();
      } else {
        this.GetStudentInfo();
      }
    },
    GetAdminInfo() {
      //TODO API /admindetail/serial (get) 要多回一個 同時上線數Info.AdminInfo.MaxOnlineNo 90
      //同時請刪掉 Info.PurchaseInfo.TaxId 教育版沒有統編 (db請一併刪除)
      apiGetAdmindetail(this.Serial).then((res) => {
        if (res.data.Status == 'ok') {
          this.Info = res.data.Info;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
      // this.Info = {
      //   Serial: '1',
      //   PurchaseInfo: {
      //     Email: 'saasdasdm@gmail.com',
      //     Company: '超現實',
      //     TaxId: '354131565', //教育版刪掉
      //     Name: 'AAAA',
      //     Phone: '0987878787',
      //     OrderId: '40453243737',
      //   },
      //   AdminInfo: {
      //     Account: '',
      //     TeacherNo: '2',
      //     StudentNo: '29',
      //     MaxOnlineNo: '995',
      //     ExpireDate: '2022-04-22',
      //     LectureType: [
      //       {
      //         Type: '100',
      //         Text: '一般教室',
      //         Selected: true,
      //       },
      //       {
      //         Type: '200',
      //         Text: '專科教室－教具酷',
      //         Selected: false,
      //       },
      //       {
      //         Type: '1001',
      //         Text: '專科教室－透視人體',
      //         Selected: false,
      //       },
      //       {
      //         Type: '1002',
      //         Text: '專科教室－認識台灣趣',
      //         Selected: false,
      //       },
      //       {
      //         Type: '2001',
      //         Text: '超商',
      //         Selected: true,
      //       },
      //     ],
      //     LectureAuth: [
      //       {
      //         Type: '1',
      //         Text: '非公開',
      //         Selected: true,
      //       },
      //       {
      //         Type: '2',
      //         Text: '上鎖課程',
      //         Selected: false,
      //       },
      //     ],
      //     Stream: 'T',
      //     PublicArea: 'T',
      //   },
      //   Desc: 'asdasdasdasd',
      // };
    },
    BackOrderList() {
      this.$router.push({ path: '/SURREALM/SuperAdmin/Order' });
    },
    CheckBoxClass(Value) {
      return Value == 'T' ? 'auth-checkbox-select' : 'auth-checkbox-unselect';
    },
    CheckBoxClick(varName) {
      this.Info.AdminInfo[varName] = this.Info.AdminInfo[varName] == 'T' ? 'F' : 'T';
    },
    EditOrderCancel() {
      this.$router.go(); //refresh page
    },
    CheckEdit() {
      let ErrMsg = '';
      let TypeNum = this.Info.AdminInfo.LectureType.filter((x) => x.Selected == true).length;
      let AuthNum = this.Info.AdminInfo.LectureAuth.filter((x) => x.Selected == true).length;

      if (this.Info.AdminInfo.TeacherNo == '') {
        ErrMsg = '請填寫老師帳號數';
      } else if (!this.TestNumber(this.Info.AdminInfo.TeacherNo)) {
        ErrMsg = '教師帳號數請輸入數字';
      } else if (this.Info.AdminInfo.StudentNo == '') {
        ErrMsg = '請填寫學生帳號數';
      } else if (!this.TestNumber(this.Info.AdminInfo.StudentNo)) {
        ErrMsg = '學生帳號數請輸入數字';
      } else if (this.Info.AdminInfo.MaxOnlineNo == '') {
        ErrMsg = '請填寫同時上線數';
      } else if (!this.TestNumber(this.Info.AdminInfo.MaxOnlineNo)) {
        ErrMsg = '同時上線數請輸入數字';
      }
      else if (this.Info.AdminInfo.ExpireDate == '' || this.Info.AdminInfo.ExpireDate == null) {
        ErrMsg = '請選擇使用期限';
      } else if (TypeNum == 0) {
        ErrMsg = '請選擇教室類型';
      } else if (AuthNum == 0) {
        ErrMsg = '請選擇課程權限';
      }
      return ErrMsg;
    },
    EditOrder() {
      let CheckMsg = this.CheckEdit();
      if (CheckMsg != '') {
        this.$toasted.show(CheckMsg, {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else {
        //TODO API /admindetail (patch) 91
        //  TeacherNo 改成string ex: '2',
        //  StudentNo 改成string ex: '29',
        //  新增一個 MaxOnlineNo ex: '995',
        apiPatchAdminDetail(this.Info).then((res) => {
          if (res.data.Status == 'ok') {
            this.$toasted.show('修改完成', {
              icon: 'checking',
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
      }
    },
    GetTeacherInfo() {
      apiGetAdminAccountdetail(this.Serial, 'Teacher').then((res) => {
        if (res.data.Status == 'ok') {
          this.TacherInfo = res.data.UserInfo;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
      // this.TacherInfo = {
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
    GetStudentInfo() {
      this.Serial;
      apiGetAdminAccountdetail(this.Serial, 'Student').then((res) => {
        if (res.data.Status == 'ok') {
          this.StudentInfo = res.data.UserInfo;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
      // this.StudentInfo = {
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
  },
  components: {
    Header,
    Menu,
    Datepicker,
    Multiselect,
    UserItem,
  },
};
</script>
