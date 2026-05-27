import type { PotModel as Pot } from "@/generated/prisma/models";
import { PotCard } from "./PotCard";

type Props = {
  pots: Pot[];
};

export function PotList({ pots }: Props) {
  return (
    <div className="grid grid-cols-2 gap-600">
      {pots.map((pot) => (
        <PotCard pot={pot} key={pot.id} />
      ))}
    </div>
  );
}
