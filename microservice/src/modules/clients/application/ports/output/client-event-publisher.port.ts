// Output Port - define cómo la aplicación publica eventos hacia el exterior
export abstract class ClientEventPublisherPort {
  abstract publishCreated(event: object): Promise<void>;
  abstract publishUpdated(event: object): Promise<void>;
  abstract publishDeleted(event: object): Promise<void>;
}
