<template>
  <div :class="MultiselectClass">
    <label class="select-txt" @click="OptionSwitch()">{{ SelectText }}</label>
    <img
      src="@/components/SURREALM/SuperAdmin/Multiselect/img/icon_arrow.png"
      @click="OptionSwitch()"
      class="select-img"
    />
    <div class="option-area">
      <div class="option-item" v-for="i in ListOption" :key="i[Value]" @click="SelectClick(i)">
        <span :class="OptionSelectClass(i.Selected)">{{ i[Text] }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import '@/components/SURREALM/SuperAdmin/Multiselect/Multiselect.scss';

export default {
  name: 'Multiselect',
  props: {
    List: Array,
    Multi: Boolean,
    Hint: String,
    Text: String,
    Value: String,
  },
  data() {
    return {
      ShowList: false,
      ListOption: [],
      ShowText: '',
    };
  },
  watch: {
    ShowList(bool) {
      if (bool) {
        this.ListOption = this.List;
      }
    },
  },
  computed: {
    MultiselectClass() {
      return this.ShowList ? 'multiselect-area-show' : 'multiselect-area-close';
    },
    SelectNum() {
      return this.ListOption.filter((x) => x.Selected == true).length;
    },
    SelectText() {
      return this.SelectNum == 0 ? this.Hint : `已選擇 ${this.SelectNum} 個選項`;
    },
  },
  mounted() {
    this.ListOption = this.List;
  },
  methods: {
    ShowTxt(name, index) {
      //console.log('ShowTxt:' + this.ListOption[index][name]);
      return this.ListOption[index][name];
    },
    SelectClick(Item) {
      let IndexOf = this.ListOption.findIndex((option) => option[this.Value] == Item[this.Value]);
      if (IndexOf >= 0) {
        if (!this.Multi) {
          for (let i = 0; i < this.ListOption.length; i++) {
            let data = this.DeepCopy(this.ListOption[i]);
            data.Selected = false;
            this.ListOption.splice(i, 1, data);
          }
        }
        let data = this.DeepCopy(Item);
        data.Selected = !data.Selected;
        this.ListOption.splice(IndexOf, 1, data);
      }
    },
    OptionSwitch() {
      this.ShowList = !this.ShowList;
    },
    OptionSelectClass(Selected) {
      return Selected ? 'option-txt-select' : 'option-txt-unselect';
    },
  },
  components: {},
};
</script>