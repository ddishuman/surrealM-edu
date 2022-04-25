<template>
  <div class="dialog-full" v-show="Show">
    <div class="dialog-gray">
      <div class="dialog-add-order">
        <div class="title-area">
          新增訂單
          <button class="title-close" @click="CloseDialog()"></button>
        </div>
        <div class="content-area">
          <div class="content-title">購買日期*</div>
          <div class="content-desc">
            <Datepicker
              v-model="Info.PurchaseDate"
              format="YYYY-MM-DD"
              value-type="format"
              placeholder="Select date"
              class="select-date"
            ></Datepicker>
          </div>
          <div class="content-title">購買信箱*</div>
          <div class="content-desc">
            <input class="input-edit" type="text" v-model.trim="Info.PurchaseEmail" placeholder="請輸入信箱" />
          </div>
          <div class="content-title">訂單編號</div>
          <div class="content-desc">
            <input class="input-edit" type="text" v-model.trim="Info.OrderId" placeholder="如為業務人工接洽, 可免填" />
          </div>
          <div class="content-title">可用帳號數*</div>
          <div class="content-desc">
            <div class="account-type">教師</div>
            <input class="account-no" type="text" v-model.trim="Info.TeacherNo" placeholder="數字" />
            <div class="account-type" style="margin-left: 34px">學生</div>
            <input class="account-no" type="text" v-model.trim="Info.StudentNo" placeholder="數字" />
          </div>
          <div class="content-title">同時上線數</div>
          <div class="content-desc">
            <input class="input-edit" type="text" v-model.trim="Info.MaxOnlineNo" placeholder="數字" />
          </div>
          <div class="content-title">使用期限*</div>
          <div class="content-desc">
            <Datepicker
              v-model="Info.ExpireDate"
              :disabled-date="DisableBeforeToday"
              format="YYYY-MM-DD"
              value-type="format"
              placeholder="Select date"
              class="select-date"
            ></Datepicker>
          </div>
          <div class="content-title">使用權限*</div>
          <div class="content-desc">
            <div class="auth-type">教室類型</div>
            <div class="auth-select">
              <Multiselect
                :List="LectureType"
                :Hint="'請勾選可用類型'"
                :Value="'Type'"
                :Text="'Text'"
                :Multi="true"
              ></Multiselect>
            </div>
            <div class="auth-type">課程權限</div>
            <div class="auth-select">
              <Multiselect
                :List="LectureAuth"
                :Hint="'請勾選可用權限'"
                :Value="'Type'"
                :Text="'Text'"
                :Multi="false"
              ></Multiselect>
            </div>
            <div class="auth-type">直播功能</div>
            <div :class="CheckBoxClass(Info.Stream)" :Text="'Text'" @click="CheckBoxClick('Stream')"></div>
            <div class="auth-type">自由空間</div>
            <div :class="CheckBoxClass(Info.PublicArea)" @click="CheckBoxClick('PublicArea')"></div>
          </div>
          <button class="btn-add-order" @click="ShowConfirmMsg()">送出</button>
          <div class="clear-both"></div>
        </div>
      </div>
    </div>

    <DialogHint
      :Show="dialogHint.Show"
      :Msg="dialogHint.Msg"
      :Button="dialogHint.Button"
      :Righttxt="dialogHint.Righttxt"
      :Lefttxt="dialogHint.Lefttxt"
      @close-dialog="CloseHintDialog()"
      @left-click="CloseHintDialog()"
      @right-click="ShowCheckDialog()"
    />

    <DialogHint
      :Show="dialogCheck.Show"
      :Msg="dialogCheck.Msg"
      :Button="dialogCheck.Button"
      :Righttxt="dialogCheck.Righttxt"
      :Lefttxt="dialogCheck.Lefttxt"
      @close-dialog="CloseCheckDialog()"
      @left-click="CloseCheckDialog()"
      @right-click="AddOrder()"
    />

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
import Multiselect from '@/components/SURREALM/SuperAdmin/Multiselect/Multiselect.vue';
import Datepicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import DialogHint from '@/components/SURREALM/SuperAdmin/DialogHint.vue';
import { apiGetSPAdminLectureType, apiGetSPAdminLectureAuth, apicheckEmail, apiPostAdminAccount } from '@/request.js';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  name: 'DialogAddOrder',
  props: {
    Show: Boolean,
  },
  data() {
    return {
      dialogHint: {
        Show: false,
        Msg: '',
        Button: true,
        Righttxt: '繼續',
        Lefttxt: '取消',
      },
      dialogCheck: {
        Show: false,
        Msg: '',
        Button: true,
        Righttxt: '確認送出',
        Lefttxt: '取消',
      },
      loadingInfo: {
        isLoading: false,
        color: '#fff',
        opacity: 0.9,
        bgColor: '#131217',
      },
      Info: {
        PurchaseDate: '',
        PurchaseEmail: '',
        OrderId: '',
        MaxOnlineNo: '',
        TeacherNo: '',
        StudentNo: '',
        ExpireDate: '',
        Stream: '',
        PublicArea: '',
      },
      LectureType: [],
      LectureAuth: [],
    };
  },
  mounted() {
    this.GetLectureType();
    this.GetLectureAuth();
  },
  computed: {},
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    DisableBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
    CheckBoxClass(Value) {
      return Value == 'T' ? 'auth-checkbox-select' : 'auth-checkbox-unselect';
    },
    CheckBoxClick(varName) {
      this.Info[varName] = this.Info[varName] == 'T' ? 'F' : 'T';
    },
    GetLectureType() {
      apiGetSPAdminLectureType().then((res) => {
        console.log('GetLectureType: ' + JSON.stringify(res.data));
        if (res.data.Status == 'ok') {
          this.LectureType = res.data.LectureType;
          this.LectureType.forEach((l) => {
            l.Selected = false;
          });
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
      // this.LectureType = [
      //   {
      //     Type: '100',
      //     Text: '一般教室',
      //   },
      //   {
      //     Type: '200',
      //     Text: '專科教室－教具酷',
      //   },
      //   {
      //     Type: '1001',
      //     Text: '專科教室－透視人體',
      //   },
      //   {
      //     Type: '1002',
      //     Text: '專科教室－認識台灣趣',
      //   },
      //   {
      //     Type: '2001',
      //     Text: '超商',
      //   },
      // ];
    },
    GetLectureAuth() {
      apiGetSPAdminLectureAuth().then((res) => {
        if (res.data.Status == 'ok') {
          this.LectureAuth = res.data.LectureAuth;
          this.LectureAuth.forEach((l) => {
            l.Selected = false;
          });
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
      // this.LectureAuth = [
      //   {
      //     Type: '1',
      //     Textaa: '非公開',
      //   },
      //   {
      //     Type: '2',
      //     Textaa: '777',
      //   },
      // ];
      // this.LectureAuth.forEach((l) => {
      //   l.Selected = false;
      // });
    },
    CheckError() {
      let ErrMsg = '';
      let TypeNum = this.LectureType.filter((x) => x.Selected == true).length;
      let AuthNum = this.LectureAuth.filter((x) => x.Selected == true).length;

      if (this.Info.PurchaseDate == '' || this.Info.PurchaseDate == null) {
        ErrMsg = '請選擇購買日期';
      } else if (this.Info.PurchaseEmail == '') {
        ErrMsg = '請填寫購買信箱';
      } else if (!this.TestEmail(this.Info.PurchaseEmail)) {
        ErrMsg = '購買信箱格式有誤';
      } else if (this.Info.TeacherNo == '') {
        ErrMsg = '請填寫教師帳號數';
      } else if (!this.TestNumber(this.Info.TeacherNo)) {
        ErrMsg = '教師帳號數請輸入數字';
      } else if (this.Info.StudentNo == '') {
        ErrMsg = '請填寫學生帳號數';
      } else if (!this.TestNumber(this.Info.StudentNo)) {
        ErrMsg = '學生帳號數請輸入數字';
      } else if (this.Info.MaxOnlineNo == '') {
        ErrMsg = '請填寫同時上線數';
      } else if (!this.TestNumber(this.Info.MaxOnlineNo)) {
        ErrMsg = '同時上線數請輸入數字';
      } else if (this.Info.ExpireDate == '' || this.Info.ExpireDate == null) {
        ErrMsg = '請選擇使用期限';
      } else if (TypeNum == 0) {
        ErrMsg = '請選擇教室類型';
      } else if (AuthNum == 0) {
        ErrMsg = '請選擇課程權限';
      }
      return ErrMsg;
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
    ShowConfirmMsg() {
      let ErrMsg = this.CheckError();
      if (ErrMsg != '') {
        this.$toasted.show(ErrMsg, {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else {
        let EmailData = {
          Email: this.Info.PurchaseEmail,
          Type: 'purchase_email',
        };
        this.CheckEmail(EmailData)
          .then((success) => {
            if (success != '') {
              this.ShowHintDialog();
            } else {
              this.ShowCheckDialog();
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
    },
    ShowHintDialog() {
      this.dialogHint.Show = true;
      this.dialogHint.Msg =
        '購買信箱已存在，請與用戶確認是否為續租。<br />' +
        '如為續租，請至原有訂單管理頁面直接修改到期日。<br />' +
        '如繼續本流程，將寄發新帳號開通信，引導用戶建立新的Admin帳號。';
    },
    CloseHintDialog() {
      this.dialogHint.Show = false;
    },
    ShowCheckDialog() {
      this.dialogHint.Show = false;
      this.dialogCheck.Show = true;
      this.dialogCheck.Msg = '訂單資訊送出後將立即寄發新帳號開通信至用戶信箱，<br />' + '請再次確認填寫內容是否正確。';
    },
    CloseCheckDialog() {
      this.dialogCheck.Show = false;
    },
    AddOrder() {
      let data = this.DeepCopy(this.Info);
      data.LectureAuth = this.DeepCopy(this.LectureAuth);
      data.LectureType = this.DeepCopy(this.LectureType);
      //console.log('AddOrder: ' + JSON.stringify(data));
      // let data = {
      //   PurchaseDate: '2022-03-31',
      //   PurchaseEmail: 'ian@faya.com.tw',
      //   OrderId: '2131564231',
      //   TeacherNo: '2',
      //   StudentNo: '11',
      //   MaxOnlineNo: '995',
      //   ExpireDate: '2022-03-30',
      //   Stream: 'T',
      //   PublicArea: 'T',
      //   LectureAuth: [
      //     {
      //       Type: '1',
      //       Text: '非公開',
      //       Selected: false,
      //     },
      //     {
      //       Type: '2',
      //       Text: '上鎖課程',
      //       Selected: true,
      //     },
      //   ],
      //   LectureType: [
      //     {
      //       Type: '100',
      //       Text: '一般教室',
      //       Selected: false,
      //     },
      //     {
      //       Type: '200',
      //       Text: '專科教室－教具酷',
      //       Selected: true,
      //     },
      //     {
      //       Type: '1001',
      //       Text: '專科教室－透視人體',
      //       Selected: false,
      //     },
      //     {
      //       Type: '1002',
      //       Text: '專科教室－認識台灣趣',
      //       Selected: true,
      //     },
      //     {
      //       Type: '2001',
      //       Text: '超商',
      //       Selected: false,
      //     },
      //   ],
      // };
      this.loadingInfo.isLoading = true;
      //TODO API /adminaccount (post) data多帶一個 MaxOnlineNo, 69
      //TeacherNo、StudentNo型態從數字改成文字
      apiPostAdminAccount(data).then((res) => {
        this.loadingInfo.isLoading = false;
        if (res.data.Status == 'ok') {
          this.$toasted.show('新增完成', {
            icon: 'checking',
            position: 'bottom-center',
            duration: 3500,
          });
          this.$router.go(); //refresh page
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
  },
  components: {
    Datepicker,
    Multiselect,
    DialogHint,
    Loading,
  },
};
</script>
