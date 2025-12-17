import fs from "fs";
import path from "path";
import { app } from "electron";
import { AppConfig } from "./types.js";

const CONFIG_FILE = "config.json";

const defaultConfig: AppConfig = {
  outputDirectory: null,
  sourcePort: Number(process.env.RECEIVER_PORT || 9000),
  destinationIp: "",
  destinationPort: Number(process.env.RECEIVER_PORT || 9000)
};

let cachedConfig: AppConfig | null = null;

function getConfigPath() {
  return path.join(app.getPath("userData"), CONFIG_FILE);
}

export function loadConfig(): AppConfig {
  if (cachedConfig !== null) return cachedConfig;

  const configPath = getConfigPath();

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    cachedConfig = defaultConfig;
    return cachedConfig as AppConfig;
  }

  const raw = fs.readFileSync(configPath, "utf-8");
  cachedConfig = { ...defaultConfig, ...JSON.parse(raw) };
  return cachedConfig as AppConfig;
}

export function saveConfig(partial: Partial<AppConfig>) {
  const config = { ...loadConfig(), ...partial };
  fs.writeFileSync(getConfigPath(), JSON.stringify(config, null, 2));
  cachedConfig = config;
}
