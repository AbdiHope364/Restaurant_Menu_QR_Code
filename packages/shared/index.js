import apiClient from './api/apiClient';
import { menuApi } from './api/menuApi';
import { ordersService } from './api/ordersService';
import {
  SettingsProvider,
  useSettings,
  THEME_PRESETS,
  CURRENCY_OPTIONS,
  DEFAULT_SETTINGS,
} from './settings/settingsContext';

export {
  apiClient,
  menuApi,
  ordersService,
  SettingsProvider,
  useSettings,
  THEME_PRESETS,
  CURRENCY_OPTIONS,
  DEFAULT_SETTINGS,
};
