export abstract class DeleteClientPort {
  abstract execute(id: string): Promise<void>;
}
