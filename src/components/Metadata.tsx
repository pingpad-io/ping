import { Post } from "~/server/api/routers/posts";

const Metadata = ({ metadata }: { metadata: Post["metadata"] }) => {
  if (!metadata) {
    return <></>;
  }

  return (
    <span
      className="max-w-md min-w-0 w-fit
				rounded-lg border text-card-foreground shadow-sm select-none truncate line-clamp-1 
				bg-accent mt-2 sm:mt-4 p-2 sm:p-4 flex flex-col gap-2 "
    >
      {metadata.publisher && (
        <span>
          <a href={metadata.url} className="select-none truncate font-light">
            {metadata.publisher}
          </a>
        </span>
      )}
      <a href={metadata.url} className="truncate hover:underline font-bold">
        {metadata.title}
      </a>
      {metadata.image && (
        <a href={metadata.url}>
          <img className="rounded-lg m-0 mt-2" src={metadata.image} alt={`${metadata.title} preview`} />
        </a>
      )}
    </span>
  );
};

export default Metadata;
