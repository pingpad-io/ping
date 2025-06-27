export const ReactionCount = ({
  amount,
  isPressed,
  persistent = false,
}: {
  amount: number;
  isPressed: boolean;
  persistent: boolean;
}) => {
  // if (amount <= 0 && !persistent) return null;

  const formattedAmount = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);

  return (
    <span
      className={`inline-flex items-center leading-none transition-colors duration-200 text-xs font-bold 
        ${isPressed ? "text-primary" : "text-muted-foreground"}`}
    >
      <span className="w-fit min-w-[3ch] text-center">{amount > 0 || persistent ? formattedAmount : ""}</span>
    </span>
  );
};
