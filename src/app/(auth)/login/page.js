import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");

  if (token && verifyToken(token.value)) {
    redirect("/board");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
