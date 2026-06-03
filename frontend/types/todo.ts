export interface Attachment {
    id: number;
    todoId: string;
    name: string;
    url: string;
    publicId: string;
    resourceType: string;
    format?: string | null;
    bytes?: number | null;
    createdAt: string;
}

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    attachments?: Attachment[];
}
