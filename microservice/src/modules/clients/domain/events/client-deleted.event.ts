export class ClientDeletedEvent {
  readonly occurredAt: Date = new Date();

  constructor(public readonly clientId: string) {}
}
