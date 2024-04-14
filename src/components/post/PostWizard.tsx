"use client";

import { Form, FormControl, FormField, FormItem } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile, SessionType, useSession } from "@lens-protocol/react-web";
import { MenuIcon, } from "lucide-react";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { UserAvatar } from "~/components/UserAvatar";
import { Textarea } from "../ui/textarea";
import { lensProfileToUser } from "./Post";

export default function PostWizard({ replyingTo }: { replyingTo?: string }) {
  const { data: session, error, loading } = useSession();
  const _router = useRouter();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const placeholderText = replyingTo ? "write a reply..." : "write a new post...";

  // const { mutate: createPost, isLoading: isPosting } = api.posts.create.useMutation({
  //   onSettled: (_e) => {
  //     updateHeight();
  //   },
  //   onSuccess: async () => {
  //     form.setValue("content", "");
  //     // await ctx.posts.invalidate();
  //   },
  //   onError: (e) => {
  //     let error = "Something went wrong";
  //     switch (e.data?.code) {
  //       case "UNAUTHORIZED":
  //         error = "You must be logged in to post";
  //         break;
  //       case "FORBIDDEN":
  //         error = "You are not allowed to post";
  //         break;
  //       case "TOO_MANY_REQUESTS":
  //         error = "Slow down! You are posting too fast";
  //         break;
  //       case "BAD_REQUEST":
  //         error = "Invalid request";
  //         break;
  //       case "PAYLOAD_TOO_LARGE":
  //         error = "Your message is too big";
  //         break;
  //     }
  //     toast.error(error);
  //   },
  // });

  const FormSchema = z.object({
    content: z.string().max(3000, {
      message: "Post must not be longer than 3000 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(_data: z.infer<typeof FormSchema>) {
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

  if (!session || !(session.type === SessionType.WithProfile)) return null;

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={onChange}
          className="flex flex-row gap-2 w-full h-fit place-items-end"
        >
          <AvatarMenu profile={session.profile} />
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
                    disabled={loading}
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

export const AvatarMenu = ({ profile }: { profile: Profile }) => {
  if (!profile)
    return (
      <div className="w-10 h-10 shrink-0 grow-0">
        <MenuIcon />
      </div>
    );
  return (
    <div className="w-10 h-10 shrink-0 grow-0">
      <UserAvatar user={lensProfileToUser(profile)} />
    </div>
  );
};
