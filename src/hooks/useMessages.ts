import { useQuery } from "@tanstack/react-query";
import type { DecodedMessage, Dm, Group } from "@xmtp/browser-sdk";

type Conversation = Dm | Group;

export function useMessages(conversation: Conversation | null | undefined) {
  return useQuery({
    queryKey: ["xmtp-messages", conversation?.id],
    queryFn: async (): Promise<DecodedMessage[]> => {
      if (!conversation) return [];
      await conversation.sync();
      return conversation.messages();
    },
    enabled: !!conversation,
    staleTime: 10 * 1000,
    refetchInterval: 30 * 1000,
  });
}
