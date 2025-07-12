import { LENS_NAMESPACE_ADDRESS } from "~/utils/constants";
import { UserLazyHandle } from "./UserLazyHandle";

interface AccountMentionProps {
  account: string;
  namespace?: string;
  localName?: string;
  className?: string;
}

export const AccountMention: React.FC<AccountMentionProps> = ({ account, namespace, localName, className = "" }) => {
  if (namespace === LENS_NAMESPACE_ADDRESS && localName) {
    return <UserLazyHandle handle={localName} className={className} />;
  }

  // For other namespaces or direct account mentions, use the account address
  // You might want to enhance this to resolve the account to a handle
  return <UserLazyHandle handle={account} className={className} />;
};
