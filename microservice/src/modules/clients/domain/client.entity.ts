import { Rnc } from './rnc.value-object';

export class Client {
  constructor(
    public readonly id: string,
    public nombre: string,
    public rnc: Rnc,
    public direccion: string,
    public telefono: string,
  ) {}

  static create(props: {
    id: string;
    nombre: string;
    rnc: string;
    direccion: string;
    telefono: string;
  }): Client {
    return new Client(
      props.id,
      props.nombre,
      new Rnc(props.rnc),
      props.direccion,
      props.telefono,
    );
  }
}
