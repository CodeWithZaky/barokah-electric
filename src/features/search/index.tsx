import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/router";
import { LuSearch } from "react-icons/lu";

const FormSchema = z.object({
  searchProduct: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function Search() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      searchProduct: "",
    },
  });

  const router = useRouter();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    router.push(`/search?query=${data.searchProduct}`);
  }

  return (
    <div className="mr-10 flex items-center justify-between gap-1">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex justify-center gap-1"
        >
          <FormField
            control={form.control}
            name="searchProduct"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="cari produk"
                    className="w-[500px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Link href={`/search?query=${form.watch("searchProduct")}`}>
        <Button className="hover:cursor-pointer">
          <LuSearch className="text-lg" />
        </Button>
      </Link>
    </div>
  );
}
