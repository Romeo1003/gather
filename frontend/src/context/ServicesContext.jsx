import { createContext, useContext } from 'react';

export const ServicesContext = createContext({
  apiClient: null,
  authService: null,
  eventService: null,
  paymentService: null
});

export const ServicesProvider = ({ children, services }) => (
  <ServicesContext.Provider value={services}>
    {children}
  </ServicesContext.Provider>
);

export const useServices = () => useContext(ServicesContext);