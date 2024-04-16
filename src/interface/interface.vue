<template>
  <VInput
    :model-value="value"
    placeholder="encrypted input"
    :type="hidden ? 'password' : 'text'"
    @change="handleChange(($event.target as HTMLInputElement).value)"
    :suffix="hidden ? 'masked' : 'visible'"
  />
  <VCheckbox
    :model-value="hidden"
    @update:modelValue="hidden = $event"
    @click="onTypeChange"
  >
    {{ hidden ? "Show data" : "Hide data" }}
  </VCheckbox>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
const props = defineProps({
  value: {
    type: String,
    default: null,
  },
  collection: {
    type: String,
    default: null,
  },
  field: {
    type: String,
    default: null,
  },
  primaryKey: {
    type: String,
    default: null,
  },
});

const hidden = ref(true);

const emit = defineEmits<{ input: [value: string] }>();
function handleChange(value: string): void {
  emit("input", value);
}

function onTypeChange(value: any) {
  // console.log(hidden.value);
}
</script>
