import { getauxiliaryInfos, getSpeciesAndAnimalGroups  } from '@/app/api/controllers/utils';
import { createOrUpdateAnimalGroup, deleteAnimalGroup } from '@/app/api/controllers/animalGroups';
import CalledBys from '@/app/api/models/CalledBys';
import Species from '@/app/api/models/Species';
import AnimalGroups from "@/app/api/models/AnimalGroups.js";



describe('utils.controller', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getauxiliaryInfos', () => {
      it('deve lidar com erros ao buscar as informações auxiliares', async () => {
        const error = new Error('Erro no banco de dados');
        jest.spyOn(CalledBys, 'findAll').mockRejectedValue(error);
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
        await expect(getauxiliaryInfos()).rejects.toThrow('Erro no banco de dados');
  
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao buscar informações auxiliares:', error);
      });
    });    
      
  });
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
  
    describe('getSpeciesAndAnimalGroups', () => {
      it('deve buscar espécies com seus grupos animais associados', async () => {
        const mockSpeciesData = [
          {
            id: 1,
            scientificName: 'Panthera leo',
            commonName: 'Leão',
            AnimalGroupId: 1,
            AnimalGroup: {
              id: 1,
              groupName: 'Mamíferos',
            },
          },
          {
            id: 2,
            scientificName: 'Aquila chrysaetos',
            commonName: 'Águia Dourada',
            AnimalGroupId: 2,
            AnimalGroup: {
              id: 2,
              groupName: 'Aves',
            },
          },
        ];
  
        const mockAnimalGroupsData = [
          { id: 1, groupName: 'Mamíferos' },
          { id: 2, groupName: 'Aves' },
        ];
  
        jest.spyOn(Species, 'findAll').mockResolvedValue(mockSpeciesData);
        jest.spyOn(AnimalGroups, 'findAll').mockResolvedValue(mockAnimalGroupsData);
  
        const result = await getSpeciesAndAnimalGroups();
  
        expect(Species.findAll).toHaveBeenCalledWith({
          include: [
            {
              model: AnimalGroups,
              attributes: ['id', 'groupName'],
            },
          ],
          attributes: ['id', 'scientificName', 'commonName', 'AnimalGroupId'],
        });
  
        expect(AnimalGroups.findAll).toHaveBeenCalledWith({
          attributes: ['id', 'groupName'],
        });
  
        expect(result).toEqual({
          species: mockSpeciesData,
          animalGroups: mockAnimalGroupsData,
        });
      });
  
      it('deve lidar com erros ao buscar espécies e grupos animais', async () => {
        const error = new Error('Erro no banco de dados');
        jest.spyOn(Species, 'findAll').mockRejectedValue(error);
        console.error = jest.fn();
  
        await expect(getSpeciesAndAnimalGroups()).rejects.toThrow(error);
  
        expect(console.error).toHaveBeenCalledWith('Error fetching species and animal groups:', error);
      });
    });
  });
  