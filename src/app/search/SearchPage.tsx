"use client";

import { useSearchPublications } from "@lens-protocol/react-web";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ErrorPage from "~/components/ErrorPage";
import { Feed } from "~/components/Feed";
import { lensItemToPost } from "~/components/post/Post";
import { SuspenseView } from "~/components/post/SuspenseView";
import { Button } from "~/components/ui/button";
import { SearchBar } from "../../components/SearchBar";

export default function SearchPage() {
  const params = useSearchParams();
  const query = params.get("q");

  const { data, loading, error } = useSearchPublications({ query });
  const suspense = [...Array(12)].map((_v, idx) => <SuspenseView key={`suspense-${idx}`} />);

  if (loading) return suspense;
  if (error) return <ErrorPage title="Couldn't find anything" />;

  const posts = data.map((item) => lensItemToPost(item)).filter((item) => item);

  return (
    <>
      <div className="h-16 flex flex-row gap-2 items-center justify-center sticky top-0 z-10 border-b">
        <Link href={"/"}>
          <Button variant="outline" className="">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <SearchBar defaultText={query} />
      </div>
      <Feed data={posts} />
    </>
  );
}
