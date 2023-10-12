
export interface PostPayload<T> {
    data: T
}

export interface GetPayload<T>{
    meta: any;
    data: T[] 
}

export interface GetDetailPayload<T>{
    data: T
}