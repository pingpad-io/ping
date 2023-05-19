import { PropsWithChildren } from "react";
import Menu from "./Menu";
import Sidebar from "./Sidebar";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { api } from "~/utils/api";
import { Profile } from "~/server/api/routers/profile";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <>
      <Menu />
      <div className="min-h-full max-w-2xl grow border-base-300 sm:shrink lg:max-w-2xl">
        {props.children}
      </div>
      <Sidebar />
    </>
  );
};
