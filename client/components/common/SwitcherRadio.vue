<template>
    <div class="switch-radio"
         v-on:change="onSwitcherChange($event.target.value)"
    >
        <label
                class="switch-radio__item"
                v-for="item in inputs"
                :class="item.value === value ? 'switch-radio__item_active' : ''"
        >
            <input type="radio"
                   :value="item.value"
                   :name="radioName"
            >
            {{item.title}}
        </label>
    </div>
</template>

<script>
  export default {
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: String,
      inputs: {
        type: Array,
        required: true
      },
      radioName: {
        type: String,
        required: true
      }
    },
    methods: {
      onSwitcherChange(value) {
        this.$emit('change', value);
      }
    },
  };
</script>