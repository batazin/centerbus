export const branches = [
  { state: "SP", name: "Center Ônibus SP", title: "Matriz · São Paulo", city: "São Paulo - SP", address: "Rua Dias da Silva, 348", cep: "02114-000", phone: "(11) 2967-3002", whatsapp: "551129673002" },
  { state: "BA", name: "Center Bahia", title: "Filial · Bahia", city: "Lauro de Freitas - BA", address: "Rua Pelicano, 495", cep: "42701-340", phone: "(71) 9982-2458", whatsapp: "557199822458" },
  { state: "RJ", name: "Center RJ", title: "Filial · Rio de Janeiro", city: "Rio de Janeiro - RJ", address: "Estrada dos Bandeirantes, 28.501 · Vargem Grande", cep: "22785-276", phone: "(21) 97201-2525", whatsapp: "5521972012525" },
] as const;

export function branchWhatsapp(branch: typeof branches[number]) {
  return `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(`Olá, ${branch.name}! Vim pelo site e gostaria de consultar uma peça de carroceria.`)}`;
}
