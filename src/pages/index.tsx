import Feed from "~/components/Feed";
import { api } from "~/utils/api";
import { GetStaticProps } from "next";
import { getSSGHelper } from "~/utils/getSSGHelper";
import { raleway } from "~/styles/fonts";
import Link from "next/link";
import { AtSign } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

const HomePage = () => {
  const posts = api.posts.get.useQuery({ take: 3 });

  return (
    <div className="w-full h-full">
      <div className={`flex flex-col mx-auto max-w-5xl min-w-0 ${raleway.className}`}>
        {/* <div className="-z-1 absolute inset-0 w-screen h-screen">
        <Image src={grid} alt="background image" fill={true} />
      </div> */}
        <Card className="p-4 text-4xl ">
          <Link className="flex flex-row gap-4 items-center " href="/">
            <AtSign className="sm:ml-2" size={30} />
            <div className="hidden sm:flex">ping</div>
          </Link>
        </Card>
        <div className="grid lg:grid-cols-2 items-center justify-center p-20">
          <div>boop</div>
          <div
            className=" duration-300 hover:-skew-x-3 hover:scale-105"
          >
            <Feed {...posts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const ssg = getSSGHelper();

  await ssg.posts.get.prefetch({ take: 3 });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 1,
  };
};

export default HomePage;
