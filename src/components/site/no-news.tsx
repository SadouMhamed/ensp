import { NewspaperIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function NoNews() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <NewspaperIcon />
        </EmptyMedia>
        <EmptyTitle>Aucune actualité pour le moment</EmptyTitle>
        <EmptyDescription>
          Les articles publiés depuis le tableau de bord apparaîtront ici.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
