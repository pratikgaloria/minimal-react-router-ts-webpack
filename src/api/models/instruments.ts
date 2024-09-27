export type TInstrumentMeta = {
  country: string;
  exchange: string;
  sector: string;
  industry: string;
};

export type TInstrument = Record<string, TInstrumentMeta>;