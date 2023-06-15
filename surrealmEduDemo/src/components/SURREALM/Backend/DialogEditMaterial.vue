<template>
    <div class="pnlDialogFull" v-if="show" style="">
        <div class="pnlDialogGray">
            <div class="pnlDialogEditMaterial">
                <div class="pnlTitle">
                    <label>{{ $t('SURREALM.MaterialLib.EditDialogTitle') }}</label>                    
                    <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
                </div>
                <div class="pnlContent">
                    <div  v-show="Material.Serial == null" class="MaterialType">
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
                            <div class="keyinContent elementFormRight" id="upload_file_zone" @drop="drop($event)" @dragover.prevent @dragenter.prevent>                            
                                <input class="display_none" id="file_upload" ref="file" @change="handleFileUpload" type="file" accept="image/*">
                                <div v-if="Material.PicUrl == null || Material.PicUrl.length == 0" class="upload_zone" @click.prevent="selectUploadImage" >
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAHoSURBVGiB7ZmvT8NAFMe/b5AhZoZELxgShp9hDuQkErk/YQIFBsP/gEDgQE5uggQJBoVAkOBISCDZIPBFdAvkeuva6113u/STNEteu9f32V7vxyYkEQKVRRdgi1LEN4IRWdUFRcTaDUiuA6iJyLPFnLGYaIN2RS4B1EVk32JOfVA9LN7wgH90LeaN1+xKhOQGydd/Iu8kG5ZyFypyzTg3JHMPMIWJKC2l0lsKEU1LqYzztlhRIv0ECSst5lyEZDeFxBTjFnMqQrLBaGRKy5hk0ysRkpVJu2TlnmTVJ5GegcSUUy9ESDYZtYkp3yRbCxUhWWXUHnl5JFnLI5J3lj0GYPTAKjQAnOXKYPqNkGxN2sIme6Y1Gy3jGY00D4g+SZu8ANgUkY8594/FtBurFGwBuEg4fwRgZca5HwAnCe/dBnCbtSAnGyuSIwBrM05/iUjmuUPJH4sFs2cvRXyjFPEN7fBLcleNicjQfTmxOuoAdpTwG4A73cW6I0bGAkYJs/dnhjxtzfsHupqDaa1SxDdM11rz6CB5rWUdJyIi0neRN4lgWqsU8Y3UzwjJK+hmVLd00l6o3VgB8PnP9yGAthoMprWCFyl8pZuBgS446xmpAzicvPrEk4ica38wybhC95bgn5GloxTxjV+7v7eq7SSNfgAAAABJRU5ErkJggg=="> 請拖曳圖檔至此或點擊瀏覽資料夾 <span>檔案限制1MB，類型為jpg、png</span>
                                </div>
                                <div id="preview" v-else>                                    
                                    <img :src="Material.PicUrl" style="width:100%;">
                                    <button class="btn btnWithIcon iconDel" style="position: absolute; bottom: 0px; right: 0px; background-color:gray;" @click="Material.PicUrl = null">{{ $t('SURREALM.MaterialLib.Delete') }}</button>
                                </div>
                            </div>
                        </div>
                        <div v-show="Material.Type == 'video'">
                            <div class="keyinTitle">*{{ $t('SURREALM.MaterialLib.MaterialLink') }}</div>
                            <div class="keyinContent">
                                <input class="tableInput" type="text" :placeholder="$t('SURREALM.MaterialLib.Placeholder.VideoLink')" v-model.trim="Material.VideoUrl"/>
                            </div>
                        </div>
                        <div v-show="Material.Type == 'pic'|| Material.Type == 'video'">
                            <div class="keyinTitle">{{ $t('SURREALM.MaterialLib.MaterialDes') }}</div>
                            <div class="keyinContent">
                                <textarea v-model="Material.Description" class="input-textarea" :placeholder="$t('SURREALM.MaterialLib.Placeholder.Des')"></textarea>
                            </div>
                        </div>
                        <div class="keyinTitle"></div>
                        <div class="keyinContent">                            
                            <div class="topic">{{ $t('SURREALM.MaterialLib.Topic') }}</div>
                        </div>
                        <div class="keyinTitle"></div>
                        <div class="keyinContent">                            
                            <textarea v-model="Material.Question" class="input-textarea-2"></textarea>
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
                        <button v-if="Material.Serial != null" class="btn btnUpload" @click="UpdateMaterial">{{ $t('SURREALM.MaterialLib.Upload') }}</button>
                        <button v-else class="btn btnUpload" @click="AddMaterial">{{ $t('SURREALM.MaterialLib.Upload') }}</button>
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
import {apiAddMaterial, apiUpdateMaterial, apiUploadMaterialImage} from '@/request.js';

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
        Serial:null,
        Type:'pic',
        Name:'',
        Classification:'課程1',
        PicUrl:'',
        VideoUrl:'',
        Des:'',
        Question:'',
        Answer:1,
        Option1:'',
        Option2:'',
        Option3:'',
        Option4:'',
      },
      File:null,
      isDragging: false,
    };
  },
  mounted() {    
    
  },
  computed: {
    
  },
  watch: {
    defaultValue(obj) {
      if (obj != null) {
        this.Material = obj;
        // console.log(this.Material); 
      }
    },
    show(bool) {
      if (!bool) {
        this.Material = {
            Type:'pic',
            Name:'',
            Classification:'課程1',
            PicUrl:'',
            VideoUrl:'',
            Description:'',
            Question:'',
            Answer:1,
            Option1:'',
            Option2:'',
            Option3:'',
            Option4:'',
        };        
      }
    },
  },
  methods: {
    CloseDialog() {
        this.$emit('close-dialog');
    },   
    ValidateMaterial() {
        let errMsg = '';
        if (this.Material.Name == '' || this.Material.Name == null) {
            errMsg = this.$t('SURREALM.MaterialLib.MaterialName') + this.$t('SURREALM.MaterialLib.Required');
        } else if (this.Material.Type == "pic" && (this.Material.PicUrl == "" || this.Material.PicUrl == null)) {
            errMsg = this.$t('SURREALM.MaterialLib.MaterialFile') + this.$t('SURREALM.MaterialLib.Required');
        } else if (this.Material.Type == "video" && (this.Material.VideoUrl == "" || this.Material.VideoUrl == null)) {
            errMsg = this.$t('SURREALM.MaterialLib.MaterialLink') + this.$t('SURREALM.MaterialLib.Required');
        } else if (this.Material.Type == "quick_resp_qn") {
            if (this.Material.Question == '' || this.Material.Question == null) {
                errMsg = this.$t('SURREALM.MaterialLib.Topic') + this.$t('SURREALM.MaterialLib.Required');
            } else if (this.Material.Option1 == '' || this.Material.Option1 == null ||
            this.Material.Option2 == '' || this.Material.Option2 == null ||
            this.Material.Option3 == '' || this.Material.Option3 == null ||
            this.Material.Option4 == '' || this.Material.Option4 == null) {
                errMsg = this.$t('SURREALM.MaterialLib.Options') + this.$t('SURREALM.MaterialLib.Required');
            }
        }
        return errMsg;
    }, 
    AddMaterial() {
        let ErrMsg = this.ValidateMaterial();
        if (ErrMsg == '') {
            this.Material.Answer = parseInt(this.Material.Answer);//string轉成int
            let data = JSON.stringify(this.Material);
            //console.log(data);
            apiAddMaterial(data)
            .then((res) => {        
                if (res.data.Status == 'ok') {          
                    this.CloseDialog();    
                } else {
                    this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
                    icon: 'warning',
                    position: 'bottom-center',
                    duration: 3500,
                    });
                }
            })
            .catch((error) => console.log(error));
        } else {
            this.$toasted.show(ErrMsg, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
            });
        }
    },  
    UpdateMaterial() {
        
        let ErrMsg = this.ValidateMaterial();
        if (ErrMsg == '') {
            this.Material.Answer = parseInt(this.Material.Answer);//string轉成int
            let data = JSON.stringify(this.Material);
            apiUpdateMaterial(this.Material.Serial, data).then((res) => {        
                if (res.data.Status == 'ok') {          
                    this.CloseDialog();              
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
    selectUploadImage() {   
        document.getElementById("file_upload").click();        
    },
    handleFileUpload(event) {        
        this.File = event.target.files[0];
        this.imageUpload();        
    },
    dragover(e) {
        console.log("dragover");
        e.preventDefault();
        this.isDragging = true;
    },
    dragleave() {
        console.log("dragleave");
        this.isDragging = false;
    },
    drop(e) {
        console.log(e.dataTransfer.files);
        e.preventDefault();
        this.File = e.dataTransfer.files[0];        
        this.isDragging = false;
        this.imageUpload();
    },
    imageUpload() {
        var fileSize = 1024000; //1M
        console.log(this.File.size);
        if (this.File == null) {
            alert(this.$t('SURREALM.MaterialLib.NoFileSelected'));
            return false;
        } else if (this.File.size > fileSize) {
            alert(this.$t('SURREALM.MaterialLib.UploadFileIsTooLarge'));
            return false;
        }

        let formData = new FormData();
        formData.append('image', this.File); //required

        apiUploadMaterialImage(formData).then((res) => {        
            if (res.data.Status == 'ok') {          
                this.Material.PicUrl = res.data.MaterialS3Path;
                console.log(this.Material.PicUrl);
            } else {
                this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
                icon: 'warning',
                position: 'bottom-center',
                duration: 3500,
                });
            }});     
    },
  },
  components: {    
    // Loading,
    // DialogMsg,
  },
};
</script>