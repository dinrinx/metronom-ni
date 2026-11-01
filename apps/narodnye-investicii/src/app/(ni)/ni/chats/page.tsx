import { BottomNav } from "@/components/ui/BottomNav";

export default function ChatsPage() {
  return (
    <div className="flex justify-center bg-surface">
      <div className="flex w-full max-w-md flex-col items-center justify-center bg-white px-6 py-24 text-center pb-28">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-surface text-3xl">💬</div>
        <h1 className="mt-4 text-h1 text-ink">Чаты скоро появятся</h1>
        <p className="mt-2 text-body text-text-secondary">Здесь будет прямая связь с донатерами и поддержкой.</p>
      </div>
      <BottomNav active="chats" />
    </div>
  );
}
