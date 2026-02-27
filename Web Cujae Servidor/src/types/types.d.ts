declare type SRecord = Record<string, any>
declare type Class<T> = new (...args: any[]) => T
declare type MaybePromise<T> = T | Promise<T>
