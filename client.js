import Vue from 'vue';
Vue.config.productionTip = false;
import VueGun from 'vue-gun';
import Gun from 'gun/gun';//browser
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
import TestChatComponent from './components/TestChatComponent';

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

Vue.use(VueGun, {
    gun: gun // your gun instance
});

new Vue({
    el: '#app', 
    components:{
        TestChatComponent
    },
    data: {
        message: 'Hello from Webpack'
    },
    render: h => h(TestChatComponent)
});
console.log("Init App...");