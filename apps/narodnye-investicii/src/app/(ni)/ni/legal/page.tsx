"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { LEGAL_CARDS, type LegalCard } from "@/lib/legalCards";
import { CardDetailScreen } from "./_components/CardDetailScreen";
import { SearchScreen } from "./_components/SearchScreen";

function LegalPageInner() {
  const searchParams = useSearchParams();
  const initialCard = LEGAL_CARDS.find((c) => c.id === searchParams.get("card")) ?? null;
  const [query, setQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<LegalCard | null>(initialCard);

  return (
    <div className="flex justify-center bg-surface md:h-full">
      <div className="w-full max-w-md min-h-screen md:min-h-0 md:h-full bg-white">
        {selectedCard ? (
          <CardDetailScreen card={selectedCard} onBack={() => setSelectedCard(null)} />
        ) : (
          <SearchScreen query={query} onQueryChange={setQuery} onOpenCard={setSelectedCard} />
        )}
      </div>
    </div>
  );
}

export default function LegalPage() {
  return (
    <Suspense fallback={null}>
      <LegalPageInner />
    </Suspense>
  );
}
