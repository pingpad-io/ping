import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { PirvateThread, PublicThread } from "./ThreadEntry";
import ThreadWizard from "./ThreadWizard";

export function PublicThreads() {
  const [open, setOpen] = useState(false);
  // const { data: threads } = api.threads.get.useQuery({});
  const threads = [1, 3];

  const threadList = threads?.map((thread) => {
    return <PublicThread key={thread.id} thread={thread} />;
  });

  return (
    <Card className="hover:bg-card">
      <CardHeader className="py-3">
        <CardTitle className="text-lg">
          <div className="flex flex-row place-items-center gap-4">
            <Link href={"/t"}>Threads</Link>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="w-4 h-4">
                  <PlusIcon />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ThreadWizard setOpen={setOpen} />
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="card-content">{threadList}</div>
      </CardContent>
    </Card>
  );
}

export function PrivateThreads() {
  const [open, setOpen] = useState(false);

  const chatList = threads?.map((thread) => {
    return <PirvateThread key={thread.id} thread={thread} />;
  });

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-lg">
          <div className="flex flex-row place-items-center gap-4">
            <Link href={"/private"}>Private Chats</Link>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="w-4 h-4">
                  <PlusIcon />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ThreadWizard defaultPublic={false} setOpen={setOpen} />
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="card-content">{chatList}</div>
      </CardContent>
    </Card>
  );
}
