"use client";
import { type PropsWithChildren, useEffect, useState } from "react";
import { Card } from "../ui/card";
import type { Post } from "./Post";
import { PostMenu } from "./PostMenu";

export const ContextMenu = (props: PropsWithChildren & { post: Post }) => {
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
      {clicked && (
        <div className="z-[40] absolute" style={{ top: `${points.y}px`, left: `${points.x}px` }}>
          <Card className="flex flex-col w-max gap-1 p-1 hover:bg-card border">
            <PostMenu post={props.post} />
          </Card>
        </div>
      )}

      {props.children}
    </div>
  );
};
