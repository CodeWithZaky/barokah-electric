// import Loading from "@/components/loading";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import { signIn, useSession } from "next-auth/react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { FcGoogle } from "react-icons/fc";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const router = useRouter();
//   const { status } = useSession();
//   const { toast } = useToast();

//   if (status === "loading") return <Loading />;
//   if (status === "authenticated") router.push("/");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);
//     try {
//       await signIn("credentials", {
//         redirect: false,
//         email,
//         password,
//       });
//       setIsLoading(false);
//       toast({
//         title: "Success",
//         description: "Login Berhasil.",
//       });
//       router.push("/");
//     } catch (error) {
//       setError("Login gagal. Periksa kembali email dan password Anda.");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle>Login</CardTitle>
//           <CardDescription>Masuk ke akun Anda</CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="nama@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             {error && <p className="text-red-500 text-sm">{error}</p>}
//           </CardContent>
//           <CardFooter>
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? "Loading..." : "Login"}
//             </Button>
//           </CardFooter>
//         </form>
//         <CardFooter className="flex flex-col gap-3">
//           <Button onClick={() => signIn("google")} className="w-full">
//             Login With Google <FcGoogle className="ml-2" size={20} />
//           </Button>
//           <span className="text-muted-foreground text-sm">
//             Don't have an account?{" "}
//             <Link href="/register" className="text-foreground underline">
//               Register
//             </Link>
//           </span>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(1, { message: "Password tidak boleh kosong" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { status } = useSession();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (status === "loading") return <Loading />;

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("Login gagal. Periksa kembali email dan password Anda.");
      } else {
        toast({
          title: "Login berhasil",
          description: "Anda telah berhasil masuk ke akun Anda.",
        });
        router.push("/");
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Masuk ke akun Anda</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="nama@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password Anda"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full">
                {loading ? "Loading..." : "Masuk"}
              </Button>
              <Button onClick={() => signIn("google")} className="w-full">
                Login With Google <FcGoogle className="ml-2" size={20} />
              </Button>
              <span className="text-sm text-muted-foreground">
                {"Belum punya akun? "}
                <Link href="/register" className="text-foreground underline">
                  Daftar
                </Link>
              </span>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
