"use client";

import { NetworkIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";

export const PingButton = () => {
  const ping = () =>
    toast.success("pong!", {
      description: "also, it's not a real thing",
    });

  return (
    <Button variant="outline" size="sm_icon" onClick={ping}>
      <NetworkIcon size={20} className="sm:mr-2" />
      <div className="hidden sm:flex text-base">ping</div>
    </Button>
  );
};
