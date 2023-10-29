import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Card } from "./ui/card";

export default function ThreadWizard({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
  const ctx = api.useContext();
  const { mutate, isLoading } = api.threads.create.useMutation({
    onSuccess: async () => {
      await ctx.threads.invalidate();
      setOpen(false);
    },
    onError: (e) => {
      let error = "Something went wrong";
      switch (e.data?.code) {
        case "UNAUTHORIZED":
          error = "You must be logged in to post";
          break;
        case "FORBIDDEN":
          error = "You are not allowed to create threads";
          break;
        case "TOO_MANY_REQUESTS":
          error = "Slow down! You are too fast";
          break;
        case "BAD_REQUEST":
          error = "Invalid request";
          break;
      }
      toast.error(error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate({ title: values.title });
  };

  const formSchema = z.object({
    title: z.string().min(2).max(50),
    isPrivate: z.boolean().default(false), // TODO: implement private threads
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Global" disabled={isLoading} type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem>
              <Card className="flex flex-row items-center justify-between p-3">
                <div className="space-y-0.5">
                  <FormLabel>Private</FormLabel>
                  <FormDescription>Make thread invite-only</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    // disabled={isLoading}
                    disabled
                    aria-readonly
                  />
                </FormControl>
              </Card>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
