<template>
  <div id="Guide">
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/Login" />
    <div class="guideArea">
      <div class="step1Area" v-show="currentStep == 1">
        <div class="welcomeTitle" v-html="$t('SURREALM.Guide.WelcomeTitle')"></div>
        <button class="btnNextStep" @click="GotoStep2">{{ $t('SURREALM.Guide.NextStep') }}</button>
      </div>
      <div class="step2Area" v-show="currentStep == 2">
        <div class="keyinTitle">
          {{ $t('SURREALM.Guide.KeyinTitle') }}<label class="miniTitle">{{ $t('SURREALM.Guide.KeyinHint') }}</label>
        </div>
        <div class="keyinArea">
          <div class="title">{{ $t('SURREALM.Guide.Name') }}</div>
          <input
            type="text"
            class="content"
            v-model.trim="info.Name"
            :placeholder="$t('SURREALM.Guide.Placeholder.Name')"
            disabled="true"
          />
          <!-- <label class="NameHint">{{ $t('SURREALM.Guide.StudentNameHint') }}</label> -->
          <div class="title">{{ $t('SURREALM.Guide.Nickname') }}</div>
          <input
            type="text"
            class="content"
            v-model.trim="info.Nickname"
            :placeholder="$t('SURREALM.Guide.Placeholder.Nickname')"
            disabled="true"
          />
          <div class="title">{{ $t('SURREALM.Guide.Gender') }}</div>
          <select v-model="info.Sex" class="content">
            <option v-for="option in sexOptions" :key="option.text" :value="option.value">
              {{ option.text }}
            </option>
          </select>

          <!-- <div class="title">{{ $t('SURREALM.Guide.Birth') }}</div>
          <Datepicker
            v-model="info.Birthday"
            :disabled-date="DisableAfterToday"
            format="YYYY-MM-DD"
            value-type="format"
            placeholder="Select date"
            class="date"
          ></Datepicker> -->

          <div style="clear: both"></div>
          <div class="toolArea">
            <button class="btnChangeStep" @click="GotoStep1">{{ $t('SURREALM.Guide.PreStep') }}</button>
            <button class="btnChangeStep" @click="GotoStep3">{{ $t('SURREALM.Guide.NextStep') }}</button>
          </div>
        </div>
      </div>
      <div class="step3Area" v-show="currentStep == 3">
        <div class="keyinTitle">
          {{ $t('SURREALM.Guide.KeyinTitle') }}<label class="miniTitle">{{ $t('SURREALM.Guide.KeyinHint') }}</label>
        </div>
        <div class="keyinArea">
          <div class="title">{{ $t('SURREALM.ClientGuide.School') }}</div>
          <input
            type="text"
            class="content"
            v-model.trim="info.School"
            :placeholder="$t('SURREALM.Guide.Placeholder.School')"
          />
          <div class="title">{{ $t('SURREALM.ClientGuide.Subject') }}</div>
          <input
            type="text"
            class="content"
            v-model.trim="info.Subject"
            :placeholder="$t('SURREALM.Guide.Placeholder.Subject')"
          />
          <div class="title">{{ $t('SURREALM.Guide.Phone') }}</div>
          <input
            type="text"
            class="content"
            v-model.trim="info.Phone"
            :placeholder="$t('SURREALM.Guide.Placeholder.Phone')"
          />
          <div style="clear: both"></div>
          <div class="toolArea">
            <button class="btnChangeStep" @click="GotoStep2">{{ $t('SURREALM.Guide.PreStep') }}</button>
            <button class="btnChangeStep" @click="GotoStep4">{{ $t('SURREALM.Guide.NextStep') }}</button>
          </div>
        </div>
      </div>
      <div class="step4Area" v-show="currentStep == 4">
        <div class="finishTitle">{{ $t('SURREALM.Guide.finishTitle') }}</div>
        <div class="finishContent">{{ $t('SURREALM.Guide.finishContent') }}</div>
        <button class="btnStartUse" @click="FinishGuide">{{ $t('SURREALM.Guide.startUse') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
// import Datepicker from 'vue2-datepicker';
// import 'vue2-datepicker/index.css';
import Header from '@/components/SURREALM/Client/Header.vue';
import { apiUpdateAccountInfo } from '@/request.js';

export default {
  mounted() {
    this.info = {
      Name: localStorage.getItem('Name'),
      Sex: localStorage.getItem('Sex'),
      Birthday: localStorage.getItem('Birthday'),
      Nickname: localStorage.getItem('Nickname'),
      School: localStorage.getItem('School'),
      Subject: localStorage.getItem('Subject'),
      Phone: localStorage.getItem('Phone'),
    };
  },
  data() {
    return {
      currentStep: 1,
      info: {
        Name: '',
        Sex: '',
        //Birthday: '2000-01-01',
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
    };
  },
  computed: {},
  methods: {
    GotoStep1() {
      this.currentStep = 1;
    },
    GotoStep2() {
      this.currentStep = 2;
    },
    GotoStep3() {
      let errMsg = this.CheckStep2Info();
      if (errMsg == '') {
        this.currentStep = 3;
      } else {
        this.$toasted.show(errMsg, {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      }
    },
    GotoStep4() {
      let errMsg = this.CheckStep3Info();
      if (errMsg == '') {
        apiUpdateAccountInfo(this.info).then((res) => {
          if (res.data.Status == 'ok') {
            //localStorage.setItem('Birthday', this.info.Birthday);
            localStorage.setItem('Name', this.info.Name);
            localStorage.setItem('Nickname', this.info.Nickname);
            localStorage.setItem('Phone', this.info.Phone);
            localStorage.setItem('School', this.info.School);
            localStorage.setItem('Sex', this.info.Sex);
            localStorage.setItem('Subject', this.info.Subject);
            this.$store.dispatch('SetNameAccount', { Name: this.info.Name, Account: localStorage.getItem('Account') });
            this.currentStep = 4;
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
    FinishGuide() {
      this.$router.push({ path: '/SURREALM/Client/AccountInfo' });
    },
    DisableAfterToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    },
    CheckStep2Info() {
      let errMsg = '';
      if (this.info.Name == '') {
        errMsg = this.$t('SURREALM.Guide.Err.NameEmpty');
      } else if (this.info.Sex == '') {
        errMsg = this.$t('SURREALM.Guide.Err.SexEmpty');
        // } else if (this.info.Birthday == null) {
        //   errMsg = this.$t('SURREALM.Guide.Err.BirthdayEmpty');
      } else if (this.info.Nickname == '') {
        errMsg = this.$t('SURREALM.Guide.Err.NicknameEmpty');
      }
      return errMsg;
    },
    CheckStep3Info() {
      let errMsg = '';
      if (this.info.School == '') {
        errMsg = this.$t('SURREALM.Guide.Err.SchoolEmpty');
        // } else if (this.info.Subject == '') {
        //   errMsg = this.$t('SURREALM.Guide.Err.SubjectEmpty');
      }
      return errMsg;
    },
  },
  components: {
    Header,
    //Datepicker,
  },
};
</script>