import React from 'react';
import { useDevice } from './useDevice';
import { DesktopView } from './DesktopView';
import { MobileTabletView } from './MobileTabletView';

export function DeviceRouter() {
  const { isDesktop } = useDevice();

  return isDesktop ? <DesktopView /> : <MobileTabletView />;
}

export default DeviceRouter;

