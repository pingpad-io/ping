"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "~/components/Link";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "../ui/button";

export const SearchButton = () => {
  const pathname = usePathname();

  if (pathname !== "/search") {
    return (
      <Link href={"/search"} className="lg:hidden">
        <Button variant="ghost" size="sm_icon">
          <div className="hidden sm:flex -mt-1">search</div>
          <SearchIcon className="sm:ml-2" size={20} />
        </Button>
      </Link>
    );
  }
};

export const SearchBar = ({ defaultText = "" }: { defaultText: string }) => {
  const formSchema = z.object({ input: z.string() });
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/search" && defaultText === "") {
    return;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: defaultText,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!values) return;
    router.push(`/search?q=${values.input}`);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Search..." className="pl-8 pr-4 mt-0 h-10" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <SearchIcon size={16} className="align-top absolute top-0 bottom-0 m-auto text-secondary-foreground ml-2" />
        </form>
      </Form>
    </div>
  );
};
