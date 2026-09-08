import React, { useEffect, useState } from "react";
import "./Deals.css";
import { useTranslation } from "react-i18next";

import API_URL from "./config";

function Deals({ user }) {
  const { t, i18n } = useTranslation();

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingDealId, setUpdatingDealId] = useState("");

  const isBuyer = user?.role === "Buyer";

  useEffect(() => {
    fetchDeals();
  }, [user]);

  const fetchDeals = async () => {
    setLoading(true);
    setError("");

    try {
      let url = "";

      if (isBuyer) {
        if (!user?.buyerId) {
          setDeals([]);
          setError(t("deals.notLinked"));
          setLoading(false);
          return;
        }

        url = `${API_URL}/api/deals/buyer/${user.buyerId}`;
      } else {
        if (!user?.email) {
          setDeals([]);
          setError(t("deals.loginToView"));
          setLoading(false);
          return;
        }

        url = `${API_URL}/api/deals/farmer/${encodeURIComponent(
          user.email
        )}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(t("deals.unableLoad"));
      }

      const result = await response.json();

      if (result.success) {
        setDeals(result.data || []);
      } else {
        setDeals([]);
        setError(result.message || t("deals.unableLoad"));
      }
    } catch (err) {
      console.error("Deals error:", err);

      setError(t("deals.backendConnectionError"));
    } finally {
      setLoading(false);
    }
  };

  const updateDealStatus = async (dealId, newStatus) => {
    if (!dealId || updatingDealId) {
      return;
    }

    const confirmed = window.confirm(
      newStatus === "Completed"
        ? t("deals.confirmCompleted")
        : t("deals.confirmCancelled")
    );

    if (!confirmed) {
      return;
    }

    setUpdatingDealId(dealId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/deals/${encodeURIComponent(dealId)}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || t("deals.unableUpdateStatus")
        );
      }

      if (result.deal) {
        setDeals((currentDeals) =>
          currentDeals.map((deal) =>
            deal.id === dealId
              ? {
                  ...deal,
                  ...result.deal,
                }
              : deal
          )
        );
      } else {
        await fetchDeals();
      }
    } catch (err) {
      console.error("Deal status update error:", err);

      setError(
        err.message ||
          t("deals.unableUpdateTryAgain")
      );
    } finally {
      setUpdatingDealId("");
    }
  };

  const getStatusClass = (status) => {
    if (status === "Active") {
      return "deal-status active";
    }

    if (status === "Completed") {
      return "deal-status completed";
    }

    if (status === "Cancelled") {
      return "deal-status cancelled";
    }

    return "deal-status";
  };

  const getTranslatedStatus = (status) => {
    if (status === "Active") {
      return t("deals.active");
    }

    if (status === "Completed") {
      return t("deals.completed");
    }

    if (status === "Cancelled") {
      return t("deals.cancelled", "Cancelled");
    }

    return status || "—";
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "—";
    }

    try {
      const locale =
        i18n.language === "hi"
          ? "hi-IN"
          : i18n.language === "mr"
          ? "mr-IN"
          : "en-IN";

      return new Date(dateString).toLocaleDateString(
        locale,
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return dateString;
    }
  };

  const activeDeals = deals.filter(
    (deal) => deal.status === "Active"
  ).length;

  const completedDeals = deals.filter(
    (deal) => deal.status === "Completed"
  ).length;

  const totalDeals = deals.length;

  if (!user) {
    return (
      <div className="deals-page">
        <div className="deals-empty">
          <div className="deals-empty-icon">🔐</div>

          <h2>{t("deals.loginRequired")}</h2>

          <p>
            {t("deals.loginRequiredDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="deals-page">

      {/* HERO */}
      <section className="deals-hero">

        <div>
          <div className="deals-eyebrow">
            🤝 {t("deals.eyebrow")}
          </div>

          <h1>
            {t("deals.title")}
          </h1>

          <p>
            {t("deals.description")}
          </p>
        </div>

        <button
          className="deals-refresh-button"
          onClick={fetchDeals}
          disabled={
            loading ||
            updatingDealId !== ""
          }
        >
          ↻{" "}
          {loading
            ? t("deals.refreshing")
            : t("deals.refresh")}
        </button>

      </section>


      {/* STATISTICS */}
      <section className="deals-stats">

        <div className="deal-stat-card">

          <div className="deal-stat-icon">
            🤝
          </div>

          <div>
            <span>
              {t("deals.totalDeals")}
            </span>

            <strong>
              {totalDeals}
            </strong>
          </div>

        </div>


        <div className="deal-stat-card">

          <div className="deal-stat-icon">
            🟢
          </div>

          <div>
            <span>
              {t("deals.active")}
            </span>

            <strong>
              {activeDeals}
            </strong>
          </div>

        </div>


        <div className="deal-stat-card">

          <div className="deal-stat-icon">
            ✅
          </div>

          <div>
            <span>
              {t("deals.completed")}
            </span>

            <strong>
              {completedDeals}
            </strong>
          </div>

        </div>

      </section>


      {/* ERROR */}
      {error && (
        <div className="deals-error">
          ⚠️ {error}
        </div>
      )}


      {/* LOADING */}
      {loading && (
        <div className="deals-loading">

          <div className="deals-spinner"></div>

          <p>
            {t("deals.loading")}
          </p>

        </div>
      )}


      {/* NO DEALS */}
      {!loading &&
        !error &&
        deals.length === 0 && (
          <div className="deals-empty">

            <div className="deals-empty-icon">
              🤝
            </div>

            <h2>
              {t("deals.noDeals")}
            </h2>

            <p>
              {isBuyer
                ? t("deals.noBuyerDeals")
                : t("deals.noFarmerDeals")}
            </p>

          </div>
        )}


      {/* DEAL LIST */}
      {!loading &&
        deals.length > 0 && (
          <section className="deals-section">

            <div className="deals-section-heading">

              <div>

                <div className="deals-small-heading">
                  {t("deals.management")}
                </div>

                <h2>
                  {isBuyer
                    ? t("deals.yourFarmerDeals")
                    : t("deals.yourBuyerDeals")}
                </h2>

              </div>

              <span className="deal-count">
                {deals.length}{" "}
                {deals.length === 1
                  ? t("deals.deal")
                  : t("deals.deals")}
              </span>

            </div>


            <div className="deals-list">

              {deals.map((deal) => {

                const isUpdating =
                  updatingDealId === deal.id;

                return (
                  <article
                    className="deal-card"
                    key={deal.id}
                  >

                    {/* CARD HEADER */}
                    <div className="deal-card-header">

                      <div className="deal-main-person">

                        <div className="deal-person-icon">
                          {isBuyer
                            ? "🌾"
                            : "🏭"}
                        </div>

                        <div>

                          <h3>
                            {isBuyer
                              ? deal.farmerName
                              : deal.buyerName}
                          </h3>

                          <p>
                            {isBuyer
                              ? deal.farmerEmail
                              : deal.buyerLocation}
                          </p>

                        </div>

                      </div>


                      <div
                        className={getStatusClass(
                          deal.status
                        )}
                      >
                        ●{" "}
                        {getTranslatedStatus(
                          deal.status
                        )}
                      </div>

                    </div>


                    {/* DEAL ID */}
                    <div className="deal-id">

                      {t("deals.dealId")}:{" "}

                      <strong>
                        {deal.id}
                      </strong>

                    </div>


                    {/* DEAL DETAILS */}
                    <div className="deal-details">

                      <div className="deal-detail">

                        <span>
                          🌱 {t("deals.crop")}
                        </span>

                        <strong>
                          {deal.crop || "—"}
                        </strong>

                      </div>


                      <div className="deal-detail">

                        <span>
                          📦 {t("deals.quantity")}
                        </span>

                        <strong>
                          {deal.quantity || "—"}
                        </strong>

                      </div>


                      <div className="deal-detail">

                        <span>
                          💰 {t("deals.offeredPrice")}
                        </span>

                        <strong>
                          {deal.offeredPrice || "—"}
                        </strong>

                      </div>


                      <div className="deal-detail">

                        <span>
                          💵 {t("deals.estimatedValue")}
                        </span>

                        <strong>
                          {deal.estimatedTotalValue || "—"}
                        </strong>

                      </div>

                    </div>


                    {/* ADDITIONAL INFORMATION */}
                    <div className="deal-information">

                      <div>

                        <span>
                          {isBuyer
                            ? t("deals.farmer")
                            : t("deals.buyer")}
                        </span>

                        <strong>
                          {isBuyer
                            ? deal.farmerName
                            : deal.buyerName}
                        </strong>

                      </div>


                      <div>

                        <span>
                          {isBuyer
                            ? t("deals.farmerEmail")
                            : t("deals.location")}
                        </span>

                        <strong>
                          {isBuyer
                            ? deal.farmerEmail
                            : deal.buyerLocation}
                        </strong>

                      </div>


                      <div>

                        <span>
                          {t("deals.created")}
                        </span>

                        <strong>
                          {formatDate(
                            deal.createdAt
                          )}
                        </strong>

                      </div>

                    </div>


                    {/* ACTIVE MESSAGE + ACTIONS */}
                    {deal.status === "Active" && (
                      <>
                        <div className="deal-active-message">

                          ✓{" "}
                          {t(
                            "deals.activeMessage"
                          )}

                        </div>


                        <div className="deal-actions">

                          <button
                            className="deal-complete-button"
                            onClick={() =>
                              updateDealStatus(
                                deal.id,
                                "Completed"
                              )
                            }
                            disabled={isUpdating}
                          >
                            {isUpdating
                              ? t("deals.updating")
                              : `✓ ${t(
                                  "deals.markCompleted"
                                )}`}
                          </button>


                          <button
                            className="deal-cancel-button"
                            onClick={() =>
                              updateDealStatus(
                                deal.id,
                                "Cancelled"
                              )
                            }
                            disabled={isUpdating}
                          >
                            {isUpdating
                              ? t("deals.updating")
                              : t(
                                  "deals.cancelDeal"
                                )}
                          </button>

                        </div>
                      </>
                    )}


                    {/* COMPLETED */}
                    {deal.status === "Completed" && (
                      <div className="deal-completed-message">
                        ✓{" "}
                        {t(
                          "deals.completedMessage"
                        )}
                      </div>
                    )}


                    {/* CANCELLED */}
                    {deal.status === "Cancelled" && (
                      <div className="deal-cancelled-message">
                        {t(
                          "deals.cancelledMessage"
                        )}
                      </div>
                    )}

                  </article>
                );
              })}

            </div>

          </section>
        )}

    </div>
  );
}

export default Deals;