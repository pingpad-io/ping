/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import type { User } from "./post/Post";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
export default function ProfileSettings({ user }: { user: User }) {
  const isLoading = true;

  function onSubmit(_values: User) {
    // const updates = {
    //   id: user.id,
    //   username: values.username,
    //   full_name: values.full_name,
    //   description: values.description,
    //   avatar_url: values.avatar_url,
    //   updated_at: new Date(),
    // };
  }

  const formSchema = z.object({
    username: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(20, {
        message: "Username must be shorter than 20 characters.",
      }),
    name: z
      .string()
      .min(2, {
        message: "Name must be at least 2 characters.",
      })
      .max(32),
    description: z.string().max(160, {
      message: "Description must be shorter than 160 characters",
    }),
  });

  const form = useForm<User>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      description: user.description,
      profilePictureUrl: user.profilePictureUrl,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <Button>Update</Button>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              disabled={isLoading}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} value={field.value ?? undefined} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={true}
              name="handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Handle</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} value={field.value ?? undefined} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={isLoading}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Bio" {...field} value={field.value ?? undefined} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
