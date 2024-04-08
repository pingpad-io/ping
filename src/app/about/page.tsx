/* eslint-disable react/no-unescaped-entities */
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const AboutPage = () => {
  return (
    <>
      <div className="flex flex-col items-center p-2 sm:p-4 md:p-20 text-center gap-8">
        <h1 className="font-bold text-4xl">About Pingpad</h1>
        <h2 className="text-2xl">a focus-first decentralized social</h2>
        <div className="flex flex-col gap-8 p-2 md:p-8">
          <Card>
            <CardHeader>
              <CardTitle>what?</CardTitle>
            </CardHeader>
            <CardContent>
              this project is an attempt to provide a better decentralized social experience -{" "}
              <b>staying out of your way to reach your people.</b>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>why?</CardTitle>
            </CardHeader>
            <CardContent>
              providing a place to express yourself, made <b>for you </b> and <b>your community</b>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>who?</CardTitle>
            </CardHeader>
            <CardContent>
              made with ❤ by{" "}
              <a className="underline" href="https://kualta.dev">
                {"kualta"}
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
