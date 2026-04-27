"use client";

import { useState, useEffect } from "react";

interface LineItem {
  sNo: number;
  description: string;
  uqc: string;
  quantity: string;
  rate: string;
  amount: string;
  hsnCode: string;
}

interface AssetData {
  id?: string;
  salesType: string;
  companyCode: string;
  assetCategory: string;
  categoryOfUnits: string;
  entityName: string;
  assetLocation: string;
  grossValue: string;
  wdv: string;
  costCenter: string;
  salesValue: string;
  consignerName: string;
  consignerAddress: string;
  consignerPinCode: string;
  consignerLocation: string;
  plantCode: string;
  consignerGSTIN: string;
  consigneeName: string;
  consigneeAddress: string;
  consigneePinCode: string;
  consigneeLocation: string;
  consigneeGSTIN: string;
  consigneeCategoryOfUnits: string;
  shipToName: string;
  shipToAddress: string;
  shipToGSTIN: string;
  type: string;
  documentType: string;
  taxType: string;
  consigneePlantCode: string;
  consigneeCostCenter: string;
  comments: string;
  lineItems: LineItem[];
}

// Placeholder dropdown options — see PLACEHOLDERS.md
const SALES_TYPES = ["Asset Sale", "Scrap Sale", "Inter-Unit Transfer"];
const COMPANY_CODES = ["HCLTech - 1000", "HCLTech - 2000", "HCLTech - 3000"];
const ASSET_CATEGORIES = ["IT Equipment", "Furniture", "Vehicle", "Machinery"];
const CATEGORY_OF_UNITS = ["SEZ", "DTA", "STPI", "EOU"];
const CONSIGNER_NAMES = ["HCLTech Noida", "HCLTech Chennai", "HCLTech Bangalore"];
const TYPES = ["Regular", "SEZ", "Export", "Import"];
const DOCUMENT_TYPES = ["Tax Invoice", "Bill of Supply", "Delivery Challan"];
const TAX_TYPES = ["IGST", "CGST+SGST", "Exempt"];
const UQC_OPTIONS = ["NOS", "KGS", "MTR", "LTR", "PCS"];

const EMPTY_LINE_ITEM: LineItem = {
  sNo: 1, description: "", uqc: "", quantity: "", rate: "", amount: "", hsnCode: "",
};

function getEmptyAsset(): AssetData {
  return {
    salesType: "", companyCode: "", assetCategory: "", categoryOfUnits: "",
    entityName: "", assetLocation: "", grossValue: "", wdv: "",
    costCenter: "", salesValue: "",
    consignerName: "", consignerAddress: "", consignerPinCode: "", consignerLocation: "",
    plantCode: "", consignerGSTIN: "",
    consigneeName: "", consigneeAddress: "", consigneePinCode: "", consigneeLocation: "",
    consigneeGSTIN: "", consigneeCategoryOfUnits: "",
    shipToName: "", shipToAddress: "", shipToGSTIN: "",
    type: "", documentType: "", taxType: "", consigneePlantCode: "", consigneeCostCenter: "",
    comments: "",
    lineItems: [{ ...EMPTY_LINE_ITEM }],
  };
}

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editAssetId?: string | null;
}

