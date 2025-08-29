"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser } from "@/actions/auth";

export default function Signup() {
  const [state, action, pending] = useActionState(createUser, null);
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Register for an account</CardTitle>
        <CardDescription>Enter a username and password</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Rex Ample"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
          <Button type="submit" className="w-full cursor-pointer mt-4">
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
