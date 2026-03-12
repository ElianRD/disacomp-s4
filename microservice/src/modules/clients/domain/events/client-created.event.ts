export class ClientCreatedEvent {
  readonly occurredAt: Date = new Date();

  constructor(
    public readonly clientId: string,
    public readonly nombre: string,
    public readonly rnc: string,
  ) {}
}
