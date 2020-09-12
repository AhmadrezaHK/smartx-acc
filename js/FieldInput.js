Vue.component("s-input", {
    props: {
        label: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        required: {
            type: Boolean,
            default: false,
        },
        error: {
            type: String,
            default: "",
        },
    },
    data: () => ({
        labelTop: false,
    }),
    template: `
        <div :class="{'s-input': true, 'label-top': labelTop}">
            <label @click="$refs.input.focus()">{{label}}<span v-if="required" class="text-danger"> *</span></label>
            <input @focus="labelTop=true" @blur="!value && (labelTop=false)" :value="value" @input="(e)=>onInput(e)" ref="input">
            <div v-if="error" class="text-danger">{{error}}</div>
        </div>
    `,
    watch: {
        value: {
            handler: function (val) {
                if (val) {
                    this.labelTop = true;
                }
            },
            immediate: true,
        },
    },
    methods: {
        onInput(e) {
            this.$emit("input", e.target.value);
        },
    },
});
