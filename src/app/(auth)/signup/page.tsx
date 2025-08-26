"use client";

import { useActionState } from "react";
import { createUser } from "@/actions/auth";

export default function Signup() {
  const [state, action, pending] = useActionState(createUser, null);
  return (
    <div>
      <div>
        <p>Signup</p>
        <form action={action}>
          <label>Username</label> <br />
          <input type="text" id="username" name="username" />
          <br />
          <label>Password</label>
          <br />
          <input type="password" id="password" name="password" />
          <br />
          <button>Register</button>
        </form>
      </div>
    </div>
  );
}
