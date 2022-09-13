export default interface Task {
  id: string;
  description: string;
  createdDate: Date;
  complete: boolean;
  completedDate: Date | null;
}
