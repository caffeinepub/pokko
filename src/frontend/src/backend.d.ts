import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    text: string;
    author: string;
    timestamp: Time;
}
export type Time = bigint;
export interface backendInterface {
    getMessages(): Promise<Array<Message>>;
    postMessage(author: string, text: string): Promise<void>;
}
