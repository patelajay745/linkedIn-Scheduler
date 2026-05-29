"use client";
import { Button } from "@/components/retroui/Button";

const LoginPage = () => {
  const loginClick = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/linkedin`;
  };
  return (
    <div className="h-screen bg-gray-800 flex justify-center items-center">
      <Button onClick={loginClick}>Login</Button>
    </div>
  );
};

export default LoginPage;
