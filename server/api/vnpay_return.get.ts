import qs from "qs";
import crypto from "crypto";

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as Record<string, any>;

  // copy and remove securehash fields
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

  // build signData in same way
  const signData = makeSignData(tmp);

  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // Debug
  console.log("VNPAY return raw query:", query);
  console.log("VNPAY return signData:", signData);
  console.log("VNPAY return computed signed:", signed);
  console.log("VNPAY return secureHash from VNPAY:", secureHash);

  if (secureHash === signed) {
    // success -> update order status in DB here using vnp_TxnRef
    const responseCode = tmp.vnp_ResponseCode || null;
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