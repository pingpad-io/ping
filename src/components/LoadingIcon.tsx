import { LoaderCircleIcon } from "lucide-react";

export const LoadingSpinner = ({ size = 22 }: { size?: number }) => {
  return <LoaderCircleIcon size={size} className="animate-spin" />;
};
