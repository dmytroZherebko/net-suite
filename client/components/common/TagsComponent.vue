<template>
    <div class="input tags-wrapper">
        <div v-for="(tag, index) in tagsList"
             :key="index"
             class="tags__tag"
        >
            <div class="tags__name">
                {{ tag[valueField] || tag }}
            </div>
            <div class="tags__remove"
                 @click="removeTagItem(index)"
            ></div>
        </div>
        <input v-if="tagsList.length < maxItems"
               type="text"
               autocomplete="off"
               class="input tags__input"
               :class="{'tags__input_invalid': hasError}"
               maxlength="70"
               @blur="addNewTagItem"
               @keyup.enter="addNewTagItem"
               @input="resetTagInputError"
               :placeholder="placeholder"
        >
    </div>
</template>

<script>
  export default {
    props: {
      tagsList: {
        type: Array,
        required: true
      },
      placeholder: {
        type: String,
        required: true
      },
      maxItems: {
        type: Number,
        required: true
      },
      hasError: {
        type: Boolean,
        required: true
      },
      valueField: String
    },
    methods: {
      addNewTagItem(e) {
        if (this.tagsList.length < 5) {
          this.$emit('add-tag-item', e.target.value);
          this.$nextTick(() => {
            if (!this.hasError) {
              e.target.value = '';
            }
          });
        }
      },
      removeTagItem(index) {
        this.$emit('remove-tag-item', index);
      },
      resetTagInputError() {
        this.$emit('reset-tag-input-error');
      }
    },
  };
</script>