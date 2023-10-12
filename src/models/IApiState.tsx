export default interface IApiState<T> {
    loading: boolean;
    data : Array<T> | null;
    meta: any;
    error: any;
}