"use client";

import { useSearchPublications } from "@lens-protocol/react-web";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FeedSuspense } from "~/components/FeedSuspense";
import { SearchBar } from "~/components/menu/Search";
import { lensItemToPost } from "~/components/post/Post";
import { Button } from "~/components/ui/button";
import { PostView } from "./post/PostView";

export function Search() {
  const params = useSearchParams();
  const query = params.get("q");

  const { data, loading, error } = useSearchPublications({ query });

  if (error && query) throw new Error(error.message);
  if (loading) return <FeedSuspense />;

  const posts = data?.map(lensItemToPost).map((post) => <PostView key={post.id} item={post} />);

  return (
    <>
      <div className="h-16 flex flex-row gap-2 items-center justify-center sticky top-0 z-10 border-b backdrop-blur-md">
        <Link href={"/"}>
          <Button variant="outline" size="sm">
            <ChevronLeft size={15} />
          </Button>
        </Link>
        <SearchBar defaultText={query} />
      </div>
      {query && posts}
    </>
  );
}
