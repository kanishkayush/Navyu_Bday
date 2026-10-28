import { PhotoConstellation } from "./PhotoConstellation";

/** Our Little Galaxy — interactive photo constellation. */
export function MemoryGallery({
  discovered,
  onDiscover,
}: {
  discovered: ReadonlySet<string>;
  onDiscover: (id: string) => void;
}) {
  return <PhotoConstellation discovered={discovered} onDiscover={onDiscover} />;
}
