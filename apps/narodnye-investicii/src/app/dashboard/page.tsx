"use client";

import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
import { Card } from "@/components/ui/Card";
import { LegalContextPopup } from "@/components/ui/LegalContextPopup";
import { TrustRatingRing } from "@/components/ui/TrustRatingRing";
import { formatRub } from "@/lib/format";
import { LEGAL_CARDS } from "@/lib/legalCards";
import { useAppState } from "@/state/AppStateContext";
import { ProfileSwitcher } from "./_components/ProfileSwitcher";

export default function DashboardPage() {
  const { activeProfile } = useAppState();
  const { trustRating } = activeProfile;
  const beautyLicenseCard = LEGAL_CARDS.find((c) => c.id === "beauty-license")!;
  const showLegalPopup = activeProfile.id === "beauty" && activeProfile.products.some((p) => /касс/i.test(p));

  return (
    <div className="flex justify-center bg-surface">
      <div className="w-full max-w-md bg-white pb-28">
        <div className="flex items-center justify-between px-6 pt-6">
          <div>
            <p className="text-caption text-text-secondary">Контур доверия</p>
            <p className="text-card-title text-ink">{activeProfile.ownerName}</p>
          </div>
          <div className="flex items-center gap-2">
            <ProfileSwitcher />
            <Link
              href="/legal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-base"
              aria-label="Поиск по юридическим карточкам"
            >
              🔍
            </Link>
          </div>
        </div>

        <div className="px-6 pt-5">
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-body font-semibold text-ink">
                {activeProfile.legalForm} · {activeProfile.city}
              </p>
              <p className="mt-1 text-caption text-text-secondary">{activeProfile.industryLabel}</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-caption font-medium text-ink">
              {activeProfile.legalStatusLabel}
            </span>
          </Card>
        </div>

        <div className="px-6 pt-3">
          <Link href="/ai-assistant" className="block">
            <Card className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl">
                {activeProfile.aiRiskDaysAway === null ? "🙂" : "⚠️"}
              </span>
              <div className="flex-1">
                <p className="text-body font-semibold text-ink">
                  {activeProfile.aiRiskDaysAway === null
                    ? "AI-ассистент: всё в порядке"
                    : `AI-ассистент: риск через ${activeProfile.aiRiskDaysAway} дней`}
                </p>
                <p className="mt-0.5 text-caption text-text-secondary">Аналитика и рекомендации</p>
              </div>
              <span className="text-ink">›</span>
            </Card>
          </Link>
        </div>

        <Link href="/rating" className="mt-6 flex flex-col items-center px-6">
          <TrustRatingRing
            percent={trustRating.progressPercent}
            level={trustRating.level}
            nextLevel={trustRating.nextLevel}
          />
        </Link>

        <div className="mt-6 px-6">
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-caption font-semibold uppercase text-text-secondary">Из чего складывается рейтинг</p>
              <Link href="/rating" className="text-caption text-ink underline underline-offset-4">
                Подробнее
              </Link>
            </div>
            <div className="mt-3 flex flex-col gap-3">
              <div className="text-body text-ink">
                <p>Обороты по счёту</p>
                <p className="mt-0.5 text-caption text-text-secondary">{trustRating.turnoverNote}</p>
              </div>
              <Link href="/products" className="flex items-center justify-between text-body text-ink">
                <span>Подключённые продукты</span>
                <span className="flex items-center gap-1 text-caption text-text-secondary">
                  {trustRating.productsConnected} из {trustRating.productsTotal}
                  <span className="text-ink">›</span>
                </span>
              </Link>
              <div className="flex items-center justify-between text-body text-ink">
                <span>Касса / эквайринг</span>
                <span className="text-caption text-text-secondary">
                  {activeProfile.products.some((p) => /касс|эквайринг|pay/i.test(p)) ? "Подключены" : "Не подключены"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 px-6">
          <Card>
            <p className="text-caption uppercase text-text-secondary">Текущий счёт</p>
            <p className="mt-1 text-[26px] font-bold text-ink">{formatRub(activeProfile.accountBalance)}</p>
          </Card>
          <Link href="/campaigns?view=fund">
            <Card inverse>
              <div className="flex items-center justify-between">
                <p className="text-caption uppercase text-white/70">Фонд стабильности</p>
                <span className="text-white/70">›</span>
              </div>
              <p className="mt-1 text-[26px] font-bold">{formatRub(activeProfile.stabilityFund)}</p>
            </Card>
          </Link>
        </div>
      </div>
      <BottomNav active="main" />
      {showLegalPopup && <LegalContextPopup card={beautyLicenseCard} />}
    </div>
  );
}
