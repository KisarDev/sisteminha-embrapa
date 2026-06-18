import { SensorType, AlertSeverity, AlertType, SensorReading } from "@prisma/client";
import { IAlertRepository } from "@/src/modules/iot/interfaces/IAlertRepository";

type ThresholdRule = {
  min?: number;
  max?: number;
  alertTypeHigh?: AlertType;
  alertTypeLow?: AlertType;
  severityHigh?: AlertSeverity;
  severityLow?: AlertSeverity;
};

const THRESHOLDS: Record<SensorType, ThresholdRule> = {
  CHICKEN_TEMPERATURE: {
    min: 18,
    max: 34,
    alertTypeHigh: AlertType.TEMPERATURE_HIGH,
    alertTypeLow: AlertType.TEMPERATURE_LOW,
    severityHigh: AlertSeverity.CRITICAL,
    severityLow: AlertSeverity.WARNING,
  },
  CHICKEN_LUMINOSITY: {
    min: 150,
    alertTypeLow: AlertType.LUMINOSITY_LOW,
    severityLow: AlertSeverity.WARNING,
  },
  QUAIL_TEMPERATURE: {
    min: 18,
    max: 32,
    alertTypeHigh: AlertType.TEMPERATURE_HIGH,
    alertTypeLow: AlertType.TEMPERATURE_LOW,
    severityHigh: AlertSeverity.CRITICAL,
    severityLow: AlertSeverity.WARNING,
  },
  QUAIL_LUMINOSITY: {
    min: 120,
    alertTypeLow: AlertType.LUMINOSITY_LOW,
    severityLow: AlertSeverity.WARNING,
  },
  WORMFARM_SOIL_TEMPERATURE: {
    min: 16,
    max: 28,
    alertTypeHigh: AlertType.TEMPERATURE_HIGH,
    alertTypeLow: AlertType.TEMPERATURE_LOW,
    severityHigh: AlertSeverity.WARNING,
    severityLow: AlertSeverity.WARNING,
  },
  WORMFARM_SOIL_HUMIDITY: {
    min: 45,
    max: 90,
    alertTypeHigh: AlertType.HUMIDITY_HIGH,
    alertTypeLow: AlertType.HUMIDITY_LOW,
    severityHigh: AlertSeverity.WARNING,
    severityLow: AlertSeverity.WARNING,
  },
  COMPOST_TEMPERATURE: {
    min: 30,
    max: 70,
    alertTypeHigh: AlertType.TEMPERATURE_HIGH,
    alertTypeLow: AlertType.TEMPERATURE_LOW,
    severityHigh: AlertSeverity.WARNING,
    severityLow: AlertSeverity.INFO,
  },
  COMPOST_HUMIDITY: {
    min: 35,
    max: 80,
    alertTypeHigh: AlertType.HUMIDITY_HIGH,
    alertTypeLow: AlertType.HUMIDITY_LOW,
    severityHigh: AlertSeverity.WARNING,
    severityLow: AlertSeverity.WARNING,
  },
  PLANTING_SOIL_HUMIDITY: {
    min: 20,
    alertTypeLow: AlertType.SOIL_DRY,
    severityLow: AlertSeverity.WARNING,
  },
  FISH_TANK_PH: {
    min: 6.5,
    max: 8.5,
    alertTypeHigh: AlertType.PH_OUT_OF_RANGE,
    alertTypeLow: AlertType.PH_OUT_OF_RANGE,
    severityHigh: AlertSeverity.CRITICAL,
    severityLow: AlertSeverity.CRITICAL,
  },
  FISH_TANK_WATER_LEVEL: {
    min: 30,
    alertTypeLow: AlertType.WATER_LEVEL_LOW,
    severityLow: AlertSeverity.CRITICAL,
  },
};

export class AlertService {
  constructor(private readonly alertRepository: IAlertRepository) {}

  async checkThresholds(reading: SensorReading) {
    const rule = THRESHOLDS[reading.sensorType];
    if (!rule) return null;

    const alerts = [];

    // Check maximum threshold
    if (rule.max !== undefined && reading.value > rule.max && rule.alertTypeHigh && rule.severityHigh) {
      const alert = await this.alertRepository.create({
        type: rule.alertTypeHigh,
        severity: rule.severityHigh,
        sensorType: reading.sensorType,
        message: `${this.getSensorLabel(reading.sensorType)} acima do limite: ${reading.value.toFixed(2)} (limite: ${rule.max})`,
        value: reading.value,
        threshold: rule.max,
        sensorReadingId: reading.id,
      });
      alerts.push(alert);
    }

    // Check minimum threshold
    if (rule.min !== undefined && reading.value < rule.min && rule.alertTypeLow && rule.severityLow) {
      const alert = await this.alertRepository.create({
        type: rule.alertTypeLow,
        severity: rule.severityLow,
        sensorType: reading.sensorType,
        message: `${this.getSensorLabel(reading.sensorType)} abaixo do limite: ${reading.value.toFixed(2)} (limite: ${rule.min})`,
        value: reading.value,
        threshold: rule.min,
        sensorReadingId: reading.id,
      });
      alerts.push(alert);
    }

    return alerts;
  }

  async getActiveAlerts(sensorType?: SensorType) {
    if (sensorType) {
      return this.alertRepository.findBySensorType(sensorType);
    }
    return this.alertRepository.findUnresolved();
  }

  async resolveAlert(alertId: string) {
    return this.alertRepository.markAsResolved(alertId);
  }

  private getSensorLabel(sensorType: SensorType): string {
    const labels: Record<SensorType, string> = {
      CHICKEN_TEMPERATURE: "Temperatura das Galinhas",
      CHICKEN_LUMINOSITY: "Luminosidade das Galinhas",
      QUAIL_TEMPERATURE: "Temperatura das Codornas",
      QUAIL_LUMINOSITY: "Luminosidade das Codornas",
      WORMFARM_SOIL_TEMPERATURE: "Temperatura do Solo do Minhocário",
      WORMFARM_SOIL_HUMIDITY: "Umidade do Solo do Minhocário",
      COMPOST_TEMPERATURE: "Temperatura da Composteira",
      COMPOST_HUMIDITY: "Umidade da Composteira",
      PLANTING_SOIL_HUMIDITY: "Umidade do Solo do Plantio",
      FISH_TANK_PH: "pH do Tanque de Peixes",
      FISH_TANK_WATER_LEVEL: "Nível da Água do Tanque",
    };
    return labels[sensorType] || sensorType;
  }
}
