<template>
    <div class="pnlDialogFull" v-if="show" style="">
        <div class="pnlDialogGray">
            <div class="pnlDialogEditMaterial">
                <div class="pnlTitle">
                    <label>{{ $t('SURREALM.MaterialLib.EditDialogTitle') }}</label>                    
                    <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
                </div>
                <div class="pnlContent">
                    <div class="MaterialType">                        
                        <input type="radio" id="pic" value="0" v-model="Material.Type" />
                        <label for="pic"><span></span>{{ $t('SURREALM.MaterialLib.Picture') }}</label>
                        <input type="radio" id="mov" value="1" v-model="Material.Type" />
                        <label for="mov"><span></span>{{ $t('SURREALM.MaterialLib.Movie') }}</label>
                        <input type="radio" id="qa" value="2" v-model="Material.Type" />
                        <label for="qa"><span></span>{{ $t('SURREALM.MaterialLib.QA') }}</label>
                    </div>
                    <div class="container">
                        <div class="keyinTitle">{{ $t('SURREALM.MaterialLib.MaterialName') }}</div>
                        <div class="keyinContent">
                            <input
                                class="tableInput"
                                type="text"
                                maxlength="30"
                                v-model.trim="Material.Name"
                            />
                        </div>
                        <div class="keyinTitle">{{ $t('SURREALM.MaterialLib.Category') }}</div>
                        <div class="keyinContent">
                            <select v-model="Material.Classification" class="tableSelect">
                                <option v-for="option in TypeOptions" :key="option.Text" :value="option.Type">
                                {{ option.Text }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import DialogMsg from '@/components/SURREALM/Backend/DialogMsg.vue';
// import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import {
  
} from '@/request.js';

export default {
  name: 'DialogEditMaterial',
  props: {
    show: Boolean,
    defaultValue: Object,
  },
  data() {
    return {
      loadingInfo: {
        isLoading: false,
        color: '#fff',
        opacity: 0.9,
        bgColor: '#131217',
      },
      dialogDel: {
        show: false,
        title: '',
        msg: '',
        isLeftBtnShow: true,
        txtLeftBtn: '',
        txtRightBtn: '',
      },
      Material: {
        Type:'',
        Name:'',
        Classification:'',
        Url:'',
        Description:'',
        Question:'',
        Answer:'',
        Option1:'',
        Option2:'',
        Option3:'',
        Option4:'',
      },
    };
  },
  mounted() {
    // this.GetLinks();    
    // this.GetLectureType();
  },
  computed: {
    
  },
  watch: {
    defaultValue(obj) {
      if (obj != null) {
        // this.Lecture = this.DeepCopy(obj.Lecture);
        // this.Lecture.IsStreaming = this.Lecture.IsStreaming != 'T' ? false : true;
        // this.Student.Select = this.DeepCopy(obj.Student);
        // this.Serial = obj.Serial;
        // this.LectureCode = obj.LectureCode;
      }
    },
    show(bool) {
      if (!bool) {
        // this.Lecture = {
        //   Name: '',
        //   Date: '',
        //   Time: [],
        //   Type: '100',
        //   Auth: 'private',
        //   IsStreaming: false,
        //   Des: '',
        //   Image: '',
        //   Models: [],
        // };
        // this.Student.Select = [];
        // this.Serial = null;
        // this.LectureCode = '';
      }
    },
  },
  methods: {
    CloseDialog() {
      
      this.$emit('close-dialog');
    },    
    // ShowDelDialog(Item, Index) {
    //   this.DelLinkInfo.Serial = LinkItem.Serial;
    //   this.DelLinkInfo.Index = Index;
    //   this.dialogDelLink.title = this.$t('SURREALM.Files.Warning');
    //   this.dialogDelLink.msg = this.$t('SURREALM.Files.DelMsg');
    //   this.dialogDelLink.isLeftBtnShow = true;
    //   this.dialogDelLink.txtLeftBtn = this.$t('SURREALM.Files.DelLeftBtn');
    //   this.dialogDelLink.txtRightBtn = this.$t('SURREALM.Files.DelRightBtn');
    //   this.dialogDelLink.show = true;
    // },
    CloseDelDialog() {
    //   this.DelLinkInfo.Serial = null;
    //   this.DelLinkInfo.Index = null;
    //   this.dialogDelLink.title = '';
    //   this.dialogDelLink.msg = '';
    //   this.dialogDelLink.isLeftBtnShow = true;
    //   this.dialogDelLink.txtLeftBtn = '';
    //   this.dialogDelLink.txtRightBtn = '';
    //   this.dialogDelLink.show = false;
    },
    Del() {
    //   apiDelLink(this.DelLinkInfo.Serial).then((res) => {
    //     if (res.data.Status == 'ok') {
    //       this.Link.Links.splice(this.DelLinkInfo.Index, 1);
    //       this.CloseDelLinkDialog();
    //     } else {
    //       this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
    //         icon: 'warning',
    //         position: 'bottom-center',
    //         duration: 3500,
    //       });
    //     }
    //   });
    },    
  },
  components: {    
    // Loading,
    // DialogMsg,
  },
};
</script>