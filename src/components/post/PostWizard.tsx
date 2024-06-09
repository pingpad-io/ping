"use client";

import { Form, FormControl, FormField, FormItem } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type KeyboardEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Textarea } from "../ui/textarea";
import { UserAvatar } from "../user/UserAvatar";
import type { User } from "../user/User";
import type { Post } from "./Post";

export default function PostWizard({ user, replyingTo }: { user: User; replyingTo?: Post }) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const placeholderText = replyingTo ? "write a reply..." : "write a new post...";

  if (!user) throw new Error("∑(O_O;) Profile not found");

  const FormSchema = z.object({
    content: z.string().max(3000, {
      message: "Post must not be longer than 3000 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success(data.content);
    // createPost({
    //   content: data.content,
    //   threadName: thread,
    //   repliedToId: replyingTo,
    // });
  }

  const updateHeight = () => {
    if (textarea.current) {
      textarea.current.style.height = "auto";
      textarea.current.style.height = `${textarea.current.scrollHeight + 2}px`;
    }
  };

  const onChange = () => {
    updateHeight();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey && event.key === "Enter") {
      onSubmit(form.getValues());
    }
  };
  const isPosting = false;

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={onChange}
          className="flex flex-row gap-2 w-full h-fit place-items-end"
        >
          <UserAvatar user={user} link={true} card={false} />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="grow">
                <FormControl>
                  <Textarea
                    {...field}
                    onKeyDown={onKeyDown}
                    placeholder={placeholderText}
                    disabled={isPosting}
                    className="min-h-12 resize-none px-2 py-3"
                    ref={textarea}
                    rows={1}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* <Button disabled={isPosting} size="icon" type="submit">
            {isPosting ? <LoaderIcon /> : <SendHorizontalIcon />}
          </Button> */}
        </form>
      </Form>
    </div>
  );
}
