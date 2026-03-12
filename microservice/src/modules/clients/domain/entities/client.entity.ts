import { ClientId } from '../value-objects/client-id.vo';
import { Rnc } from '../value-objects/rnc.vo';
import { Phone } from '../value-objects/phone.vo';
import { ClientCreatedEvent } from '../events/client-created.event';
import { ClientUpdatedEvent } from '../events/client-updated.event';
import { ClientDeletedEvent } from '../events/client-deleted.event';

export class Client {
  private _domainEvents: object[] = [];

  private constructor(
    private readonly _id: ClientId,
    private _nombre: string,
    private _rnc: Rnc,
    private _direccion: string,
    private _telefono: Phone,
  ) {}

  // ── Factory methods ────────────────────────────────────────
  static create(props: {
    id: string;
    nombre: string;
    rnc: string;
    direccion: string;
    telefono: string;
  }): Client {
    const client = new Client(
      new ClientId(props.id),
      props.nombre,
      new Rnc(props.rnc),
      props.direccion,
      new Phone(props.telefono),
    );
    client._domainEvents.push(new ClientCreatedEvent(props.id, props.nombre, props.rnc));
    return client;
  }

  static reconstitute(props: {
    id: string;
    nombre: string;
    rnc: string;
    direccion: string;
    telefono: string;
  }): Client {
    return new Client(
      new ClientId(props.id),
      props.nombre,
      new Rnc(props.rnc),
      props.direccion,
      new Phone(props.telefono),
    );
  }

  // ── Getters ────────────────────────────────────────────────
  get id(): ClientId { return this._id; }
  get nombre(): string { return this._nombre; }
  get rnc(): Rnc { return this._rnc; }
  get direccion(): string { return this._direccion; }
  get telefono(): Phone { return this._telefono; }
  get domainEvents(): object[] { return [...this._domainEvents]; }

  // ── Business methods ───────────────────────────────────────
  update(props: {
    nombre?: string;
    rnc?: string;
    direccion?: string;
    telefono?: string;
  }): void {
    if (props.nombre) this._nombre = props.nombre;
    if (props.rnc) this._rnc = new Rnc(props.rnc);
    if (props.direccion) this._direccion = props.direccion;
    if (props.telefono) this._telefono = new Phone(props.telefono);
    this._domainEvents.push(new ClientUpdatedEvent(this._id.getValue()));
  }

  delete(): void {
    this._domainEvents.push(new ClientDeletedEvent(this._id.getValue()));
  }

  clearEvents(): void {
    this._domainEvents = [];
  }
}
