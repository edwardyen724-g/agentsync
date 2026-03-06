export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export const sampleTask: Task = {
  id: '1',
  title: 'Sample Task',
  completed: false,
};