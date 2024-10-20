import AnimalGroups from '../models/AnimalGroups';

export async function createOrUpdateAnimalGroup(id, data) {
  try {

    if (id) {
      await AnimalGroups.update(data, { where: { id: id } });
      console.log('Registro de resgate atualizado com sucesso');
    } else {
      await AnimalGroups.create(data);
      console.log('Registro de resgate criado com sucesso');
    }
  } catch (error) {
    console.error('Erro ao criar ou atualizar registro de resgate:', error);
  }
}

export async function deleteAnimalGroup(id) {
  try {
    await AnimalGroups.destroy({ where: { id: id } });
    console.log('Registro de resgate excluído com sucesso');
  } catch (error) {
    console.error('Erro ao excluir registro de resgate:', error);
  }
}
