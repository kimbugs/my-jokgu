"use server";

import { signIn, signOut } from "@/auth";
import prisma from "@/lib/db";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: id,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

export const login = async (provider: string) => {
  await signIn(provider, { redirectTo: "/" });
  revalidatePath("/");
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
};

export async function loginWithCreds(
  prevStae: string | undefined,
  formData: FormData
) {
  const rawFormData = {
    id: formData.get("id"),
    password: formData.get("password"),
    redirectTo: "/",
  };

  const existingUser = await getUserById(formData.get("id") as string);

  try {
    await signIn("credentials", rawFormData);
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials!";
        default:
          return "Something went wrong!";
      }
    }

    throw error;
  }
  revalidatePath("/");
}
