import Species from '@/app/api/models/Species.js';

export async function createOrUpdateSpecie(id, data) {
  try {

    if (id) {
      await Species.update(data, { where: { id: id } });
      console.log('Registro de resgate atualizado com sucesso');
    } else {
      await Species.create(data);
      console.log('Registro de resgate criado com sucesso');
    }
  } catch (error) {
    console.error('Erro ao criar ou atualizar registro de resgate:', error);
  }
}

export async function deleteSpecie(id) {
  try {
    await Species.destroy({ where: { id: id } });
    console.log('Registro de resgate excluído com sucesso');
  } catch (error) {
    console.error('Erro ao excluir registro de resgate:', error);
  }
}
