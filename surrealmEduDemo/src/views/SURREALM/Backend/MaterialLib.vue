<template>
  <div id="PageMaterialLib">
    <Header :title="$t('SURREALM.PageName')" logoutPath="/SURREALM/Login" />
    <Menu />
    <div class="pnlPageContent scrollBar">
      <TitleBar
        :iconSrc="require('@/assets/img/SURREALM/Backend/Menu/icon_material_lib.png')"
        :title="$t('SURREALM.MaterialLib.PageName')"
      >
      <button class="btn btnWithIcon iconAdd" @click="AddMaterial">
          {{ $t('SURREALM.MaterialLib.AddMaterial') }}
      </button>      
      <button class="btnInformation" @click="ShowQA()"></button>
      </TitleBar>
      <div class="materialLib">
        <div class="toolArea">
          <label class="toolTitle">{{ $t('SURREALM.MaterialLib.MaterialType') }}</label>
          <select class="input-select">
            <option v-for="(type, index) in MaterialTypes" :key="index" :value="index">
              {{ type }}
            </option>
          </select>
          &nbsp;&nbsp;
          <label class="toolTitle">{{ $t('SURREALM.MaterialLib.Category') }}</label>
          <select class="input-select">
            <option v-for="(type, index) in MaterialTypes" :key="index" :value="index">
              {{ type }}
            </option>
          </select>
          <button class="btnWithIcon iconSearch" @click="SearchMaterial">{{ $t('SURREALM.MaterialLib.Search') }}</button>
        </div>
        <div class="materialLibArea">
        <div class="titleType">{{ $t('SURREALM.MaterialLib.MaterialType') }}</div>
          <div class="titleName">{{ $t('SURREALM.MaterialLib.MaterialName') }}</div>
          <div class="titleCategory">{{ $t('SURREALM.MaterialLib.Category') }}</div>
          <div class="titleOperate">{{ $t('SURREALM.MaterialLib.Operate') }}</div>
          <div class="scrollArea">
            <div v-for="(material, index) in MaterialList" :key="material.serial">
              <div class="titleType">{{ material.type }}</div>
              <div class="titleName">{{ material.name }}</div>
              <div class="titleCategory">{{ material.category }}</div>
              <div class="titleOperate">
                <button class="btn btnWithIcon iconEdit" @click="EditMaterial(material, index)">{{ $t('SURREALM.MaterialLib.Edit') }}</button>
                <button class="btn btnWithIcon iconDel" @click="ShowDelDialog(material, index)">{{ $t('SURREALM.MaterialLib.Delete') }}</button>
              </div>
              
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
      @close-dialog="CloseDelDialog"
      @click-left="CloseDelDialog"
      @click-right="DelMaterial"
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
import Header from '@/components/SURREALM/Backend/Header.vue';
import Menu from '@/components/SURREALM/Backend/Menu.vue';
import TitleBar from '@/components/SURREALM/Backend/TitleBar.vue';
import DialogMsg from '@/components/SURREALM/Backend/DialogMsg.vue';
import DialogQA from '@/components/SURREALM/Backend/DialogQA.vue';

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
      MaterialTypes: ["圖片", "影片", "搶答題目"],
      Categories: ["圖片", "影片", "搶答題目"],
      MaterialList: [
        {serial: 0, type: "圖片", name: "測試1", category: "Test1"},
        {serial: 1, type: "圖片", name: "測試2", category: "Test2"},
        {serial: 2, type: "圖片", name: "測試3", category: "Test3"},
        {serial: 3, type: "圖片", name: "測試4", category: "Test4"},
        {serial: 4, type: "圖片", name: "測試5", category: "Test5"},
      ],
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
    // this.GetLinks();
  },
  computed: {},
  methods: {
    AddMaterial() {
      
    },
    SearchMaterial() {
      
    },  
    EditMaterial() {
      
    },
    ShowDelDialog(Item, Index) {
      this.DelLinkInfo.Serial = Item.serial;
      this.DelLinkInfo.Index = Index;
      this.dialogDelLink.title = this.$t('SURREALM.Files.Warning');
      this.dialogDelLink.msg = this.$t('SURREALM.Files.DelMsg');
      this.dialogDelLink.isLeftBtnShow = true;
      this.dialogDelLink.txtLeftBtn = this.$t('SURREALM.Files.DelLeftBtn');
      this.dialogDelLink.txtRightBtn = this.$t('SURREALM.Files.DelRightBtn');
      this.dialogDelLink.show = true;
    },
    CloseDelDialog() {
      this.DelLinkInfo.Serial = null;
      this.DelLinkInfo.Index = null;
      this.dialogDelLink.title = '';
      this.dialogDelLink.msg = '';
      this.dialogDelLink.isLeftBtnShow = true;
      this.dialogDelLink.txtLeftBtn = '';
      this.dialogDelLink.txtRightBtn = '';
      this.dialogDelLink.show = false;
    },
    DelMaterial() {
      
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