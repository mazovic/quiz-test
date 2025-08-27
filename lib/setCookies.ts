"use server";

import { cookies } from "next/headers";

export async function setTokenCookies(token: string) {
  (await cookies()).set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}
