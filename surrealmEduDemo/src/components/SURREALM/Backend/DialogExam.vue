<template>
  <div class="pnlDialogFull" v-show="show" style="">
    <div class="pnlDialogGray">
      <div class="pnlDialogExam">
        <div class="pnlTitle">
          <label>{{ $t('SURREALM.Exam.Title') }}</label>
          <img class="btnDialogXX" src="@/assets/img/SURREALM/Backend/btn_close.png" @click="CloseDialog" />
        </div>
        <div class="pnlContent scrollBar">
          <div class="pnlScrollArea" ref="Scroll">
            <div class="ExamItem">
              <label class="lblTItle">{{ $t('SURREALM.Exam.Time') }}</label>
              <select v-model="ExamInfo.Time" class="ExamTime">
                <option v-for="option in TimeOption" :key="option.Value" :value="option.Value">
                  {{ option.Text }}
                </option>
              </select>
            </div>
            <div class="ExamItem">
              <label class="lblTItle">{{ $t('SURREALM.Exam.TotalTime') }}</label>
              <div class="TotalTime">{{ `${TotalTime} ${$t('SURREALM.Exam.Second')}` }}</div>
            </div>
            <div style="clear: both"></div>
            <div class="mainTitle">{{ $t('SURREALM.Exam.Select') }}</div>
            <div class="QuestionItem" v-for="(item, index) in ExamInfo.QuestionList" :key="index">
              <div class="ExamNum">{{ index + 1 }}</div>
              <div class="ExamContent">
                <div class="QuestionType">
                  <input type="radio" :id="`S${index}`" value="S" v-model="item.Type" @click="CheckSingleType(item)" />
                  <label :for="`S${index}`"><span></span>{{ $t('SURREALM.Exam.SingleSelect') }}</label>
                  <input type="radio" :id="`M${index}`" value="M" v-model="item.Type" />
                  <label :for="`M${index}`"><span></span>{{ $t('SURREALM.Exam.MultiSelect') }}</label>
                </div>
                <hr class="HrSplit" />
                <textarea
                  v-model.trim="item.Title"
                  class="QuestionTitle"
                  :placeholder="$t('SURREALM.Exam.Placeholder.Title')"
                ></textarea>
                <hr class="HrSplit" />
                <div class="SelectedAnswer" v-for="(ans, index) in item.Answer" :key="index">
                  <img class="ModelImage" :src="GetModelImg(ans)" />
                  <label class="ModelName">{{ GetModelName(ans) }}</label>
                  <button class="DelAnswer" @click="DelAnswer(item, index)">
                    {{ $t('SURREALM.Exam.DelAnswer') }}
                  </button>
                </div>
                <button class="SelectAnswer" @click="ShowSelectAnswerDialog(index)" v-show="SelectAnswerItem(item)">
                  {{ $t('SURREALM.Exam.SelectAnswer') }}
                </button>
              </div>
              <div class="ExamTools">
                <button class="BtnDel" @click="DelQuestion(index)"></button>
                <button class="BtnCopy" @click="CopyQuestion(index)"></button>
                <button class="BtnPhoto" @click="UploadPhoto(index)"></button>
              </div>
            </div>
          </div>
          <button class="ExamAddQustion" @click="AddQuestion">{{ $t('SURREALM.Exam.AddExam') }}</button>
          <button class="ScrollTop" @click="ScrollTop">↑</button>
          <div class="toolArea">
            <button class="btnNoBg" @click="CloseDialog">
              {{ $t('SURREALM.AccountInfo.BtnCancel') }}
            </button>
            <button class="btnNoBg" @click="InsertExam">
              {{ $t('SURREALM.AccountInfo.BtnSave') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <DialogModelSelect
      :show="DialogModels.Show"
      :index="DialogModels.Index"
      :option="DialogModels.Option"
      @close-dialog="CloseSelectAnswerDialog"
      @add-answer="AddAnswer"
    ></DialogModelSelect>
  </div>
</template>
<script>
import DialogModelSelect from '@/components/SURREALM/Backend/DialogModelSelect.vue';
import { apiGetModelsByType, apiInsertExam, apiGetExam } from '@/request.js';

export default {
  name: 'DialogExam',
  props: {
    show: Boolean,
    serial: Number,
    type: String,
  },
  data() {
    return {
      DialogModels: {
        Show: false,
        Index: null,
        Option: null,
      },
      TimeOption: [
        { Text: '30秒', Value: 30 },
        { Text: '60秒', Value: 60 },
        { Text: '90秒', Value: 90 },
        { Text: '120秒', Value: 120 },
        { Text: '150秒', Value: 150 },
        { Text: '180秒', Value: 180 },
        { Text: '210秒', Value: 210 },
        { Text: '240秒', Value: 240 },
        { Text: '270秒', Value: 270 },
        { Text: '300秒', Value: 300 },
      ],
      ModelOption: null,
      ExamInfo: {
        Serial: null,
        Time: 30,
        QuestionList: [],
      },
      tmpSerial: 0,
    };
  },
  watch: {
    show(bool) {
      if (bool) {
        this.GetModels();
        this.GetExamInfo();
      }
    },
  },
  computed: {
    TotalTime() {
      return this.ExamInfo.Time * this.ExamInfo.QuestionList.length;
    },
  },
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    CheckQuestion(QuestionList) {
      for (let i = 0; i < QuestionList.length; i++) {
        if (QuestionList[i].Title.trim() == '') {
          return this.$t('SURREALM.Exam.Err.TitleEmpty', { Num: i + 1 });
        }
        if (QuestionList[i].Type == 'M') {
          if (QuestionList[i].Answer.length < 2) {
            return this.$t('SURREALM.Exam.Err.AnswerErr', { Num: i + 1 });
          }
        } else {
          if (QuestionList[i].Answer.length < 1) {
            return this.$t('SURREALM.Exam.Err.AnswerEmpty', { Num: i + 1 });
          }
        }
      }
      return '';
    },
    InsertExam() {
      let chkMsg = this.CheckQuestion(this.ExamInfo.QuestionList);
      if (chkMsg == '') {
        apiInsertExam(this.serial, this.ExamInfo).then((res) => {
          if (res.data.Status == 'ok') {
            this.$toasted.show(this.$t('SURREALM.Exam.ExamDone'), {
              icon: 'check',
              position: 'bottom-center',
              duration: 3500,
            });
          } else {
            this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
              icon: 'warning',
              position: 'bottom-center',
              duration: 3500,
            });
          }
        });
      } else {
        this.$toasted.show(chkMsg, {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      }
    },
    GetExamInfo() {
      apiGetExam(this.serial).then((res) => {
        if (res.data.Status == 'ok') {
          if (res.data.ExamInfo.Time == 0) {
            this.ExamInfo = {
              Time: 30,
              QuestionList: [{ Type: 'S', Title: '', Answer: [] }],
            };
          } else {
            this.ExamInfo = res.data.ExamInfo;
          }
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    GetModels() {
      apiGetModelsByType(this.type).then((res) => {
        if (res.data.Status == 'ok') {
          this.ModelOption = res.data.ModelInfo;
        } else {
          this.$toasted.show(this.$t('SURREALM.ApiErr') + res.data.Code, {
            icon: 'warning',
            position: 'bottom-center',
            duration: 3500,
          });
        }
      });
    },
    CheckSingleType(Item) {
      if (Item.Answer.length > 1) {
        Item.Answer.splice(1, Item.Answer.length - 1);
      }
    },
    DelQuestion(Index) {
      this.ExamInfo.QuestionList.splice(Index, 1);
    },
    CopyQuestion(Index) {
      let tmpQuestion = this.DeepCopy(this.ExamInfo.QuestionList[Index]);
      this.ExamInfo.QuestionList.push(tmpQuestion);
    },
    UploadPhoto(Index) {
      console.log(`UploadPhoto: ${Index} `);
    },
    async AddQuestion() {
      let tmpQuestion = { Type: 'S', Title: '', Answer: [] };
      this.ExamInfo.QuestionList.push(tmpQuestion);

      let dom = this.$refs.Scroll;
      await this.Sleep(100);
      dom.scrollTop = dom.scrollHeight - dom.clientHeight;
    },
    Sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
    ScrollTop() {
      let dom = this.$refs.Scroll;
      dom.scrollTop = 0;
    },
    SelectAnswerItem(Item) {
      if (Item.Type == 'S') {
        if (Item.Answer.length < 1) {
          return true;
        } else {
          return false;
        }
      } else {
        if (Item.Answer.length < 3) {
          return true;
        } else {
          return false;
        }
      }
    },
    ShowSelectAnswerDialog(Index) {
      this.DialogModels.Index = Index;
      this.DialogModels.Option = this.ModelOption;
      this.DialogModels.Show = true;
    },
    CloseSelectAnswerDialog() {
      this.DialogModels.Index = null;
      this.DialogModels.Option = null;
      this.DialogModels.Show = false;
    },
    DelAnswer(Question, Index) {
      Question.Answer.splice(Index, 1);
    },
    AddAnswer(data) {
      let IndexOf = this.ExamInfo.QuestionList[data.QuestionNum].Answer.find((el) => el == data.Answer);
      if (Number.isInteger(IndexOf)) {
        this.$toasted.show(this.$t('SURREALM.Exam.Err.AnswerRepeat'), {
          icon: 'warning',
          position: 'bottom-center',
          duration: 3500,
        });
      } else {
        this.ExamInfo.QuestionList[data.QuestionNum].Answer.push(data.Answer);
        this.CloseSelectAnswerDialog();
      }
    },
    GetModelImg(AnswerSerial) {
      return this.ModelOption == null ? '' : this.ModelOption.find((obj) => obj.Serial == AnswerSerial).PhotoUrl;
    },
    GetModelName(AnswerSerial) {
      return this.ModelOption == null ? '' : this.ModelOption.find((obj) => obj.Serial == AnswerSerial).Name;
    },
  },
  components: {
    DialogModelSelect,
  },
};
</script>