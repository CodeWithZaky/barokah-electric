import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { string, z } from "zod";

const registerType = z.object({
  username: string().min(3, "Username must be at least 3 characters"),
  email: string().email("Invalid email address"),
  password: string().min(8, "Password must be at least 8 characters"),
  confirmPassword: string(),
});

function Register() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const mutation = api.user.register.useMutation();
  const router = useRouter();

  const registerBTN = async () => {
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const validatedData = registerType.parse({
        username,
        email,
        password,
        confirmPassword,
      });

      mutation.mutate(
        {
          name: validatedData.username,
          email: validatedData.email,
          password: validatedData.password,
        },
        {
          onSuccess: () => {
            console.log("Registration successful!");
            router.push("/");
          },
          onError: (error) => {
            alert(`Registration failed: ${error.message}`);
          },
        },
      );
    } catch (err) {
      console.error(err);
      alert("Please check your input and try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card className="flex w-1/2 flex-col items-center justify-center gap-5 p-10">
        <p className="text-2xl font-bold tracking-wider">Register</p>
        <div className="flex w-full flex-col gap-3">
          <Label>Username</Label>
          <Input
            name="username"
            placeholder="username..."
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex w-full flex-col gap-3">
          <Label>Email</Label>
          <Input
            name="email"
            placeholder="email..."
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex w-full flex-col gap-3">
          <Label>Password</Label>
          <Input
            name="password"
            type="password"
            placeholder="password..."
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex w-full flex-col gap-3">
          <Label>Confirm password</Label>
          <Input
            name="confirm-password"
            type="password"
            placeholder="confirm password..."
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button onClick={registerBTN}>Register</Button>
      </Card>
    </div>
  );
}

export default Register;
