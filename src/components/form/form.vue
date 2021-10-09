<template>
    <form >
        <slot></slot>
    </form>
</template>
<script>
export default {
    data() {
        return {
            fields:[]
        }
    },
    name:"cForm",
    props:{
        model:{
            type:Object
        },
        rules: {
            type:Object
        }
    },
    created(){
        this.$on('on-form-item-add',(field)=>{
            if(field) {
                this.fields.push(field)
            }
        })
        this.$on('on-form-item-remove',(field)=>{
            if(field.prop) {
                this.fields.splice(this.fields.indexOf(field),1);
            }
        })
    },
    provide(){
        return {
            form:this
        }
    },
    methods:{
        resetFields() {
            this.fields.forEach(field=>{
                field.resetField();
            })
        },
        validate(callback) {
            
        }
    }
}
</script>