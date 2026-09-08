import React, { useEffect, useState } from "react";
import "./BuyerDashboard.css";
import { useTranslation } from "react-i18next";

import API_URL from "./config";

function BuyerDashboard({ user }) {
  const { t, i18n } = useTranslation();

  const [requests, setRequests] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // LOAD REQUESTS + DEALS
  useEffect(() => {
    if (user?.buyerId) {
      fetchDashboardData();
    } else {
      setLoading(false);
      setError(
        t("buyerDashboard.notLinked")
      );
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [requestsResponse, dealsResponse] =
        await Promise.all([
          fetch(
            `${API_URL}/api/contact-requests/buyer/${user.buyerId}`
          ),
          fetch(
            `${API_URL}/api/deals/buyer/${user.buyerId}`
          ),
        ]);

      if (!requestsResponse.ok) {
        throw new Error(
          t("buyerDashboard.loadRequestsError")
        );
      }

      if (!dealsResponse.ok) {
        throw new Error(
          t("buyerDashboard.loadDealsError")
        );
      }

      const requestsResult =
        await requestsResponse.json();

      const dealsResult =
        await dealsResponse.json();

      if (!requestsResult.success) {
        throw new Error(
          requestsResult.message ||
            t("buyerDashboard.unableRequests")
        );
      }

      if (!dealsResult.success) {
        throw new Error(
          dealsResult.message ||
            t("buyerDashboard.unableDeals")
        );
      }

      setRequests(requestsResult.data || []);
      setDeals(dealsResult.data || []);

    } catch (err) {
      console.error(
        "Buyer dashboard loading error:",
        err
      );

      setError(
        err.message ||
          t("buyerDashboard.unableDashboard")
      );

    } finally {
      setLoading(false);
    }
  };

  // UPDATE REQUEST STATUS
  const updateRequestStatus = async (
    requestId,
    status
  ) => {
    if (updatingId) {
      return;
    }

    try {
      setUpdatingId(requestId);
      setError("");

      const response = await fetch(
        `${API_URL}/api/contact-requests/${requestId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            result.detail ||
            t("buyerDashboard.unableUpdate")
        );
      }

      // Update request locally
      setRequests((previous) =>
        previous.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status,
                dealId:
                  result.deal?.id ||
                  request.dealId ||
                  null,
                updatedAt:
                  result.request?.updatedAt ||
                  new Date().toISOString(),
              }
            : request
        )
      );

      // If accepting created/reused a deal,
      // immediately add/update it in the dashboard.
      if (
        status === "Accepted" &&
        result.deal
      ) {
        setDeals((previous) => {
          const existingIndex =
            previous.findIndex(
              (deal) =>
                deal.id === result.deal.id
            );

          if (existingIndex !== -1) {
            return previous.map(
              (deal, index) =>
                index === existingIndex
                  ? result.deal
                  : deal
            );
          }

          return [
            ...previous,
            result.deal,
          ];
        });
      }

      // Refresh once after the operation so the
      // dashboard stays synchronized with backend data.
      if (status === "Accepted") {
        setTimeout(() => {
          fetchDashboardData();
        }, 300);
      }

    } catch (err) {
      console.error(
        "Request status update error:",
        err
      );

      setError(
        err.message ||
          t("buyerDashboard.updateTryAgain")
      );

    } finally {
      setUpdatingId(null);
    }
  };

  // FIND DEAL LINKED TO REQUEST
  const getDealForRequest = (request) => {
    if (!request) {
      return null;
    }

    // First preference: exact deal ID
    if (request.dealId) {
      const dealById = deals.find(
        (deal) =>
          deal.id === request.dealId
      );

      if (dealById) {
        return dealById;
      }
    }

    // Second preference: exact contact request ID
    const dealByRequest =
      deals.find(
        (deal) =>
          deal.contactRequestId ===
          request.id
      );

    if (dealByRequest) {
      return dealByRequest;
    }

    // Third preference: same farmer + buyer + crop
    const dealByDetails =
      deals.find(
        (deal) =>
          String(
            deal.farmerEmail || ""
          ).toLowerCase() ===
            String(
              request.farmerEmail || ""
            ).toLowerCase() &&
          String(
            deal.buyerId || ""
          ) ===
            String(
              user?.buyerId || ""
            ) &&
          String(
            deal.crop || ""
          ).toLowerCase() ===
            String(
              request.crop || ""
            ).toLowerCase()
      );

    return dealByDetails || null;
  };

  // REQUEST COUNTS
  const pendingCount =
    requests.filter(
      (request) =>
        request.status === "Pending"
    ).length;

  const acceptedCount =
    requests.filter(
      (request) =>
        request.status === "Accepted"
    ).length;

  const rejectedCount =
    requests.filter(
      (request) =>
        request.status === "Rejected"
    ).length;

  // ACTIVE DEAL COUNT
  const activeDealCount =
    deals.filter(
      (deal) =>
        deal.status === "Active"
    ).length;

  // LOADING
  if (loading) {
    return (
      <main className="buyer-dashboard-page">
        <section className="buyer-dashboard-header">
          <div className="section-label">
            {t("buyerDashboard.portal")}
          </div>

          <h1>
            {t("buyerDashboard.title")}
          </h1>

          <p>
            {t("buyerDashboard.description")}
          </p>
        </section>

        <div className="dashboard-empty">
          <div className="dashboard-empty-icon">
            ⏳
          </div>

          <h3>
            {t("buyerDashboard.loading")}
          </h3>

          <p>
            {t("buyerDashboard.loadingDescription")}
          </p>
        </div>
      </main>
    );
  }

  // ERROR
  if (
    error &&
    requests.length === 0 &&
    deals.length === 0
  ) {
    return (
      <main className="buyer-dashboard-page">
        <section className="buyer-dashboard-header">
          <div className="section-label">
            {t("buyerDashboard.portal")}
          </div>

          <h1>
            {t("buyerDashboard.title")}
          </h1>

          <p>
            {t("buyerDashboard.description")}
          </p>
        </section>

        <div className="dashboard-empty">
          <div className="dashboard-empty-icon">
            ⚠️
          </div>

          <h3>
            {t("buyerDashboard.unableLoad")}
          </h3>

          <p>{error}</p>

          <button
            className="dashboard-refresh-btn"
            onClick={fetchDashboardData}
          >
            {t("buyerDashboard.tryAgain")}
          </button>
        </div>
      </main>
    );
  }

  // MAIN DASHBOARD
  return (
    <main className="buyer-dashboard-page">

      {/* HEADER */}
      <section className="buyer-dashboard-header">
        <div className="section-label">
          {t("buyerDashboard.portal")}
        </div>

        <h1>
          {t("buyerDashboard.title")}
        </h1>

        <p>
          {t("buyerDashboard.welcomeBack")}{" "}
          <strong>
            {user?.name}
          </strong>
          .{" "}
          {t("buyerDashboard.manageNetwork")}
        </p>
      </section>

      {/* BUSINESS CARD */}
      <section className="buyer-business-card">

        <div className="buyer-business-icon">
          🏢
        </div>

        <div className="buyer-business-info">
          <span>
            {t("buyerDashboard.loggedInAs")}
          </span>

          <h2>
            {user?.buyerName ||
              t("buyerDashboard.buyerBusiness")}
          </h2>

          {user?.buyerLocation && (
            <p>
              📍 {user.buyerLocation}
            </p>
          )}
        </div>

        <div className="buyer-id-badge">
          {t("buyerDashboard.buyerId")}:{" "}
          {user?.buyerId}
        </div>

      </section>

      {/* STATS */}
      <section className="buyer-stats-grid">

        <div className="buyer-stat-card">
          <div className="buyer-stat-icon">
            📨
          </div>

          <div>
            <span>
              {t("buyerDashboard.totalRequests")}
            </span>

            <strong>
              {requests.length}
            </strong>
          </div>
        </div>

        <div className="buyer-stat-card">
          <div className="buyer-stat-icon">
            🟡
          </div>

          <div>
            <span>
              {t("buyerDashboard.pending")}
            </span>

            <strong>
              {pendingCount}
            </strong>
          </div>
        </div>

        <div className="buyer-stat-card">
          <div className="buyer-stat-icon">
            ✅
          </div>

          <div>
            <span>
              {t("buyerDashboard.accepted")}
            </span>

            <strong>
              {acceptedCount}
            </strong>
          </div>
        </div>

        <div className="buyer-stat-card">
          <div className="buyer-stat-icon">
            🤝
          </div>

          <div>
            <span>
              {t("buyerDashboard.activeDeals")}
            </span>

            <strong>
              {activeDealCount}
            </strong>
          </div>
        </div>

      </section>

      {/* ERROR BANNER */}
      {error &&
        requests.length > 0 && (
          <div className="dashboard-error">
            ⚠️ {error}
          </div>
        )}

      {/* INCOMING REQUESTS */}
      <section className="incoming-requests-section">

        <div className="incoming-header">

          <div>
            <div className="section-label">
              {t("buyerDashboard.farmerConnections")}
            </div>

            <h2>
              {t("buyerDashboard.incomingRequests")}
            </h2>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchDashboardData}
            disabled={
              updatingId !== null
            }
          >
            ↻ {t("buyerDashboard.refresh")}
          </button>

        </div>

        {requests.length === 0 ? (
          <div className="dashboard-empty request-empty">

            <div className="dashboard-empty-icon">
              📭
            </div>

            <h3>
              {t("buyerDashboard.noRequests")}
            </h3>

            <p>
              {t("buyerDashboard.noRequestsDescription")}
            </p>

          </div>
        ) : (
          <div className="incoming-request-list">

            {requests
              .slice()
              .reverse()
              .map((request) => {

                const deal =
                  getDealForRequest(
                    request
                  );

                return (
                  <article
                    className="incoming-request-card"
                    key={request.id}
                  >

                    {/* FARMER INFORMATION */}
                    <div className="incoming-request-main">

                      <div className="farmer-avatar">
                        🌾
                      </div>

                      <div className="farmer-info">

                        <div className="farmer-name-row">

                          <h3>
                            {request.farmerName}
                          </h3>

                          <span
                            className={`status-badge status-${request.status?.toLowerCase()}`}
                          >
                            ● {request.status}
                          </span>

                        </div>

                        <p>
                          {request.farmerEmail}
                        </p>

                        <small>
                          {t("buyerDashboard.requestId")}:{" "}
                          {request.id}
                        </small>

                      </div>

                    </div>

                    {/* REQUEST DETAILS */}
                    <div className="request-details-grid">

                      <div className="request-detail">
                        <span>
                          🌱 {t("buyerDashboard.crop")}
                        </span>

                        <strong>
                          {request.crop}
                        </strong>
                      </div>

                      <div className="request-detail">
                        <span>
                          📦 {t("buyerDashboard.quantity")}
                        </span>

                        <strong>
                          {request.quantity}
                        </strong>
                      </div>

                      <div className="request-detail">
                        <span>
                          💰 {t("buyerDashboard.offeredPrice")}
                        </span>

                        <strong>
                          {request.offeredPrice}
                        </strong>
                      </div>

                      <div className="request-detail">
                        <span>
                          📅 {t("buyerDashboard.requested")}
                        </span>

                        <strong>
                          {request.createdAt
                            ? new Date(
                                request.createdAt
                              ).toLocaleDateString(
                                i18n.language === "mr"
                                  ? "mr-IN"
                                  : i18n.language === "hi"
                                  ? "hi-IN"
                                  : "en-IN"
                              )
                            : "—"}
                        </strong>
                      </div>

                    </div>

                    {/* PENDING ACTIONS */}
                    {request.status ===
                      "Pending" && (
                      <div className="request-actions">

                        <button
                          className="reject-request-btn"
                          onClick={() =>
                            updateRequestStatus(
                              request.id,
                              "Rejected"
                            )
                          }
                          disabled={
                            updatingId ===
                            request.id
                          }
                        >
                          {updatingId ===
                          request.id
                            ? t("buyerDashboard.updating")
                            : `✕ ${t("buyerDashboard.reject")}`}
                        </button>

                        <button
                          className="accept-request-btn"
                          onClick={() =>
                            updateRequestStatus(
                              request.id,
                              "Accepted"
                            )
                          }
                          disabled={
                            updatingId ===
                            request.id
                          }
                        >
                          {updatingId ===
                          request.id
                            ? t("buyerDashboard.updating")
                            : `✓ ${t("buyerDashboard.accept")}`}
                        </button>

                      </div>
                    )}

                    {/* ACCEPTED + DEAL */}
                    {request.status ===
                      "Accepted" && (
                      <div>

                        {deal ? (
                          <div className="completed-message accepted-message">

                            <div>
                              ✓ {t("buyerDashboard.requestAccepted")}
                            </div>

                            <div
                              style={{
                                marginTop:
                                  "10px",
                                paddingTop:
                                  "10px",
                                borderTop:
                                  "1px solid rgba(0,0,0,0.08)",
                              }}
                            >
                              <strong>
                                🤝 {t("buyerDashboard.dealCreated")}
                              </strong>

                              <div
                                style={{
                                  display:
                                    "grid",
                                  gridTemplateColumns:
                                    "repeat(auto-fit, minmax(160px, 1fr))",
                                  gap: "8px",
                                  marginTop:
                                    "8px",
                                }}
                              >

                                <div>
                                  <small>
                                    {t("buyerDashboard.dealId")}
                                  </small>

                                  <div>
                                    <strong>
                                      {deal.id}
                                    </strong>
                                  </div>
                                </div>

                                <div>
                                  <small>
                                    {t("buyerDashboard.status")}
                                  </small>

                                  <div>
                                    <strong>
                                      {deal.status ||
                                        "Active"}
                                    </strong>
                                  </div>
                                </div>

                                <div>
                                  <small>
                                    {t("buyerDashboard.estimatedValue")}
                                  </small>

                                  <div>
                                    <strong>
                                      {deal.estimatedTotalValue ||
                                        "—"}
                                    </strong>
                                  </div>
                                </div>

                              </div>

                              <div
                                style={{
                                  marginTop:
                                    "8px",
                                }}
                              >
                                <small>
                                  {t("buyerDashboard.transactionTracked")}
                                </small>
                              </div>

                            </div>

                          </div>
                        ) : (
                          <div className="completed-message accepted-message">
                            ✓{" "}
                            {t("buyerDashboard.acceptedContact")}
                            <div
                              style={{
                                marginTop:
                                  "6px",
                              }}
                            >
                              {t("buyerDashboard.dealSynchronizing")}
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                    {/* REJECTED */}
                    {request.status ===
                      "Rejected" && (
                      <div className="completed-message rejected-message">
                        ✕{" "}
                        {t("buyerDashboard.rejectedContact")}
                      </div>
                    )}

                  </article>
                );
              })}

          </div>
        )}

      </section>

      {/* ACTIVE DEALS */}
      {deals.length > 0 && (
        <section
          className="incoming-requests-section"
          style={{
            marginTop: "30px",
          }}
        >

          <div className="incoming-header">

            <div>
              <div className="section-label">
                {t("buyerDashboard.transactionManagement")}
              </div>

              <h2>
                {t("buyerDashboard.yourDeals")}
              </h2>
            </div>

          </div>

          <div className="incoming-request-list">

            {deals
              .slice()
              .reverse()
              .map((deal) => (
                <article
                  className="incoming-request-card"
                  key={deal.id}
                >

                  <div className="incoming-request-main">

                    <div className="farmer-avatar">
                      🤝
                    </div>

                    <div className="farmer-info">

                      <div className="farmer-name-row">

                        <h3>
                          {deal.crop ||
                            t("buyerDashboard.cropDeal")}
                        </h3>

                        <span
                          className={`status-badge status-${deal.status?.toLowerCase()}`}
                        >
                          ● {deal.status}
                        </span>

                      </div>

                      <p>
                        {t("buyerDashboard.farmer")}:{" "}
                        {deal.farmerName}
                      </p>

                      <small>
                        {t("buyerDashboard.dealId")}:{" "}
                        {deal.id}
                      </small>

                    </div>

                  </div>

                  <div className="request-details-grid">

                    <div className="request-detail">
                      <span>
                        📦 {t("buyerDashboard.quantity")}
                      </span>

                      <strong>
                        {deal.quantity ||
                          "—"}
                      </strong>
                    </div>

                    <div className="request-detail">
                      <span>
                        💰 {t("buyerDashboard.offeredPrice")}
                      </span>

                      <strong>
                        {deal.offeredPrice ||
                          "—"}
                      </strong>
                    </div>

                    <div className="request-detail">
                      <span>
                        💵 {t("buyerDashboard.estimatedValue")}
                      </span>

                      <strong>
                        {deal.estimatedTotalValue ||
                          "—"}
                      </strong>
                    </div>

                    <div className="request-detail">
                      <span>
                        📅 {t("buyerDashboard.created")}
                      </span>

                      <strong>
                        {deal.createdAt
                          ? new Date(
                              deal.createdAt
                            ).toLocaleDateString(
                              i18n.language === "mr"
                                ? "mr-IN"
                                : i18n.language === "hi"
                                ? "hi-IN"
                                : "en-IN"
                            )
                          : "—"}
                      </strong>
                    </div>

                  </div>

                  <div className="completed-message accepted-message">
                    ✓{" "}
                    {t("buyerDashboard.dealTracked")}
                  </div>

                </article>
              ))}

          </div>

        </section>
      )}

    </main>
  );
}

export default BuyerDashboard;