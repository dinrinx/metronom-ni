"use client";

import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
import { Card } from "@/components/ui/Card";
import { PAYMENT_PRODUCTS } from "@/lib/paymentProducts";
import { useAppState } from "@/state/AppStateContext";

export default function ProductsPage() {
  const { activeProfile, dispatch } = useAppState();

  function connect(name: string) {
    if (activeProfile.products.includes(name)) return;
    const nextProducts = [...activeProfile.products, name];
    dispatch({
      type: "UPDATE_ACTIVE_PROFILE",
      patch: {
        products: nextProducts,
        trustRating: {
          ...activeProfile.trustRating,
          productsConnected: Math.min(nextProducts.length, activeProfile.trustRating.productsTotal),
        },
      },
    });
  }

  return (
    <div className="flex justify-center bg-surface">
      <div className="w-full max-w-md bg-white pb-28">
        <div className="px-6 py-6">
          <Link href="/dashboard" className="text-2xl leading-none text-ink" aria-label="Назад">
            ‹
          </Link>
          <h1 className="mt-4 text-h1 text-ink">Продукты платёжного бизнеса</h1>
          <p className="mt-2 text-body text-text-secondary">
            {activeProfile.trustRating.productsConnected} из {activeProfile.trustRating.productsTotal} подключено —
            чем больше продуктов, тем выше рейтинг доверия.
          </p>

          <div className="mt-6 flex flex-col gap-2">
            {PAYMENT_PRODUCTS.map((product) => {
              const connected = activeProfile.products.includes(product.name);
              return (
                <Card key={product.name} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-lg">
                    {product.glyph}
                  </span>
                  <div className="flex-1">
                    <p className="text-body font-medium text-ink">{product.name}</p>
                    <p className="mt-0.5 text-caption text-text-secondary">{product.description}</p>
                  </div>
                  {connected ? (
                    <span className="rounded-full bg-white px-3 py-1.5 text-caption font-medium text-ink">
                      Подключено
                    </span>
                  ) : (
                    <button
                      onClick={() => connect(product.name)}
                      className="shrink-0 rounded-full bg-ink px-3 py-1.5 text-caption font-medium text-white"
                    >
                      Подключить
                    </button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      <BottomNav active="main" />
    </div>
  );
}
