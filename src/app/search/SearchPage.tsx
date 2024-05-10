"use client";

import { useSearchPublications } from "@lens-protocol/react-web";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ErrorPage from "~/components/ErrorPage";
import { Feed, FeedSuspense } from "~/components/Feed";
import { SearchBar } from "~/components/SearchBar";
import { lensItemToPost } from "~/components/post/Post";
import { Button } from "~/components/ui/button";

export function SearchPage() {
  const params = useSearchParams();
  const query = params.get("q");

  const { data, loading, error } = useSearchPublications({ query });

  if (error && query) return <ErrorPage title="Couldn't find anything" />;

  const posts = data?.map((item) => lensItemToPost(item)).filter((item) => item);
  const feed = loading ? <FeedSuspense /> : <Feed data={posts} />;

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
      {query && feed}
    </>
  );
}
