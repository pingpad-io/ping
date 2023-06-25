import { api } from "~/utils/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { FiSearch } from "react-icons/fi";
import { MenuItem } from "~/components/MenuItem";
import { PageLayout } from "~/components/Layout";
import Feed from "~/components/Feed";
import ErrorPage from "~/components/ErrorPage";
import Link from "next/link";

export default function SearchPage() {
  const router = useRouter();
  const { q: query } = router.query;

  if (!query || typeof query !== "string")
    return (
      <PageLayout>
        <ErrorPage title="Not found" />
      </PageLayout>
    );

  const posts = api.posts.find.useQuery(query, {
    onError: (e) => {
      let error = "Something went wrong";
      switch (e.data?.code) {
        case "TOO_MANY_REQUESTS":
          error = "Slow down! You are posting too fast";
          break;
        case "BAD_REQUEST":
          error = "Invalid request";
          break;
        case "PAYLOAD_TOO_LARGE":
          error = "Your message is too big";
          break;
      }
      toast.error(error);
    },
  });

  return (
    <PageLayout>
      <div className="flex flex-col justify-center  px-2 py-4 ">
        <div className="flex w-full justify-center p-4 text-2xl font-bold">Search Results</div>
        <Feed {...posts} />
        <Link className="btn-ghost btn" href={"/"}>{`< Home`}</Link>
      </div>
    </PageLayout>
  );
}

export const SearchBar = () => {
  const [input, setInput] = useState("");
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${input}`).catch(console.error);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <>
      <div className="hidden w-full xl:flex">
        <form className="flex w-full flex-row gap-4" onSubmit={onSubmit}>
          <input
            type="text"
            className="input-bordered input input-md w-full"
            placeholder={"Search Twotter..."}
            value={input}
            onChange={onChange}
          />
        </form>
      </div>

      <div className="xl:hidden">
        <MenuItem href="/search" icon={<FiSearch size={24} />} />
      </div>
    </>
  );
};
