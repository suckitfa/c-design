<template>
    <div>
        <label v-if="label" :class="{'c-form-item-label-required':isRequired}">{{label}}</label>
        <div>
            <slot></slot>
            <div v-if="validateState === 'error'" class="c-form-item-message">{{ validateMessage }}</div>
        </div>
    </div>
</template>
<script>
import Emitter from '../../mixins/emitter';
import AsyncValidator from 'async-validator';
export default {
    name:"cFormItem",
    mixins:[Emitter],
    mounted() {
        // 组件渲时，讲实例缓存在Form中
        if(this.prop) {
            this.dispatch('cForm','on-form-item-add',this)
            this.setRules()
        }
    },
    beforeDestroy() {
        this.dispatch('cForm','on-form-item-remove',this)
    },
    props:{
        label: {
            type:String,
            default:''
        },
        prop:{
            type:String
        }
    },
    methods:{
        setRules() {
            let rules = this.getRules();
            if(rules.length) {
                rules.every(rule=>{
                    // 标记必填项
                    this.isRequired = rule.required;
                })
            }
            this.$on('on-form-blur',this.onFieldBlur)
            this.$on('on-form-change',this.onFieldChange)
        },
        getRules() {
            let formRules = this.form.rules;
            formRules = formRules ? formRules[this.prop]:[]
            return [].concat(formRules||[])
        },
        // 只支持blur和change
        getFilterRules(trigger) {
            const rules = this.getRules();
            return rules.filter(rule=> !rule.trigger || rule.trigger.indexOf(trigger) !==-1);
        },
        validate(trigger,callback = function(){}){
            let rules = this.getFilterRules(trigger)
            if(!rules || rules.length === 0) {
                return true;
            }

            this.validateState = 'validating'
            let descriptor = {};
            descriptor[this.prop] = rules;
            const validator = new AsyncValidator(descriptor);
            let model = {};
            model[this.prop] = this.fieldValue;
            validator.validate(model,{firstFields:true},errors=>{
                this.validateState = !errors ? 'success':'error';
                this.validateMessage = errors ? errors[0].message:''
                // 将报错信息弹出
                callback(this.validateMessage)
            })
        },
        onFieldBlur() {
            this.validate('blur');
        },
        onFieldChange() {
            this.validate('change')
        },
        resetField() {
            this.validateState = ''
            this.validateMessage = ''
            this.form.model[this.prop] = this.initialValue;
        }
    },
    inject:['form'],
    data() {
        return {
            isRequired:false,
            validateState:'', // 校验状态
            validateMessage:"" // 校验不通过信息
        }
    },
    computed:{
        // 从Form中model动态获取当前表单组件数据
        fieldValue() {
            return this.form.model[this.prop]
        }
    }
}
</script>
<style>
  .c-form-item-label-required:before {
    content: '*';
    color: red;
  }
  .c-form-item-message {
    color: red;
  }
</style>