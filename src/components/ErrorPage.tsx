import Link from "next/link";
import { PageLayout } from "./Layout";

const ErrorPage = ({ title }: { title: string }) => {
  return (
    <PageLayout>
      <div className="flex items-center justify-center">
        <div className="rounded-box my-auto flex h-max flex-col p-8">
          <h1 className="rounded-box card-title p-4 text-base-content">{title}</h1>

          <div className="card-actions justify-center p-4">
            <Link className="btn-ghost btn" href={"/"}>{`< Home`}</Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ErrorPage;
