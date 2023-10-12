import { useMutation, useQuery, useQueryClient } from "react-query";

import { apiRequest, uploadRequest } from "../services/api";
import { useLocalStorage } from "./useLocalStorage";

interface IGet<T> {
  name: string;
  endpoint: string;
  onSuccessCallback?(data: T): void;
  onErrorCallback?(): void;
  page?: number;
  limit?: number;
  search?: string;
  filter?: object;
  retry?: boolean;
}

export function useGet<T>({
  name,
  endpoint,
  onSuccessCallback,
  onErrorCallback,
  page,
  limit,
  search,
  filter,
  retry,
}: IGet<T>) {
  
  const [user] = useLocalStorage("user");
  function getData(page: number | undefined) {
    let params = new URLSearchParams();

    if (page) {
      params.append("page", page.toString());
    }
    if (limit) {
      params.append("limit", limit.toString());
    }
    if (search) {
      params.append("search", search);
    }

    if (filter) {
      Object.entries(filter).map((item) => {
        if (item[1] !== undefined) params.append(item[0], item[1]);
        return item;
      });
    }

    let realEndpoint = endpoint;
    if (page || limit || search || filter) {
      realEndpoint = `${endpoint}?${params}`;
    }

    return apiRequest({
      token: user?.token,
      method: "GET",
      endpoint: realEndpoint,
    });
  }
  return useQuery<T>([name, page], () => getData(page), {
    onSuccess: (data: any) => {
      if (onSuccessCallback) onSuccessCallback!(data);
    },
    onError: (error: any) => {
      // if (error?.response?.status === 500) {
      //   navigate("/500");
      // } else if (error?.response?.status === 401) navigate("/401");
    },
    keepPreviousData: false,
    retry
    // enabled:Boolean(filter)
  });
}

export interface IGenericPos {
  name: string | null;
  endpoint: string;
  data?: any;
  onSuccessCallback?(data: any): void;
  onErrorCallback?(error: any): void;
}

interface IPost extends IGenericPos {
  method: "POST" | "PUT" | "DELETE";
}

export function usePost<T>(props: IGenericPos) {
  return useGenericPost<T>({ ...props, method: "POST" });
}

export function usePut<T>(props: IGenericPos) {
  return useGenericPost<T>({ ...props, method: "PUT" });
}

export function useDelete<T>(props: IGenericPos) {
  return useGenericPost<T>({ ...props, method: "DELETE" });
}

function useGenericPost<T>({
  name,
  endpoint,
  method,
  onSuccessCallback,
  onErrorCallback,
}: IPost) {
  const queryClient = useQueryClient();
  
  const [user] = useLocalStorage("user");
  function storeData(data: T) {
    return apiRequest({
      token: user?.token,
      method,
      endpoint,
      data,
    });
  }
  return useMutation(storeData, {
    onSuccess: (data: any) => {
      if (name) {
        const names = name.split(",");
        names.map((name) => queryClient.invalidateQueries({ queryKey: [name] }))
        
      }
      if (onSuccessCallback) onSuccessCallback!(data);
    },
    onError: (error: any) => {
      // if (error?.response?.status === 500) {
      //   navigate("/500");
      // } else if (error?.response?.status === 401) navigate("/401");
      if (onErrorCallback) onErrorCallback!(error);
    },
  });
}

export function useUploadPost<T>(props: IGenericPos) {
  return useGenericUpload<T>({ ...props, method: "POST" });
}

export function useUploadPut<T>(props: IGenericPos) {
  return useGenericUpload<T>({ ...props, method: "PUT" });
}

function useGenericUpload<T>({
  name,
  endpoint,
  method,
  onSuccessCallback,
  onErrorCallback,
}: IPost) {
  const queryClient = useQueryClient();
  const [user] = useLocalStorage("user");
  function storeData(data: T) {
    return uploadRequest({
      token: user?.token,
      method,
      endpoint,
      data,
    });
  }
  return useMutation(storeData, {
    onSuccess: (data: any) => {
      if (name) queryClient.invalidateQueries({ queryKey: [name] });
      if (onSuccessCallback) onSuccessCallback!(data);
    },
    onError: (error: any) => {
      // if (error?.response?.status === 500) {
      //   navigate("/500");
      // } else if (error?.response?.status === 401) navigate("/401");
      // if (onErrorCallback) onErrorCallback!(error);
    },
  });
}
