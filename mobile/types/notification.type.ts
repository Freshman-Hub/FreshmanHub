export interface PushToken {
  userId: string;
  token: string;
  deviceInfo: {
    platform: string;
    deviceName: string;
    deviceType: string;
  };
  createdAt: string;
  lastUsed: string;
  isActive: boolean;
  deactivatedAt?: string;
}
