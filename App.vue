<template>
    <div id="app">
        <div id="navmenu">
            <template v-if="blogin==false">
                Access: {{navname}}
            </template>
            <template v-if="blogin">
                <!-- <a href="#" >Home</a> -->
                <a href="#" v-for="item in navmenus" v-on:click="setViewComponent(item.context)" :key="item.context"> {{item.name}} |</a>
                <DisplayNameComponent></DisplayNameComponent>
                <PublicKeyDisplayComponent></PublicKeyDisplayComponent>
            </template>
        </div>
        <div id="content">
            <template v-if="blogin">
                <!-- Hello -->
                <component :is="currentView" ></component>
            </template>
            <template v-else>
                <template v-if="bforgotpassphrase==false">
                    <LoginComponent></LoginComponent>
                </template>
                <template v-else>
                    <ForgotComponent></ForgotComponent>
                </template>
            </template>
        </div>
        <!--
        <ChatPanel></ChatPanel>
        -->
    </div>
</template>
<script>
import HomeLayoutComponent from './components/HomeLayoutComponent';
import AccountLayoutComponent from './components/AccountLayoutComponent';
import MessagesLayoutComponent from './components/MessagesLayoutComponent';
import PublicChatLayoutComponent from './components/PublicChatLayoutComponent';
import PrivateChatLayoutComponent from './components/PrivateChatLayoutComponent';
import SimpleChatComponent from './components/SimpleChatComponent';


import DisplayNameComponent from './components/DisplayNameComponent';
import PublicKeyDisplayComponent from './components/PublicKeyDisplayComponent';

import ChatPanel from './components/TestChatComponent';
import LoginComponent from './components/LoginComponent';
import ForgotComponent from './components/ForgotComponent';
import bus from './bus';
//<component :is="currentView" ></component>
export default {
    data() {
        return {
            navname:"Login",
            currentView:null,
            blogin:false,
            bforgotpassphrase:false,
            elappcontent:null,
            elcontent:null,
            navmenus:[],
        }
    },
    components:{
        LoginComponent,
        ForgotComponent,
        DisplayNameComponent,
        PublicKeyDisplayComponent,
        //ChatPanel,
    },
    created(){
        this.$on('action', this.action);

        //this.currentView = ChatPanel;
        //this.currentView = AccountLayoutComponent;
        this.currentView = HomeLayoutComponent;

        this.navmenus.push({name:"Home",context:"home",comp:HomeLayoutComponent});
        this.navmenus.push({name:"Account",context:"account",comp:AccountLayoutComponent});
        this.navmenus.push({name:"Messages",context:"messages",comp:MessagesLayoutComponent});
        this.navmenus.push({name:"Public Chat",context:"publicchat",comp:PublicChatLayoutComponent});
        this.navmenus.push({name:"Private Chat",context:"privatechat",comp:PrivateChatLayoutComponent});

        this.navmenus.push({name:"Simple Chat",context:"simplechat",comp:SimpleChatComponent});
    },
    mounted(){
        console.log("mount!");
        this.elappcontent = document.getElementById('app');
        this.elcontent = document.getElementById('content');
        window.addEventListener("resize", this.resize.bind(this));
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.resize.bind(this));
    },
    methods: {
        action:function(event){
            if(event == "loginpass"){
                this.blogin=true;
            }
            if(event == "accessforgot"){
                this.bforgotpassphrase=true;
                this.navname="Forgot";
            }
            if(event == "accesslogin"){
                this.bforgotpassphrase=false;
                this.navname="Login";
            }
        },
        setViewComponent:function(_view){
            //console.log(_view);
            let menus = this.navmenus;
            for (let i =0;i < menus.length;i++){
                if(menus[i].context == _view){
                    this.currentView = menus[i].comp;
                }
            }
        },
        btnforgot:function(){
            this.bforgotpassphrase=true;
        },
        resize:function(){
            //console.log(this.elappcontent);
            if(this.elappcontent == null) return;

            this.elcontent.style.height = (this.elappcontent.clientHeight - 2*24) + "px";
            this.elcontent.style.width = (this.elappcontent.clientWidth) + "px";
        },
    }
}
</script>
<style>
    #app{
        height: 100%;
        width: 100%;
    }
</style>