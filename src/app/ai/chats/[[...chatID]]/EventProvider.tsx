'use client';

import { useEventEmitter } from 'ahooks';
import { EventEmitter } from 'ahooks/lib/useEventEmitter';
import React from 'react';

export const EventContext = React.createContext<{
  eventEmitter?: EventEmitter<{ type: string; data: any }>;
}>({});
export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const eventEmitter = useEventEmitter() as EventEmitter<{
    type: string;
    data: any;
  }>;
  return (
    <EventContext.Provider value={{ eventEmitter }}>
      {children}
    </EventContext.Provider>
  );
};
