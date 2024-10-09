import { getRescuesWithStrings, createOrUpdateRescueRecord, deleteRescue } from '@/app/api/controllers/rescue';
import Rescues from '@/app/api/models/Rescues';

describe('rescue.controller', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getRescuesWithStrings', () => {
      it('deve buscar resgates com as opções corretas quando o id é fornecido', async () => {
        const id = 1;
        const mockRescues = [{ id: 1 }];
  
        jest.spyOn(Rescues, 'findAll').mockResolvedValue(mockRescues);
  
        const result = await getRescuesWithStrings(id);
  
        expect(Rescues.findAll).toHaveBeenCalledWith(expect.objectContaining({
          where: { id },
        }));
        expect(result).toEqual(mockRescues);
      });
  
      it('deve buscar resgates corretamente quando o id não é fornecido', async () => {
        const mockRescues = [{ id: 1 }, { id: 2 }];
  
        jest.spyOn(Rescues, 'findAll').mockResolvedValue(mockRescues);
  
        const result = await getRescuesWithStrings();
  
        expect(Rescues.findAll).toHaveBeenCalledWith(expect.not.objectContaining({
          where: expect.anything(),
        }));
        expect(result).toEqual(mockRescues);
      });
  
      it('deve lidar com erros', async () => {
        const error = new Error('Erro no banco de dados');
        jest.spyOn(Rescues, 'findAll').mockRejectedValue(error);
        console.error = jest.fn();
  
        const result = await getRescuesWithStrings();
  
        expect(console.error).toHaveBeenCalledWith('Error fetching rescues with string fields:', error);
        expect(result).toBeUndefined();
      });
    });
  
    describe('createOrUpdateRescueRecord', () => {
      it('deve criar um novo registro de resgate quando o id não é fornecido', async () => {
        const data = {
          date: { year: 2022, month: 10, day: 10 },
          time: { hour: 10, minute: 30 },
          height: '5',
          length: '10',
          width: '2',
          locationCoordinates: '12.34,56.78',
          releaseLocationCoordinates: '90.12,34.56',
          weight: '50',
          occurrence: 'Ocorrência de teste',
          observation: 'Observação de teste',
          address: 'Endereço de teste',
        };
        jest.spyOn(Rescues, 'create').mockResolvedValue({ id: 1 });
        console.log = jest.fn();
  
        await createOrUpdateRescueRecord(null, data);
  
        expect(Rescues.create).toHaveBeenCalledWith(expect.objectContaining({
          weight: 50,
          measurement: { height: 5, length: 10, width: 2 },
          occurrence: 'Ocorrência de teste',
          observation: 'Observação de teste',
          address: 'Endereço de teste',
          locationCoordinates: { latitude: 12.34, longitude: 56.78 },
          releaseLocationCoordinates: { latitude: 90.12, longitude: 34.56 },
        }));
        expect(console.log).toHaveBeenCalledWith('Registro de resgate criado com sucesso');
      });
  
      it('deve atualizar um registro de resgate quando o id é fornecido', async () => {
        const data = {
          date: { year: 2022, month: 10, day: 10 },
          time: { hour: 10, minute: 30 },
        };
        const id = 1;
  
        jest.spyOn(Rescues, 'update').mockResolvedValue([1]);
        console.log = jest.fn();
  
        await createOrUpdateRescueRecord(id, data);
  
        expect(Rescues.update).toHaveBeenCalledWith(expect.any(Object), { where: { id } });
        expect(console.log).toHaveBeenCalledWith('Registro de resgate atualizado com sucesso');
      });
  
      it('deve lidar com erro de data inválida', async () => {
        const data = {
          date: { year: 2022, month: null, day: 10 },
        };
        console.error = jest.fn();
  
        await createOrUpdateRescueRecord(null, data);
  
        expect(console.error).toHaveBeenCalledWith('Erro ao criar ou atualizar registro de resgate:', new Error('Data inválida: Ano, mês ou dia ausentes.'));
      });
  
      it('deve lidar com coordenadas de localização inválidas', async () => {
        const data = {
          date: { year: 2022, month: 10, day: 10 },
          locationCoordinates: 'coordenadas inválidas',
        };
        console.error = jest.fn();
  
        await createOrUpdateRescueRecord(null, data);
  
        expect(console.error).toHaveBeenCalledWith('Erro ao criar ou atualizar registro de resgate:', new Error('Coordenadas de localização inválidas'));
      });
    });
    describe('deleteRescue', () => {
      it('deve excluir um registro de resgate quando o id é fornecido', async () => {
        const id = 1;
        jest.spyOn(Rescues, 'destroy').mockResolvedValue(1);
        console.log = jest.fn();
  
        await deleteRescue(id);
  
        expect(Rescues.destroy).toHaveBeenCalledWith({ where: { id } });
        expect(console.log).toHaveBeenCalledWith('Registro de resgate excluído com sucesso');
      });
  
      it('deve lidar com erros ao excluir o registro de resgate', async () => {
        const id = 1;
        const error = new Error('Erro ao excluir registro');
        jest.spyOn(Rescues, 'destroy').mockRejectedValue(error);
        console.error = jest.fn();
  
        await deleteRescue(id);
  
        expect(console.error).toHaveBeenCalledWith('Erro ao excluir registro de resgate:', error);
      });
    });
  });