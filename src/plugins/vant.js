import Vue from 'vue'
import { Tabbar, TabbarItem } from 'vant';
import { Form } from 'vant';
import { Field } from 'vant';
import { Button } from 'vant';
import { Toast } from 'vant';
import { Picker } from 'vant';
import { Overlay } from 'vant';
import { List } from 'vant';
import { Icon } from 'vant';
import { PullRefresh } from 'vant';
import { Search } from 'vant';
import { Tag } from 'vant';
import { Image } from 'vant';
import { Dialog } from 'vant';
import { Loading } from 'vant';
import { Uploader } from 'vant';

Vue.use(Uploader);
Vue.use(Loading);
Vue.use(Dialog);
Vue.use(Image);
Vue.use(Tag);
Vue.use(Search);
Vue.use(PullRefresh);
Vue.use(Icon);
Vue.use(List);
Vue.use(Overlay);
Vue.use(Picker);
Vue.use(Toast);
Vue.use(Button);
Vue.use(Field);
Vue.use(Form);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.prototype.$toast.$loading = function(message){
  Vue.prototype.$toast.loading({
    message,
    forbidClick: true,
    duration: 0
  })
}

