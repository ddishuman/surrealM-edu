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
                        <div v-for="(type, index) in MaterialTypes" :key="index" :value="type.id">
                            <input type="radio" name="material_types" :id="type.id" :value="type.id" v-model="Material.Type" />
                            <label :for="type.id" v-if="type.id == 'pic'"><span></span>{{ $t('SURREALM.MaterialLib.Picture') }}</label>
                            <label :for="type.id" v-else-if="type.id == 'video'"><span></span>{{ $t('SURREALM.MaterialLib.Movie') }}</label>
                            <label :for="type.id" v-else><span></span>{{ $t('SURREALM.MaterialLib.QA') }}</label>
                        </div>                        
                    </div>
                    <div class="container">
                        <div class="keyinTitle">*{{ $t('SURREALM.MaterialLib.MaterialName') }}</div>
                        <div class="keyinContent">
                            <input class="tableInput" type="text" maxlength="30" :placeholder="$t('SURREALM.MaterialLib.Placeholder.Name')" v-model.trim="Material.Name"/>
                        </div>
                        <div class="keyinTitle">*{{ $t('SURREALM.MaterialLib.Category') }}</div>
                        <div class="keyinContent">                            
                            <select class="tableSelect" v-model="Material.Classification">
                                <option v-for="(category, index) in Categories" :key="index" :value="category">
                                  {{ category }}
                                </option>
                              </select>
                        </div>
                        <div v-show="Material.Type == 'pic'">
                            <div class="keyinTitle">*{{ $t('SURREALM.MaterialLib.MaterialFile') }}</div>
                            <div class="keyinContent elementFormRight">                            
                                <input class="display_none" id="fileUploader" onchange="handleFiles(this.files)" type="file">
                                <div class="upload_zone" id="upload_zone">
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAHoSURBVGiB7ZmvT8NAFMe/b5AhZoZELxgShp9hDuQkErk/YQIFBsP/gEDgQE5uggQJBoVAkOBISCDZIPBFdAvkeuva6113u/STNEteu9f32V7vxyYkEQKVRRdgi1LEN4IRWdUFRcTaDUiuA6iJyLPFnLGYaIN2RS4B1EVk32JOfVA9LN7wgH90LeaN1+xKhOQGydd/Iu8kG5ZyFypyzTg3JHMPMIWJKC2l0lsKEU1LqYzztlhRIv0ECSst5lyEZDeFxBTjFnMqQrLBaGRKy5hk0ysRkpVJu2TlnmTVJ5GegcSUUy9ESDYZtYkp3yRbCxUhWWXUHnl5JFnLI5J3lj0GYPTAKjQAnOXKYPqNkGxN2sIme6Y1Gy3jGY00D4g+SZu8ANgUkY8594/FtBurFGwBuEg4fwRgZca5HwAnCe/dBnCbtSAnGyuSIwBrM05/iUjmuUPJH4sFs2cvRXyjFPEN7fBLcleNicjQfTmxOuoAdpTwG4A73cW6I0bGAkYJs/dnhjxtzfsHupqDaa1SxDdM11rz6CB5rWUdJyIi0neRN4lgWqsU8Y3UzwjJK+hmVLd00l6o3VgB8PnP9yGAthoMprWCFyl8pZuBgS446xmpAzicvPrEk4ica38wybhC95bgn5GloxTxjV+7v7eq7SSNfgAAAABJRU5ErkJggg=="> 請拖曳圖檔至此或點擊瀏覽資料夾 <span>檔案限制1MB，類型為jpg、png</span>
                                </div>
                                <div id="preview"></div>
                            </div>
                        </div>
                        <div v-show="Material.Type == 'video'">
                            <div class="keyinTitle">*{{ $t('SURREALM.MaterialLib.MaterialLink') }}</div>
                            <div class="keyinContent">
                                <input class="tableInput" type="text" :placeholder="$t('SURREALM.MaterialLib.Placeholder.VideoLink')" v-model.trim="Material.Url"/>
                            </div>
                        </div>
                        <div v-show="Material.Type == 'pic'|| Material.Type == 'video'">
                            <div class="keyinTitle">{{ $t('SURREALM.MaterialLib.MaterialDes') }}</div>
                            <div class="keyinContent">
                                <textarea v-model="Material.Des" class="input-textarea" :placeholder="$t('SURREALM.MaterialLib.Placeholder.Des')"></textarea>
                            </div>
                        </div>
                        <div class="keyinTitle"></div>
                        <div class="keyinContent">                            
                            <div class="topic">{{ $t('SURREALM.MaterialLib.Topic') }}</div>
                        </div>
                        <div class="keyinTitle"></div>
                        <div class="keyinContent">                            
                            <textarea v-model="Material.Des" class="input-textarea-2"></textarea>
                        </div>
                        <div class="keyinTitle"></div>
                        <div class="keyinContent">                            
                            <div class="topic">{{ $t('SURREALM.MaterialLib.CorrectAnswer') }}</div>
                        </div>
                        <div class="keyinTitle">
                            <input type="radio" name="options" id="option_1" value="1" v-model="Material.Answer" />
                            <label for="option_1"><span></span>{{ $t('SURREALM.MaterialLib.Options') }}&nbsp;1</label>
                        </div>
                        <div class="keyinContent">                            
                            <textarea v-model="Material.Option1" class="input-textarea-2"></textarea>
                        </div>
                        <div class="keyinTitle">
                            <input type="radio" name="options" id="option_2" value="2" v-model="Material.Answer" />
                            <label for="option_2"><span></span>{{ $t('SURREALM.MaterialLib.Options') }}&nbsp;2</label>
                        </div>
                        <div class="keyinContent">                            
                            <textarea v-model="Material.Option2" class="input-textarea-2"></textarea>
                        </div>
                        <div class="keyinTitle">
                            <input type="radio" name="options" id="option_3" value="3" v-model="Material.Answer" />
                            <label for="option_3"><span></span>{{ $t('SURREALM.MaterialLib.Options') }}&nbsp;3</label>
                        </div>
                        <div class="keyinContent">                            
                            <textarea v-model="Material.Option3" class="input-textarea-2"></textarea>
                        </div>
                        <div class="keyinTitle">
                            <input type="radio" name="options" id="option_4" value="4" v-model="Material.Answer" />
                            <label for="option_4"><span></span>{{ $t('SURREALM.MaterialLib.Options') }}&nbsp;4</label>
                        </div>
                        <div class="keyinContent">                            
                            <textarea v-model="Material.Option4" class="input-textarea-2"></textarea>
                        </div>
                        <button class="btn btnUpload">{{ $t('SURREALM.MaterialLib.Upload') }}</button>
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
import "@/assets/scss/component.scss"
import {
  
} from '@/request.js';

export default {
  name: 'DialogEditMaterial',
  props: {
    show: Boolean,
    defaultValue: Object,
    MaterialTypes: Array,
    Categories: Array,
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
        Type:'pic',
        Name:'',
        Classification:'課程1',
        Url:'',
        Des:'',
        Question:'',
        Answer:'1',
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
        this.Material = obj;
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