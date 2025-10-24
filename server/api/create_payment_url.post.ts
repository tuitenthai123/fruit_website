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
  const orderId = moment(date).format("YYYYMMDDHHmmssSSS");

  const ipAddr =
    getHeader(event, "x-forwarded-for") ||
    getHeader(event, "x-real-ip") ||
    (event.node.req.socket && event.node.req.socket.remoteAddress) ||
    "";

  const rawAmount = Number(body?.amount);
  if (!rawAmount || isNaN(rawAmount) || rawAmount <= 0) {
    return createError({ statusCode: 400, statusMessage: "Invalid amount" });
  }
  const amount = Math.round(rawAmount);
  const vnp_Amount = amount * 100;

  const bankCode = body?.bankCode || "";
  const locale = body?.language || "vn";

  const vnpParams: Record<string, any> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan cho khach hang ${body?.name} voi ma GD:${body?.id}`,
    vnp_OrderType: "other",
    vnp_Amount: String(vnp_Amount),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) vnpParams.vnp_BankCode = bankCode;

  const signData = makeSignData(vnpParams);
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // attach secure hash
  vnpParams.vnp_SecureHash = signed;

  const qsObj: Record<string, any> = {};
  Object.keys(vnpParams).sort().forEach((k) => {
    qsObj[k] = encodeURIComponent(String(vnpParams[k])).replace(/%20/g, "+");
  });
  const fullUrl = vnpUrl + "?" + qs.stringify(qsObj, { encode: false });

  // console.log("VNPAY create signData:", signData);
  // console.log("VNPAY create signed:", signed);
  // console.log("VNPAY paymentUrl:", fullUrl);

  return { success: true, paymentUrl: fullUrl, orderId };
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