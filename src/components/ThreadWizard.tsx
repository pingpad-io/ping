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
    mutate({ title: values.title, public: values.public });
  };

  const formSchema = z.object({
    title: z.string().min(2).max(50),
    public: z.boolean().default(true),
    users: z.array(z.string().uuid()),
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

  const searchUsers = (event: any) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  const addProfile = (user_id: string) => {
    form.setValue("users", [...form.getValues("users"), user_id]);
    setSearchValue("");
  }


  const profilesSearchList = searchResult?.map((profile) => {
    if (!profile) return;
    return (
      <Button variant="ghost" size="default" className="w-full p-1 " key={profile.id} onClick={() => addProfile(profile.id)}>
        <ProfileEntry key={`entry ${profile.id}`} profile={profile} />
      </Button>
    );
  });

  const debouncedOnChange = debounce(searchUsers, 300);

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
              <Card className="flex flex-row items-center justify-between p-3">
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
                        <FormControl onChange={debouncedOnChange}>
                          <Input type="text" placeholder="Search users..." className="pl-12 pr-4 mt-0" {...field} />
                        </FormControl>
                      </>
                    )}
                  />
                  {searchResult?.length !== 0 && (
                  <Card
                    className={`absolute p-2 w-full flex flex-col  overflow-scroll max-h-72 gap-2 ${quicksand.className}`}
                  >
                    {profilesSearchList}
                  </Card>
                  )}
                </FormItem>
              </Card>
            )}
          />
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
