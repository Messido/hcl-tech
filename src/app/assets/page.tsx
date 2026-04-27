"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AssetModal from "./AssetModal";

interface Asset {
  id: string;
  requestNo: string;
  entityName: string | null;
  assetLocation: string | null;
  status: string;
}

interface AssetsResponse {
  assets: Asset[];
  total: number;
  page: number;
  totalPages: number;
}

export default function AssetsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [data, setData] = useState<AssetsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [requestNo, setRequestNo] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchAssets = useCallback(
    async (p: number = page) => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(p) });
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);
      if (requestNo) params.set("requestNo", requestNo);

      try {
        const res = await fetch(`/api/assets?${params}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } finally {
        setLoading(false);
      }
    },
    [page, fromDate, toDate, requestNo]
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    if (status === "authenticated") {
      fetchAssets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page, router]);

  function handleSearch() {
    setPage(1);
    fetchAssets(1);
  }

  function openCreate() {
    setEditId(null);
    setModalOpen(true);
  }

  function openEdit(id: string) {
    setEditId(id);
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this asset request?")) return;
    const res = await fetch(`/api/assets/${id}`, { method: "DELETE" });
    if (res.ok) fetchAssets();
  }

  if (status === "loading") {
    return (
      <div className="assets-page">
        <div className="assets-loading">Loading&hellip;</div>
      </div>
    );
  }

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";

  return (
    <div className="assets-page">
      {/* ─── Nav ─── */}
      <nav className="assets-nav">
        <div className="assets-nav-brand">
          <div className="assets-nav-logo">AM</div>
          <span>Asset Management</span>
        </div>
        <div className="assets-nav-user">
          <div className="welcome-user-info">
            <div className="welcome-user-name">{userName}</div>
            <div className="welcome-user-email">{userEmail}</div>
          </div>
          <button
            className="btn btn-ghost btn-signout"
            onClick={() => signOut({ callbackUrl: "/signin" })}
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* ─── Page Content ─── */}
      <main className="assets-main">
        <div className="assets-hero-row">
          <div>
            <h1 className="assets-title">Asset Requests</h1>
            <p className="assets-subtitle">
              Manage and track your fixed asset disposal requests
            </p>
          </div>
          <button
            className="btn btn-accent"
            onClick={openCreate}
            id="btn-create-asset"
          >
            + New Request
          </button>
        </div>

        {/* ─── Filters ─── */}
        <div className="assets-filters">
          <div className="assets-filter-field">
            <label className="form-label" htmlFor="filter-from">
              From
            </label>
            <input
              id="filter-from"
              type="date"
              className="assets-input"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="assets-filter-field">
            <label className="form-label" htmlFor="filter-to">
              To
            </label>
            <input
              id="filter-to"
              type="date"
              className="assets-input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="assets-filter-field">
            <label className="form-label" htmlFor="filter-req">
              Request&nbsp;No.
            </label>
            <input
              id="filter-req"
              type="text"
              className="assets-input"
              placeholder="e.g. ASSID008001"
              value={requestNo}
              onChange={(e) => setRequestNo(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary assets-search-btn"
            onClick={handleSearch}
            id="btn-search"
          >
            Search
          </button>
        </div>

        {/* ─── Table ─── */}
        <div className="assets-card">
          <div className="assets-table-wrap">
            <table className="assets-table">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Entity Name</th>
                  <th>Business Area</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="assets-empty">
                      Loading&hellip;
                    </td>
                  </tr>
                ) : !data || !data.assets || data.assets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="assets-empty">
                      <span className="assets-empty-icon">📋</span>
                      <span>No asset requests yet</span>
                    </td>
                  </tr>
                ) : (
                  data.assets.map((asset) => (
                    <tr key={asset.id}>
                      <td className="assets-mono">{asset.requestNo}</td>
                      <td>{asset.entityName || "—"}</td>
                      <td>{asset.assetLocation || "—"}</td>
                      <td>
                        <span
                          className={`assets-badge ${
                            asset.status === "Requestor Saved"
                              ? "badge-draft"
                              : asset.status === "InProgress RM"
                              ? "badge-progress"
                              : "badge-other"
                          }`}
                        >
                          {asset.status}
                        </span>
                      </td>
                      <td className="assets-row-actions">
                        <button
                          className="assets-action-btn"
                          onClick={() => openEdit(asset.id)}
                          title="Edit"
                          aria-label="Edit asset"
                        >
                          ✎
                        </button>
                        <button
                          className="assets-action-btn assets-action-danger"
                          onClick={() => handleDelete(asset.id)}
                          title="Delete"
                          aria-label="Delete asset"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ─── Pagination ─── */}
          {data && data.totalPages > 1 && (
            <div className="assets-pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(1)}
                className="assets-page-btn"
              >
                «
              </button>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="assets-page-btn"
              >
                ‹
              </button>
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    className={`assets-page-btn ${
                      p === page ? "active" : ""
                    }`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                disabled={page === data.totalPages}
                onClick={() =>
                  setPage((p) => Math.min(data.totalPages, p + 1))
                }
                className="assets-page-btn"
              >
                ›
              </button>
              <button
                disabled={page === data.totalPages}
                onClick={() => setPage(data.totalPages)}
                className="assets-page-btn"
              >
                »
              </button>
            </div>
          )}
        </div>
      </main>

      <AssetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => fetchAssets()}
        editAssetId={editId}
      />
    </div>
  );
}
