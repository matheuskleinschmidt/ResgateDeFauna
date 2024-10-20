"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { useForm } from 'react-hook-form';

const AnimalGroupList = () => {
  const [animalGroupList, setAnimalGroupList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);

  const fetchAnimalGroups = async () => {
    try {
      const response = await axios.get("/api/dateUtil/speciesAndAnimalGroups");
      setAnimalGroupList(response.data.animalGroups);
    } catch (error) {
      console.error("Erro ao buscar os grupos de animais:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimalGroups();
  }, []);

  const handleEdit = (group) => {
    setCurrentGroup(group);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/dateUtil/animalGroups/${id}`);
      fetchAnimalGroups();
    } catch (error) {
      console.error("Erro ao deletar o grupo de animais:", error);
    }
  };

  const handleCreate = () => {
    setCurrentGroup(null);
    setModalOpen(true);
  };

  const handleFormSubmit = () => {
    setModalOpen(false);
    fetchAnimalGroups();
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <Button onClick={handleCreate}>Criar Novo Grupo</Button>
      <Table isStriped isCompact>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Nome do Grupo</TableColumn>
          <TableColumn>Ações</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Não há grupos cadastrados."}>
          {Array.isArray(animalGroupList) && animalGroupList.length > 0
            ? animalGroupList.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.id}</TableCell>
                  <TableCell>{group.groupName}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => handleEdit(group)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      color="error"
                      onClick={() => handleDelete(group.id)}
                    >
                      Deletar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>

      <Modal isOpen={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {currentGroup ? "Editar Grupo" : "Criar Novo Grupo"}
              </ModalHeader>
              <ModalBody>
                <AnimalGroupForm
                  group={currentGroup}
                  onSubmit={handleFormSubmit}
                  onClose={onClose}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

const AnimalGroupForm = ({ group, onSubmit, onClose }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      groupName: '',
    },
  });

  useEffect(() => {
    if (group) {
      reset({
        groupName: group.groupName || '',
      });
    } else {
      reset({
        groupName: '',
      });
    }
  }, [group, reset]);

  const onSubmitForm = async (data) => {
    try {
      if (group) {
        await axios.put(`/api/dateUtil/animalGroups/${group.id}`, data);
      } else {
        await axios.post('/api/dateUtil/animalGroups', data);
      }
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar o grupo de animais:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Input {...register('groupName')} label="Nome do Grupo" placeholder="Nome do Grupo" />
      <Button type="submit">Salvar</Button>
    </form>
  );
};

export default AnimalGroupList;
