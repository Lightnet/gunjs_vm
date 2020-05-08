import Vue from 'vue';

//Vue.component('hello-component', require('./components/HelloComponent').default);
/*
new Vue({
    el: '#app', 
    data: {
        message: 'Hello from Webpack'
    }
});
*/

import HelloComponent from './components/HelloComponent';

new Vue({
    el: '#app', 
    components:{
        HelloComponent
    },
    data: {
        message: 'Hello from Webpack'
    },
    render: h => h(HelloComponent)
});

console.log("init app...");