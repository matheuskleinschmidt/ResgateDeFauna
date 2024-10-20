"use client";

import { React, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { Input, Button, DatePicker } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { TimeInput } from "@nextui-org/date-input";
import useGeolocation from "../../../components/useGeolocation";
import utils from "../../../utils/datas.js";
import { useRouter } from "next/navigation";

export default function App() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [filteredSpecies, setFilteredSpecies] = useState([]);

  const { getLocation, error } = useGeolocation();
  const router = useRouter();

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const [options, setOptions] = useState({
    calledBy: utils.calledBy,
    procedureBy: utils.procedureBy,
    ageRanges: utils.ageRanges,
    situations: utils.situations,
    postRescue: utils.postRescue,
    AnimalGroups: utils.AnimalGroups,
    allSpecies: utils.allSpecies,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const utilsData = localStorage.getItem("utils");
      const speciesAndAnimalGroupsData = localStorage.getItem(
        "speciesAndAnimalGroups"
      );

      const utilsParsedData = utilsData ? JSON.parse(utilsData) : {};
      const speciesAndAnimalGroupsParsedData = speciesAndAnimalGroupsData
        ? JSON.parse(speciesAndAnimalGroupsData)
        : {};

      const updatedOptions = {
        calledBy: utilsParsedData.calledBys || options.calledBy,
        procedureBy:
          utilsParsedData.procedureOrientationBys || options.procedureBy,
        ageRanges: utilsParsedData.ageRanges || options.ageRanges,
        situations: utilsParsedData.situations || options.situations,
        postRescue: utilsParsedData.postRescues || options.postRescue,
        AnimalGroups:
          speciesAndAnimalGroupsParsedData.animalGroups || options.AnimalGroups,
        allSpecies:
          speciesAndAnimalGroupsParsedData.species || options.allSpecies,
      };

      setOptions(updatedOptions);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      const speciesForGroup = options.allSpecies.filter(
        (species) => species.AnimalGroupId.toString() === selectedGroup
      );
      console.log("Species for group:", speciesForGroup);
      setFilteredSpecies(speciesForGroup);
    } else {
      setFilteredSpecies([]);
    }
  }, [selectedGroup, options.allSpecies]);

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

  const onSubmit = async (data) => {
    const baseUrl = window.location.origin;
    const apiUrl = `${baseUrl}/api/rescue`;
    console.log("Data:", data);
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
            data-testid="time"
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
            data-testid="date"
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
            data-testid="locationCoordinates"
          />
        )}
      />
      {error && <p>Erro: {error}</p>}
      <Button
        className="w-full max-w-xs mb-4"
        data-testid="getLocationButton"
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
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            data-testid="AnimalGroup"
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
              setSelectedGroup(selectedKey);
            }}
          >
            {options.AnimalGroups.map((AnimalGroup) => (
              <SelectItem
                key={AnimalGroup.id}
                value={AnimalGroup.id}
              >
                {AnimalGroup.groupName}
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
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
            }}
            disabled={!selectedGroup}
            data-testid="Species"
          >
            {filteredSpecies.map((species) => (
              <SelectItem
                key={species.id.toString()}
                value={species.id.toString()}
              >
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
            value={field.value || ""}
            onChange={field.onChange}
            data-testid="weight"
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
            value={field.value || ""}
            onChange={field.onChange}
            data-testid="height"
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
            value={field.value || ""}
            onChange={field.onChange}
            data-testid="length"
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
            value={field.value || ""}
            onChange={field.onChange}
            data-testid="width"
          />
        )}
      />

      <Controller
        name="address"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            inputMode="text"
            label="Endereço do resgate"
            className="w-full max-w-xs mb-4"
            value={field.value || ""}
            onChange={field.onChange}
            data-testid="address"
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
            value={field.value || ""}
            onChange={field.onChange}
            data-testid="occurrence"
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
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
            }}
            data-testid="calledBy"
          >
            {options.calledBy.map((calledBy) => (
              <SelectItem
                key={calledBy.key.toString()}
                value={calledBy.key.toString()}
              >
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
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
            }}
            data-testid="procedureBy"
          >
            {options.procedureBy.map((procedureBy) => (
              <SelectItem
                key={procedureBy.key.toString()}
                value={procedureBy.key.toString()}
              >
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
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
            }}
            data-testid="ageRange"
          >
            {options.ageRanges.map((ages) => (
              <SelectItem
                key={ages.key.toString()}
                value={ages.key.toString()}
              >
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
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
            }}
            data-testid="situation"
          >
            {options.situations.map((situation) => (
              <SelectItem
                key={situation.key.toString()}
                value={situation.key.toString()}
              >
                {situation.label}
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
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
            }}
            data-testid="postRescue"
          >
            {options.postRescue.map((postRescue) => (
              <SelectItem
                key={postRescue.key.toString()}
                value={postRescue.key.toString()}
              >
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
            value={field.value || ""}
            onChange={field.onChange}
            data-testid="observation"
          />
        )}
      />

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
            data-testid="releaseLocationCoordinates"
          />
        )}
      />
      <Button
        className="w-full max-w-xs mb-4"
        data-testid="getReleaseLocationButton"
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
