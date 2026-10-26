export const centerOffices = [
  {
    id: "sp",
    title: "Matriz",
    shortLabel: "São Paulo",
    city: "São Paulo - SP",
    address: "Rua Dias da Silva, 348",
    cep: "CEP: 02114-000",
    phones: ["11 2967-3002"],
    mapQuery: "Rua Dias da Silva, 348, São Paulo - SP, 02114-000",
  },
  {
    id: "ba",
    title: "Filial: Bahia",
    shortLabel: "Bahia",
    city: "Lauro de Freitas - BA",
    address: "Rua Pelicano, 495",
    cep: "CEP: 42701-340",
    phones: ["71 3377-0770", "71 3252-5933"],
    mapQuery: "Rua Pelicano, 495, Lauro de Freitas - BA, 42701-340",
  },
  {
    id: "rj",
    title: "Filial: Rio de Janeiro",
    shortLabel: "Rio de Janeiro",
    city: "Vargem Grande - RJ",
    address: "Estrada dos Bandeirantes, 28501",
    cep: "CEP: 22785-276",
    phones: ["21 2391-1182", "21 97201-2525"],
    mapQuery: "Estrada dos Bandeirantes, 28501, Vargem Grande, Rio de Janeiro - RJ, 22785-276",
  },
] as const;

export type CenterOffice = (typeof centerOffices)[number];
