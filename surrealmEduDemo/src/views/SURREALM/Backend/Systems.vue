<template>
  <div id="PageStudentManager">
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/Login" />
    <Menu />
    <div class="pnlPageContent scrollBar">
      <TitleBar :iconSrc="require('@/assets/img/SURREALM/Backend/Menu/icon_system.png')" :title="TitleBarTitle">
        <button ref="btnAddLecture" class="btn" @click="SwitchCurrentType('System')">
          {{ $t('SURREALM.Systems.PageName') }}
        </button>
        <button ref="btnAddLecture" class="btn" @click="SwitchCurrentType('Lecture')">
          {{ $t('SURREALM.Systems.LectureLog') }}
        </button>
      </TitleBar>
      <div class="systemsPage">
        <div class="searchTitle">{{ $t('SURREALM.LectureHistory.StartDate') }}</div>
        <Datepicker
          v-model="Search.StartDate"
          :disabled-date="DisableAfterToday"
          format="YYYY-MM-DD"
          value-type="format"
          placeholder="Select date"
          class="searchDate"
        ></Datepicker>
        <div class="searchTitle">{{ $t('SURREALM.LectureHistory.EndDate') }}</div>
        <Datepicker
          v-model="Search.EndDate"
          :disabled-date="DisableAfterToday"
          format="YYYY-MM-DD"
          value-type="format"
          placeholder="Select date"
          class="searchDate"
        ></Datepicker>
        <div style="clear: both"></div>
        <div class="logArea">
          <div class="logMsg">
            {{ CurrentType == 'System' ? $t('SURREALM.Systems.LogContent') : $t('SURREALM.Systems.LectureContent') }}
          </div>
          <div class="logDateTime">{{ $t('SURREALM.Systems.LogDateTime') }}</div>
          <div class="scrollArea">
            <div :class="GetSelectStyle(item.Selected)" v-for="(item, index) in FilterLogs" :key="item.LectureSerial">
              <div class="logMark" @click.self="SwitchSelectStatus(item, index)">
                {{ item.Read ? '' : $t('SURREALM.Post.NeverRead') }}
              </div>
              <div class="logMsg" @click.self="SwitchSelectStatus(item, index)">{{ item.LectureName }}</div>
              <div class="logDateTime" @click.self="SwitchSelectStatus(item, index)">{{ item.DateTime }}</div>
              <div class="subItem" v-for="logs in item.Logs" :key="logs.Serial" @click="ShowMsgDetail(logs)">
                <div class="logMark"></div>
                <div class="logMsg" :class="DetailClickable">{{ MsgKeyToValue(logs.Msg) }}</div>
                <div class="logDateTime">{{ logs.DateTime }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DialogPost
      :show="dialogPost.show"
      :serial="dialogPost.serial"
      :edit="dialogPost.edit"
      :msg="dialogPost.msg"
      @close-dialog="CloseDialogPost"
    />
  </div>
</template>

<script>
import '@/assets/js/dateFormat.js';
import Header from '@/components/SURREALM/Backend/Header.vue';
import Menu from '@/components/SURREALM/Backend/Menu.vue';
import TitleBar from '@/components/SURREALM/Backend/TitleBar.vue';
import DialogPost from '@/components/SURREALM/Backend/DialogPost.vue';
import Datepicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import { apiGetPost, apiUpdatePostRead } from '@/request.js';

export default {
  data() {
    return {
      Search: {
        StartDate: null,
        EndDate: null,
      },
      Log: null,
      CurrentType: 'System',
      dialogPost: {
        show: false,
        serial: null,
        edit: false,
        msg: '',
      },
    };
  },
  mounted() {
    //日期預設
    var dtEnd = new Date(Date.now());
    dtEnd.setHours(0, 0, 0);
    var dtStart = new Date(dtEnd);
    dtStart.setDate(dtEnd.getDate() - parseInt(30));
    this.Search.StartDate = dtStart.format('yyyy-MM-dd').toString();
    this.Search.EndDate = dtEnd.format('yyyy-MM-dd').toString();
    this.GetLogs();
  },
  computed: {
    TitleBarTitle() {
      return this.CurrentType == 'System'
        ? this.$t('SURREALM.Systems.PageName')
        : this.$t('SURREALM.Systems.LectureLog');
    },
    DetailClickable() {
      return this.CurrentType == 'System' ? '' : 'clickable';
    },
    FilterLogs() {
      return this.Log == null
        ? null
        : this.Log.filter((obj) => {
            let LogDate = new Date(obj.DateTime);
            let StartDate = new Date(this.Search.StartDate);
            let EndDate = new Date(this.Search.EndDate);
            EndDate.setDate(EndDate.getDate() + 1);
            let Tomorrow = new Date();
            Tomorrow.setDate(Tomorrow.getDate() + 1);
            if (this.Search.StartDate == null && this.Search.EndDate == null) {
              return LogDate.getTime() <= Tomorrow.getTime();
            } else if (this.Search.StartDate == null) {
              return LogDate.getTime() <= EndDate.getTime();
            } else if (this.Search.EndDate == null) {
              return StartDate.getTime() <= LogDate.getTime();
            } else {
              return StartDate.getTime() <= LogDate.getTime() && LogDate.getTime() <= EndDate.getTime();
            }
          });
    },
  },
  methods: {
    GetLogs() {
      apiGetPost(this.CurrentType).then((res) => {
        if (res.data.Status == 'ok') {
          this.Log = res.data.Log;
          this.Log.forEach((l) => {
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

      // this.Log = [
      //   {
      //     Serial: 5,
      //     LectureSerial: 1,
      //     LectureName: '課程1',
      //     DateTime: '2021-06-01 00:05',
      //     Read: true,
      //     Selected: false,
      //     Logs: [
      //       {
      //         Serial: 7,
      //         Msg: '順便記得寫作業',
      //         DateTime: '2021-06-01 00:05',
      //       },
      //       {
      //         Serial: 6,
      //         Msg: '請記得預習第一課',
      //         DateTime: '2021-05-31 23:57',
      //       },
      //     ],
      //   },
      // ];
    },
    DisableAfterToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    },
    SwitchCurrentType(Type) {
      //先init
      this.Log = null;
      this.CurrentType = Type;
      this.GetLogs();
    },
    GetSelectStyle(Selected) {
      return Selected == true ? 'selectItem' : 'unselectItem';
    },
    SwitchSelectStatus(Item, Index) {
      let tempLog = this.DeepCopy(Item);
      if (Item.Read == false) {
        apiUpdatePostRead(Item.Serial, {}).then((res) => {
          if (res.data.Status == 'ok') {
            tempLog.Read = true;
          } else {
            this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
          tempLog.Selected = !tempLog.Selected;
          this.Log.splice(Index, 1, tempLog);
        });
      } else {
        tempLog.Selected = !tempLog.Selected;
        this.Log.splice(Index, 1, tempLog);
      }
    },
    MsgKeyToValue(Key) {
      return this.CurrentType == 'System' ? this.$t('SURREALM.Systems.Teacher.' + Key) : Key;
    },

    ShowMsgDetail(log) {
      if (this.CurrentType != 'System') {
        this.dialogPost.serial = log.Serial;
        this.dialogPost.msg = log.Msg;
        this.dialogPost.show = true;
      }
    },

    CloseDialogPost() {
      this.dialogPost.show = false;
    },
  },
  components: {
    Header,
    Menu,
    TitleBar,
    DialogPost,
    Datepicker,
  },
};
</script>