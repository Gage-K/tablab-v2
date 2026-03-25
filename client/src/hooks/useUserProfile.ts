import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate";
import { queryKeys } from "../api/queryKeys";
import { API_ENDPOINTS } from "../api/endpoints";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  last_login: string | null;
}

export function useUserProfile() {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<UserProfile>({
    queryKey: queryKeys.user.profile,
    queryFn: async () => {
      const response = await axiosPrivate.get(API_ENDPOINTS.user.base);
      return response.data;
    },
  });
}

export function useUpdateEmail() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axiosPrivate.put(
        API_ENDPOINTS.user.email,
        JSON.stringify({ email })
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    },
  });
}

export function useUpdateUsername() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username: string) => {
      const response = await axiosPrivate.put(
        API_ENDPOINTS.user.username,
        JSON.stringify({ username })
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    },
  });
}

export function useUpdatePassword() {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const response = await axiosPrivate.put(
        API_ENDPOINTS.user.password,
        JSON.stringify({ currentPassword, newPassword })
      );
      return response.data;
    },
  });
}
