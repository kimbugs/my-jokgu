"use client";

import { loginWithCreds } from "@/actions/auth";
import { useActionState } from "react";

export default function SignIn() {
  const [errorMessage, formAction, isPending] = useActionState(
    loginWithCreds,
    undefined
  );
  return (
    <div className="w-full flex mt-20 justify-center">
      <section className="flex flex-col w-[400px]">
        <h1 className="text-3xl w-full text-center font-bold mb-6">Sign in</h1>
        <div>
          <form action={formAction}>
            <label className="input input-bordered flex items-center gap-3">
              id
              <input
                className="grow"
                type="id"
                placeholder="id"
                id="id"
                name="id"
              />
            </label>
            <label className="input input-bordered flex items-center gap-3">
              Password
              <input
                className="grow"
                type="password"
                placeholder="Password"
                id="password"
                name="password"
              />
            </label>
            <div>
              <button
                disabled={isPending}
                type="submit"
                className="btn-neutral btn btn-block"
              >
                {isPending ? "Loading..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
