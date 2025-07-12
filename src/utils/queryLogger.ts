import { QueryCache, MutationCache } from "@tanstack/react-query";

export const queryCache = new QueryCache({
  onError: (error, query) => {
    console.error(`Query Error [${query.queryKey}]:`, error);
  },
  onSuccess: (data, query) => {
    console.log(`Query Success [${query.queryKey}]:`, {
      dataPreview: Array.isArray(data) ? `Array(${data.length})` : data,
      state: query.state,
    });
  },
});

export const mutationCache = new MutationCache({
  onError: (error, variables, context, mutation) => {
    console.error(`Mutation Error [${mutation.options.mutationKey}]:`, error);
  },
  onSuccess: (data, variables, context, mutation) => {
    console.log(`Mutation Success [${mutation.options.mutationKey}]:`, data);
  },
});