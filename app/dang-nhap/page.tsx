"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", { username, password, redirect: false });
    if (result?.error) {
      setError("Sai tài khoản hoặc mật khẩu.");
      return;
    }
    router.push("/giao-vien/dashboard");
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="w-full rounded-3xl border border-chem-border bg-white p-6 shadow-card">
        <h1 className="text-2xl font-bold text-chem-primary">Đăng nhập hệ thống</h1>
        <p className="mt-2 text-sm text-chem-muted">Dành cho admin và giáo viên.</p>

        <div className="mt-5 space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tên đăng nhập"
            className="w-full rounded-xl border border-chem-border p-3"
          />
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full rounded-xl border border-chem-border p-3"
          />
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button className="w-full rounded-xl bg-chem-primary p-3 font-semibold text-white">Đăng nhập</button>
        </div>
      </form>
    </main>
  );
}
