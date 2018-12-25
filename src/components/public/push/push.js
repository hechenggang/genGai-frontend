import PushComponent from './push.vue'

let Push = {};

Push.install = function(Vue){
    // 将组建转换为Vue构造器
    let Constuctor = Vue.extend(PushComponent);

    // 得到一个push.vue文件的实例
    let push = new Constuctor();

    // 将push.vue文件的实例转化为html
    push.$mount(document.createElement('div'));

    // 注入当前页面
    document.body.appendChild(push.$el);

    // 暴露全局调用方法 
    Vue.prototype.$push_message = ({text = '', duration = 1500}) => {
        push.text = text;
        push.show = true;

        setTimeout(() => {
            push.show = false;
        }, duration);
    }
}
export default Push;