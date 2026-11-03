import { branches } from "../_content/branches";

export function BranchMap({ branch }: { branch: typeof branches[number] }) {
  const address = `${branch.address}, ${branch.city}, ${branch.cep}`;
  return <div className="office-map google-branch-map">
    <iframe title={`Google Maps · ${branch.name}`} src={`https://maps.google.com/maps?hl=pt-BR&q=${encodeURIComponent(address)}&t=m&z=16&output=embed`} width="100%" height="240" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
  </div>;
}
