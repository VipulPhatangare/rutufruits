"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

interface PincodeEntry {
  _id: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  deliveryCharge: number;
  minimumOrderAmount: number;
  etaDays: string;
  enabled: boolean;
  source: "manual" | "csv";
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface PincodeForm {
  pincode: string;
  city: string;
  state: string;
  country: string;
  deliveryCharge: string;
  minimumOrderAmount: string;
  etaDays: string;
  enabled: boolean;
  notes: string;
}

const emptyForm: PincodeForm = {
  pincode: "",
  city: "",
  state: "",
  country: "India",
  deliveryCharge: "0",
  minimumOrderAmount: "0",
  etaDays: "",
  enabled: true,
  notes: "",
};

function parseCSVLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      const nextChar = line[index + 1];
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function parseBulkInput(input: string) {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [] as Array<Record<string, string | boolean | number>>;

  const headerColumns = parseCSVLine(lines[0]).map((column) => column.toLowerCase());
  const hasHeader = headerColumns.includes("pincode");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines
    .map((line) => {
      const columns = parseCSVLine(line);
      if (hasHeader) {
        const row = Object.fromEntries(headerColumns.map((header, index) => [header, columns[index] ?? ""]));
        return {
          pincode: row.pincode ?? "",
          city: row.city ?? "",
          state: row.state ?? "",
          country: row.country ?? "India",
          deliveryCharge: row.deliverycharge ?? row.delivery_charge ?? "0",
          minimumOrderAmount: row.minimumorderamount ?? row.minimum_order_amount ?? "0",
          etaDays: row.etadays ?? row.eta_days ?? "",
          enabled: row.enabled ?? "true",
          notes: row.notes ?? "",
        };
      }

      return {
        pincode: columns[0] ?? "",
        city: columns[1] ?? "",
        state: columns[2] ?? "",
        country: columns[3] ?? "India",
        deliveryCharge: columns[4] ?? "0",
        minimumOrderAmount: columns[5] ?? "0",
        etaDays: columns[6] ?? "",
        enabled: columns[7] ?? "true",
        notes: columns[8] ?? "",
      };
    })
    .filter((row) => String(row.pincode || "").trim());
}

export default function AdminPincodesPage() {
  const [pincodes, setPincodes] = useState<PincodeEntry[]>([]);
  const [manualForm, setManualForm] = useState<PincodeForm>(emptyForm);
  const [bulkText, setBulkText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "enabled" | "disabled">("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [rowSavingId, setRowSavingId] = useState<string | null>(null);
  const [rowDeletingId, setRowDeletingId] = useState<string | null>(null);

  const fetchPincodes = useCallback(() => {
    fetch("/api/pincodes")
      .then((res) => res.json())
      .then((data) => {
        setPincodes(Array.isArray(data.pincodes) ? data.pincodes : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPincodes();
  }, [fetchPincodes]);

  const filteredPincodes = useMemo(() => {
    return pincodes.filter((entry) => {
      const matchesQuery =
        !query ||
        [entry.pincode, entry.city, entry.state, entry.notes]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "enabled" ? entry.enabled : !entry.enabled);
      const matchesState = stateFilter === "all" || entry.state === stateFilter;

      return matchesQuery && matchesStatus && matchesState;
    });
  }, [pincodes, query, statusFilter, stateFilter]);

  const activeCount = pincodes.filter((entry) => entry.enabled).length;
  const stateOptions = Array.from(new Set(pincodes.map((entry) => entry.state).filter(Boolean))).sort();

  function updateManualForm<K extends keyof PincodeForm>(field: K, value: PincodeForm[K]) {
    setManualForm((current) => ({ ...current, [field]: value }));
  }

  async function addManualPincode(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/pincodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...manualForm,
        source: "manual",
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("Pincode saved successfully.");
      setManualForm(emptyForm);
      fetchPincodes();
    } else {
      setMessage(data.error || "Failed to save pincode.");
    }
    setSaving(false);
  }

  async function importBulkPincodes() {
    const parsedEntries = parseBulkInput(bulkText);
    if (parsedEntries.length === 0) {
      setMessage("Please add CSV rows or paste at least one valid pincode row.");
      return;
    }

    setSaving(true);
    setMessage("");

    const response = await fetch("/api/pincodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pincodes: parsedEntries }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage(`Imported ${data.processed} pincodes (${data.inserted} new, ${data.updated} updated).`);
      setBulkText("");
      fetchPincodes();
    } else {
      setMessage(data.error || "Bulk import failed.");
    }

    setSaving(false);
  }

  async function handleCSVFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setBulkText(text);
    setMessage(`Loaded ${file.name}. Review the CSV text below, then click Import.`);
    event.target.value = "";
  }

  function updateRow(id: string, field: keyof PincodeEntry, value: string | number | boolean) {
    setPincodes((current) =>
      current.map((entry) => (entry._id === id ? { ...entry, [field]: value } : entry))
    );
  }

  async function saveRow(entry: PincodeEntry) {
    setRowSavingId(entry._id);
    setMessage("");

    const response = await fetch("/api/pincodes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setMessage(`Updated pincode ${entry.pincode}.`);
      fetchPincodes();
    } else {
      setMessage(data.error || `Failed to update ${entry.pincode}.`);
    }

    setRowSavingId(null);
  }

  async function deleteRow(id: string, pincode: string) {
    setRowDeletingId(id);
    setMessage("");

    const response = await fetch(`/api/pincodes?id=${id}`, {
      method: "DELETE",
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setMessage(`Deleted pincode ${pincode}.`);
      setPincodes((current) => current.filter((entry) => entry._id !== id));
    } else {
      setMessage(data.error || `Failed to delete ${pincode}.`);
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
          Pincode Manager
        </h1>
        <p
          className="text-sm"
          style={{
            color: "var(--warm-grey)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 300,
          }}
        >
          Add delivery pincodes manually, upload them with CSV, and filter the saved list from one screen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Pincodes", value: pincodes.length },
          { label: "Active Pincodes", value: activeCount },
          { label: "Filtered Results", value: filteredPincodes.length },
        ].map((card) => (
          <div
            key={card.label}
            className="p-5 rounded-sm"
            style={{ backgroundColor: "var(--cream-white)" }}
          >
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form
          onSubmit={addManualPincode}
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
              Add Manually
            </h2>
            <p
              className="text-sm"
              style={{
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: 300,
              }}
            >
              Type a pincode and delivery details directly on screen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "pincode", label: "Pincode", type: "text", placeholder: "422605" },
              { key: "city", label: "City", type: "text", placeholder: "Ahilyanagar" },
              { key: "state", label: "State", type: "text", placeholder: "Maharashtra" },
              { key: "country", label: "Country", type: "text", placeholder: "India" },
              { key: "deliveryCharge", label: "Delivery Charge (₹)", type: "number", placeholder: "0" },
              {
                key: "minimumOrderAmount",
                label: "Minimum Order Amount (₹)",
                type: "number",
                placeholder: "0",
              },
              { key: "etaDays", label: "ETA", type: "text", placeholder: "2-3 days" },
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
                  required={field.key === "pincode"}
                  value={manualForm[field.key as keyof PincodeForm] as string}
                  onChange={(event) =>
                    updateManualForm(field.key as keyof PincodeForm, event.target.value as never)
                  }
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
              value={manualForm.notes}
              onChange={(event) => updateManualForm("notes", event.target.value)}
              className="w-full py-2.5 px-3 text-sm border outline-none rounded-sm resize-none"
              style={{
                borderColor: "var(--parchment)",
                backgroundColor: "var(--ivory)",
                color: "var(--charcoal)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={manualForm.enabled}
              onChange={(event) => updateManualForm("enabled", event.target.checked)}
              className="w-4 h-4"
              style={{ accentColor: "var(--forest)" }}
            />
            <span
              className="text-sm"
              style={{ color: "var(--charcoal)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
            >
              Active for delivery
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
            {saving ? "Saving..." : "Save Pincode"}
          </button>
        </form>

        <div
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
              Import from CSV
            </h2>
            <p
              className="text-sm"
              style={{
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: 300,
              }}
            >
              Upload a CSV file or paste CSV rows. Supported columns: pincode, city, state, country, deliveryCharge, minimumOrderAmount, etaDays, enabled, notes.
            </p>
          </div>

          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleCSVFile}
            className="block w-full text-sm"
            style={{ color: "var(--charcoal)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
          />

          <textarea
            rows={12}
            value={bulkText}
            onChange={(event) => setBulkText(event.target.value)}
            placeholder={"pincode,city,state,country,deliveryCharge,minimumOrderAmount,etaDays,enabled,notes\n422605,Ahilyanagar,Maharashtra,India,120,1500,2-3 days,true,Core delivery zone"}
            className="w-full py-3 px-4 text-sm border outline-none rounded-sm resize-y"
            style={{
              borderColor: "var(--parchment)",
              backgroundColor: "var(--ivory)",
              color: "var(--charcoal)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            }}
          />

          <button
            type="button"
            onClick={importBulkPincodes}
            disabled={saving}
            className="px-6 py-3 text-xs font-medium tracking-widest uppercase rounded-sm transition-all hover:opacity-90 disabled:opacity-60"
            style={{
              backgroundColor: "var(--forest)",
              color: "var(--ivory)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            }}
          >
            {saving ? "Importing..." : "Import Pincodes"}
          </button>
        </div>
      </div>

      <div
        className="p-6 rounded-sm border space-y-4"
        style={{ backgroundColor: "var(--cream-white)", borderColor: "var(--parchment)" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
          <div>
            <h2
              className="text-xl font-light mb-1"
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                color: "var(--forest)",
              }}
            >
              Saved Pincodes
            </h2>
            <p
              className="text-sm"
              style={{
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: 300,
              }}
            >
              Filter by status, state, or search by pincode/city.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full lg:w-auto">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pincode, city, state..."
              className="py-2.5 px-3 text-sm border outline-none rounded-sm min-w-56"
              style={{
                borderColor: "var(--parchment)",
                backgroundColor: "var(--ivory)",
                color: "var(--charcoal)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "all" | "enabled" | "disabled")}
              className="py-2.5 px-3 text-sm border outline-none rounded-sm"
              style={{
                borderColor: "var(--parchment)",
                backgroundColor: "var(--ivory)",
                color: "var(--charcoal)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              <option value="all">All statuses</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
            <select
              value={stateFilter}
              onChange={(event) => setStateFilter(event.target.value)}
              className="py-2.5 px-3 text-sm border outline-none rounded-sm"
              style={{
                borderColor: "var(--parchment)",
                backgroundColor: "var(--ivory)",
                color: "var(--charcoal)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              <option value="all">All states</option>
              {stateOptions.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
            Loading pincodes...
          </p>
        ) : filteredPincodes.length === 0 ? (
          <div
            className="p-8 rounded-sm border text-center"
            style={{ borderColor: "var(--parchment)", backgroundColor: "var(--ivory)" }}
          >
            <p
              style={{
                color: "var(--warm-grey)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: 300,
              }}
            >
              No pincodes match the current filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPincodes.map((entry) => (
              <div
                key={entry._id}
                className="p-5 rounded-sm border"
                style={{
                  backgroundColor: "var(--ivory)",
                  borderColor: entry.enabled ? "var(--parchment)" : "rgba(138,127,114,0.4)",
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
                        {entry.pincode}
                      </p>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest"
                        style={{
                          backgroundColor: entry.enabled ? "rgba(44,74,46,0.1)" : "var(--parchment)",
                          color: entry.enabled ? "var(--forest)" : "var(--warm-grey)",
                          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                        }}
                      >
                        {entry.enabled ? "Enabled" : "Disabled"}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest"
                        style={{
                          backgroundColor: "var(--parchment)",
                          color: "var(--warm-grey)",
                          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                        }}
                      >
                        {entry.source}
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
                      {entry.city || "—"}, {entry.state || "—"}, {entry.country || "India"}
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
                    Updated {new Date(entry.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
                  {[
                    { key: "pincode", label: "Pincode", type: "text" },
                    { key: "city", label: "City", type: "text" },
                    { key: "state", label: "State", type: "text" },
                    { key: "country", label: "Country", type: "text" },
                    { key: "deliveryCharge", label: "Delivery Charge (₹)", type: "number" },
                    { key: "minimumOrderAmount", label: "Min Order (₹)", type: "number" },
                    { key: "etaDays", label: "ETA", type: "text" },
                    { key: "notes", label: "Notes", type: "text" },
                  ].map((field) => (
                    <div key={`${entry._id}-${field.key}`}>
                      <label
                        className="block text-[10px] uppercase tracking-widest mb-1"
                        style={{ color: "var(--warm-grey)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
                      >
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={String(entry[field.key as keyof PincodeEntry] ?? "")}
                        onChange={(event) =>
                          updateRow(
                            entry._id,
                            field.key as keyof PincodeEntry,
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
                      checked={entry.enabled}
                      onChange={(event) => updateRow(entry._id, "enabled", event.target.checked)}
                      className="w-4 h-4"
                      style={{ accentColor: "var(--forest)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--charcoal)", fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
                    >
                      Active for delivery
                    </span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => saveRow(entry)}
                      disabled={rowSavingId === entry._id}
                      className="px-4 py-2 text-xs font-medium tracking-widest uppercase rounded-sm transition-all hover:opacity-90 disabled:opacity-60"
                      style={{
                        backgroundColor: "var(--forest)",
                        color: "var(--ivory)",
                        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      }}
                    >
                      {rowSavingId === entry._id ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRow(entry._id, entry.pincode)}
                      disabled={rowDeletingId === entry._id}
                      className="px-4 py-2 text-xs font-medium tracking-widest uppercase rounded-sm transition-all hover:opacity-90 disabled:opacity-60"
                      style={{
                        backgroundColor: "#c0392b",
                        color: "var(--ivory)",
                        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      }}
                    >
                      {rowDeletingId === entry._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}