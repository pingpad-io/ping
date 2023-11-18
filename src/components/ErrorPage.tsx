import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const ErrorPage = ({ title }: { title: string }) => {
  return (
    <Card className="flex flex-col items-center justify-center">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <Link href={"/"}>
          <Button>{"< Home"}</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ErrorPage;
