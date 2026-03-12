export class ClientAlreadyExistsException extends Error {
  constructor(rnc: string) {
    super(`Ya existe un cliente con RNC '${rnc}'`);
    this.name = 'ClientAlreadyExistsException';
  }
}
