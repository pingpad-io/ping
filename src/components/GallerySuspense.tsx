"use client";
import { Card } from "./ui/card";

export const GallerySuspense = () => {
  const placeholders = Array.from({ length: 9 }, () => crypto.randomUUID());
  return (
    <div className="grid grid-cols-3 gap-2">
      {placeholders.map((id) => (
        <Card key={id} className="overflow-hidden p-0">
          <div className="aspect-square w-full animate-pulse bg-muted" />
        </Card>
      ))}
    </div>
  );
};
