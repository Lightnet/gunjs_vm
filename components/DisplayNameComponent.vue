<template>
    <label>
        Alias: {{username}}
    </label>
</template>
<script>

export default {
    data() {
        return {
            username:"",
        }
    },
    mounted:function(){
        let user = this.$gun.user();
        //console.log(user);
        this.username = user.is.alias;
    }
}
</script>