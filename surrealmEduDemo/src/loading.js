import Vue from 'vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'


Vue.use(Loading, {
    canCancel: false,
    color: '#000000',
    loader: 'spinner', //spinner/dots/bars
    width: 50,
    height: 50,
    backgroundColor: '#696969',
    isFullPage: true,
    opacity: 0.8
});


export default {}