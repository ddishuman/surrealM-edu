<template>
  <div id="Download">
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/Login" />
    <Menu />
    <div class="pnlPageContent scrollBar">
      <TitleBar
        :iconSrc="require('@/assets/img/SURREALM/Backend/Menu/icon_download.png')"
        :title="$t('SURREALM.Menu.Download')"
      >
      </TitleBar>
      <div class="downloadPage">
        <label class="helmetTitle">
          {{ $t('SURREALM.Download.PlzSelectApk') }}
        </label>
        <select v-model="SelectHelmet.Value" class="helmetSelect" @change="GetApkInfo()">
          <option v-for="Helmet in HelmetList" :key="Helmet.Value" :value="Helmet.Value">
            {{ Helmet.Text }}
          </option>
        </select>
        <br />
        <label class="downloadItemsSp" @click="DownloadFile(SelectHelmet.Apk)">
          {{ $t('SURREALM.Download.Apk', { version: SelectHelmet.Version, date: SelectHelmet.ReleaseDate }) }}
        </label>
        <br />
        <label class="downloadItems" @click="DownloadFile(SelectHelmet.InstallSop)">
          {{ $t('SURREALM.Download.InstallSop') }}
        </label>
        <br />
        <!-- <label class="downloadItems" @click="DownloadFile(SelectHelmet.TeacherSop)">
          {{ $t('SURREALM.Download.TeacherSop') }}
        </label>
        <br /> -->
        <label class="downloadItems" @click="DownloadFile(SelectHelmet.StudentSop)">
          {{ $t('SURREALM.Download.StudentSop') }}
        </label>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/js/dateFormat.js';
import Header from '@/components/SURREALM/Client/Header.vue';
import Menu from '@/components/SURREALM/Client/Menu.vue';
import TitleBar from '@/components/SURREALM/Backend/TitleBar.vue';
import { apiGetHelmetFileUrl } from '@/request.js';

export default {
  data() {
    return {
      HelmetList: [
        { Text: 'Oculus Quest 1/2', Value: 'Quest' },
        { Text: 'VIVE Focus Plus', Value: 'FocusPlus' },
        { Text: 'VIVE Focus 3', Value: 'Focus3' },
      ],
      SelectHelmet: {
        Value: 'Quest',
        Version: '',
        ReleaseDate: '',
        Apk: '',
        InstallSop: '',
        TeacherSop: '',
        StudentSop: '',
      },
    };
  },
  mounted() {
    this.GetApkInfo();
  },
  computed: {},
  methods: {
    GetApkInfo() {
      apiGetHelmetFileUrl(this.SelectHelmet.Value).then((res) => {
        if (res.data.Status == 'ok') {
          this.SelectHelmet.Version = res.data.Version;
          this.SelectHelmet.ReleaseDate = res.data.ReleaseDate;
          this.SelectHelmet.Apk = res.data.Apk;
          this.SelectHelmet.InstallSop = res.data.InstallSop;
          this.SelectHelmet.TeacherSop = res.data.TeacherSop;
          this.SelectHelmet.StudentSop = res.data.StudentSop;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    DownloadFile(url) {
      window.open(url);
    },
  },
  components: {
    Header,
    Menu,
    TitleBar,
  },
};
</script>