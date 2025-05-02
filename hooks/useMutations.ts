import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import { api } from '../lib/api';

export function useCustomMutations<TResponse, TVariables>(
  mutationFn: (client: AxiosInstance, variables: TVariables) => Promise<TResponse>,
  options?: UseMutationOptions<TResponse, unknown, TVariables>
) {
  return useMutation<TResponse, unknown, TVariables>({
    mutationFn: (variables) => mutationFn(api, variables),
    ...options,
  });
}
