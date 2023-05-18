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
            <option v-for="(type, index) in MaterialTypes" :key="index" :value="type.id">
              {{ type.name }}
            </option>
          </select>
          &nbsp;&nbsp;
          <label class="toolTitle">{{ $t('SURREALM.MaterialLib.Category') }}</label>
          <select class="input-select">
            <option v-for="(category, index) in Categories" :key="index" :value="category">
              {{ category }}
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
              <div class="titleType">{{ getMateriaTypeName(material.Type) }}</div>
              <div class="titleName">{{ material.Name }}</div>              
              <div class="titleCategory">{{ material.Classification }}</div>
              <div class="titleOperate">
                <button class="btn btnWithIcon iconEdit" @click="EditMaterial(material)">{{ $t('SURREALM.MaterialLib.Edit') }}</button>
                <button class="btn btnWithIcon iconDel" @click="ShowDelDialog(material, index)">{{ $t('SURREALM.MaterialLib.Delete') }}</button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>

    <DialogEditMaterial
      :show="dialogeEditMaterial.show"
      :MaterialTypes="MaterialTypes"
      :Categories="Categories"
      :defaultValue="Material"
      @close-dialog="CloseEditMaterialDialog"
    />
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
import DialogEditMaterial from '@/components/SURREALM/Backend/DialogEditMaterial.vue';
import DialogMsg from '@/components/SURREALM/Backend/DialogMsg.vue';
import DialogQA from '@/components/SURREALM/Backend/DialogQA.vue';
import { apiGetMaterialList, apiDelMaterial } from '@/request.js';

export default {
  data() {
    return {      
      MaterialTypes: [
        {id:"pic", name:"圖片"},
        {id:"video", name:"影片"},
        {id:"quick_resp_qn", name:"搶答題目"}
      ],
      Categories: ["課程1", "課程2", "課程3", "課程4", "課程5", "課程6", "課程7", "課程8", "課程9", "課程10"],
      MaterialList:null,
      Material: null,      
      dialogeEditMaterial: {
        show: false,
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
      DelMaterialInfo: {
        Serial: null,
        Index: null,
      },
    };
  },
  mounted() {
    this.GetMaterialList();
  },
  computed: {},
  methods: {
    getMateriaTypeName(type) {
      var MaterialType = this.MaterialTypes.find(function(item){
        return item.id == type;
      });

      return MaterialType.name;
    },
    AddMaterial() {
      this.dialogeEditMaterial.show = true;
    },
    SearchMaterial() {
      
    },  
    EditMaterial(material) {
      this.Material = material;
      this.dialogeEditMaterial.show = true;
    },
    ShowEditMaterialDialog() {
      this.dialogeEditMaterial.show = true;
    },
    CloseEditMaterialDialog() {
      this.dialogeEditMaterial.show = false;
      this.Material = null;
    },
    ShowDelDialog(Item, Index) {
      this.DelMaterialInfo.Serial = Item.serial;
      this.DelMaterialInfo.Index = Index;
      this.dialogDelLink.title = this.$t('SURREALM.Files.Warning');
      this.dialogDelLink.msg = this.$t('SURREALM.Files.DelMsg');
      this.dialogDelLink.isLeftBtnShow = true;
      this.dialogDelLink.txtLeftBtn = this.$t('SURREALM.Files.DelLeftBtn');
      this.dialogDelLink.txtRightBtn = this.$t('SURREALM.Files.DelRightBtn');
      this.dialogDelLink.show = true;
    },
    CloseDelDialog() {
      this.DelMaterialInfo.Serial = null;
      this.DelMaterialInfo.Index = null;
      this.dialogDelLink.title = '';
      this.dialogDelLink.msg = '';
      this.dialogDelLink.isLeftBtnShow = true;
      this.dialogDelLink.txtLeftBtn = '';
      this.dialogDelLink.txtRightBtn = '';
      this.dialogDelLink.show = false;
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
    GetMaterialList() {      
      apiGetMaterialList().then((res) => {
        
        if (res.data.Status == 'ok') {          
          this.MaterialList = res.data.Materials;          
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    DelMaterial() {
      apiDelMaterial(this.DelMaterialInfo.Serial).then((res) => {
        if (res.data.Status == 'ok') {
          var Index = this.Lectures.findIndex((obj) => obj.Serial == this.DelMaterialInfo.Serial);
          this.MaterialList.splice(Index, 1);
          this.CloseDelDialog();
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
    Header,
    Menu,
    TitleBar,
    DialogEditMaterial,
    DialogMsg,
    DialogQA,
  },
};
</script>