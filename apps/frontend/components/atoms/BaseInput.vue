<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-secondary-600 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue ?? ''"
      :required="required"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      @input="handleInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      class="appearance-none w-full min-w-0 max-w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  modelValue?: string | number;
  label?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'date';
  required?: boolean;
  placeholder?: string;
  autocomplete?: string;
  disabled?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  autocomplete: 'off',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number | undefined];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (props.type === 'number') {
    const value = target.value === '' ? undefined : Number(target.value);
    emit('update:modelValue', value);
  } else {
    emit('update:modelValue', target.value);
  }
};
</script>
