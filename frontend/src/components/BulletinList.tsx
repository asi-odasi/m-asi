import type { BulletinItem } from "@/types/huggingface";
import { BulletinListItem } from "./BulletinListItem";

interface Props {
  bulletins: BulletinItem[];
  onSelect: (bulletin: BulletinItem) => void;
  onToggleFavorite: (id: string) => void;
}

export function BulletinList({ bulletins, onSelect, onToggleFavorite }: Props) {
  if (bulletins.length === 0) {
    return <p className="py-16 text-center text-brand-muted">Gösterilecek bülten bulunamadı.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {bulletins.map((bulletin) => (
        <BulletinListItem
          key={bulletin.id}
          bulletin={bulletin}
          onClick={() => onSelect(bulletin)}
          onToggleFavorite={() => onToggleFavorite(bulletin.id)}
        />
      ))}
    </ul>
  );
}
