"use client";

import { useState } from "react";
import {
  Plus,
  Sparkles,
  Target,
  CheckCircle2,
  Circle,
  PlayCircle,
  Trash2,
  MessageCircle,
  Loader2,
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  strengthTags: string[];
  status: "not_started" | "in_progress" | "completed";
  createdAt: string;
}

interface GoalsDashboardProps {
  initialGoals: Goal[];
  latestResultId: string | null;
  topStrengthNames: string[];
}

const STATUS_ICONS = {
  not_started: Circle,
  in_progress: PlayCircle,
  completed: CheckCircle2,
};

const STATUS_LABELS = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
};

const STATUS_CYCLE: Record<string, "not_started" | "in_progress" | "completed"> = {
  not_started: "in_progress",
  in_progress: "completed",
  completed: "not_started",
};

export function GoalsDashboard({
  initialGoals,
  latestResultId,
  topStrengthNames,
}: GoalsDashboardProps) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [coaching, setCoaching] = useState<Record<string, string>>({});
  const [loadingCoach, setLoadingCoach] = useState<string | null>(null);

  // Create goal form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTags, setNewTags] = useState<string[]>([]);

  async function handleCreate() {
    if (!newTitle.trim()) return;

    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription || undefined,
        strengthTags: newTags,
        resultId: latestResultId,
      }),
    });

    if (res.ok) {
      const created = await res.json();
      setGoals([
        {
          id: created.id,
          title: created.title,
          description: created.description,
          strengthTags: created.strengthTags as string[],
          status: created.status,
          createdAt: created.createdAt,
        },
        ...goals,
      ]);
      setNewTitle("");
      setNewDescription("");
      setNewTags([]);
      setShowCreateForm(false);
    }
  }

  async function handleStatusToggle(goalId: string, currentStatus: string) {
    const nextStatus = STATUS_CYCLE[currentStatus];
    const res = await fetch(`/api/goals/${goalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (res.ok) {
      setGoals(
        goals.map((g) =>
          g.id === goalId ? { ...g, status: nextStatus } : g
        )
      );
    }
  }

  async function handleDelete(goalId: string) {
    const res = await fetch(`/api/goals/${goalId}`, { method: "DELETE" });
    if (res.ok) {
      setGoals(goals.filter((g) => g.id !== goalId));
    }
  }

  async function handleSuggest() {
    if (!latestResultId) return;
    setSuggesting(true);

    try {
      const res = await fetch("/api/goals/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultId: latestResultId }),
      });

      if (res.ok) {
        const data = await res.json();
        // Create all suggested goals
        for (const suggestion of data.goals ?? []) {
          const createRes = await fetch("/api/goals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: suggestion.title,
              description: suggestion.description,
              strengthTags: suggestion.strengthTags,
              resultId: latestResultId,
            }),
          });
          if (createRes.ok) {
            const created = await createRes.json();
            setGoals((prev) => [
              {
                id: created.id,
                title: created.title,
                description: created.description,
                strengthTags: created.strengthTags as string[],
                status: created.status,
                createdAt: created.createdAt,
              },
              ...prev,
            ]);
          }
        }
      }
    } finally {
      setSuggesting(false);
    }
  }

  async function handleCoach(goalId: string) {
    if (coaching[goalId]) {
      // Toggle off
      setCoaching((prev) => {
        const next = { ...prev };
        delete next[goalId];
        return next;
      });
      return;
    }

    setLoadingCoach(goalId);
    try {
      const res = await fetch(`/api/goals/${goalId}/coach`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setCoaching((prev) => ({ ...prev, [goalId]: data.coaching }));
      }
    } finally {
      setLoadingCoach(null);
    }
  }

  function toggleTag(tag: string) {
    setNewTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  const activeGoals = goals.filter((g) => g.status !== "completed");
  const completedGoals = goals.filter((g) => g.status === "completed");

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>

        {latestResultId && (
          <button
            type="button"
            onClick={handleSuggest}
            disabled={suggesting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            {suggesting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {suggesting ? "Generating..." : "AI Suggest Goals"}
          </button>
        )}
      </div>

      {/* Create form */}
      {showCreateForm && (
        <div className="rounded-xl border bg-white p-5 space-y-4">
          <input
            type="text"
            placeholder="Goal title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full text-lg font-medium border-b border-gray-200 pb-2 focus:outline-none focus:border-primary"
          />
          <textarea
            placeholder="What does success look like? (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={2}
            className="w-full text-sm text-gray-600 border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />

          {/* Strength tag selector */}
          {topStrengthNames.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">
                Link to your strengths:
              </p>
              <div className="flex flex-wrap gap-2">
                {topStrengthNames.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleTag(name)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      newTags.includes(name)
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="text-sm text-gray-500 px-3 py-1.5 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={!newTitle.trim()}
              className="text-sm font-medium text-white bg-primary px-4 py-1.5 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Create Goal
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {goals.length === 0 && !showCreateForm && (
        <div className="rounded-xl border bg-white p-8 text-center">
          <Target className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <h2 className="text-lg font-semibold mb-1">No goals yet</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {latestResultId
              ? "Create a goal manually or let AI suggest goals based on your strengths."
              : "Take a strengths assessment first, then create goals that leverage your top strengths."}
          </p>
        </div>
      )}

      {/* Active goals */}
      {activeGoals.length > 0 && (
        <div className="space-y-3">
          {activeGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onStatusToggle={handleStatusToggle}
              onDelete={handleDelete}
              onCoach={handleCoach}
              coachingText={coaching[goal.id]}
              loadingCoach={loadingCoach === goal.id}
            />
          ))}
        </div>
      )}

      {/* Completed goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3">
            Completed ({completedGoals.length})
          </h2>
          <div className="space-y-2 opacity-60">
            {completedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onStatusToggle={handleStatusToggle}
                onDelete={handleDelete}
                onCoach={handleCoach}
                coachingText={coaching[goal.id]}
                loadingCoach={loadingCoach === goal.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GoalCard({
  goal,
  onStatusToggle,
  onDelete,
  onCoach,
  coachingText,
  loadingCoach,
}: {
  goal: Goal;
  onStatusToggle: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onCoach: (id: string) => void;
  coachingText?: string;
  loadingCoach: boolean;
}) {
  const StatusIcon = STATUS_ICONS[goal.status];

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onStatusToggle(goal.id, goal.status)}
          className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-primary transition-colors"
          title={`Status: ${STATUS_LABELS[goal.status]}. Click to advance.`}
        >
          <StatusIcon
            className={`w-5 h-5 ${
              goal.status === "completed"
                ? "text-green-500"
                : goal.status === "in_progress"
                  ? "text-blue-500"
                  : ""
            }`}
          />
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium ${
              goal.status === "completed"
                ? "line-through text-gray-400"
                : "text-gray-900"
            }`}
          >
            {goal.title}
          </h3>
          {goal.description && (
            <p className="text-sm text-gray-500 mt-0.5">{goal.description}</p>
          )}

          {/* Strength tags */}
          {goal.strengthTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {goal.strengthTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Coaching text */}
          {coachingText && (
            <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {coachingText}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onCoach(goal.id)}
            disabled={loadingCoach}
            className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors rounded-lg hover:bg-amber-50"
            title="Get AI coaching"
          >
            {loadingCoach ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MessageCircle className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onDelete(goal.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
            title="Delete goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
