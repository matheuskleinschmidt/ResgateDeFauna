import { getUsers, createOrUpdateUser, deleteUser } from '@/app/api/controllers/users';
import User from '@/app/api/models/users';

describe('users.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('deve buscar todos os usuários quando o id não é fornecido', async () => {
      jest.spyOn(User, 'findAll').mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const result = await getUsers();

      expect(User.findAll).toHaveBeenCalled();
      expect(User.findAll).toHaveBeenCalledWith();
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('deve buscar o usuário pelo id quando o id é fornecido', async () => {
      const id = 1;
      jest.spyOn(User, 'findAll').mockResolvedValue([{ id: 1 }]);

      const result = await getUsers(id);

      expect(User.findAll).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual([{ id: 1 }]);
    });

    it('deve lidar com erros ao buscar usuários', async () => {
      const error = new Error('Erro no banco de dados');
      jest.spyOn(User, 'findAll').mockRejectedValue(error);
      console.error = jest.fn();

      const result = await getUsers();

      expect(console.error).toHaveBeenCalledWith('Erro ao buscar registros de usuario:', error);
      expect(result).toBeUndefined();
    });
  });

  describe('createOrUpdateUser', () => {
    it('deve criar um novo usuário quando o id não é fornecido', async () => {
      const data = { name: 'Novo Usuário', email: 'novo@usuario.com' };
      jest.spyOn(User, 'create').mockResolvedValue({ id: 1 });
      console.log = jest.fn();

      await createOrUpdateUser(null, data);

      expect(User.create).toHaveBeenCalledWith(data);
      expect(console.log).toHaveBeenCalledWith('Usuario criado com sucesso');
    });

    it('deve atualizar um usuário quando o id é fornecido', async () => {
      const id = 1;
      const data = { name: 'Usuário Atualizado', email: 'atualizado@usuario.com' };
      jest.spyOn(User, 'update').mockResolvedValue([1]);
      console.log = jest.fn();

      await createOrUpdateUser(id, data);

      expect(User.update).toHaveBeenCalledWith(data, { where: { id } });
      expect(console.log).toHaveBeenCalledWith('Usuario atualizado com sucesso');
    });

    it('deve lidar com erros ao criar ou atualizar o usuário', async () => {
      const error = new Error('Erro no banco de dados');
      jest.spyOn(User, 'create').mockRejectedValue(error);
      console.error = jest.fn();

      await createOrUpdateUser(null, {});

      expect(console.error).toHaveBeenCalledWith('Erro ao criar ou atualizar registro de resgate:', error);
    });
  });

  describe('deleteUser', () => {
    it('deve excluir um usuário quando o id é fornecido', async () => {
      const id = 1;
      jest.spyOn(User, 'destroy').mockResolvedValue(1);
      console.log = jest.fn();

      await deleteUser(id);

      expect(User.destroy).toHaveBeenCalledWith({ where: { id } });
      expect(console.log).toHaveBeenCalledWith('Usuario excluído com sucesso');
    });

    it('deve lidar com erros ao excluir o usuário', async () => {
      const error = new Error('Erro ao excluir usuário');
      jest.spyOn(User, 'destroy').mockRejectedValue(error);
      console.error = jest.fn();

      await deleteUser(1);

      expect(console.error).toHaveBeenCalledWith('Erro ao excluir Usuario:', error);
    });
  });
});
