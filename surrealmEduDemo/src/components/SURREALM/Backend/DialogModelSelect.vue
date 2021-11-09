<template>
  <div class="pnlDialogFull" v-show="show">
    <div class="pnlDialogGray" @click.self="CloseDialog">
      <div class="pnlDialogModels">
        <div class="AnswerItem" v-for="model in option" :key="model.Serial">
          <img :src="model.PhotoUrl" />
          <label >{{ model.Name }}</label>
          <button @click="SelectItem(model.Serial)"></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DialogModelSelect',
  props: {
    show: Boolean,
    index: Number,
    option: Array,
  },
  data() {
    return {};
  },
  methods: {
    CloseDialog() {
      this.$emit('close-dialog');
    },
    SelectItem(Serial) {
      let data = { QuestionNum: this.index, Answer: Serial };
      this.$emit('add-answer', data);
    },
  },
};
</script>
