import moment from "moment";
import crypto from "crypto";
import qs from "qs";

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as Record<string, any>;
  const config = useRuntimeConfig();
  const tmnCode = config.private.NUXT_VNP_TMNCODE;
  const secretKey = (config.private.NUXT_VNP_HASHSECRET || "").trim();
  let vnpUrl = config.private.NUXT_VNP_URL as string;
  const returnUrl = config.private.NUXT_VNP_RETURNURL as string;

  if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
    return createError({ statusCode: 500, statusMessage: "Missing VNPAY config" });
  }

  process.env.TZ = "Asia/Ho_Chi_Minh";
  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");
  const orderId = moment(date).format("YYYYMMDDHHmmssSSS"); // unique

  const ipAddr =
    getHeader(event, "x-forwarded-for") ||
    getHeader(event, "x-real-ip") ||
    (event.node.req.socket && event.node.req.socket.remoteAddress) ||
    "";

  // validate amount
  const rawAmount = Number(body?.amount);
  if (!rawAmount || isNaN(rawAmount) || rawAmount <= 0) {
    return createError({ statusCode: 400, statusMessage: "Invalid amount" });
  }
  const amount = Math.round(rawAmount); // assume client sends 100000 for VND
  const vnp_Amount = amount * 100; // VNPAY expects amount*100

  const bankCode = body?.bankCode || "";
  const locale = body?.language || "vn";

  const vnpParams: Record<string, any> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan cho ma GD:${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: String(vnp_Amount),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) vnpParams.vnp_BankCode = bankCode;

  // build signData using helper
  const signData = makeSignData(vnpParams);
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // attach secure hash
  vnpParams.vnp_SecureHash = signed;

  // Build final query string: we must encode values as VNPAY expects
  // reuse the same encoding logic used in makeSignData (so keep consistent)
  const qsObj: Record<string, any> = {};
  Object.keys(vnpParams).sort().forEach((k) => {
    qsObj[k] = encodeURIComponent(String(vnpParams[k])).replace(/%20/g, "+");
  });
  const fullUrl = vnpUrl + "?" + qs.stringify(qsObj, { encode: false });

  // Debug (temporary)
  console.log("VNPAY create signData:", signData);
  console.log("VNPAY create signed:", signed);
  console.log("VNPAY paymentUrl:", fullUrl);

  // return paymentUrl for frontend to redirect
  return { success: true, paymentUrl: fullUrl, orderId };
});

function makeSignData(params: Record<string, any>) {
  // remove secure hash keys if present
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