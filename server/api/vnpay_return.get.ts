import qs from "qs";
import crypto from "crypto";
import { db } from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as Record<string, any>;

  const secureHash = query["vnp_SecureHash"] as string | undefined;
  if (!secureHash) {
    return createError({ statusCode: 400, statusMessage: "Missing vnp_SecureHash" });
  }

  const tmp = { ...query };
  delete tmp.vnp_SecureHash;
  delete tmp.vnp_SecureHashType;

  const config = useRuntimeConfig();
  const secretKey = (config.private.NUXT_VNP_HASHSECRET || "").trim();
  if (!secretKey) return createError({ statusCode: 500, statusMessage: "Missing secret" });

  const signData = makeSignData(tmp);

  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  console.log("VNPAY return raw query:", query);
  console.log("VNPAY return signData:", signData);
  console.log("VNPAY return computed signed:", signed);
  console.log("VNPAY return secureHash from VNPAY:", secureHash);

  if (secureHash === signed) {


    const responseCode = tmp.vnp_ResponseCode || null;
    const id_order = (tmp?.vnp_OrderInfo as string).split(":")

    await db.order.updateMany({
      where: {
        id: id_order[1]
      },
      data: {
        order_id: tmp.vnp_TxnRef,
        response_code: tmp.vnp_ResponseCode,
        payment_method: tmp.vnp_CardType
      }
    })
    return { success: true, code: responseCode, params: tmp };
  } else {
    return { success: false, code: "97", message: "Invalid signature" };
  }
});

function makeSignData(params: Record<string, any>) {
  const tmp: Record<string, any> = { ...params };
  delete tmp.vnp_SecureHash;
  delete tmp.vnp_SecureHashType;

  const keys = Object.keys(tmp).sort();
  const parts = keys.map((k) => {
    const v = tmp[k] === undefined || tmp[k] === null ? "" : String(tmp[k]);
    const encoded = encodeURIComponent(v).replace(/%20/g, "+");
    return `${k}=${encoded}`;
  });
  return parts.join("&");
}