"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { Application, STATUS_LABELS, STATUSES, Status } from "@/lib/types";

function ApplicationCard({ application }: { application: Application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: application.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab rounded-md border border-gray-200 bg-white p-3 shadow-sm active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <p className="font-medium">{application.company}</p>
      <p className="text-sm text-gray-600">{application.role}</p>
      {application.appliedDate && (
        <p className="mt-1 text-xs text-gray-400">
          Applied {new Date(application.appliedDate).toLocaleDateString()}
        </p>
      )}
      <Link
        href={`/applications/${application.id}/edit`}
        className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline"
      >
        Edit
      </Link>
    </div>
  );
}

function Column({
  status,
  applications,
}: {
  status: Status;
  applications: Application[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[200px] w-64 flex-shrink-0 flex-col gap-2 rounded-md border border-gray-200 p-2 ${
        isOver ? "bg-blue-50" : "bg-gray-100"
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <StatusBadge status={status} />
        <span className="text-xs text-gray-400">{applications.length}</span>
      </div>
      {applications.map((app) => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
}

export function Board({ applications }: { applications: Application[] }) {
  const [items, setItems] = useState(applications);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const newStatus = over.id as Status;
    const id = String(active.id);
    const current = items.find((app) => app.id === id);
    if (!current || current.status === newStatus) return;

    setItems((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)),
    );

    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  const activeApplication = items.find((app) => app.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            applications={items.filter((app) => app.status === status)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeApplication ? (
          <div className="w-64 rounded-md border border-gray-200 bg-white p-3 shadow-lg">
            <p className="font-medium">{activeApplication.company}</p>
            <p className="text-sm text-gray-600">{activeApplication.role}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
