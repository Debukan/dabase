export interface Task {
    id: number;
    title: string;
    description: string;
    topicId: number;
}

export interface Topic {
    id: number;
    name: string;
    description?: string;
}

export interface TaskCreate {
    title: string;
    description: string;
    source: 'kompege' | 'polykov';
    taskNumber: string;
    topic: string;
}