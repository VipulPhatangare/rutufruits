"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface DeliveryChargeRule {
  _id: string;
  name: string;
  minDistanceKm: number;
  maxDistanceKm: number;
  baseCharge: number;
  chargePerKm: number;
  minimumCharge: number;
  enabled: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface DeliveryChargeForm {
  name: string;
  minDistanceKm: string;
  maxDistanceKm: string;
  baseCharge: string;
  chargePerKm: string;
  minimumCharge: string;
  enabled: boolean;
  notes: string;
}

const emptyForm: DeliveryChargeForm = {
  name: "",
  minDistanceKm: "0",
  maxDistanceKm: "0",
  baseCharge: "0",
  chargePerKm: "0",
  minimumCharge: "0",
  enabled: true,
  notes: "",
};

function formatCurrency(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function calculatePreview(rule: {
  minDistanceKm: number;
  maxDistanceKm: number;
  baseCharge: number;
  chargePerKm: number;
  minimumCharge: number;
}) {
  const previewDistance = rule.maxDistanceKm > 0 ? rule.maxDistanceKm : rule.minDistanceKm;
  const calculated = rule.baseCharge + previewDistance * rule.chargePerKm;
  return Math.max(calculated, rule.minimumCharge);
}

export default function AdminDeliveryChargesPage() {
  const [rules, setRules] = useState<DeliveryChargeRule[]>([]);
  const [form, setForm] = useState<DeliveryChargeForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<"all" | "enabled" | "disabled">("all");
  const [query, setQuery] = useState("");
  const [rowSavingId, setRowSavingId] = useState<string | null>(null);
  const [rowDeletingId, setRowDeletingId] = useState<string | null>(null);

  const fetchRules = useCallback(() => {
    fetch("/api/delivery-charges")
      .then((res) => res.json())
      .then((data) => {
        setRules(Array.isArray(data.rules) ? data.rules : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const matchesFilter = filter === "all" || (filter === "enabled" ? rule.enabled : !rule.enabled);
      const matchesQuery =
        !query ||
        [rule.name, rule.notes, `${rule.minDistanceKm}`, `${rule.maxDistanceKm}`]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, rules]);

  const activeCount = rules.filter((rule) => rule.enabled).length;

  function updateForm<K extends keyof DeliveryChargeForm>(field: K, value: DeliveryChargeForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateRow(id: string, field: keyof DeliveryChargeRule, value: string | number | boolean) {
    setRules((current) => current.map((rule) => (rule._id === id ? { ...rule, [field]: value } : rule)));
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/delivery-charges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setMessage("Delivery charge rule created.");
      setForm(emptyForm);
      fetchRules();
    } else {
      setMessage(data.error || "Failed to create delivery charge rule.");
    }

    setSaving(false);
  }

  async function saveRule(rule: DeliveryChargeRule) {
    setRowSavingId(rule._id);
    setMessage("");

    const response = await fetch("/api/delivery-charges", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rule),
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setMessage(`Updated rule ${rule.name}.`);
      fetchRules();
    } else {
      setMessage(data.error || `Failed to update ${rule.name}.`);
    }

    setRowSavingId(null);
  }

  async function deleteRule(id: string, name: string) {
    setRowDeletingId(id);
    setMessage("");

    const response = await fetch(`/api/delivery-charges?id=${id}`, {
      method: "DELETE",
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setMessage(`Deleted rule ${name}.`);
      setRules((current) => current.filter((rule) => rule._id !== id));
    } else {
      setMessage(data.error || `Failed to delete ${name}.`);
    }

    setRowDeletingId(null);
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1
          className="text-3xl font-light mb-1"
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            color: "var(--forest)",
          }}
        >
          Delivery Charges
        </h1>
        <p
          className="text-sm"
          style={{
            color: "var(--warm-grey)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 300,
          }}
        >
          Store distance-based delivery pricing rules in a separate collection, including base fee and per-km charge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Rules", value: rules.length },
          { label: "Active Rules", value: activeCount },
          { label: "Filtered Results", value: filteredRules.length },
        ].map((card) => (
          <div key={card.label} className="p-5 rounded-sm" style={{ backgroundColor: "var(--cream-white)" }}>
            <p
              className="text-2xl font-light mb-1"
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                color: "var(--forest)",
              }}
            >
              {card.value}
            </p>
            <p
              className="text-xs uppercase tracking-widest"
              style={{
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: 300,
              }}
            >
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {message && (
        <p
          className="text-sm px-3 py-2 rounded-sm"
          style={{
            backgroundColor: "var(--parchment)",
            color: "var(--forest)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          }}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleCreate}
        className="p-6 rounded-sm border space-y-4"
        style={{ backgroundColor: "var(--cream-white)", borderColor: "var(--parchment)" }}
      >
        <div>
          <h2
            className="text-xl font-light mb-1"
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              color: "var(--forest)",
            }}
          >
            Add Delivery Charge Rule
          </h2>
          <p
            className="text-sm"
            style={{
              color: "var(--warm-grey)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            Example: 0-10 km at ₹12/km with ₹50 minimum charge, or 10-30 km at a different rate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { key: "name", label: "Rule Name", type: "text", placeholder: "Local delivery" },
            { key: "minDistanceKm", label: "Min Distance (km)", type: "number", placeholder: "0" },
            { key: "maxDistanceKm", label: "Max Distance (km)", type: "number", placeholder: "10" },
            { key: "baseCharge", label: "Base Charge (₹)", type: "number", placeholder: "0" },
            { key: "chargePerKm", label: "Charge per km (₹)", type: "number", placeholder: "12" },
            { key: "minimumCharge", label: "Minimum Charge (₹)", type: "number", placeholder: "50" },
          ].map((field) => (
            <div key={field.key}>
              <label
                className="block text-xs uppercase tracking-wider mb-1.5"
                style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                required={field.key === "name"}
                value={form[field.key as keyof DeliveryChargeForm] as string}
                onChange={(event) => updateForm(field.key as keyof DeliveryChargeForm, event.target.value as never)}
                placeholder={field.placeholder}
                className="w-full py-2.5 px-3 text-sm border outline-none rounded-sm"
                style={{
                  borderColor: "var(--parchment)",
                  backgroundColor: "var(--ivory)",
                  color: "var(--charcoal)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              />
            </div>
          ))}
        </div>

        <div>
          <label
            className="block text-xs uppercase tracking-wider mb-1.5"
            style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
          >
            Notes
          </label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(event) => updateForm("notes", event.target.value)}
            className="w-full py-2.5 px-3 text-sm border outline-none rounded-sm resize-none"
            style={{
              borderColor: "var(--parchment)",
              backgroundColor: "var(--ivory)",
              color: "var(--charcoal)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(event) => updateForm("enabled", event.target.checked)}
              className="w-4 h-4"
              style={{ accentColor: "var(--forest)" }}
            />
            <span
              className="text-sm"
              style={{ color: "var(--charcoal)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
            >
              Enable this rule
            </span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 text-xs font-medium tracking-widest uppercase rounded-sm transition-all hover:opacity-90 disabled:opacity-60"
            style={{
              backgroundColor: "var(--forest)",
              color: "var(--ivory)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            }}
          >
            {saving ? "Saving..." : "Save Rule"}
          </button>
        </div>
      </form>

      <div className="p-6 rounded-sm border space-y-4" style={{ backgroundColor: "var(--cream-white)", borderColor: "var(--parchment)" }}>
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
          <div>
            <h2
              className="text-xl font-light mb-1"
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                color: "var(--forest)",
              }}
            >
              Saved Rules
            </h2>
            <p
              className="text-sm"
              style={{
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: 300,
              }}
            >
              Filter and edit delivery pricing slabs. Preview shows the estimated charge at the rule&apos;s max distance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full lg:w-auto">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search rule name or notes..."
              className="py-2.5 px-3 text-sm border outline-none rounded-sm min-w-56"
              style={{
                borderColor: "var(--parchment)",
                backgroundColor: "var(--ivory)",
                color: "var(--charcoal)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            />
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as "all" | "enabled" | "disabled")}
              className="py-2.5 px-3 text-sm border outline-none rounded-sm"
              style={{
                borderColor: "var(--parchment)",
                backgroundColor: "var(--ivory)",
                color: "var(--charcoal)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              <option value="all">All rules</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
            Loading delivery charge rules...
          </p>
        ) : filteredRules.length === 0 ? (
          <div className="p-8 rounded-sm border text-center" style={{ borderColor: "var(--parchment)", backgroundColor: "var(--ivory)" }}>
            <p
              style={{
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: 300,
              }}
            >
              No delivery charge rules match the current filter.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRules.map((rule) => {
              const preview = calculatePreview(rule);

              return (
                <div
                  key={rule._id}
                  className="p-5 rounded-sm border"
                  style={{
                    backgroundColor: "var(--ivory)",
                    borderColor: rule.enabled ? "var(--parchment)" : "rgba(138,127,114,0.4)",
                  }}
                >
                  <div className="flex flex-col xl:flex-row gap-4 xl:items-start xl:justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className="text-lg font-medium"
                          style={{
                            color: "var(--forest)",
                            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                          }}
                        >
                          {rule.name}
                        </p>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest"
                          style={{
                            backgroundColor: rule.enabled ? "rgba(44,74,46,0.1)" : "var(--parchment)",
                            color: rule.enabled ? "var(--forest)" : "var(--warm-grey)",
                            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                          }}
                        >
                          {rule.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <p
                        className="text-sm"
                        style={{
                          color: "var(--warm-grey)",
                          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                          fontWeight: 300,
                        }}
                      >
                        {rule.minDistanceKm} km to {rule.maxDistanceKm} km • Preview charge: {formatCurrency(preview)}
                      </p>
                    </div>
                    <p
                      className="text-xs"
                      style={{
                        color: "var(--warm-grey)",
                        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      Updated {new Date(rule.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
                    {[
                      { key: "name", label: "Rule Name", type: "text" },
                      { key: "minDistanceKm", label: "Min Distance", type: "number" },
                      { key: "maxDistanceKm", label: "Max Distance", type: "number" },
                      { key: "baseCharge", label: "Base Charge", type: "number" },
                      { key: "chargePerKm", label: "Charge / km", type: "number" },
                      { key: "minimumCharge", label: "Minimum Charge", type: "number" },
                      { key: "notes", label: "Notes", type: "text" },
                    ].map((field) => (
                      <div key={`${rule._id}-${field.key}`}>
                        <label
                          className="block text-[10px] uppercase tracking-widest mb-1"
                          style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
                        >
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          value={String(rule[field.key as keyof DeliveryChargeRule] ?? "")}
                          onChange={(event) =>
                            updateRow(
                              rule._id,
                              field.key as keyof DeliveryChargeRule,
                              field.type === "number" ? Number(event.target.value) : event.target.value
                            )
                          }
                          className="w-full py-2 px-3 text-sm border outline-none rounded-sm"
                          style={{
                            borderColor: "var(--parchment)",
                            backgroundColor: "var(--cream-white)",
                            color: "var(--charcoal)",
                            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={(event) => updateRow(rule._id, "enabled", event.target.checked)}
                        className="w-4 h-4"
                        style={{ accentColor: "var(--forest)" }}
                      />
                      <span className="text-sm" style={{ color: "var(--charcoal)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
                        Active for delivery pricing
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => saveRule(rule)}
                        disabled={rowSavingId === rule._id}
                        className="px-4 py-2 text-xs font-medium tracking-widest uppercase rounded-sm transition-all hover:opacity-90 disabled:opacity-60"
                        style={{
                          backgroundColor: "var(--forest)",
                          color: "var(--ivory)",
                          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                        }}
                      >
                        {rowSavingId === rule._id ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRule(rule._id, rule.name)}
                        disabled={rowDeletingId === rule._id}
                        className="px-4 py-2 text-xs font-medium tracking-widest uppercase rounded-sm transition-all hover:opacity-90 disabled:opacity-60"
                        style={{
                          backgroundColor: "#c0392b",
                          color: "var(--ivory)",
                          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                        }}
                      >
                        {rowDeletingId === rule._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}