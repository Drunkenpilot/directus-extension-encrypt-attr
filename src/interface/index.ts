import { defineInterface } from "@directus/extensions-sdk";
import InterfaceComponent from "./interface.vue";

export default defineInterface({
  id: "encrypted-input",
  name: "Encryption Input",
  icon: "lock",
  description: "This is an input for data encryption ",
  component: InterfaceComponent,
  options: null,
  group: "standard",
  types: ["string"],
  recommendedDisplays: ["encrypted-string"],
});
