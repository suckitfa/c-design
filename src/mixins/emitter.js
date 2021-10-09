function broadcast(componetName,eventName,params) {
    this.$children.forEach(child=>{
        const name = child.$options.name;
        if(name === componetName) {
            child.$emit.apply(child,[eventName].concat(params))
        } else {
            broadcast.apply(child,[componetName,eventName].concat([params]))
        }
    })
}
export default {
    methods: {
        dispatch(componentName, eventName, params) {
            let parent = this.$parent || this.$root;
            let name = parent.$options.name;

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options.name;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        },
        broadcast(componentName, eventName, params) {
            broadcast.call(this, componentName, eventName, params);
        }
    }
};