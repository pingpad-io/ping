import { api } from "~/utils/api";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ThreadLink } from "./ThreadLink";
import { Thread } from "~/server/api/routers/threads";
import { useRouter } from "next/router";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MessageSquareIcon, PlusIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import ThreadWizard from "./ThreadWizard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import { PirvateThread, PublicThread } from "./ThreadEntry";

export function PublicThreads() {
  const [open, setOpen] = useState(false);
  const { data: threads } = api.threads.get.useQuery({ public: true });

  const threadList = threads?.map((thread) => {
    return <PublicThread key={thread.id} thread={thread} />;
  });

  return (
    <Card className="border-0">
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
  const { data: threads } = api.threads.getPrivate.useQuery();

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
