import cookie from "cookie";

export default defineEventHandler(async (event) => {
  setHeader(event, "Set-Cookie", cookie.serialize("token", "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0
  }));

  return { message: "Đã đăng xuất" };
});
