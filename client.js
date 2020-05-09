/*
    Information: Web Client.
*/
import "@babel/polyfill";

import Vue from 'vue';
//https://vuejs.org/v2/api/
Vue.config.productionTip = false;
//Vue.config.silent = true;
Vue.config.devtools = false;

import Gun from 'gun/gun'; //browser
import 'gun/sea';
//import VueGun from 'vue-gun';
//Vue.component('hello-component', require('./components/HelloComponent').default);
/*
new Vue({
    el: '#app', 
    data: {
        message: 'Hello from Webpack'
    }
});
*/
//import HelloComponent from './components/HelloComponent';
//import TestChatComponent from './components/TestChatComponent';
import App from './App.vue';

var gun;
if(location.origin == 'http://localhost:3000'){
    gun = Gun({
        peers:['http://localhost:8080' + '/gun'],
        secure: false, //not added?
    });
    console.log('local gun.js');
}else{
    gun = Gun(location.origin + '/gun');
    console.log('host gun.js');
}
gun.on('hi', peer => {//peer connect
    console.log('peer connect!');
    //displayeffectmessage('Connect to peer!');
});
gun.on('bye', (peer)=>{// peer disconnect
    console.log('Disconnected from peer!');
});
Vue.prototype.$gun = gun;
//Vue.use(VueGun, {
    //gun: gun // your gun instance
//});
/*
Vue.use(VueGun, {
    peers: ['http://localhost:8080/gun']
});
*/
//console.log(Vue);

function init(){
    
    new Vue({
        el: '#app', 
        components:{
            App
        },
        data: {
            //message: 'Hello from Webpack'
        },
        render: h => h(App),
        mounted:function(){
            /*
            this.$gun.on('hi', peer => {//peer connect
                console.log('peer connect!');
                //displayeffectmessage('Connect to peer!');
            });
            this.$gun.on('bye', (peer)=>{// peer disconnect
                console.log('Disconnected from peer!');
            });
            */
        },
    });
    console.log("Init App...");
}
window.addEventListener("load",init);
//console.log("Init App...");
