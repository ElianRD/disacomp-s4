export interface IDeleteInvoicePort {
  execute(id: string): Promise<void>;
}
