"use client";
import { PropsWithChildren, useEffect, useState } from "react";
import { SignedIn } from "../Authenticated";
import { Card } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Post } from "./Post";
import { PostMenuContent } from "./PostMenu";

export const PostContextMenu = (props: PropsWithChildren & { post: Post }) => {
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });

  const handleClick = () => setClicked(false);
  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [handleClick]);

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        setClicked(true);
        setPoints({
          x: e.pageX,
          y: e.pageY,
        });
      }}
    >
      <SignedIn>
        {clicked && (
          <div className="z-[10] absolute" style={{ top: `${points.y}px`, left: `${points.x}px` }}>
            <DropdownMenu open={true}>
              <DropdownMenuTrigger />
              <DropdownMenuContent>
                <Card className="hover:bg-card">
                  <PostMenuContent post={props.post} profileId="" />
                </Card>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </SignedIn>

      {props.children}
    </div>
  );
};
