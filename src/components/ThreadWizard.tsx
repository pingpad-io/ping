import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
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
import { SearchBar } from "./SearchBar";
import { SearchIcon } from "lucide-react";
import { debounce } from "~/utils";
import { useMutation } from "@tanstack/react-query";
import { ProfileEntry } from "./ProfileEntry";
import { quicksand } from "~/styles/fonts";
import { Profile } from "@prisma/client";
import { Avatar } from "./ui/avatar";
import { UserAvatar } from "./UserAvatar";

export default function ThreadWizard({
  setOpen,
  defaultPublic = true,
}: { setOpen: Dispatch<SetStateAction<boolean>>; defaultPublic?: boolean }) {
  const ctx = api.useUtils();
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

  const [searchValue, setSearchValue] = useState("");
  const { data: searchResult, isLoading: isSearching } = api.profiles.search.useQuery({ query: searchValue });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const ids = values.users.map((user) => user.id);
    mutate({ title: values.title, public: values.public, users: ids });
  };

  const formSchema = z.object({
    title: z.string().min(2).max(50),
    public: z.boolean().default(true),
    users: z.array(z.custom<Profile>()),
    usersSearchInput: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      public: defaultPublic,
      users: [],
      usersSearchInput: "",
    },
  });

  const addProfile = (profile: Profile) => {
    form.setValue("users", [...form.getValues("users"), profile]);
    form.setValue("usersSearchInput", "");
    setSearchValue("");
  };

  const profileAvatarsList = form.watch("users").map((profile) => {
    if (!profile) return;
    return (
      <div className="w-8 h-8">
        <UserAvatar userId={profile.id} key={`avatar ${profile.id}`} />
      </div>
    );
  });

  const profileSearchList = searchResult?.map((profile) => {
    if (!profile) return;
    return (
      <Button
        variant="ghost"
        size="default"
        className="w-full p-1 "
        key={profile.id}
        onClick={() => addProfile(profile)}
      >
        <ProfileEntry key={`entry ${profile.id}`} profile={profile} />
      </Button>
    );
  });

  const searchUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
  };
  const debouncedSearchUsers = debounce(searchUsers, 300);

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          name="public"
          render={({ field }) => (
            <FormItem>
              <Card className="flex flex-row items-center justify-between p-3">
                <div className="space-y-0.5">
                  <FormLabel>Public</FormLabel>
                  <FormDescription>Anyone can join this thread</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} aria-readonly />
                </FormControl>
              </Card>
            </FormItem>
          )}
        />
        {!form.getValues().public && (
          <FormField
            control={form.control}
            name="public"
            render={({ field }) => (
              <Card className="flex flex-col p-3 gap-4">
                <div className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Search</FormLabel>
                    <FormDescription>Add members</FormDescription>
                  </div>
                  <FormItem className="relative w-max grow ml-3">
                    <FormField
                      control={form.control}
                      name="usersSearchInput"
                      render={({ field }) => (
                        <>
                          <SearchIcon className="align-top absolute top-0 bottom-0 m-auto text-gray-500 mt-4  ml-3" />
                          <FormControl onChange={debouncedSearchUsers}>
                            <Input type="text" placeholder="Search users..." className="pl-12 pr-4 mt-0" {...field} />
                          </FormControl>
                        </>
                      )}
                    />
                    {searchResult?.length !== 0 && (
                      <Card
                        className={`absolute p-2 w-full flex flex-col  overflow-scroll max-h-72 gap-2 ${quicksand.className}`}
                      >
                        {profileSearchList}
                      </Card>
                    )}
                  </FormItem>
                </div>
                {profileAvatarsList.length > 0 && (
                  <Card className="flex flex-row items-center -space-x-4 p-2">{profileAvatarsList}</Card>
                )}
              </Card>
            )}
          />
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
