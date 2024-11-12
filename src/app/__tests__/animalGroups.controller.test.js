import { createOrUpdateAnimalGroup, deleteAnimalGroup, getSpeciesAndAnimalGroups } from '@/app/api/controllers/animalGroups';
import AnimalGroups from '@/app/api/models/AnimalGroups';
import Species from '@/app/api/models/Species.js';

describe('animalGroups.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrUpdateAnimalGroup', () => {
    it('deve criar um novo grupo animal quando o id não é fornecido', async () => {
      const data = { name: 'Novo Grupo', description: 'Descrição do novo grupo' };
      jest.spyOn(AnimalGroups, 'create').mockResolvedValue({ id: 1 });
      console.log = jest.fn();

      await createOrUpdateAnimalGroup(null, data);

      expect(AnimalGroups.create).toHaveBeenCalledWith(data);
      expect(console.log).toHaveBeenCalledWith('Registro de resgate criado com sucesso');
    });

    it('deve atualizar um grupo animal quando o id é fornecido', async () => {
      const id = 1;
      const data = { name: 'Grupo Atualizado', description: 'Descrição atualizada' };
      jest.spyOn(AnimalGroups, 'update').mockResolvedValue([1]);
      console.log = jest.fn();

      await createOrUpdateAnimalGroup(id, data);

      expect(AnimalGroups.update).toHaveBeenCalledWith(data, { where: { id } });
      expect(console.log).toHaveBeenCalledWith('Registro de resgate atualizado com sucesso');
    });

    it('deve lidar com erros ao criar ou atualizar o grupo animal', async () => {
      const error = new Error('Erro no banco de dados');
      jest.spyOn(AnimalGroups, 'create').mockRejectedValue(error);
      console.error = jest.fn();

      await createOrUpdateAnimalGroup(null, {});

      expect(console.error).toHaveBeenCalledWith('Erro ao criar ou atualizar registro de resgate:', error);
    });
  });

  describe('deleteAnimalGroup', () => {
    it('deve excluir um grupo animal quando o id é fornecido', async () => {
      const id = 1;
      jest.spyOn(AnimalGroups, 'destroy').mockResolvedValue(1);
      console.log = jest.fn();

      await deleteAnimalGroup(id);

      expect(AnimalGroups.destroy).toHaveBeenCalledWith({ where: { id } });
      expect(console.log).toHaveBeenCalledWith('Registro de resgate excluído com sucesso');
    });

    it('deve lidar com erros ao excluir o grupo animal', async () => {
      const error = new Error('Erro ao excluir registro');
      jest.spyOn(AnimalGroups, 'destroy').mockRejectedValue(error);
      console.error = jest.fn();

      await deleteAnimalGroup(1);

      expect(console.error).toHaveBeenCalledWith('Erro ao excluir registro de resgate:', error);
    });
  });
});
