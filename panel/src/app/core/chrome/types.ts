export interface Message { [key: string]: any; }
export type MessageListener = (message: Message) => void;