export default function AssetModal({ isOpen, onClose, onSaved, editAssetId }: AssetModalProps) {
  const [form, setForm] = useState<AssetData>(getEmptyAsset());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetchingEdit, setFetchingEdit] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (editAssetId) {
      setFetchingEdit(true);
      fetch(`/api/assets/${editAssetId}`)
        .then((r) => r.json())
        .then((data) => {
          const mapped: AssetData = { ...getEmptyAsset(), id: data.id };
          for (const key of Object.keys(mapped) as (keyof AssetData)[]) {
            if (key === "lineItems" || key === "id") continue;
            if (data[key]) (mapped as Record<string, string>)[key] = data[key];
          }
          mapped.lineItems = data.lineItems?.length
            ? data.lineItems.map((li: LineItem) => ({
                sNo: li.sNo, description: li.description || "", uqc: li.uqc || "",
                quantity: li.quantity || "", rate: li.rate || "",
                amount: li.amount || "", hsnCode: li.hsnCode || "",
              }))
            : [{ ...EMPTY_LINE_ITEM }];
          setForm(mapped);
        })
        .finally(() => setFetchingEdit(false));
    } else {
      setForm(getEmptyAsset());
    }
    setErrors({});
  }, [isOpen, editAssetId]);

  if (!isOpen) return null;

  function setField(field: keyof AssetData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  }

  function updateLineItem(index: number, field: keyof LineItem, value: string) {
    setForm((prev) => {
      const items = [...prev.lineItems];
      items[index] = { ...items[index], [field]: value };
      if (field === "quantity" || field === "rate") {
        const qty = parseFloat(field === "quantity" ? value : items[index].quantity) || 0;
        const rate = parseFloat(field === "rate" ? value : items[index].rate) || 0;
        items[index].amount = qty && rate ? (qty * rate).toFixed(2) : "";
      }
      return { ...prev, lineItems: items };
    });
  }

  function addLineItem() {
    setForm((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, { ...EMPTY_LINE_ITEM, sNo: prev.lineItems.length + 1 }],
    }));
  }

  function removeLineItem(index: number) {
    setForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index).map((item, i) => ({ ...item, sNo: i + 1 })),
    }));
  }

  function getTotalAmount(): string {
    const total = form.lineItems.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
    return total ? total.toFixed(2) : "";
  }

  function validate(): boolean {
    const required: (keyof AssetData)[] = [
      "salesType", "companyCode", "assetCategory", "categoryOfUnits",
      "entityName", "assetLocation", "grossValue", "wdv", "costCenter", "salesValue",
      "consignerName", "consignerAddress", "consignerPinCode", "consignerLocation",
      "plantCode", "consignerGSTIN",
      "consigneeName", "consigneeAddress", "consigneePinCode", "consigneeLocation",
      "consigneeGSTIN", "comments",
    ];
    const errs: Record<string, string> = {};
    for (const f of required) if (!(form[f] as string)) errs[f] = "Required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Scroll to the first error
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return Object.keys(errs).length === 0;
  }

  async function handleSave(submitStatus: string) {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form, status: submitStatus };
      const url = editAssetId ? `/api/assets/${editAssetId}` : "/api/assets";
      const method = editAssetId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const err = await res.json(); alert(err.error || "Failed to save"); return; }
      onSaved();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  function renderSelect(id: string, label: string, field: keyof AssetData, options: string[]) {
    return (
      <div className="modal-field">
        <label className="form-label" htmlFor={id}>{label}</label>
        <select
          id={id}
          value={form[field] as string}
          onChange={(e) => setField(field, e.target.value)}
          className={`modal-select ${errors[field] ? "input-error" : ""}`}
        >
          <option value="">Select…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {errors[field] && <span className="error-hint">{errors[field]}</span>}
      </div>
    );
  }

  function renderInput(id: string, label: string, field: keyof AssetData, placeholder: string) {
    return (
      <div className="modal-field">
        <label className="form-label" htmlFor={id}>{label}</label>
        <input
          id={id}
          type="text"
          value={form[field] as string}
          onChange={(e) => setField(field, e.target.value)}
          placeholder={placeholder}
          className={`modal-input ${errors[field] ? "input-error" : ""}`}
        />
        {errors[field] && <span className="error-hint">{errors[field]}</span>}
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-head">
          <div>
            <h2 className="modal-title">
              {editAssetId ? "Edit Asset Request" : "New Asset Request"}
            </h2>
            <p className="modal-desc">
              Fill up all details accurately. No changes after invoice is prepared.
            </p>
          </div>
          <button className="modal-x" onClick={onClose} aria-label="Close">×</button>
        </div>

        {fetchingEdit ? (
          <div className="modal-loading">Loading…</div>
        ) : (
          <div className="modal-body">
            {/* ─── Asset Info ─── */}
            <fieldset className="modal-section">
              <legend className="modal-legend">Asset Information</legend>
              <div className="modal-grid">
                {renderSelect("salesType", "Sales Type", "salesType", SALES_TYPES)}
                {renderSelect("companyCode", "Company Code", "companyCode", COMPANY_CODES)}
                {renderSelect("assetCategory", "Asset Category", "assetCategory", ASSET_CATEGORIES)}
                {renderSelect("categoryOfUnits", "Category of Units", "categoryOfUnits", CATEGORY_OF_UNITS)}
                {renderInput("entityName", "Entity Name", "entityName", "Entity name")}
                {renderInput("assetLocation", "Asset Location", "assetLocation", "Asset location")}
                {renderInput("grossValue", "Gross Value", "grossValue", "0.00")}
                {renderInput("wdv", "WDV", "wdv", "0.00")}
                {renderInput("costCenter", "Cost Center", "costCenter", "Cost center")}
                {renderInput("salesValue", "Sales Value", "salesValue", "0.00")}
              </div>
            </fieldset>

            {/* ─── Consigner ─── */}
            <fieldset className="modal-section">
              <legend className="modal-legend">Consigner Details</legend>
              <div className="modal-grid">
                {renderSelect("consignerName", "Consigner Name", "consignerName", CONSIGNER_NAMES)}
                {renderInput("consignerAddress", "Address", "consignerAddress", "Address")}
                {renderInput("consignerPinCode", "Pin Code", "consignerPinCode", "Pin code")}
                {renderInput("consignerLocation", "Location", "consignerLocation", "Location")}
                {renderInput("plantCode", "Plant Code", "plantCode", "Plant code")}
                {renderInput("consignerGSTIN", "GSTIN No.", "consignerGSTIN", "GSTIN")}
              </div>
            </fieldset>

            {/* ─── Consignee ─── */}
            <fieldset className="modal-section">
              <legend className="modal-legend">Consignee Details</legend>
              <div className="modal-grid">
                {renderInput("consigneeName", "Consignee Name", "consigneeName", "Name")}
                {renderInput("consigneeAddress", "Address", "consigneeAddress", "Address")}
                {renderInput("consigneePinCode", "Pin Code", "consigneePinCode", "Pin code")}
                {renderInput("consigneeLocation", "Location", "consigneeLocation", "Location")}
                {renderInput("consigneeGSTIN", "GSTIN No.", "consigneeGSTIN", "GSTIN")}
                {renderSelect("consigneeCategoryOfUnits", "Category of Units", "consigneeCategoryOfUnits", CATEGORY_OF_UNITS)}
                {renderInput("shipToName", "Ship To Name", "shipToName", "Ship to name")}
                {renderInput("shipToAddress", "Ship To Address", "shipToAddress", "Ship to address")}
                {renderInput("shipToGSTIN", "Ship To GSTIN", "shipToGSTIN", "Ship to GSTIN")}
                {renderSelect("type", "Type", "type", TYPES)}
                {renderSelect("documentType", "Document Type", "documentType", DOCUMENT_TYPES)}
                {renderSelect("taxType", "Tax Type", "taxType", TAX_TYPES)}
                {renderInput("consigneePlantCode", "Plant Code", "consigneePlantCode", "Plant code")}
                {renderInput("consigneeCostCenter", "Cost Center", "consigneeCostCenter", "Cost center")}
              </div>
            </fieldset>

            {/* ─── Line Items ─── */}
            <fieldset className="modal-section">
              <legend className="modal-legend">
                Line Items
                <button type="button" className="btn btn-ghost legend-btn" onClick={addLineItem}>
                  + Add Item
                </button>
              </legend>
              <div className="items-table-wrap">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Description</th>
                      <th>UQC</th>
                      <th>Qty</th>
                      <th>Rate</th>
                      <th>Amount</th>
                      <th>HSN</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.lineItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="items-sno">{item.sNo}</td>
                        <td>
                          <input value={item.description} onChange={(e) => updateLineItem(idx, "description", e.target.value)} placeholder="Description" />
                        </td>
                        <td>
                          <select value={item.uqc} onChange={(e) => updateLineItem(idx, "uqc", e.target.value)}>
                            <option value="">—</option>
                            {UQC_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </td>
                        <td><input value={item.quantity} onChange={(e) => updateLineItem(idx, "quantity", e.target.value)} placeholder="0" /></td>
                        <td><input value={item.rate} onChange={(e) => updateLineItem(idx, "rate", e.target.value)} placeholder="0.00" /></td>
                        <td><input value={item.amount} readOnly className="items-readonly" placeholder="—" /></td>
                        <td><input value={item.hsnCode} onChange={(e) => updateLineItem(idx, "hsnCode", e.target.value)} placeholder="HSN" /></td>
                        <td>
                          <button
                            type="button"
                            className="items-remove"
                            onClick={() => removeLineItem(idx)}
                            disabled={form.lineItems.length === 1}
                            aria-label="Remove item"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={5} className="items-total-label">Total</td>
                      <td className="items-total-value">{getTotalAmount() || "—"}</td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </fieldset>

            {/* ─── Comments ─── */}
            <fieldset className="modal-section">
              <legend className="modal-legend">Comments</legend>
              <textarea
                id="comments"
                className={`modal-textarea ${errors.comments ? "input-error" : ""}`}
                value={form.comments}
                onChange={(e) => setField("comments", e.target.value)}
                placeholder="Add any relevant notes…"
                rows={3}
              />
              {errors.comments && <span className="error-hint">{errors.comments}</span>}
            </fieldset>

            {/* ─── Documents ─── */}
            <fieldset className="modal-section">
              <legend className="modal-legend">Documents</legend>
              <div className="modal-grid">
                <div className="modal-field"><label className="form-label">FAR Documents</label><input type="file" className="modal-file" /></div>
                <div className="modal-field"><label className="form-label">Other Documents</label><input type="file" className="modal-file" /></div>
                <div className="modal-field"><label className="form-label">Sourcing Approval</label><input type="file" className="modal-file" /></div>
                <div className="modal-field"><label className="form-label">DC</label><input type="file" className="modal-file" /></div>
                <div className="modal-field"><label className="form-label">Payment Confirmation</label><input type="file" className="modal-file" /></div>
              </div>
            </fieldset>

            {/* ─── Actions ─── */}
            <div className="modal-actions">
              <button type="button" className="btn btn-primary" onClick={() => handleSave("InProgress RM")} disabled={loading}>
                {loading ? <span className="spinner" /> : "Submit"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => handleSave("Requestor Saved")} disabled={loading}>
                Save as Draft
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
