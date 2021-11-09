<template>
  <div id="PageStudentManager">
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/Login" />
    <Menu />
    <div class="pnlPageContent scrollBar">
      <TitleBar
        :iconSrc="require('@/assets/img/SURREALM/Backend/Menu/icon_files.png')"
        :title="$t('SURREALM.Files.PageName')"
      >
        <button class="btnInformation" @click="ShowQA()"></button>
      </TitleBar>
      <div class="filesPage">
        <div class="uploadArea">
          <label class="stepHint">{{ $t('SURREALM.LectureOwn.UpLinkStep1') }}</label>
          <label class="stepLine"></label>
          <label class="stepHint">{{ $t('SURREALM.LectureOwn.UpLinkStep2') }}</label>
          <label class="stepLine"></label>
          <label class="stepHint">{{ $t('SURREALM.LectureOwn.UpLinkStep3') }}</label>
          <input
            class="editLink"
            type="text"
            v-model.trim="Link.Upload.Url"
            :placeholder="$t('SURREALM.LectureOwn.Placeholder.Link')"
          />
          <input
            class="editName"
            type="text"
            v-model.trim="Link.Upload.Name"
            :placeholder="$t('SURREALM.LectureOwn.Placeholder.LinkName')"
          />
          <button class="btn btnUpload" @click="UploadLink">{{ $t('SURREALM.LectureOwn.Upload') }}</button>
        </div>
        <div class="fileArea">
          <div class="titleName">{{ $t('SURREALM.LectureOwn.UpLinkTitleName') }}</div>
          <div class="titleDate">{{ $t('SURREALM.LectureOwn.UpLinkTitleDate') }}</div>
          <div class="titleDel">{{ $t('SURREALM.LectureOwn.UpLinkTitleDel') }}</div>
          <div class="scrollArea">
            <div v-for="(LinkItem, index) in Link.Links" :key="LinkItem.Serial">
              <a class="titleName" :href="LinkItem.Url" target="blank">{{ LinkItem.Name }}</a>
              <div class="titleDate">{{ LinkItem.Date }}</div>
              <button class="titleDel" @click="ShowDelLinkDialog(LinkItem, index)"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DialogMsg
      :show="dialogDelLink.show"
      :title="dialogDelLink.title"
      :msg="dialogDelLink.msg"
      :isLeftBtnShow="dialogDelLink.isLeftBtnShow"
      :txtLeftBtn="dialogDelLink.txtLeftBtn"
      :txtRightBtn="dialogDelLink.txtRightBtn"
      @close-dialog="CloseDelLinkDialog"
      @click-left="CloseDelLinkDialog"
      @click-right="DelLink"
    ></DialogMsg>
    <DialogQA
      :show="dialogHint.isShow"
      :msgs="dialogHint.msg"
      :btnTxt="dialogHint.btnTxt"
      :imgSrc="dialogHint.imgSrc"
      @close-dialog="CloseQA"
      @btn-click="CloseQA"
    />
  </div>
</template>

<script>
import '@/assets/js/dateFormat.js';
import Header from '@/components/SURREALM/Client/Header.vue';
import Menu from '@/components/SURREALM/Client/Menu.vue';
import TitleBar from '@/components/SURREALM/Backend/TitleBar.vue';
import DialogMsg from '@/components/SURREALM/Backend/DialogMsg.vue';
import DialogQA from '@/components/SURREALM/Backend/DialogQA.vue';
import { apiAddLink, apiGetLink, apiDelLink } from '@/request.js';

export default {
  data() {
    return {
      Link: {
        Upload: {
          Url: '',
          Name: '',
        },
        Links: [],
      },

      dialogDelLink: {
        show: false,
        title: '',
        msg: '',
        isLeftBtnShow: true,
        txtLeftBtn: '',
        txtRightBtn: '',
      },
      dialogHint: {
        isShow: false,
        msg: [],
        btnTxt: '',
        imgSrc: '',
      },
      DelLinkInfo: {
        Serial: null,
        Index: null,
      },
    };
  },
  mounted() {
    this.GetLinks();
  },
  computed: {},
  methods: {
    GetLinks() {
      apiGetLink().then((res) => {
        if (res.data.Status == 'ok') {
          this.Link.Links = res.data.Links;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    CheckUploadLink() {
      let errMsg = '';
      if (this.Link.Upload.Url == '') {
        errMsg = this.$t('SURREALM.LectureOwn.Placeholder.Link');
      } else if (this.Link.Upload.Name == '') {
        errMsg = this.$t('SURREALM.LectureOwn.Placeholder.LinkName');
      }
      return errMsg;
    },
    UploadLink() {
      let ErrMsg = this.CheckUploadLink();
      if (ErrMsg == '') {
        let data = {
          Url: this.Link.Upload.Url,
          Name: this.Link.Upload.Name,
        };
        apiAddLink(data).then((res) => {
          if (res.data.Status == 'ok') {
            data.Serial = res.data.Serial;
            var dtNow = new Date(Date.now());
            data.Date = dtNow.format('yyyy-MM-dd').toString();
            this.Link.Links.push(data);
            this.Link.Upload.Url = '';
            this.Link.Upload.Name = '';
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
    ShowDelLinkDialog(LinkItem, Index) {
      this.DelLinkInfo.Serial = LinkItem.Serial;
      this.DelLinkInfo.Index = Index;
      this.dialogDelLink.title = this.$t('SURREALM.Files.Warning');
      this.dialogDelLink.msg = this.$t('SURREALM.Files.DelMsg');
      this.dialogDelLink.isLeftBtnShow = true;
      this.dialogDelLink.txtLeftBtn = this.$t('SURREALM.Files.DelLeftBtn');
      this.dialogDelLink.txtRightBtn = this.$t('SURREALM.Files.DelRightBtn');
      this.dialogDelLink.show = true;
    },
    CloseDelLinkDialog() {
      this.DelLinkInfo.Serial = null;
      this.DelLinkInfo.Index = null;
      this.dialogDelLink.title = '';
      this.dialogDelLink.msg = '';
      this.dialogDelLink.isLeftBtnShow = true;
      this.dialogDelLink.txtLeftBtn = '';
      this.dialogDelLink.txtRightBtn = '';
      this.dialogDelLink.show = false;
    },
    DelLink() {
      apiDelLink(this.DelLinkInfo.Serial).then((res) => {
        if (res.data.Status == 'ok') {
          this.Link.Links.splice(this.DelLinkInfo.Index, 1);
          this.CloseDelLinkDialog();
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    ShowQA() {
      this.dialogHint.isShow = true;
      var tmpMsg = this.$t('SURREALM.QA.QAFile');
      this.dialogHint.msg = tmpMsg.split('<br>');
      this.dialogHint.btnTxt = this.$t('SURREALM.QA.QAComfirm');
      this.dialogHint.imgSrc = require('@/assets/img/SURREALM/Backend/Help/icon_help.png');
    },
    CloseQA() {
      this.dialogHint.isShow = false;
    },
  },
  components: {
    Header,
    Menu,
    TitleBar,
    DialogMsg,
    DialogQA,
  },
};
</script>