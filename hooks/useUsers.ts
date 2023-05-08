import useSWR, { SWRConfiguration } from "swr";
import { User } from "../interfaces";

export const useUsers = (url: string, config: SWRConfiguration = {}) => {
  const { data, error } = useSWR<User[]>(`/api${url}`, config);

  return {
    users: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};
