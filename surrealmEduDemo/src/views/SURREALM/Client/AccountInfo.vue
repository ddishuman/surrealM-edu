<template>
  <div id="AccountInfo">
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/Login" />
    <Menu />
    <div class="pnlPageContent scrollBar">
      <TitleBar
        :iconSrc="require('@/assets/img/SURREALM/Backend/Menu/icon_account_info.png')"
        :title="$t('SURREALM.AccountInfo.PageName')"
      >
        <button class="btn" @click="StartEdit">
          {{ $t('SURREALM.AccountInfo.EditInfo') }}
        </button>
        <!-- <button class="btn" @click="ShowChangePW">
          {{ $t('SURREALM.AccountInfo.ChangePW') }}
        </button> -->
      </TitleBar>
      <div class="accountInfo">
        <div class="infoItem">
          <div class="title">{{ $t('SURREALM.Guide.Name') }}</div>
          <input
            id="name"
            type="text"
            class="lblContent"
            v-model.trim="info.Name"
            :placeholder="isEditMode ? $t('SURREALM.Guide.Placeholder.Name') : ''"
            :disabled="true"
          />
        </div>
        <div class="infoItem">
          <div class="title">{{ $t('SURREALM.Guide.Gender') }}</div>
          <select id="gender" v-model="info.Sex" :class="KeyinStyle()" :disabled="!isEditMode">
            <option v-for="option in sexOptions" :key="option.text" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
        <!-- <div class="infoItem">
          <div class="title">{{ $t('SURREALM.Guide.Birth') }}</div>
          <Datepicker
            id="birth"
            v-model="info.Birthday"
            :disabled-date="DisableAfterToday"
            format="YYYY-MM-DD"
            value-type="format"
            placeholder="Select"
            :class="KeyinStyle()"
            :disabled="!isEditMode"
          ></Datepicker>
        </div> -->
        <div class="infoItem">
          <div class="title">{{ $t('SURREALM.Guide.Nickname') }}</div>
          <input
            id="nickname"
            type="text"
            class="lblContent"
            v-model.trim="info.Nickname"
            :placeholder="isEditMode ? $t('SURREALM.Guide.Placeholder.Nickname') : ''"
            :disabled="true"
            maxlength="20"
          />
        </div>
        <div class="infoItem">
          <div class="title">{{ $t('SURREALM.ClientGuide.School') }}</div>
          <input
            id="school"
            type="text"
            :class="KeyinStyle()"
            v-model.trim="info.School"
            :placeholder="isEditMode ? $t('SURREALM.Guide.Placeholder.School') : ''"
            :disabled="!isEditMode"
          />
        </div>
        <div class="infoItem">
          <div class="title">{{ $t('SURREALM.ClientGuide.Subject') }}</div>
          <input
            id="subject"
            type="text"
            :class="KeyinStyle()"
            v-model.trim="info.Subject"
            :placeholder="isEditMode ? $t('SURREALM.Guide.Placeholder.Subject') : ''"
            :disabled="!isEditMode"
          />
        </div>
        <div class="infoItem">
          <div class="title">{{ $t('SURREALM.Guide.Phone') }}</div>
          <input
            id="phone"
            type="number"
            :class="KeyinStyle()"
            v-model.trim="info.Phone"
            :placeholder="isEditMode ? $t('SURREALM.Guide.Placeholder.Phone') : ''"
            :disabled="!isEditMode"
          />
        </div>
        <div style="clear: both"></div>
        <div class="toolArea" v-show="isEditMode">
          <button class="btnNoBg" @click="CancelEdit">
            {{ $t('SURREALM.AccountInfo.BtnCancel') }}
          </button>
          <button class="btnNoBg" @click="SaveInfo">
            {{ $t('SURREALM.AccountInfo.BtnSave') }}
          </button>
        </div>
      </div>
    </div>

    <DialogChangePW :show="dialogChangePW.show" @close-dialog="CloseChangePW" />
  </div>
</template>

<script>
import Header from '@/components/SURREALM/Client/Header.vue';
import Menu from '@/components/SURREALM/Client/Menu.vue';
import TitleBar from '@/components/SURREALM/Backend/TitleBar.vue';
import DialogChangePW from '@/components/SURREALM/Backend/DialogChangePW.vue';
// import Datepicker from 'vue2-datepicker';
// import 'vue2-datepicker/index.css';
import { apiUpdateAccountInfo } from '@/request.js';

export default {
  mounted() {
    let Sex = localStorage.getItem('Sex');
    if (Sex == '') {
      this.$router.push({ path: '/SURREALM/Backend/Guide' });
    }
    this.info = {
      Name: localStorage.getItem('Name'),
      Sex: Sex,
      Birthday: localStorage.getItem('Birthday'),
      Nickname: localStorage.getItem('Nickname'),
      School: localStorage.getItem('School'),
      Subject: localStorage.getItem('Subject'),
      Phone: localStorage.getItem('Phone'),
    };
  },
  data() {
    return {
      isEditMode: false,
      info: {
        Name: '',
        Sex: '',
        Birthday: '2000-01-01',
        Nickname: '',
        School: '',
        Subject: '',
        Phone: '',
      },
      sexOptions: [
        { text: this.$t('SURREALM.AccountInfo.Option.Null'), value: '' },
        { text: this.$t('SURREALM.AccountInfo.Option.Male'), value: 'male' },
        { text: this.$t('SURREALM.AccountInfo.Option.Female'), value: 'female' },
        { text: this.$t('SURREALM.AccountInfo.Option.Other'), value: 'other' },
      ],
      dialogChangePW: {
        show: false,
      },
    };
  },
  computed: {},
  methods: {
    StartEdit() {
      this.isEditMode = true;
    },
    CancelEdit() {
      this.isEditMode = false;
      this.$router.go(); //refresh page
    },
    SaveInfo() {
      let errMsg = this.CheckInfo();
      if (errMsg == '') {
        apiUpdateAccountInfo(this.info).then((res) => {
          if (res.data.Status == 'ok') {
            localStorage.setItem('Name', this.info.Name);
            //localStorage.setItem('Birthday', this.info.Birthday);
            localStorage.setItem('Nickname', this.info.Nickname);
            localStorage.setItem('Phone', this.info.Phone);
            localStorage.setItem('School', this.info.School);
            localStorage.setItem('Sex', this.info.Sex);
            localStorage.setItem('Subject', this.info.Subject);
            this.CancelEdit();
          } else {
            this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
        });
      } else {
        this.$toasted.show(errMsg, {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      }
    },
    CheckInfo() {
      let errMsg = '';
      if (this.info.Sex == '') {
        errMsg = this.$t('SURREALM.AccountInfo.Err.SexEmpty');
      } else if (this.info.Nickname == '') {
        errMsg = this.$t('SURREALM.AccountInfo.Err.NicknameEmpty');
      } else if (this.info.School == '') {
        errMsg = this.$t('SURREALM.AccountInfo.Err.SchoolEmpty');
      }
      return errMsg;
    },
    ShowChangePW() {
      this.dialogChangePW.show = true;
    },
    CloseChangePW() {
      this.dialogChangePW.show = false;
    },
    DisableAfterToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    },
    KeyinStyle() {
      return { lblContent: !this.isEditMode, editContent: this.isEditMode };
    },
  },
  components: {
    Header,
    Menu,
    TitleBar,
    DialogChangePW,
    //Datepicker,
  },
};
</script>