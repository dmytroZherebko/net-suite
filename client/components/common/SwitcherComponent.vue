<template>
    <label class="switch" :class="{'checked': checked}">
        <input type="checkbox"
               @change="onSwitcherChange($event.target.checked)"
               :checked="checked">
        <div class="slider"></div>
    </label>
</template>

<script>
  export default {
    model: {
      prop: 'checked',
      event: 'change'
    },
    props: {
      checked: Boolean
    },
    methods: {
      onSwitcherChange(value) {
        this.$emit('change', !!value);
      }
    },
  };
</script>