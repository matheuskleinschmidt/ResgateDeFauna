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
import { Spinner } from "@nextui-org/react";
import { useForm } from 'react-hook-form';
import bcrypt from 'bcryptjs';

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUserList(response.data);
    } catch (error) {
      console.error("Erro ao buscar os usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Erro ao deletar o usuário:", error);
    }
  };

  const handleCreate = () => {
    setCurrentUser(null);
    setModalOpen(true);
  };

  const handleFormSubmit = () => {
    setModalOpen(false);
    fetchUsers();
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center px-4">
    <Spinner size="lg" />
  </div>
  );

  return (
    <div>
      <div className="flex justify-end">
        <Button className="flex-end max-w-xs m-2" onClick={handleCreate}>Criar Usuário</Button>
      </div>

      <Table isStriped isCompact>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Nome</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Função</TableColumn>
          <TableColumn>Ações</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Não há usuários cadastrados."}>
          {Array.isArray(userList) && userList.length > 0
            ? userList.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => handleEdit(user)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      color="error"
                      onClick={() => handleDelete(user.id)}
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
                {currentUser ? "Editar Usuário" : "Criar Novo Usuário"}
              </ModalHeader>
              <ModalBody>
                <UserForm
                  user={currentUser}
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

const UserForm = ({ user, onSubmit, onClose }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        password: '',
        role: '',
      });
    }
  }, [user, reset]);

  const onSubmitForm = async (data) => {
    console.log(data);
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const dataToSend = {
        ...data,
        password: hashedPassword,
      };

      if (user) {
        await axios.put(`/api/users/${user.id}`, dataToSend);
      } else {
        await axios.post('/api/users', dataToSend);
      }
  
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar o usuário:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Input className="mb-4" {...register('name')} label="Nome" placeholder="Nome" />
      <Input className="mb-4" {...register('email')} label="Email" placeholder="Email" />
      <Input className="mb-4" {...register('password')} label="Senha" placeholder="Senha" type="password" />
      <Input className="mb-4" {...register('role')} label="Função" placeholder="Função" />
      <Button type="submit" className="mb-4">Salvar</Button>
    </form>
  );
};

export default UserList;
