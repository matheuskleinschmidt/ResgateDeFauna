"use client";

import { React, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";  
import { DatePicker,Button, Input } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { TimeInput } from "@nextui-org/date-input";
import { parseDate, Time } from "@internationalized/date";
import useGeolocation from "../../../components/useGeolocation";
import { useRouter } from "next/navigation";
import utils from "../../../utils/datas.js";

export default function App({ params }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [filteredSpecies, setFilteredSpecies] = useState([]);
  const { getLocation, error } = useGeolocation();
  const router = useRouter();
  const { handleSubmit, setValue, control } = useForm();

  let calledBy = utils.calledBy
  let procedureBy = utils.procedureBy
  let ageRanges = utils.ageRanges 
  let situations = utils.situations
  let postRescue = utils.postRescue
  let AnimalGroups = utils.AnimalGroups
  let allSpecies = utils.allSpecies

  const [options, setOptions] = useState({
    calledBy,
    procedureBy,
    ageRanges,
    situations,
    postRescue,
    AnimalGroups,
    allSpecies,
  });

  const [isOptionsLoaded, setIsOptionsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const utils = localStorage.getItem("utils");
      const speciesAndAnimalGroups = localStorage.getItem(
        "speciesAndAnimalGroups"
      );

      const utilsParsedData = utils ? JSON.parse(utils) : {};
      const speciesAndAnimalGroupsParsedData = speciesAndAnimalGroups
        ? JSON.parse(speciesAndAnimalGroups)
        : {};

      console.log(utilsParsedData.calledBys);
      console.log(speciesAndAnimalGroupsParsedData);

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
      setIsOptionsLoaded(true);
    } else {
      setIsOptionsLoaded(true); 
    }
  }, []);

  useEffect(() => {
    if (isOptionsLoaded) {
      fetchRescueData();
    }
  }, [params.id, isOptionsLoaded]);

  const fetchRescueData = async () => {
    try {
      const baseUrl = window.location.origin;
      const apiUrl = `${baseUrl}/api/rescue/${params.id}`;
      const response = await axios.get(apiUrl);
      const dataResponse = response.data[0];
      console.log("Data Response:", dataResponse);

      setValue("Species", dataResponse.species.id.toString());

      setSelectedGroup(dataResponse.species.AnimalGroupId.toString());
      setValue("AnimalGroup", dataResponse.species.AnimalGroupId.toString());

      const dateString = dataResponse.fullDate.split("T")[0];
      const dateValue = parseDate(dateString);
      setValue("date", dateValue);

      const timeString = dataResponse.fullDate.split("T")[1];
      const timeParts = timeString.split(":");
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      const timeValue = new Time(hours, minutes);
      setValue("time", timeValue);

      setValue(
        "locationCoordinates",
        `${
          dataResponse.locationCoordinates != null
            ? dataResponse.locationCoordinates.latitude
            : ""
        }, ${
          dataResponse.locationCoordinates != null
            ? dataResponse.locationCoordinates.longitude
            : ""
        }`
      );
      setValue("weight", dataResponse.weight);
      setValue("adress", dataResponse.address);
      setValue("occurrence", dataResponse.occurrence);
      setValue("observation", dataResponse.observation);

      setValue(
        "releaseLocationCoordinates",
        dataResponse.releaseLocationCoordinates
          ? `${dataResponse.releaseLocationCoordinates.latitude}, ${dataResponse.releaseLocationCoordinates.longitude}`
          : ""
      );

      setValue("height", dataResponse.measurement.height);
      setValue("length", dataResponse.measurement.length);
      setValue("width", dataResponse.measurement.width);

      const normalizeString = (str) => str.toString().toLowerCase().trim();

      const ageRangeName = dataResponse.ageRange?.name.toString() || null;
      let ageKey = null;

      if (ageRangeName && Array.isArray(options.ageRanges)) {
        const ageItem = options.ageRanges.find(
          (item) =>
            normalizeString(item.label) === normalizeString(ageRangeName)
        );
        ageKey = ageItem ? ageItem.key.toString() : null;
      }
      setValue("ageRange", ageKey);

      const calledByName = dataResponse.calledBy?.name || null;
      let calledByKey = null;

      if (calledByName && Array.isArray(options.calledBy)) {
        const calledByItem = options.calledBy.find(
          (item) =>
            normalizeString(item.label) === normalizeString(calledByName)
        );
        calledByKey = calledByItem ? calledByItem.key.toString() : null;
      }
      setValue("calledBy", calledByKey);

      const procedureByName =
        dataResponse.procedureOrientationBy?.name || null;
      let procedureByKey = null;
      if (procedureByName && Array.isArray(options.procedureBy)) {
        const procedureByItem = options.procedureBy.find(
          (item) =>
            normalizeString(item.label) === normalizeString(procedureByName)
        );
        procedureByKey = procedureByItem
          ? procedureByItem.key.toString()
          : null;
      }
      setValue("procedureBy", procedureByKey);

      const situationName = dataResponse.situation?.name || null;
      let situationKey = null;

      if (situationName && Array.isArray(options.situations)) {
        const situationItem = options.situations.find(
          (item) =>
            normalizeString(item.label) === normalizeString(situationName)
        );
        situationKey = situationItem ? situationItem.key.toString() : null;
      }
      setValue("situation", situationKey);

      const postRescueName = dataResponse.postRescue?.name || null;
      let postRescueKey = null;

      if (postRescueName && Array.isArray(options.postRescue)) {
        const postRescueItem = options.postRescue.find(
          (item) =>
            normalizeString(item.label) === normalizeString(postRescueName)
        );
        postRescueKey = postRescueItem ? postRescueItem.key.toString() : null;
      }
      setValue("postRescue", postRescueKey);
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
    }
  };

  useEffect(() => {
    if (selectedGroup) {
      const speciesForGroup = options.allSpecies.filter(
        (species) => species.AnimalGroupId.toString() === selectedGroup
      );
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
    const apiUrl = `${baseUrl}/api/rescue/${params.id}`;
    try {
      const response = await axios.put(apiUrl, data);
      console.log("Response:", response.data);
      window.alert("Registro editado com sucesso!");
      router.push("/pages/rescue");
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja deletar este resgate?"
    );
    if (!confirmDelete) return;
    const baseUrl = window.location.origin;
    const apiUrl = `${baseUrl}/api/rescue/${params.id}`;
    try {
      await axios.delete(apiUrl);
      window.alert("Registro deletado com sucesso!");
      router.push("/pages/rescue");
    } catch (error) {
      console.error("Erro ao deletar registro:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center max-w-full px-4 mx-auto sm:max-w-md"
    >
      {/* Time Input */}
      <Controller
        name="time"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <TimeInput
            label="Hora do evento"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange}
            isRequired
          />
        )}
      />

      {/* Date Picker */}
      <Controller
        name="date"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <DatePicker
            label="Dia da ocorrência"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange}
            isRequired
          />
        )}
      />

      {/* Location Coordinates */}
      <Controller
        name="locationCoordinates"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            className="w-full max-w-xs mb-4"
            label="Localização do resgate"
            placeholder="Clique no botão para preencher"
            value={field.value}
            onChange={field.onChange}
            isRequired
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

      {/* Animal Group Selection */}
      <Controller
        name="AnimalGroup"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="Qual o grupo do animal?"
            className="w-full max-w-xs mb-4"
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            isRequired
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
              setSelectedGroup(selectedKey);
            }}
          >
            {options.AnimalGroups.map((AnimalGroup) => (
              <SelectItem key={AnimalGroup.id} value={AnimalGroup.id}>
                {AnimalGroup.groupName}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      {/* Species Selection */}
      <Controller
        name="Species"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="Qual a espécie do animal?"
            className="w-full max-w-xs mb-4"
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            isRequired
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
            }}
            disabled={!selectedGroup}
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

      {/* Weight Input */}
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
          />
        )}
      />

      {/* Measurements */}
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
          />
        )}
      />

      {/* Address Input */}
      <Controller
        name="adress"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            inputMode="text"
            label="Endereço do resgate"
            className="w-full max-w-xs mb-4"
            value={field.value || ""}
            onChange={field.onChange}
          />
        )}
      />

      {/* Occurrence Description */}
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
          />
        )}
      />

      {/* Called By Selection */}
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

      {/* Procedure By Selection */}
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

      {/* Age Range Selection */}
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
          >
            {options.ageRanges.map((age) => (
              <SelectItem
                key={age.key.toString()}
                value={age.key.toString()}
              >
                {age.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      {/* Situation Selection */}
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

      {/* Post Rescue Selection */}
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

      {/* Observation */}
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
          />
        )}
      />

      {/* Release Location Coordinates */}
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

      {/* Delete and Submit Buttons */}
      <Button
        color="danger"
        className="w-full max-w-xs mb-4"
        variant="bordered"
        onClick={handleDelete}
      >
        Deletar Resgate
      </Button>

      <Button type="submit" className="w-full max-w-xs mb-4">
        Atualizar
      </Button>
    </form>
  );
}
