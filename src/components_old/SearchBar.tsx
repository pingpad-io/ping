import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

export const SearchBar = ({ defaultText }: { defaultText: string }) => {
  const router = useRouter();
  const formSchema = z.object({ input: z.string() });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: defaultText,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!values) return;
    router.push(`/search?q=${values.input}`).catch(console.error);
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
                  <Input type="text" placeholder="Search ping..." className="pl-12 pr-4 mt-0 border-0" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <SearchIcon className="align-top absolute top-0 bottom-0 m-auto text-gray-500 ml-3" />
        </form>
      </Form>
    </div>
  );
};
