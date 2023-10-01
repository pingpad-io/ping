/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";
import { PageLayout } from "~/components/Layout";

const AboutPage = () => {
	return (
		<>
			<Head>
				<title>About</title>
			</Head>

			<PageLayout>
				<div className="flex h-screen w-full flex-col items-center gap-8 p-20 text-center font-mono">
					<div className="flex flex-col items-center text-2xl">
						<h1 className="font-bold">About Ping</h1>
						<h2>a focus-first microblogging platform</h2>
					</div>
					<div className="mt-10 flex flex-col gap-8 p-8">
						<div className="card m-4 bg-base-200 p-4">
							<b>what?</b>
							<div className="text-left">
								this website is an attempt to create a better decentralized
								microblogging experience - staying out of your way to reach your
								people.
							</div>
						</div>
						<div className="card m-4 bg-base-200 p-4">
							<b>who?</b>
							<div className="text-left">
								made with ❤ by
								<a className="underline" href="https://kualta.dev">
									kualta
								</a>
							</div>
						</div>
						<div className="card m-4 bg-base-100 p-4" />
					</div>
				</div>
			</PageLayout>
		</>
	);
};

export default AboutPage;
