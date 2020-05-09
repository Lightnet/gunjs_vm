<template>
    <div id="accountlayout">
        <div id="accountmenu">
            <a href="#" v-for="item in navmenus" v-on:click="setViewComponent(item.context)" :key="item.context"> {{item.name}} |</a>
        </div>
        <div id="accountcontent">
            <component :is="currentView" ></component>
        </div>        
    </div>
</template>
<script>
import ProfileComponent from './ProfileComponent';
import ChangePassphraseComponent from './ChangePassphraseComponent';
import HintPassphraseComponent from './HintPassphraseComponent';
import ContactsLayoutComponent from './ContactsLayoutComponent';
//import ProfileComponent from './ProfileComponent';

export default {
    data() {
        return {
            ellayout:null,
            elcontent:null,
            navmenus:[],
            currentView:null,
        }
    },
    mounted(){
        console.log("mount!");
        this.currentView = ProfileComponent;
        this.ellayout = document.getElementById('accountlayout');
        this.elcontent = document.getElementById('accountcontent');

        this.navmenus.push({name:"Profile",context:"profile",comp:ProfileComponent});
        this.navmenus.push({name:"Contacts",context:"contacts",comp:ContactsLayoutComponent});
        this.navmenus.push({name:"Hint Passphrase",context:"hintpassphrase",comp:HintPassphraseComponent});
        this.navmenus.push({name:"Change Passphrase",context:"changepassphrase",comp:ChangePassphraseComponent});
        
        window.addEventListener("resize", this.resize.bind(this));
    },
    beforeDestroy() {
        this.ellayout=null;
        this.elcontent=null;
        window.removeEventListener("resize", this.resize.bind(this));
    },
    methods:{
        resize:function(){
            //console.log(this.elappcontent);
            if(this.ellayout == null) return;
            let parent = this.ellayout.parentNode;

            this.ellayout.style.height = (parent.clientHeight) + "px";
            this.ellayout.style.width = (parent.clientWidth) + "px";

            this.elcontent.style.height = (parent.clientHeight - 24) + "px";
            this.elcontent.style.width = (parent.clientWidth) + "px";
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

    }
}
</script>
<style>
    #accountmenu{
        height:24px;
        width:100%;
    }
</style>