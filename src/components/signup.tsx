"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser, type AuthFormState } from "@/actions/auth";
import { useActionState } from "react";

export default function Signup() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    createUser,
    null
  );

  return (
    <Card className="w-full max-w-sm">
      <div className="flex flex-col items-center justify-center">
        <CardTitle className="text-3xl">Sign Up</CardTitle>
        <CardDescription>Get started by creating an account.</CardDescription>
      </div>
      <CardContent>
        <form action={action} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              name="username"
              placeholder="your display name"
              required
              autoComplete="username"
              defaultValue={state?.values?.username ?? ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              defaultValue={state?.values?.email ?? ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              defaultValue=""
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              defaultValue=""
            />
          </div>
          {state?.error && (
            <p className="text-sm text-red-600" role="alert">
              {state.error}
            </p>
          )}
          <Button
            type="submit"
            className="bg-[#212121] hover:bg-[#303030] w-full cursor-pointer mt-2"
            disabled={pending}
          >
            {pending ? "Registering..." : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
