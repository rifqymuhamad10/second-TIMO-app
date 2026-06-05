"use client";

import React from "react";
import TaskCard, { Task } from "./TaskCard";

interface TaskGridProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (task: Task) => void;
  onUpdateMembers?: () => void;
}

export default function TaskGrid({ tasks, onEdit, onDelete, onToggleStatus, onUpdateMembers }: TaskGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full pb-12">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onUpdateMembers={onUpdateMembers}
        />
      ))}
    </div>
  );
}
