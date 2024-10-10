import { getauxiliaryInfos, getSpeciesAndAnimalGroups } from '@/app/api/controllers/utils';
import CalledBys from '@/app/api/models/CalledBys';
import Species from '@/app/api/models/Species';


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
  
    describe('getSpeciesAndAnimalGroups', () => {
        it('deve lidar com erros ao buscar species e grupos de animais', async () => {
          const error = new Error('Erro no banco de dados');
          
          jest.spyOn(Species, 'findAll').mockRejectedValue(error);
          
          const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
          await expect(getSpeciesAndAnimalGroups()).rejects.toThrow('Erro no banco de dados');
      
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Erro ao buscar informações sobre species e grupos de animais:', 
            error
          );
        });
      });
      
      
  });
  