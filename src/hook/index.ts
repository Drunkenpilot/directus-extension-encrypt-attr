import { defineHook } from "@directus/extensions-sdk";

export default defineHook(
  ({ filter, action }, { env, services, getSchema }) => {
    const totalEncryptionFields: { [key: string]: string[] } = {};

    if (typeof env.DE_ENCRYPTION === "string") {
      const [collection, field] = env.DE_ENCRYPTION.split(".");
      if (collection && field) totalEncryptionFields[collection] = [field];
    }

    if (Array.isArray(env.DE_ENCRYPTION)) {
      for (const item of env.DE_ENCRYPTION) {
        const [collection, field] = item.split(".");
        if (collection && field) totalEncryptionFields[collection]?.push(field);
      }
    }

    filter("items.update", async (payload: any, meta, context) => {
      const { collection } = meta;
      const { FieldsService } = services;
      const fieldsService = new FieldsService("directus_fields", {
        schema: context.schema,
        accountability: context.accountability,
      });

      const data = await fieldsService.readAll(collection);
      console.log(data);

      console.log(meta);
      console.log(payload);

      console.log(context.schema?.collections.directus_fields);

      if (totalEncryptionFields[collection] != null)
        console.log(totalEncryptionFields[collection]);

      //    for (const field of (totalEncryptionFields as any)[collection])
      //      if (payload[field] != null && payload[field].length > 0)
      //        payload[field] = encrypt(payload[field], env.DE_KEY);
    });

    filter("items.read", async (payload: any, meta, context) => {
      const { collection } = meta;
      console.log(collection);

      const { FieldsService } = services;

      try {
        const fieldsService = new FieldsService("directus_fields", {
          schema: await getSchema(),
          accountability: context.accountability,
        });
        console.log(fieldsService.itemsService.where(""));
      } catch (err) {
        console.log(err);
      }
      // const fieldsService = new FieldsService("directus_fields", {
      //   schema: await getSchema(),
      //   accountability: context.accountability,
      // });

      // const data = await fieldsService.readAll(collection);
      // console.log(data);

      //    for (const field of (totalEncryptionFields as any)[collection])
      //      if (payload[field] != null && payload[field].length > 0)
      //        payload[field] = encrypt(payload[field], env.DE_KEY);
    });

    filter("items.create", () => {
      console.log("Creating Item!");
    });

    action("items.create", () => {
      console.log("Item created!");
    });
  }
);
