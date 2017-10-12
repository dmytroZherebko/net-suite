<template>
    <div class="form-section">
        <div class="form-section__title">
            {{ title }}
        </div>
        <div class="form-section__info">
            <slot name="form-control"></slot>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      }
    }
  };
</script>