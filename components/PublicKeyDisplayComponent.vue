<template>
    <label>
        Public Key: <input :id="idpublickey" v-model="publickey" readonly/><button v-on:click="btncopy">Copy</button>
    </label>
</template>
<script>

import { generateId } from '../generateid';

export default {
    data() {
        return {
            publickey:"",
            idpublickey:generateId(10),
        }
    },
    mounted:function(){
        let user = this.$gun.user();
        //console.log(user);
        this.publickey=user.is.pub;
    },
    methods:{
        btncopy:function(){
            document.getElementById(this.idpublickey).select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log(msg);
            } catch (err) {
                console.log(err);
            }
        }
    }
}
</script>