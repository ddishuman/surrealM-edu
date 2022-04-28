<template>
  <div>
    <div class="pnlStreamingArea fullscreen-wrapper">
      <div v-if="ws.srcImg == ''" class="hintTxt">{{ $t('SURREALM.LIVE.Err.Prepare') }}</div>
      <div v-else-if="TeacherConnect == false" class="hintTxt">{{ $t('SURREALM.LIVE.Err.Wait') }}</div>
      <div v-else class="pnlImgArea">
        <img id="DisplayImg" :src="ws.srcImg" />
        <div class="pnlStreamToolBar">
          <button class="bntfullscreen" @click="ToggleFullscreen"></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { api as fullscreen } from 'vue-fullscreen';
import Zlib from 'zlib';

export default {
  name: 'StreamingView',
  props: {},
  data() {
    return {
      Fullscreen: {
        IsFull: false,
      },
      ws: {
        statusImg: 1001,
        dataIDImg: 0,
        receivedLengthImg: 0,
        dataLengthImg: 0,
        dataByteImg: new Uint8Array(0),
        readyToGetFrameImg: true,
        srcImg: '',

        statusAud: 2001,
        dataIDAud: 0,
        dataLengthAud: 0,
        receivedLengthAud: 0,
        dataByteAud: new Uint8Array(100),
        readyToGetFrameAud: true,
        sourceSampleRate: 44100,
        sourceChannels: 1,
        audioCtx: new (window.AudioContext || window.webkitAudioContext)(),
        soundFirstTime: true,
      },
      TeacherConnect: true,
    };
  },
  mounted() {
    if (this.ws.soundFirstTime) {
      this.CreateSound(450, 100, 'square', 0.05);
      this.ws.soundFirstTime = false;
    }
  },
  sockets: {
    OnReceiveData: function (data) {
      var _byteData = new Uint8Array(data.DataByte);
      var _label = this.ByteToInt32(_byteData, 0);

      if (_label == this.ws.statusImg) {
        let _dataID = this.ByteToInt32(_byteData, 4);
        if (_dataID != this.ws.dataIDImg) this.ws.receivedLengthImg = 0;

        this.ws.dataIDImg = _dataID;
        this.ws.dataLengthImg = this.ByteToInt32(_byteData, 8);

        let _GZipMode = _byteData[16] == 1 ? true : false;

        if (this.ws.receivedLengthImg == 0) this.ws.dataByteImg = new Uint8Array(0);
        this.ws.receivedLengthImg += _byteData.length - 17;
        this.ws.dataByteImg = this.CombineInt8Array(this.ws.dataByteImg, _byteData.slice(17, _byteData.length));

        if (this.ws.readyToGetFrameImg) {
          if (this.ws.receivedLengthImg == this.ws.dataLengthImg) this.ProcessImageData(this.ws.dataByteImg, _GZipMode);
        }
      }
      if (_label == this.ws.statusAud) {
        let _dataID = this.ByteToInt32(_byteData, 4);
        if (_dataID != this.ws.dataIDAud) this.ws.receivedLengthAud = 0;

        this.ws.dataIDAud = _dataID;
        this.ws.dataLengthAud = this.ByteToInt32(_byteData, 8);

        let _GZipMode = _byteData[16] == 1 ? true : false;

        if (this.ws.receivedLengthAud == 0) this.ws.dataByteAud = new Uint8Array(0);
        this.ws.receivedLengthAud += _byteData.length - 17;

        this.ws.dataByteAud = this.CombineInt8Array(this.ws.dataByteAud, _byteData.slice(17, _byteData.length));

        if (this.ws.readyToGetFrameAud) {
          if (this.ws.receivedLengthAud == this.ws.dataLengthAud) this.ProcessAudioData(this.ws.dataByteAud, _GZipMode);
        }
      }
    },
    OnTeacherConnectionChange: function (data) {
      console.log('OnTeacherConnectionChange Status:' + data.Status);
      if (data.Status == 'Connected') {
        this.TeacherConnect = true;
      } else if (data.Status == 'Disconnected') {
        this.TeacherConnect = false;
        if (this.Fullscreen.IsFull) this.ToggleFullscreen();
      }
    },
  },
  methods: {
    ToggleFullscreen() {
      fullscreen.toggle(this.$el.querySelector('.fullscreen-wrapper'), {
        teleport: this.teleport,
        callback: (isFullscreen) => {
          this.Fullscreen.IsFull = isFullscreen;
        },
      });
    },

    ProcessImageData: function (_byte, _GZipMode) {
      this.ws.readyToGetFrameImg = false;
      var binary = '';
      var bytes = new Uint8Array(_byte);
      if (_GZipMode) {
        var gunzip = new Zlib.Gunzip(bytes);
        bytes = gunzip.decompress();
      }

      //----conver byte[] to Base64 string----
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      this.ws.srcImg = 'data:image/jpeg;base64,' + btoa(binary);
      this.ws.readyToGetFrameImg = true;
    },

    ProcessAudioData: function (_byte, _GZipMode) {
      this.ws.readyToGetFrameAud = false;

      var bytes = new Uint8Array(_byte);
      if (_GZipMode) {
        var gunzip = new Zlib.Gunzip(bytes);
        bytes = gunzip.decompress();
      }

      //read meta data
      this.ws.SourceSampleRate = this.ByteToInt32(bytes, 0);
      this.ws.SourceChannels = this.ByteToInt32(bytes, 4);

      //conver byte[] to float
      var BufferData = bytes.slice(8, bytes.length);
      var AudioInt16 = new Int16Array(BufferData.buffer);

      //=====================playback=====================
      if (AudioInt16.length > 0)
        this.StreamAudio(this.ws.SourceChannels, AudioInt16.length, this.ws.SourceSampleRate, AudioInt16);
      //=====================playback=====================

      this.ws.readyToGetFrameAud = true;
    },
    StreamAudio(NUM_CHANNELS, NUM_SAMPLES, SAMPLE_RATE, AUDIO_CHUNKS) {
      var audioBuffer = this.ws.audioCtx.createBuffer(NUM_CHANNELS, NUM_SAMPLES / NUM_CHANNELS, SAMPLE_RATE);
      for (var channel = 0; channel < NUM_CHANNELS; channel++) {
        // This gives us the actual ArrayBuffer that contains the data
        var nowBuffering = audioBuffer.getChannelData(channel);
        for (var i = 0; i < NUM_SAMPLES; i++) {
          var order = i * NUM_CHANNELS + channel;
          nowBuffering[i] = (0.8 / 32767.0) * AUDIO_CHUNKS[order];
        }
      }

      var source = this.ws.audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.ws.audioCtx.destination);
      source.start(0);
    },
    ByteToInt32: function (_byte, _offset) {
      return (
        (_byte[_offset] & 255) +
        ((_byte[_offset + 1] & 255) << 8) +
        ((_byte[_offset + 2] & 255) << 16) +
        ((_byte[_offset + 3] & 255) << 24)
      );
    },
    CombineInt8Array: function (a, b) {
      var c = new Int8Array(a.length + b.length);
      c.set(a);
      c.set(b, a.length);
      return c;
    },
    SwitchFullScreenMode() {
      this.fullScreenMode = !this.fullScreenMode;
    },
    StyleStreamingView() {
      return this.fullScreenMode ? 'streamingViewFull' : 'streamingView';
    },
    StopCase() {
      this.ws.srcImg = '';
      this.fullScreenMode = false;
      this.$emit('stop-cast');
    },

    CreateSound(fr, time, _type, vol) {
      let osc = this.ws.audioCtx.createOscillator();
      let gain = this.ws.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.ws.audioCtx.destination);
      osc.type = _type;
      osc.start();
      osc.frequency.value = fr;
      gain.gain.value = vol;
      setTimeout(() => {
        osc.frequency.value = 0;
        osc.stop();
      }, time);
    },
  },
};
</script>