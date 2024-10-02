import { Bluetooth } from "../../Som/Bluetooth";
import { baseString } from "./Commands";

export const sendCommand = async (command) => {
  try {
    // Aqui você enviaria o comando via Bluetooth, por exemplo
    // await sendCommand(baseString, command);
    console.log(`Enviando comando: ${baseString}${command}`);
  } catch (error) {
    console.error("Erro ao enviar comando via Bluetooth:", error);
  }
};