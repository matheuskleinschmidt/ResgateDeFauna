import { createOrUpdateSpecie, deleteSpecie } from '@/app/api/controllers/species';
import Species from '@/app/api/models/Species.js';

describe('species.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrUpdateSpecie', () => {
    it('deve criar uma nova espécie quando o id não é fornecido', async () => {
      const data = { name: 'Espécie Nova', description: 'Descrição da espécie nova' };
      jest.spyOn(Species, 'create').mockResolvedValue({ id: 1 });
      console.log = jest.fn();

      await createOrUpdateSpecie(null, data);

      expect(Species.create).toHaveBeenCalledWith(data);
      expect(console.log).toHaveBeenCalledWith('Registro de resgate criado com sucesso');
    });

    it('deve atualizar uma espécie quando o id é fornecido', async () => {
      const id = 1;
      const data = { name: 'Espécie Atualizada', description: 'Descrição atualizada' };
      jest.spyOn(Species, 'update').mockResolvedValue([1]);
      console.log = jest.fn();

      await createOrUpdateSpecie(id, data);

      expect(Species.update).toHaveBeenCalledWith(data, { where: { id } });
      expect(console.log).toHaveBeenCalledWith('Registro de resgate atualizado com sucesso');
    });

    it('deve lidar com erros ao criar ou atualizar a espécie', async () => {
      const error = new Error('Erro no banco de dados');
      jest.spyOn(Species, 'create').mockRejectedValue(error);
      console.error = jest.fn();

      await createOrUpdateSpecie(null, {});

      expect(console.error).toHaveBeenCalledWith('Erro ao criar ou atualizar registro de resgate:', error);
    });
  });

  describe('deleteSpecie', () => {
    it('deve excluir uma espécie quando o id é fornecido', async () => {
      const id = 1;
      jest.spyOn(Species, 'destroy').mockResolvedValue(1);
      console.log = jest.fn();

      await deleteSpecie(id);

      expect(Species.destroy).toHaveBeenCalledWith({ where: { id } });
      expect(console.log).toHaveBeenCalledWith('Registro de resgate excluído com sucesso');
    });

    it('deve lidar com erros ao excluir a espécie', async () => {
      const error = new Error('Erro ao excluir registro');
      jest.spyOn(Species, 'destroy').mockRejectedValue(error);
      console.error = jest.fn();

      await deleteSpecie(1);

      expect(console.error).toHaveBeenCalledWith('Erro ao excluir registro de resgate:', error);
    });
  });
});
