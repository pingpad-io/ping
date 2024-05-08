import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ThreadWizard from "../components_old/ThreadWizard";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export function PublicThreads() {
  const [open, setOpen] = useState(false);
  const threads = [1, 3];

  const threadList = threads?.map((thread) => {
    return <>Not Implemented</>;
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
