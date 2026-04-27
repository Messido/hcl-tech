# Placeholders & Open Questions

Items marked with placeholder values that need real data before production.

---

## Dropdown Options (All using placeholder values)

| Field | Location | Current Placeholders | Question |
|-------|----------|---------------------|----------|
| **Sales Type** | Asset form | "Asset Sale", "Scrap Sale", "Inter-Unit Transfer" | What are the actual sales type categories? |
| **Company Code / Entity Name** | Asset form | "HCLTech - 1000", "HCLTech - 2000", "HCLTech - 3000" | What company codes and entity names should be listed? |
| **Asset Category** | Asset form | "IT Equipment", "Furniture", "Vehicle", "Machinery" | What are the real asset categories? |
| **Category Of Units** | Asset form | "SEZ", "DTA", "STPI", "EOU" | What unit categories are used? |
| **Consigner Name** | Consigner section | "HCLTech Noida", "HCLTech Chennai", "HCLTech Bangalore" | Should this be a dynamic list from the database, or a fixed set? |
| **Consignee Category Of Units** | Consignee section | Same as Category Of Units | Same question as above |
| **Type** | Consignee section | "Regular", "SEZ", "Export", "Import" | What types are applicable? |
| **Document Type** | Consignee section | "Tax Invoice", "Bill of Supply", "Delivery Challan" | What document types does FOS use? |
| **Tax Type** | Consignee section | "IGST", "CGST+SGST", "Exempt" | What tax types are applicable? |
| **UQC** (Unit Quantity Code) | Line items table | "NOS", "KGS", "MTR", "LTR", "PCS" | What UQC codes should be available? |

---

## File Uploads

| Field | Question |
|-------|----------|
| **FAR Documents Upload** | What file types/size limits? PDF only? |
| **Other Documents** | Same — any restrictions? |
| **Sourcing Approval** | Is this always required? |
| **DC** (Delivery Challan) | Is this always required? |
| **Payment Confirmation** | Is this always required? |

> Currently files are stored in `public/uploads/` and filenames saved in the DB. For production, consider cloud storage (S3/Azure Blob).

---

## Business Logic Questions

| Topic | Question |
|-------|----------|
| **Request Number Format** | Using `ASSID00XXXX` (sequential). Is this the correct format? What's the starting number? |
| **Status Workflow** | Currently: Save → "Requestor Saved", Submit → "InProgress RM". What's the full status flow? (e.g., RM Referred Back, Approved, Rejected?) |
| **"Pending With" Column** | How is this determined? Is it based on status? Who are the roles (Requestor, RM, etc.)? |
| **Business Area** | Where does this value come from? Is it derived from entity/location? |
| **Amount Calculation** | Is Amount = Quantity × Rate? Or can it be manually overridden? |
| **User Roles** | Are there different roles (Requestor, RM, Admin)? Should the view differ per role? |
| **Edit Permissions** | Can a submitted asset be edited? Or only "Requestor Saved" ones? |
| **Delete Permissions** | Can any asset be deleted, or only drafts? |

---

## UI/UX Questions

| Topic | Question |
|-------|----------|
| **"My Request" Tab** | Are there other tabs planned (e.g., "All Requests", "Pending Approval")? |
| **Search Behavior** | Should search be server-side (API query) or client-side filter? Currently planned as server-side. |
| **Date Format** | Using `YYYY-MM-DD`. Is `DD/MM/YYYY` preferred (Indian format)? |
| **Pagination Size** | Using 5 items per page (matching screenshot). Should this be configurable? |

---

*Last updated: 2026-04-27*
