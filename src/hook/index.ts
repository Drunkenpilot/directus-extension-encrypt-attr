import { defineHook } from "@directus/extensions-sdk";

import EA from "encrypted-attr";
export default defineHook(
  ({ filter, action, init }, { env, services, getSchema }) => {
    const totalEncryptionFields: { [key: string]: string[] } = {};
    const interfaceKeys = ["encrypted-input"];
    const encryptedKeys = env.EA_KEYS;
    const encryptedKeyId = env.EA_KEY_ID;
    const encryptedVerifyId = env.EA_VERIFY_ID;

    init("app.after", async () => {
      const { ItemsService } = services;
      try {
        const itemService = new ItemsService("directus_fields", {
          schema: await getSchema(),
        });

        const items = await itemService.readByQuery({
          filter: {
            interface: {
              _in: interfaceKeys,
            },
          },
        });

        for (const item of items) {
          if (!totalEncryptionFields[item.collection])
            totalEncryptionFields[item.collection] = [];

          totalEncryptionFields[item.collection]?.push(item.field);
        }
      } catch (err) {
        console.log(err);
      }
    });

    action("fields.create", async (meta) => {
      const { payload, collection } = meta;

      if (interfaceKeys.includes(payload.meta.interface)) {
        if (totalEncryptionFields[collection] !== null)
          totalEncryptionFields[collection]?.push(payload.field);
        if (!totalEncryptionFields[collection])
          totalEncryptionFields[collection] = [payload.field];
      }
    });
    action("fields.update", async (meta) => {
      const { payload, collection } = meta;

      if (
        totalEncryptionFields[collection]?.includes(payload.field) &&
        !interfaceKeys.includes(payload.meta.interface)
      ) {
        totalEncryptionFields[collection] =
          totalEncryptionFields[collection]?.filter(
            (key) => key !== payload.field
          ) ?? [];
      }

      if (
        interfaceKeys.includes(payload.meta.interface) &&
        !totalEncryptionFields[collection]?.includes(payload.field)
      ) {
        if (totalEncryptionFields[collection] !== null)
          totalEncryptionFields[collection]?.push(payload.field);
        if (!totalEncryptionFields[collection])
          totalEncryptionFields[collection] = [payload.field];
      }
    });

    action("fields.delete", async (meta) => {
      const { payload, collection } = meta;
      if (totalEncryptionFields[collection]?.includes(payload[0])) {
        totalEncryptionFields[collection] =
          totalEncryptionFields[collection]?.filter(
            (key) => key !== payload[0]
          ) ?? [];
      }
    });

    filter("items.update", async (payload: any, meta) => {
      const { collection } = meta;

      if (totalEncryptionFields[collection] != null)
        for (const field of (totalEncryptionFields as any)[collection])
          if (payload[field] != null && payload[field].length > 0)
            payload[field] = encrypt(
              payload[field],
              [field],
              encryptedKeys,
              encryptedKeyId,
              encryptedVerifyId
            );
    });

    action("items.read", async ({ payload, collection }) => {
      if (totalEncryptionFields[collection] != null)
        for (const field of (totalEncryptionFields as any)[collection])
          for (let i = 0; i < payload.length; i++) {
            const item = payload[i];
            if (item[field] != null && item[field].length > 0) {
              const data = decrypt(item[field], [field], encryptedKeys);
              payload[i][field] = data;
            }
          }
    });

    filter("items.create", async (payload: any, meta) => {
      const { collection } = meta;

      if (totalEncryptionFields[collection] != null)
        for (const field of (totalEncryptionFields as any)[collection])
          if (payload[field] != null && payload[field].length > 0)
            payload[field] = encrypt(
              payload[field],
              [field],
              encryptedKeys,
              encryptedKeyId,
              encryptedVerifyId
            );
    });

    function encrypt(
      text: string,
      attributes: string[],
      keys: Record<string, string>,
      keyId = "default",
      verifyId?: string
    ): Promise<string> {
      const encryptedAttributes = EA(attributes, {
        keys,
        keyId,
        verifyId,
      });

      const encryptedSecret = encryptedAttributes.encryptAttribute(
        undefined,
        JSON.stringify(text)
      );

      return encryptedSecret;
    }

    function decrypt(
      encryptedText: string,
      attributes: string[],
      keys: Record<string, string>
    ) {
      const decryptedButStillJsonEncoded = EA(attributes, {
        keys,
      }).decryptAttribute(undefined, encryptedText);
      return JSON.parse(decryptedButStillJsonEncoded);
    }
  }
);
