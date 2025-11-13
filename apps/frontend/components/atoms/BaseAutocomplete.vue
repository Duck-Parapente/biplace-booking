<template>
  <div class="relative">
    <label v-if="label" :for="id" class="block text-sm font-medium text-secondary-600 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        :value="modelValue"
        type="text"
        :required="required"
        :placeholder="placeholder"
        autocomplete="off"
        :disabled="disabled"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        class="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        v-if="modelValue && !disabled"
        type="button"
        @click="clearValue"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
        title="Effacer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    <div
      v-if="showDropdown && filteredOptions.length > 0"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto"
    >
      <button
        v-for="option in filteredOptions"
        :key="option.value"
        type="button"
        @mousedown.prevent="selectOption(option)"
        class="w-full text-left px-3 py-2 hover:bg-gray-100 transition"
      >
        <div class="font-medium">{{ option.label }}</div>
        <div v-if="option.description" class="text-xs text-gray-500">
          {{ option.description }}
        </div>
      </button>
    </div>
    <div
      v-if="showDropdown && modelValue && filteredOptions.length === 0"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg px-3 py-2 text-sm text-gray-500"
    >
      {{ noResultsText }}
    </div>
  </div>
</template>

<script setup lang="ts">
export interface AutocompleteOption {
  value: string;
  label: string;
  description?: string;
}

interface Props {
  id: string;
  modelValue: string;
  options: AutocompleteOption[];
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  noResultsText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  noResultsText: 'Aucun résultat trouvé',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  select: [value: string];
}>();

const showDropdown = ref(false);

const filteredOptions = computed(() => {
  if (!props.modelValue) {
    return props.options;
  }

  const search = props.modelValue.toLowerCase();
  return props.options.filter((option) => {
    const label = option.label.toLowerCase();
    const description = option.description?.toLowerCase() || '';
    return label.includes(search) || description.includes(search);
  });
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleFocus = () => {
  showDropdown.value = true;
};

const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

const selectOption = (option: AutocompleteOption) => {
  emit('update:modelValue', option.label);
  emit('select', option.value);
  showDropdown.value = false;
};

const clearValue = () => {
  emit('update:modelValue', '');
  emit('select', '');
};
</script>
