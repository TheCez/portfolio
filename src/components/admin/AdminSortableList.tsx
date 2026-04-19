"use client";

import { GripVertical } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

type Item = {
  id: string;
  title: string;
  subtitle?: string;
};

type AdminSortableListProps = {
  items: Item[];
  label: string;
  emptyMessage?: string;
  reorderAction: (ids: string[]) => Promise<void>;
};

function reorderArray<T>(items: T[], fromIndex: number, toIndex: number) {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export default function AdminSortableList({
  items,
  label,
  emptyMessage = "Nothing to reorder yet.",
  reorderAction,
}: AdminSortableListProps) {
  const [orderedItems, setOrderedItems] = useState(items);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const draggedIndex = useMemo(
    () => orderedItems.findIndex((item) => item.id === draggedId),
    [orderedItems, draggedId],
  );

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 p-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{label}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Drag rows to change the live order.</p>
        </div>
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await reorderAction(orderedItems.map((item) => item.id));
            })
          }
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save Order"}
        </button>
      </div>

      <div className="space-y-3">
        {orderedItems.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => setDraggedId(item.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (!draggedId || draggedId === item.id) return;
              const targetIndex = orderedItems.findIndex((entry) => entry.id === item.id);
              if (draggedIndex === -1 || targetIndex === -1) return;
              setOrderedItems((current) => reorderArray(current, draggedIndex, targetIndex));
              setDraggedId(null);
            }}
            onDragEnd={() => setDraggedId(null)}
            className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition ${
              draggedId === item.id
                ? "border-indigo-400 bg-indigo-50 dark:border-indigo-400/40 dark:bg-indigo-900/20"
                : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/60"
            }`}
          >
            <div className="rounded-lg border border-gray-200 p-2 text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <GripVertical size={16} />
            </div>
            <div className="w-8 text-sm font-semibold text-gray-400 dark:text-gray-500">{index + 1}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900 dark:text-white">{item.title}</p>
              {item.subtitle ? (
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
