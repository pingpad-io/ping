import { type Flair } from "@prisma/client";

export const FlairView = ({ flair, size = "md" }: { flair: Flair | undefined; size: "xs" | "sm" | "md" | "lg" }) => {
  if (!flair) return null;

  let flairColor = "";
  switch (flair.color) {
    case "accent":
      flairColor = "badge-info";
      break;
    case "error":
      flairColor = "badge-error";
      break;
    case "success":
      flairColor = "badge-success";
      break;
    case "warning":
      flairColor = "badge-warning";
      break;
    case "info":
      flairColor = "badge-info";
      break;
    case "primary":
      flairColor = "badge-primary";
      break;
    case "secondary":
      flairColor = "badge-secondary";
      break;
    default:
      flairColor = "badge-info";
      break;
  }

  let flairSize = "";
  switch (size) {
    case "sm":
      flairSize = "badge-sm";
      break;
    case "xs":
      flairSize = "badge-xs";
      break;
    case "md":
      flairSize = "badge-md";
      break;
    case "lg":
      flairSize = "badge-lg";
      break;
    default:
      flairSize = "badge-md";
      break;
  }

  return (
    <div key={flair.id} className={"badge-outline badge h-min w-fit " + flairColor + " " + flairSize}>
      {flair.title}
    </div>
  );
};
