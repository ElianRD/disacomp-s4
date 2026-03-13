export class ClientUpdatedEvent {
  readonly occurredAt: Date = new Date();

  constructor(public readonly clientId: string) {}
}
