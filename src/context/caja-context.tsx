import { createContext } from "react";

interface OptionI {
  ingress: number;
}

const initialIngress = {
  ingress: 0,
};

interface OptionE {
  egress: number;
}

const initialEgress = {
  egress: 0,
};

const PagoContext = createContext({
  summaryIngress: initialIngress,
  setSummaryIngress: (value: OptionI) => {},
  summaryEgress: initialEgress,
  setSummaryEgress: (value: OptionE) => {},
});

const PagoProvider = PagoContext.Provider;
const PagoConsumer = PagoContext.Consumer;

export { PagoProvider, PagoConsumer, PagoContext };
