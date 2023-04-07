import Link from "next/link";
import { PageLayout } from "./Layout";

const ErrorPage = ({ title }: { title: string }) => {
  return (
    <PageLayout>
      <div className="flex h-full items-center justify-center">
        <div className="my-auto flex flex-col h-max rounded-xl p-8">

          <h1 className="card-title text-base-content p-4 rounded-xl">{title}</h1>

          <div className="card-actions justify-center p-4">
            <Link className="btn btn-ghost" href={"/"}>{`< Home`}</Link>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default ErrorPage;
