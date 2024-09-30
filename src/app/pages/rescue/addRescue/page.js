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
import {TimeInput} from "@nextui-org/date-input";
import useGeolocation from "../../../components/useGeolocation";
import data from "../../../utils/datas.js";
import { useRouter } from "next/navigation"; 

export default function App() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [filteredSpecies, setFilteredSpecies] = useState([]);
  const { location, getLocation, error } = useGeolocation();
  const router = useRouter();

  const handleGetLocation = async (field) => {
    try {
      const location = await getLocation();
      if (location.latitude && location.longitude) {
        setValue(field, `${location.latitude}, ${location.longitude}`);
      } else {
        console.error("Localização não encontrada");
      }
    } catch (error) {
      console.error("Erro ao obter localização:", error);
    }
  };


  useEffect(() => {
    if (selectedGroup) {
      const speciesForGroup = data.allSpecies.filter(
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
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const baseUrl = window.location.origin;
    const apiUrl = `${baseUrl}/api/rescue`;

    try {
      const response = await axios.post(apiUrl, data);
      console.log("Response:", response.data);
      window.alert("Registro criado com sucesso!");
      router.push("/pages/rescue");
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
        name="time"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <TimeInput
            isRequired
            label="Hora do evento"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="date"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <DatePicker
            isRequired
            label="Dia da ocorrência"
            className="w-full max-w-xs mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="locationCoordinates"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            isRequired
            className="w-full max-w-xs mb-4"
            label="Localização do resgate"
            placeholder="Clique no botão para preencher"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {error && <p>Erro: {error}</p>}
      <Button
        className="w-full max-w-xs mb-4"
        onClick={() => handleGetLocation("locationCoordinates")}
      >
        Obter Localização do Resgate
      </Button>

      <Controller
        name="AnimalGroup"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            isRequired
            label="Qual o grupo do animal?"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              setSelectedGroup(value.target.value);
            }}
          >
            {data.AnimalGroups.map((AnimalGroups) => (
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
            isRequired
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
            type="number"
            placeholder="0.00"
            label="Peso do animal (Kg)"
            className="w-full max-w-xs mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <h3>Medidas</h3>
      <h4>Em metros</h4>
      <Controller
        name="height"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            type="number"
            placeholder="0.00"
            label="Altura do animal"
            className="w-full max-w-xs mb-4"
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
            type="number"
            placeholder="0.00"
            label="Comprimento do animal"
            className="w-full max-w-xs mb-4"
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
            type="number"
            placeholder="0.00"
            label="Largura do animal"
            className="w-full max-w-xs mb-4"
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
            className="w-full max-w-xs mb-4"
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
            className="w-full max-w-xs mb-4"
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
            {data.calledBy.map((calledBy) => (
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
            {data.procedureBy.map((procedureBy) => (
              <SelectItem key={procedureBy.key} value={procedureBy.key}>
                {procedureBy.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        name="ageRange"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="Idade do animal?"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange}
          >
            {data.ageRanges.map((ages) => (
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
            {data.situations.map((situations) => (
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
            {data.postRescue.map((postRescue) => (
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
            className="w-full max-w-xs mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {/* <Controller
        name="releaseLocation"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            inputMode="text"
            label="Endereço da soltura"
            className="w-full max-w-xs mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      /> */}

      <Controller
        name="releaseLocationCoordinates"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            className="w-full max-w-xs mb-4"
            label="Localização da soltura"
            placeholder="Clique no botão para preencher"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Button
        className="w-full max-w-xs mb-4"
        onClick={() => handleGetLocation("releaseLocationCoordinates")}
      >
        Obter Localização da Soltura
      </Button>

      <Button type="submit" className="mt-4 w-full sm:max-w-xs mb-4">
        Enviar
      </Button>
    </form>
  );
}
