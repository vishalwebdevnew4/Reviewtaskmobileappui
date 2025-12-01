import { Capacitor } from '@capacitor/core';

// Check if running in native app
export const isNative = () => Capacitor.isNativePlatform();

// Check if running in web browser
export const isWeb = () => !Capacitor.isNativePlatform();

// Get platform name
export const getPlatform = () => Capacitor.getPlatform();

