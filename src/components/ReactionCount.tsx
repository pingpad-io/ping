export const ReactionCount = ({
  amount,
  isPressed,
  persistent = false,
}: {
  amount: number;
  isPressed: boolean;
  persistent: boolean;
}) => {
  if (amount <= 0 && !persistent) return null;

  const formattedAmount = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);

  return (
    <span className={isPressed ? "font-semibold text-accent-foreground" : ""}>
      <span className="w-fit font-medium">{formattedAmount}</span>
    </span>
  );
};
