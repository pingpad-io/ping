/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";
import { PageLayout } from "~/components/Layout";
import { Card } from "~/components/ui/card";

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
						<Card className="m-4 bg-base-200 p-4">
							<b>what?</b>
							<div className="text-left">
								this website is an attempt to create a better decentralized
								microblogging experience - staying out of your way to reach your
								people.
							</div>
						</Card>
						<Card className="m-4 p-4">
							<b>who?</b>
							<div className="text-left space-x-2">
								made with ❤ by {' '}
								<a className="underline" href="https://kualta.dev">
									{"kualta"}
								</a>
							</div>
						</Card>
					</div>
				</div>
			</PageLayout>
		</>
	);
};

export default AboutPage;
