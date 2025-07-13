import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Group } from "@lens-protocol/client";

interface GroupMutationContext {
  previousGroup?: Group;
  previousStats?: { totalMembers: number };
}

export function useGroupMutations(groupId: string) {
  const queryClient = useQueryClient();

  const updateGroupInCache = (updater: (oldGroup: Group) => Group) => {
    queryClient.setQueryData<Group>(["group", groupId], (oldData) => {
      if (!oldData) return oldData;
      return updater(oldData);
    });

    queryClient.setQueriesData<{ pages: { data: Group[] }[] }>(
      { queryKey: ["groups"], exact: false },
      (oldData) => {
        if (!oldData?.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((group) => (group.address === groupId ? updater(group) : group)),
          })),
        };
      }
    );
  };

  const updateStatsInCache = (increment: number) => {
    queryClient.setQueryData<{ totalMembers: number }>(["groupStats", groupId], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        totalMembers: oldData.totalMembers + increment,
      };
    });
  };

  const joinMutation = useMutation<boolean, Error, void, GroupMutationContext>({
    mutationFn: async () => {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to join group");
      const result = await response.json();
      if (!result.success) {
        throw new Error("Join operation failed");
      }
      return result.success;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["group", groupId] });
      await queryClient.cancelQueries({ queryKey: ["groupStats", groupId] });

      const previousGroup = queryClient.getQueryData<Group>(["group", groupId]);
      const previousStats = queryClient.getQueryData<{ totalMembers: number }>(["groupStats", groupId]);

      updateGroupInCache((old) => ({
        ...old,
        operations: {
          ...old.operations,
          canJoin: {
            __typename: "GroupOperationValidationFailed" as const,
            reason: "AlreadyMember",
            unsatisfiedRules: {
              __typename: "GroupUnsatisfiedRules" as const,
              required: [],
              anyOf: [],
            },
          },
          canLeave: {
            __typename: "GroupOperationValidationPassed" as const,
          },
        },
      }));

      // Optimistically increment member count
      updateStatsInCache(1);

      return { previousGroup, previousStats };
    },
    onSuccess: () => {
      // Confirm the optimistic update by ensuring the state is set correctly
      updateGroupInCache((old) => ({
        ...old,
        operations: {
          ...old.operations,
          canJoin: {
            __typename: "GroupOperationValidationFailed" as const,
            reason: "AlreadyMember",
            unsatisfiedRules: {
              __typename: "GroupUnsatisfiedRules" as const,
              required: [],
              anyOf: [],
            },
          },
          canLeave: {
            __typename: "GroupOperationValidationPassed" as const,
          },
        },
      }));
    },
    onError: (_error, _variables, context) => {
      if (context?.previousGroup) {
        queryClient.setQueryData(["group", groupId], context.previousGroup);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(["groupStats", groupId], context.previousStats);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groupStats", groupId] });
    },
  });

  const leaveMutation = useMutation<boolean, Error, void, GroupMutationContext>({
    mutationFn: async () => {
      const response = await fetch(`/api/groups/${groupId}/leave`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to leave group");
      const result = await response.json();
      if (!result.success) {
        throw new Error("Leave operation failed");
      }
      return result.success;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["group", groupId] });
      await queryClient.cancelQueries({ queryKey: ["groupStats", groupId] });

      const previousGroup = queryClient.getQueryData<Group>(["group", groupId]);
      const previousStats = queryClient.getQueryData<{ totalMembers: number }>(["groupStats", groupId]);

      // Optimistic update
      updateGroupInCache((old) => ({
        ...old,
        operations: {
          ...old.operations,
          canJoin: {
            __typename: "GroupOperationValidationPassed" as const,
          },
          canLeave: {
            __typename: "GroupOperationValidationFailed" as const,
            reason: "NotMember",
            unsatisfiedRules: {
              __typename: "GroupUnsatisfiedRules" as const,
              required: [],
              anyOf: [],
            },
          },
        },
      }));

      // Optimistically decrement member count
      updateStatsInCache(-1);

      return { previousGroup, previousStats };
    },
    onSuccess: () => {
      // Confirm the optimistic update by ensuring the state is set correctly
      updateGroupInCache((old) => ({
        ...old,
        operations: {
          ...old.operations,
          canJoin: {
            __typename: "GroupOperationValidationPassed" as const,
          },
          canLeave: {
            __typename: "GroupOperationValidationFailed" as const,
            reason: "NotMember",
            unsatisfiedRules: {
              __typename: "GroupUnsatisfiedRules" as const,
              required: [],
              anyOf: [],
            },
          },
        },
      }));
    },
    onError: (_error, _variables, context) => {
      if (context?.previousGroup) {
        queryClient.setQueryData(["group", groupId], context.previousGroup);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(["groupStats", groupId], context.previousStats);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groupStats", groupId] });
    },
  });

  return {
    joinMutation,
    leaveMutation,
  };
}