"use client";

import { Form, FormControl, FormField, FormItem } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { textOnly } from "@lens-protocol/metadata";
import { LoaderIcon, SendHorizontalIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { type KeyboardEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import type { User } from "../user/User";
import { UserAvatar } from "../user/UserAvatar";
import type { Post } from "./Post";

export default function PostWizard({ user, replyingTo }: { user?: User; replyingTo?: Post }) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [isPosting, setPosting] = useState(false);
  const placeholderText = replyingTo ? "write your reply..." : "write a new post...";

  const pathname = usePathname().split("/");
  const community = pathname[1] === "c" ? pathname[2] : "global";

  const FormSchema = z.object({
    content: z.string().max(3000, {
      message: "Post must not be longer than 3000 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setPosting(true);

    const metadata = textOnly({
      content: data.content,
      tags: [community],
      appId: "ping",
    });

    const response = fetch(`/api/posts?${replyingTo ? `replyingTo=${replyingTo.id}&` : ""}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    }).then((res) => {
      if (res.ok) {
        toast.success("Post created successfully!");
        form.setValue("content", "");
        resetHeight();
      } else {
        toast.error(res.statusText);
      }

      setPosting(false);
    });
  }

  const resetHeight = () => {
    if (textarea.current) {
      textarea.current.style.height = "auto";
      textarea.current.style.height = "38px";
    }
  };

  const updateHeight = () => {
    if (textarea.current) {
      textarea.current.style.height = "auto";
      textarea.current.style.height = `${textarea.current.scrollHeight + 2}px`;
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey && event.key === "Enter") {
      onSubmit(form.getValues());
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={updateHeight}
          className="flex flex-row gap-2 w-full h-fit place-items-end justify-center"
        >
          {user && (
            <div className="w-10 h-10">
              <UserAvatar user={user} link={true} card={false} />
            </div>
          )}
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
                    className="min-h-8 resize-none px-2 py-2"
                    ref={textarea}
                    rows={1}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button disabled={isPosting} size="icon" type="submit" className="h-10 w-10">
            {isPosting ? <LoaderIcon /> : <SendHorizontalIcon />}
          </Button>
        </form>
      </Form>
    </div>
  );
}
