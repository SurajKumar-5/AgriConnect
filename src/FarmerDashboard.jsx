import React, { useEffect, useState } from "react";
import "./FarmerDashboard.css";
import { useTranslation } from "react-i18next";

import API_URL from "./config";

function FarmerDashboard({ user, navigate }) {
  const { t, i18n } = useTranslation();

  const [requests, setRequests] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const farmerEmail = user?.email || "";

  const loadDashboard = async () => {
    if (!farmerEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [requestsResponse, dealsResponse] = await Promise.all([
        fetch(
          `${API_URL}/api/contact-requests/farmer/${encodeURIComponent(
            farmerEmail
          )}`
        ),
        fetch(
          `${API_URL}/api/deals/farmer/${encodeURIComponent(farmerEmail)}`
        ),
      ]);

      if (!requestsResponse.ok || !dealsResponse.ok) {
        throw new Error("Unable to load farmer dashboard.");
      }

      const requestsResult = await requestsResponse.json();
      const dealsResult = await dealsResponse.json();

      setRequests(requestsResult.data || []);
      setDeals(dealsResult.data || []);
    } catch (err) {
      console.error("Farmer dashboard error:", err);
      setError(t("farmerDashboard.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();

    // Refresh when returning to the dashboard.
    const handleUserUpdate = () => loadDashboard();

    window.addEventListener("agriUserUpdated", handleUserUpdate);

    return () => {
      window.removeEventListener("agriUserUpdated", handleUserUpdate);
    };
  }, [farmerEmail]);

  const pendingRequests = requests.filter(
    (request) => String(request.status).toLowerCase() === "pending"
  );

  const acceptedRequests = requests.filter(
    (request) => String(request.status).toLowerCase() === "accepted"
  );

  const rejectedRequests = requests.filter(
    (request) => String(request.status).toLowerCase() === "rejected"
  );

  const activeDeals = deals.filter(
    (deal) => String(deal.status).toLowerCase() === "active"
  );

  const completedDeals = deals.filter(
    (deal) => String(deal.status).toLowerCase() === "completed"
  );

  const getDealForRequest = (request) => {
    if (!request) return null;

    // Best match: dealId stored on the request.
    if (request.dealId) {
      const directDeal = deals.find(
        (deal) => String(deal.id) === String(request.dealId)
      );

      if (directDeal) return directDeal;
    }

    // Second match: contactRequestId.
    const requestDeal = deals.find(
      (deal) =>
        String(deal.contactRequestId) === String(request.id)
    );

    if (requestDeal) return requestDeal;

    // Final fallback: same farmer + buyer + crop.
    return deals.find(
      (deal) =>
        String(deal.farmerEmail || "").toLowerCase() ===
          String(request.farmerEmail || farmerEmail).toLowerCase() &&
        Number(deal.buyerId) === Number(request.buyerId) &&
        String(deal.crop || "").toLowerCase() ===
          String(request.crop || "").toLowerCase()
    );
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return t("farmerDashboard.dateNotAvailable");

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString(
      i18n.language === "hi"
        ? "hi-IN"
        : i18n.language === "mr"
        ? "mr-IN"
        : "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClass = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "accepted") return "status-accepted";
    if (normalized === "rejected") return "status-rejected";
    if (normalized === "completed") return "status-completed";
    if (normalized === "cancelled") return "status-cancelled";

    return "status-pending";
  };

  const getStatusIcon = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "accepted") return "✓";
    if (normalized === "rejected") return "✕";
    if (normalized === "completed") return "✓";
    if (normalized === "cancelled") return "✕";

    return "⏳";
  };

  if (!user) {
    return (
      <div className="farmer-dashboard">
        <div className="farmer-empty-state">
          <h2>{t("farmerDashboard.loginRequired")}</h2>
          <p>
            {t("farmerDashboard.loginRequiredDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="farmer-dashboard">
      {/* HERO */}
      <section className="farmer-dashboard-hero">
        <div>
          <p className="farmer-dashboard-label">
            {t("farmerDashboard.label")}
          </p>

          <h1>
            {t("farmerDashboard.welcome", {
              name: user.name || t("farmerDashboard.farmer"),
            })}{" "}
            👨‍🌾
          </h1>

          <p>
            {t("farmerDashboard.description")}
          </p>
        </div>

        <button
          className="farmer-refresh-button"
          onClick={loadDashboard}
          disabled={loading}
        >
          ↻{" "}
          {loading
            ? t("farmerDashboard.refreshing")
            : t("farmerDashboard.refresh")}
        </button>
      </section>

      {/* ERROR */}
      {error && (
        <div className="farmer-error">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={loadDashboard}>
            {t("farmerDashboard.tryAgain")}
          </button>
        </div>
      )}

      {/* STATS */}
      <section className="farmer-stats-grid">
        <div className="farmer-stat-card">
          <div className="farmer-stat-icon">📨</div>
          <div>
            <span>{t("farmerDashboard.pendingRequests")}</span>
            <strong>{pendingRequests.length}</strong>
          </div>
        </div>

        <div className="farmer-stat-card">
          <div className="farmer-stat-icon">🤝</div>
          <div>
            <span>{t("farmerDashboard.accepted")}</span>
            <strong>{acceptedRequests.length}</strong>
          </div>
        </div>

        <div className="farmer-stat-card">
          <div className="farmer-stat-icon">🟢</div>
          <div>
            <span>{t("farmerDashboard.activeDeals")}</span>
            <strong>{activeDeals.length}</strong>
          </div>
        </div>

        <div className="farmer-stat-card">
          <div className="farmer-stat-icon">✅</div>
          <div>
            <span>{t("farmerDashboard.completedDeals")}</span>
            <strong>{completedDeals.length}</strong>
          </div>
        </div>
      </section>

      {/* LOADING */}
      {loading ? (
        <div className="farmer-loading">
          <div className="farmer-spinner"></div>
          <p>{t("farmerDashboard.loading")}</p>
        </div>
      ) : (
        <>
          {/* CONTACT REQUESTS */}
          <section className="farmer-section">
            <div className="farmer-section-heading">
              <div>
                <h2>
                  {t("farmerDashboard.myBuyerRequests")}
                </h2>
                <p>
                  {t("farmerDashboard.myBuyerRequestsDescription")}
                </p>
              </div>

              <span className="farmer-section-count">
                {requests.length}
              </span>
            </div>

            {requests.length === 0 ? (
              <div className="farmer-empty-state">
                <div className="farmer-empty-icon">📨</div>

                <h3>
                  {t("farmerDashboard.noBuyerRequests")}
                </h3>

                <p>
                  {t(
                    "farmerDashboard.noBuyerRequestsDescription"
                  )}
                </p>

                {navigate && (
                  <button
                    className="farmer-primary-button"
                    onClick={() => navigate("Buyers")}
                  >
                    {t("farmerDashboard.browseBuyers")}
                  </button>
                )}
              </div>
            ) : (
              <div className="farmer-request-list">
                {requests.map((request) => {
                  const deal = getDealForRequest(request);

                  return (
                    <div
                      className="farmer-request-card"
                      key={request.id || request._id}
                    >
                      <div className="farmer-request-top">
                        <div className="farmer-request-title">
                          <div className="farmer-buyer-avatar">
                            {(request.buyerName || "B")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h3>
                              {request.buyerName ||
                                t("farmerDashboard.buyer")}
                            </h3>

                            <p>
                              {request.buyerLocation ||
                                t(
                                  "farmerDashboard.locationNotAvailable"
                                )}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`farmer-status ${getStatusClass(
                            request.status
                          )}`}
                        >
                          {getStatusIcon(request.status)}{" "}
                          {request.status ||
                            t("farmerDashboard.pending")}
                        </span>
                      </div>

                      <div className="farmer-request-details">
                        <div>
                          <span>
                            {t("farmerDashboard.crop")}
                          </span>
                          <strong>
                            {request.crop || "—"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            {t("farmerDashboard.quantity")}
                          </span>
                          <strong>
                            {request.quantity || "—"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            {t("farmerDashboard.offeredPrice")}
                          </span>
                          <strong>
                            {request.offeredPrice || "—"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            {t("farmerDashboard.requestDate")}
                          </span>
                          <strong>
                            {formatDate(request.createdAt)}
                          </strong>
                        </div>
                      </div>

                      {/* ACCEPTED REQUEST */}
                      {String(request.status).toLowerCase() ===
                        "accepted" && (
                        <div className="farmer-accepted-box">
                          <div className="farmer-accepted-heading">
                            <span>✓</span>
                            <strong>
                              {t("farmerDashboard.dealCreated")}
                            </strong>
                          </div>

                          {deal ? (
                            <div className="farmer-deal-mini">
                              <div>
                                <span>
                                  {t("farmerDashboard.dealId")}
                                </span>
                                <strong>{deal.id}</strong>
                              </div>

                              <div>
                                <span>
                                  {t("farmerDashboard.status")}
                                </span>
                                <strong>{deal.status}</strong>
                              </div>

                              {deal.estimatedTotalValue && (
                                <div>
                                  <span>
                                    {t(
                                      "farmerDashboard.estimatedValue"
                                    )}
                                  </span>
                                  <strong>
                                    {deal.estimatedTotalValue}
                                  </strong>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p>
                              {t(
                                "farmerDashboard.dealSynchronizing"
                              )}
                            </p>
                          )}
                        </div>
                      )}

                      {/* REJECTED */}
                      {String(request.status).toLowerCase() ===
                        "rejected" && (
                        <div className="farmer-rejected-box">
                          ❌{" "}
                          {t(
                            "farmerDashboard.requestRejected"
                          )}
                        </div>
                      )}

                      <div className="farmer-request-footer">
                        <span>
                          {t("farmerDashboard.requestId")}:{" "}
                          <strong>
                            {request.id || "—"}
                          </strong>
                        </span>

                        {deal && (
                          <span>
                            {t("farmerDashboard.dealId")}:{" "}
                            <strong>{deal.id}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* DEALS */}
          <section className="farmer-section">
            <div className="farmer-section-heading">
              <div>
                <h2>
                  {t("farmerDashboard.myDeals")}
                </h2>

                <p>
                  {t("farmerDashboard.myDealsDescription")}
                </p>
              </div>

              <span className="farmer-section-count">
                {deals.length}
              </span>
            </div>

            {deals.length === 0 ? (
              <div className="farmer-empty-state">
                <div className="farmer-empty-icon">🤝</div>

                <h3>
                  {t("farmerDashboard.noDeals")}
                </h3>

                <p>
                  {t("farmerDashboard.noDealsDescription")}
                </p>
              </div>
            ) : (
              <div className="farmer-deals-grid">
                {deals.map((deal) => (
                  <div
                    className="farmer-deal-card"
                    key={deal.id}
                  >
                    <div className="farmer-deal-header">
                      <div>
                        <span className="farmer-deal-label">
                          {t("farmerDashboard.deal")}
                        </span>

                        <h3>{deal.id}</h3>
                      </div>

                      <span
                        className={`farmer-status ${getStatusClass(
                          deal.status
                        )}`}
                      >
                        {getStatusIcon(deal.status)}{" "}
                        {deal.status}
                      </span>
                    </div>

                    <div className="farmer-deal-buyer">
                      <div className="farmer-buyer-avatar">
                        {(deal.buyerName || "B")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <span>
                          {t("farmerDashboard.buyer")}
                        </span>

                        <strong>
                          {deal.buyerName ||
                            t("farmerDashboard.buyer")}
                        </strong>

                        {deal.buyerLocation && (
                          <small>
                            {deal.buyerLocation}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="farmer-deal-details">
                      <div>
                        <span>
                          {t("farmerDashboard.crop")}
                        </span>
                        <strong>
                          {deal.crop || "—"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          {t("farmerDashboard.quantity")}
                        </span>
                        <strong>
                          {deal.quantity || "—"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          {t("farmerDashboard.offeredPrice")}
                        </span>
                        <strong>
                          {deal.offeredPrice || "—"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          {t(
                            "farmerDashboard.estimatedValue"
                          )}
                        </span>
                        <strong>
                          {deal.estimatedTotalValue || "—"}
                        </strong>
                      </div>
                    </div>

                    <div className="farmer-deal-footer">
                      <span>
                        {t("farmerDashboard.created")}:{" "}
                        {formatDate(deal.createdAt)}
                      </span>

                      <span>
                        {t("farmerDashboard.request")}:{" "}
                        {deal.contactRequestId || "—"}
                      </span>
                    </div>

                    {String(deal.status).toLowerCase() ===
                      "active" && (
                      <div className="farmer-active-message">
                        🟢{" "}
                        {t(
                          "farmerDashboard.activeDealMessage"
                        )}
                      </div>
                    )}

                    {String(deal.status).toLowerCase() ===
                      "completed" && (
                      <div className="farmer-completed-message">
                        ✅{" "}
                        {t(
                          "farmerDashboard.completedDealMessage"
                        )}
                      </div>
                    )}

                    {String(deal.status).toLowerCase() ===
                      "cancelled" && (
                      <div className="farmer-cancelled-message">
                        ❌{" "}
                        {t(
                          "farmerDashboard.cancelledDealMessage"
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default FarmerDashboard;