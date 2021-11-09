<template>
  <div class="cropperArea">
    <label class="title" v-html="$t('SURREALM.CropperView.Title')"></label>
    <input id="imgUpload" ref="input" type="file" name="image" accept="image/*" @change="UploadImg" />
    <vue-cropper
      ref="cropper"
      :aspect-ratio="16 / 9"
      :crop-box-resizable="Image.cropBoxResizable"
      :min-crop-box-width="Image.minCropBoxWidth"
      :zoomable="Image.zoomable"
      :src="Image.Src"
      v-show="!Image.CropImg && Image.Src"
      class="cropperView"
    />
    <div class="croppedImage" v-show="Image.CropImg">
      <img :src="Image.CropImg" alt="Cropped Image" />
    </div>
    <div class="toolArea" v-show="!Image.CropImg">
      <button class="btn" @click.prevent="CropImage">{{ $t('SURREALM.CropperView.Cut') }}</button>
      <button class="btn" @click.prevent="ResetImage">{{ $t('SURREALM.CropperView.Cancel') }}</button>
    </div>
    <div class="toolArea" v-show="Image.CropImg">
      <button class="btn" @click.prevent="ShowFileChooser">{{ $t('SURREALM.CropperView.Upload') }}</button>
    </div>
    <Loading
      :active.sync="loadingInfo.isLoading"
      :can-cancel="false"
      :is-full-page="true"
      :color="loadingInfo.color"
      :opacity="loadingInfo.opacity"
      :background-color="loadingInfo.bgColor"
    ></Loading>
  </div>
</template>
<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  name: 'CropperView',
  props: {
    defaultImage: String,
  },
  data() {
    return {
      Image: {
        Src: '',
        CropImg: '',
        Data: null,
        cropBoxResizable: false,
        minCropBoxWidth: 100,
        zoomable: true,
      },
      loadingInfo: {
        isLoading: false,
        color: '#fff',
        opacity: 0.9,
        bgColor: '#131217',
      },
    };
  },
  watch: {
    defaultImage(src) {
      this.Image.CropImg = src;
    },
  },
  methods: {
    UploadImg(e) {
      //init
      let vuethis = this;
      vuethis.loadingInfo.isLoading = true;
      this.Image.CropImg = '';
      const file = e.target.files[0];
      if (file.type.indexOf('image/') === -1) {
        alert('Please select an image file');
        return;
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.Image.Src = event.target.result;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
          vuethis.loadingInfo.isLoading = false;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Sorry, FileReader API not supported');
      }
    },
    CropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.Image.CropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
      this.$emit('set-image', this.Image.CropImg);
      //clear file
      document.getElementById('imgUpload').value = '';
    },
    ShowFileChooser() {
      this.$refs.input.click();
    },
    ResetImage() {
      this.Image.CropImg = this.defaultImage;
      this.Image.Src = '';
      //clear file
      document.getElementById('imgUpload').value = '';
    },
  },
  components: {
    VueCropper,
    Loading,
  },
};
</script>