"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import React from "react";
import { DatePicker } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/react";

const calledBy = [
  { key: "1", label: "Ouvidoria" },
  { key: "2", label: "Telefone" },
  { key: "3", label: "Whatsapp" },
  { key: "4", label: "Facebook" },
  { key: "5", label: "Instagram" },
  { key: "6", label: "E-mail" },
  { key: "7", label: "Na fujama" },
  { key: "8", label: "Bombeiros" },
  { key: "9", label: "Outros" },
];

const procedureBy = [
  { key: "1", label: "Resgate " },
  { key: "2", label: "Telefone " },
  { key: "3", label: "Whatsapp" },
  { key: "4", label: "Facebook" },
  { key: "5", label: "Instagram" },
  { key: "6", label: "E-mail" },
  { key: "7", label: "Sistema Ouvidoria" },
  { key: "8", label: "Animal não localizado" },
  { key: "9", label: "Outros" },
];

const ages = [
  { key: "1", label: "Filhote" },
  { key: "2", label: "Adulto" },
  { key: "3", label: "Idoso" },
  { key: "4", label: "Outros" },
];

const situations = [
  { key: "1", label: "Atropelamento" },
  { key: "2", label: "Caça" },
  { key: "3", label: "Ataque por Pets" },
  { key: "4", label: "Vidraça" },
  { key: "5", label: "Cativeiro" },
  { key: "6", label: "Outros" },
];

const postRescue = [
  { key: "1", label: "Soltura imediata" },
  { key: "2", label: "Veterinário + soltura/internação " },
  { key: "3", label: "Veterinário + soltura sem internação " },
  { key: "4", label: "Cetas" },
  { key: "5", label: "Obito" },
  { key: "6", label: "Butanta " },
  { key: "7", label: "Outros" },
];

const AnimalGroups = [
  { key: "1", label: "Mamifero" },
  { key: "2", label: "Répteis " },
  { key: "3", label: "Aves " },
  { key: "4", label: "Peixes" },
  { key: "5", label: "Anfibios" },
  { key: "7", label: "Outros" },
];

const allSpecies = [
  {
    id: "101",
    scientificName: "Canis lupus",
    commonName: "Lobo",
    groupId: "1",
  },
  {
    id: "102",
    scientificName: "Felis catus",
    commonName: "Gato",
    groupId: "1", // Mamíferos
  },
  {
    id: "201",
    scientificName: "Python regius",
    commonName: "Píton-real",
    groupId: "2", // Répteis
  },
  {
    id: "202",
    scientificName: "Chelonia mydas",
    commonName: "Tartaruga-verde",
    groupId: "2", // Répteis
  },
  {
    id: "301",
    scientificName: "Falco peregrinus",
    commonName: "Falcão-peregrino",
    groupId: "3", // Aves
  },
  {
    id: "302",
    scientificName: "Ara macao",
    commonName: "Arara-vermelha",
    groupId: "3", // Aves
  },
];

export default function App() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [filteredSpecies, setFilteredSpecies] = useState([]);

  useEffect(() => {
    console.log("Selected group:", selectedGroup);
    if (selectedGroup) {
      const speciesForGroup = allSpecies.filter(
        (species) => species.groupId === selectedGroup
      );
      setFilteredSpecies(speciesForGroup);
    } else {
      setFilteredSpecies([]);
    }
  }, [selectedGroup]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  console.log(watch("example")); // watch input value by passing the name of it
  console.log(watch("exampleRequired"));

  console.log(watch("Date"));
  console.log(watch("weight"));
  console.log(watch("height"));
  console.log(watch("length"));
  console.log(watch("width"));

  const onSubmit = async (data) => {
    //console.log("Data to submit:", data);
    const baseUrl = window.location.origin;

    const apiUrl = `${baseUrl}/api/rescue`;
    console.log(apiUrl);
    try {
      const response = await axios.post(apiUrl, data);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center max-w-full px-4 mx-auto sm:max-w-md"
    >
      <Controller
        name="date"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <DatePicker
            label="Dia da ocorrência"
            className="w-full max-w-[284px] mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="AnimalGroup"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="Qual o grupo do animal?"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              setSelectedGroup(value.target.value);
            }}
          >
            {AnimalGroups.map((AnimalGroups) => (
              <SelectItem key={AnimalGroups.key} value={AnimalGroups.key}>
                {AnimalGroups.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        name="Species"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="Qual a espécie do animal?"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange}
            disabled={!selectedGroup}
          >
            {filteredSpecies.map((species) => (
              <SelectItem key={species.id} value={species.id}>
                {`${species.commonName} - ${species.scientificName}`}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        name="weight"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            inputMode="numeric"
            label="Peso do animal "
            className="w-full max-w-[284px] mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <h3>Medidas</h3>
      <h4>Em centimetros</h4>
      <Controller
        name="height"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            inputMode="numeric"
            label="Altura do animal"
            className="w-full max-w-[284px] mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="length"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            inputMode="numeric"
            label="Comprimento do animal"
            className="w-full max-w-[284px] mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="width"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            inputMode="numeric"
            label="Largura do animal"
            className="w-full max-w-[284px] mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="adress"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            inputMode="text"
            label="Endereço do resgate"
            className="w-full max-w-[284px] mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="occurrence"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Textarea
            inputMode="text"
            label="O que ocorreu?"
            className="w-full max-w-[284px] mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="calledBy"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="O chamado é via?"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange} 
          >
            {calledBy.map((calledBy) => (
              <SelectItem key={calledBy.key} value={calledBy.key}>
                {calledBy.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />
      <Controller
        name="procedureBy"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="O procedimento foi via?"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange} 
          >
            {procedureBy.map((procedureBy) => (
              <SelectItem key={procedureBy.key} value={procedureBy.key}>
                {procedureBy.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />
      <Controller
        name="age"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="Idade do animal?"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange} 
          >
            {ages.map((ages) => (
              <SelectItem key={ages.key} value={ages.key}>
                {ages.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />
      <Controller
        name="situation"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="Situação do animal?"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange} 
          >
            {situations.map((situations) => (
              <SelectItem key={situations.key} value={situations.key}>
                {situations.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />
      <Controller
        name="postRescue"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="Pós o resgate"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange} 
          >
            {postRescue.map((postRescue) => (
              <SelectItem key={postRescue.key} value={postRescue.key}>
                {postRescue.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />
      <Controller
        name="observation"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Textarea
            inputMode="text"
            label="Alguma observação?"
            className="w-full max-w-[284px] mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="releaseLocation"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            inputMode="text"
            label="Endereço da soltura"
            className="w-full max-w-[284px] mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Button type="submit" className="mt-4 w-full sm:max-w-xs">
        Enviar
      </Button>
    </form>
  );
}
