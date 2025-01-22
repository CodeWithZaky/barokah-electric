import { ShippingMethod } from "@prisma/client";

export const shippingCosts = {
  [ShippingMethod.JNE]: 15000,
  [ShippingMethod.JNT]: 14000,
  [ShippingMethod.SICEPAT]: 16000,
  [ShippingMethod.POS_INDONESIA]: 18000,
  [ShippingMethod.TIKI]: 17000,
};
