"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser } from "@/actions/auth";
import { useActionState } from "react";

export default function Signup() {
  const [state, action] = useActionState(createUser, null);
  return (
    <Card className="w-full max-w-sm">
      <div className="flex flex-col items-center justify-center">
        <CardTitle className="text-3xl">Sign Up</CardTitle>
        <CardDescription>Get started by creating an account.</CardDescription>
      </div>
      <CardContent>
        <form action={action}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                name="username"
                placeholder="Rex Ample"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
          </div>
          <Button
            type="submit"
            className="bg-[#212121] hover:bg-[#303030] w-full cursor-pointer mt-4"
          >
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
