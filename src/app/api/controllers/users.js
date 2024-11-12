import User from '@/app/api/models/users';

export async function getUsers(id) {
  try {

    if (id) {
      return await User.findAll({ where: { id: id }});
    }
    return await User.findAll();

  } catch (error) {
    console.error('Erro ao buscar registros de usuario:', error);
  }
}

export async function createOrUpdateUser(id, data) {
  console.log(data)
  try {

    if (id) {
      await User.update(data, { where: { id: id } });
      console.log('Usuario atualizado com sucesso');
    } else {
      await User.create(data);
      console.log('Usuario criado com sucesso');
    }
  } catch (error) {
    console.error('Erro ao criar ou atualizar registro de resgate:', error);
  }
}

export async function deleteUser(id) {
  try {
    await User.destroy({ where: { id: id } });
    console.log('Usuario excluído com sucesso');
  } catch (error) {
    console.error('Erro ao excluir Usuario:', error);
  }
}
