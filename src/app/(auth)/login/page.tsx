"use client";

import { useActionState } from "react";
import { authenticate } from "@/actions/auth";

export default function Login() {
  const [state, action, pending] = useActionState(authenticate, null);
  return (
    <div>
      <div>
        <p>Login</p>
        <form action={action}>
          <label>Username</label> <br />
          <input type="text" id="username" name="username" />
          <br />
          <label>Password</label>
          <br />
          <input type="password" id="password" name="password" />
          <br />
          <button>Login</button>
        </form>
      </div>
    </div>
  );
}
