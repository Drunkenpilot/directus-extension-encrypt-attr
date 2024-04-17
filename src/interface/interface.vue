<template>
  <VInput
    :model-value="value"
    placeholder="encrypted input"
    :type="hidden ? 'password' : 'text'"
    @change="handleChange(($event.target as HTMLInputElement).value)"
    :suffix="hidden ? 'masked' : 'visible'"
  />

  <VButton
    style="margin-top: 5px"
    @click="onTypeChange()"
    :xSmall="true"
    :outlined="true"
    :danger="hidden"
  >
    <VIcon
      :name="hidden ? 'visibility_off' : 'visibility'"
      style="margin-right: 5px"
    />
    {{ hidden ? "Show Data" : "Hide Data" }}
  </VButton>
</template>

<script lang="ts" setup>
import { ref } from "vue";
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

function onTypeChange() {
  hidden.value = !hidden.value;
}
</script>
