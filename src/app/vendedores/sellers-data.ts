export type Seller = {
  id: string;
  name: string;
  state: "SP" | "BA" | "RJ";
  stateName: string;
  unit: string;
  email: string;
  phone: string;
  extension?: string;
  whatsapp?: string;
  whatsappFormatted?: string;
  fotoImage: string;
  cardImage: string;
};

export const sellersList: Seller[] = [
  {
    "id": "andre",
    "name": "André",
    "state": "SP",
    "stateName": "São Paulo",
    "unit": "Matriz — São Paulo",
    "email": "andre@centeronibus.com.br",
    "phone": "(11) 2967-3002",
    "extension": "227",
    "whatsapp": "5511994340243",
    "whatsappFormatted": "(11) 99434-0243",
    "fotoImage": "/images/vendedores/retratos-2026/andre.webp",
    "cardImage": "/images/vendedores/Andre_novo.png"
  },
  {
    "id": "atilas",
    "name": "Atilas",
    "state": "SP",
    "stateName": "São Paulo",
    "unit": "Matriz — São Paulo",
    "email": "atilas@centeronibus.com.br",
    "phone": "(11) 2967-3002",
    "extension": "212",
    "whatsapp": "5511963170689",
    "whatsappFormatted": "(11) 96317-0689",
    "fotoImage": "/images/vendedores/retratos-2026/atilas.webp",
    "cardImage": "/images/vendedores/Atilas.png"
  },
  {
    "id": "diego-ueda",
    "name": "Diego Ueda",
    "state": "SP",
    "stateName": "São Paulo",
    "unit": "Matriz — São Paulo",
    "email": "diego.ueda@centeronibus.com.br",
    "phone": "(11) 2967-3002",
    "extension": "236",
    "fotoImage": "/images/vendedores/retratos-2026/diego-ueda.webp",
    "cardImage": "/images/vendedores/Diego_Ueda-2.png"
  },
  {
    "id": "erick",
    "name": "Erick",
    "state": "SP",
    "stateName": "São Paulo",
    "unit": "Matriz — São Paulo",
    "email": "",
    "phone": "",
    "cardImage": "",
    "fotoImage": "/images/vendedores/retratos-2026/erick.webp"
  },
  {
    "id": "ferreira",
    "name": "Ferreira",
    "state": "SP",
    "stateName": "São Paulo",
    "unit": "Matriz — São Paulo",
    "email": "ferreira@centeronibus.com.br",
    "phone": "(11) 2967-3002",
    "extension": "204",
    "whatsapp": "5511994291546",
    "whatsappFormatted": "(11) 99429-1546",
    "fotoImage": "/images/vendedores/retratos-2026/ferreira.webp",
    "cardImage": "/images/vendedores/Ferreira.png"
  },
  {
    "id": "gelson-santos",
    "name": "Gelson Santos",
    "state": "SP",
    "stateName": "São Paulo",
    "unit": "Matriz — São Paulo",
    "email": "gelson.santos@centeronibus.com.br",
    "phone": "(11) 2967-3002",
    "extension": "225",
    "whatsapp": "5511994257186",
    "whatsappFormatted": "(11) 99425-7186",
    "fotoImage": "/images/vendedores/retratos-2026/gelson-santos.webp",
    "cardImage": "/images/vendedores/Gelson-2.png"
  },
  {
    "id": "gesrael-silva",
    "name": "Gesrael Silva",
    "state": "SP",
    "stateName": "São Paulo",
    "unit": "Matriz — São Paulo",
    "email": "gesa.vendas@centeronibus.com.br",
    "phone": "(11) 2967-3002",
    "extension": "247",
    "whatsapp": "5511993580684",
    "whatsappFormatted": "(11) 99358-0684",
    "fotoImage": "/images/vendedores/retratos-2026/gesrael-silva.webp",
    "cardImage": "/images/vendedores/Gesrael_Silva-2.png"
  },
  {
    "id": "jackson",
    "name": "Jackson",
    "state": "SP",
    "stateName": "São Paulo",
    "unit": "Matriz — São Paulo",
    "email": "",
    "phone": "",
    "cardImage": "",
    "fotoImage": "/images/vendedores/retratos-2026/jackson.webp"
  },
  {
    "id": "leandro-francisco",
    "name": "Leandro Francisco",
    "state": "SP",
    "stateName": "São Paulo",
    "unit": "Matriz — São Paulo",
    "email": "leandro.francisco@centeronibus.com.br",
    "phone": "(11) 2967-3002",
    "extension": "240",
    "fotoImage": "/images/vendedores/retratos-2026/leandro-francisco.webp",
    "cardImage": "/images/vendedores/Leandro.png"
  },
  {
    "id": "mario",
    "name": "Mario",
    "state": "SP",
    "stateName": "São Paulo",
    "unit": "Matriz — São Paulo",
    "email": "mario@centeronibus.com.br",
    "phone": "(11) 2967-3002",
    "extension": "206",
    "whatsapp": "5511994317333",
    "whatsappFormatted": "(11) 99431-7333",
    "fotoImage": "/images/vendedores/retratos-2026/mario.webp",
    "cardImage": "/images/vendedores/Mario.png"
  },
  {
    "id": "paulo",
    "name": "Paulinho",
    "state": "SP",
    "stateName": "São Paulo",
    "unit": "Matriz — São Paulo",
    "email": "paulo@centeronibus.com.br",
    "phone": "(11) 2967-3002",
    "extension": "209",
    "whatsapp": "5511994328643",
    "whatsappFormatted": "(11) 99432-8643",
    "fotoImage": "/images/vendedores/retratos-2026/paulo.webp",
    "cardImage": "/images/vendedores/Paulo.png"
  },
  {
    "id": "ronaldo",
    "name": "Ronaldo",
    "state": "SP",
    "stateName": "São Paulo",
    "unit": "Matriz — São Paulo",
    "email": "ronaldo@centeronibus.com.br",
    "phone": "(11) 2967-3002",
    "extension": "203",
    "whatsapp": "5511994363736",
    "whatsappFormatted": "(11) 99436-3736",
    "fotoImage": "/images/vendedores/retratos-2026/ronaldo.webp",
    "cardImage": "/images/vendedores/Ronaldo.png"
  },
  {
    "id": "saulo-santos",
    "name": "Saulo Santos",
    "state": "SP",
    "stateName": "São Paulo",
    "unit": "Matriz — São Paulo",
    "email": "saulo.santos@centeronibus.com.br",
    "phone": "(11) 2967-3002",
    "extension": "243",
    "whatsapp": "5511963190799",
    "whatsappFormatted": "(11) 96319-0799",
    "fotoImage": "/images/vendedores/retratos-2026/saulo-santos.webp",
    "cardImage": "/images/vendedores/Saulo_Santos-1.png"
  },
  {
    "id": "washington",
    "name": "Washington",
    "state": "SP",
    "stateName": "São Paulo",
    "unit": "Matriz — São Paulo",
    "email": "washington@centeronibus.com.br",
    "phone": "(11) 2967-3002",
    "extension": "208",
    "whatsapp": "5511994382672",
    "whatsappFormatted": "(11) 99438-2672",
    "fotoImage": "/images/vendedores/retratos-2026/washington.webp",
    "cardImage": "/images/vendedores/Washington.png"
  },
  {
    "id": "luciano",
    "name": "Luciano",
    "state": "BA",
    "stateName": "Bahia",
    "unit": "Filial — Lauro de Freitas / BA",
    "email": "",
    "phone": "",
    "cardImage": "",
    "fotoImage": "/images/vendedores/retratos-2026/luciano.webp"
  },
  {
    "id": "raimundo-barbosa",
    "name": "Raimundo Barbosa",
    "state": "BA",
    "stateName": "Bahia",
    "unit": "Filial — Lauro de Freitas / BA",
    "email": "raimundo.barbosa@centeronibus.com.br",
    "phone": "(71) 9982-2458",
    "whatsapp": "5571987773354",
    "whatsappFormatted": "(71) 98777-3354",
    "fotoImage": "/images/vendedores/retratos-2026/raimundo-barbosa.webp",
    "cardImage": "/images/vendedores/Raimundo-Barbosa-2.png"
  },
  {
    "id": "raimundo-costa",
    "name": "Raimundo Costa",
    "state": "BA",
    "stateName": "Bahia",
    "unit": "Filial — Lauro de Freitas / BA",
    "email": "costaba@centeronibus.com.br",
    "phone": "(71) 9982-2458",
    "whatsapp": "5571988853349",
    "whatsappFormatted": "(71) 98885-3349",
    "fotoImage": "/images/vendedores/retratos-2026/raimundo-costa.webp",
    "cardImage": "/images/vendedores/Raimundo-Costa-5.png"
  },
  {
    "id": "catia",
    "name": "Catia",
    "state": "RJ",
    "stateName": "Rio de Janeiro",
    "unit": "Filial — Rio de Janeiro / RJ",
    "email": "",
    "phone": "",
    "cardImage": "",
    "fotoImage": "/images/vendedores/retratos-2026/catia.webp"
  },
  {
    "id": "eduardo",
    "name": "Eduardo",
    "state": "RJ",
    "stateName": "Rio de Janeiro",
    "unit": "Filial — Rio de Janeiro / RJ",
    "email": "",
    "phone": "",
    "cardImage": "",
    "fotoImage": "/images/vendedores/retratos-2026/eduardo.webp"
  },
  {
    "id": "leonardo",
    "name": "Leonardo",
    "state": "RJ",
    "stateName": "Rio de Janeiro",
    "unit": "Filial — Rio de Janeiro / RJ",
    "email": "",
    "phone": "",
    "cardImage": "",
    "fotoImage": "/images/vendedores/retratos-2026/leonardo.webp"
  },
  {
    "id": "silas",
    "name": "Silas",
    "state": "RJ",
    "stateName": "Rio de Janeiro",
    "unit": "Filial — Rio de Janeiro / RJ",
    "email": "",
    "phone": "",
    "cardImage": "",
    "fotoImage": "/images/vendedores/retratos-2026/silas.webp"
  }
];
