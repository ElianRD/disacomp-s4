import { ClientResponseDto } from '../../../application/dtos/client-response.dto';

export class ClientPresenter {
  static present(dto: ClientResponseDto) {
    return {
      id: dto.id,
      nombre: dto.nombre,
      rnc: dto.rnc,
      direccion: dto.direccion,
      telefono: dto.telefono,
    };
  }

  static presentList(dtos: ClientResponseDto[]) {
    return dtos.map(ClientPresenter.present);
  }
}
