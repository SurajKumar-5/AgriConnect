import React, { useEffect, useState } from "react";
import "./MarketPrices.css";
import VoiceAssistant from "./VoiceAssistant";
import { useTranslation } from "react-i18next";
import API_URL from "./config";

function MarketPrices() {
  const { t, i18n } = useTranslation();

  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // MARKET SERVICE STATUS
  // ============================================================

  const [dataSource, setDataSource] = useState("");
  const [isDemoData, setIsDemoData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  // ============================================================
  // FETCH MARKET PRICES
  // ============================================================

  const fetchMarketPrices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/market-prices`
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Unable to load market prices."
        );
      }

      // --------------------------------------------------------
      // MARKET DATA
      // --------------------------------------------------------

      setMarketData(result.data || []);

      // --------------------------------------------------------
      // DATA SOURCE
      // --------------------------------------------------------

      setDataSource(
        result.source ||
          "AgriConnect Market Service"
      );

      setIsDemoData(
        Boolean(result.demo)
      );

      // --------------------------------------------------------
      // LAST UPDATED
      // --------------------------------------------------------

      setLastUpdated(
        result.updated || ""
      );

    } catch (err) {
      console.error(
        "Market price error:",
        err
      );

      setError(
        t("marketPrices.loadError")
      );

      setDataSource("");
      setIsDemoData(false);
      setLastUpdated("");

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  // ============================================================
  // PRICE FORMATTER
  // ============================================================

  const formatPrice = (value) => {
    const price = Number(value);

    if (!Number.isFinite(price)) {
      return "—";
    }

    // Government market data is generally reported
    // per quintal. Convert to approximate ₹/kg.
    const perKg = price / 100;

    return `₹${perKg.toFixed(0)}/kg`;
  };

  // ============================================================
  // CROP ICON
  // ============================================================

  const getCropIcon = (commodity) => {
    const icons = {
      tomato: "🍅",
      onion: "🧅",
      potato: "🥔",
      wheat: "🌾",
      soybean: "🫘",
      cotton: "🌿",
      maize: "🌽",
      corn: "🌽",
      rice: "🍚",
      apple: "🍎",
      banana: "🍌",
      grape: "🍇",
      orange: "🍊",
      mango: "🥭",
      cabbage: "🥬",
      cauliflower: "🥦",
    };

    return (
      icons[
        String(commodity || "")
          .toLowerCase()
          .trim()
      ] || "🌾"
    );
  };

  // ============================================================
  // TREND CLASS
  // ============================================================

  const getTrendClass = (trend) => {
    return String(trend || "Stable")
      .toLowerCase()
      .includes("rising")
      ? "rising"
      : "stable";
  };

  // ============================================================
  // FORMAT UPDATED TIME
  // ============================================================

  const formatUpdatedTime = (value) => {
    if (!value) {
      return "";
    }

    try {
      const date = new Date(
        value.replace(" ", "T")
      );

      if (Number.isNaN(date.getTime())) {
        return value;
      }

      return date.toLocaleString(
        i18n.language === "hi"
          ? "hi-IN"
          : i18n.language === "mr"
          ? "mr-IN"
          : "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return value;
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="market-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="market-hero">

        <span className="market-label">
          {t("marketPrices.intelligence")}
        </span>

        <h1>
          {t("marketPrices.title")}
        </h1>

        <p>
          {t("marketPrices.description")}
        </p>


        {/* =================================================
            MARKET DATA SOURCE STATUS
        ================================================= */}

        {!loading && !error && (
          <div
            className={`market-status ${
              isDemoData
                ? "demo-status"
                : "government-status"
            }`}
          >

            <span className="status-dot"></span>

            {isDemoData ? (
              <>
                {t("marketPrices.demoData")}
              </>
            ) : (
              <>
                {t("marketPrices.governmentData")}
              </>
            )}

          </div>
        )}


        {/* =================================================
            UPDATED INFORMATION
        ================================================= */}

        {!loading &&
          !error &&
          lastUpdated && (
            <div className="market-updated">

              {t("marketPrices.lastUpdated")}:{" "}
              {formatUpdatedTime(
                lastUpdated
              )}

            </div>
          )}


        {/* =================================================
            DEMO DATA EXPLANATION
        ================================================= */}

        {!loading &&
          !error &&
          isDemoData && (
            <div className="market-demo-note">

              {t("marketPrices.demoExplanation")}

            </div>
          )}

      </section>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="market-loading">

          <div className="market-spinner"></div>

          <h2>
            {t("marketPrices.loading")}
          </h2>

          <p>
            {t("marketPrices.loadingDescription")}
          </p>

        </div>
      )}


      {/* =====================================================
          ERROR
      ===================================================== */}

      {!loading && error && (
        <div className="market-error">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            {t("marketPrices.unavailable")}
          </h2>

          <p>
            {error}
          </p>

          <button
            className="retry-button"
            onClick={fetchMarketPrices}
            type="button"
          >
            {t("marketPrices.tryAgain")}
          </button>

        </div>
      )}


      {/* =====================================================
          MARKET CARDS
      ===================================================== */}

      {!loading &&
        !error &&
        marketData.length > 0 && (

          <section className="market-grid">

            {marketData.map((item, index) => {

              const commodity =
                item.commodity ||
                "Unknown Crop";

              const icon =
                item.icon ||
                getCropIcon(
                  commodity
                );

              const trend =
                item.trend ||
                "Stable";

              return (
                <article
                  className="market-card"
                  key={`${commodity}-${item.market}-${index}`}
                >

                  {/* =========================================
                      CARD HEADER
                  ========================================= */}

                  <div className="market-card-top">

                    <div className="crop-title">

                      <span className="crop-emoji">
                        {icon}
                      </span>

                      <h2>
                        {commodity}
                      </h2>

                    </div>

                    <span
                      className={`trend-badge ${getTrendClass(
                        trend
                      )}`}
                    >
                      {trend}
                    </span>

                  </div>


                  {/* =========================================
                      LOCATION
                  ========================================= */}

                  <p className="market-location">

                    📍{" "}

                    {item.market ||
                      t("marketPrices.marketUnavailable")}

                    {item.district
                      ? `, ${item.district}`
                      : ""}

                  </p>


                  {/* =========================================
                      MODAL PRICE
                  ========================================= */}

                  <div className="modal-price-box">

                    <span>
                      {t("marketPrices.modalPrice")}
                    </span>

                    <strong>
                      {formatPrice(
                        item.modalPrice
                      )}
                    </strong>

                  </div>


                  {/* =========================================
                      MIN / MAX
                  ========================================= */}

                  <div className="price-range">

                    <div className="range-box">

                      <span>
                        {t("marketPrices.minimum")}
                      </span>

                      <strong>
                        {formatPrice(
                          item.minPrice
                        )}
                      </strong>

                    </div>


                    <div className="range-box">

                      <span>
                        {t("marketPrices.maximum")}
                      </span>

                      <strong>
                        {formatPrice(
                          item.maxPrice
                        )}
                      </strong>

                    </div>

                  </div>


                  {/* =========================================
                      FOOTER
                  ========================================= */}

                  <div className="market-card-footer">

                    <span>

                      {item.variety
                        ? `${item.variety}`
                        : t("marketPrices.localVariety")}

                      {item.grade
                        ? ` • ${t("marketPrices.grade")} ${item.grade}`
                        : ""}

                    </span>


                    {/* =====================================
                        LISTEN BUTTON
                    ===================================== */}

                    <button
                      type="button"
                      onClick={() => {

                        const message =
                          t(
                            "marketPrices.speechMessage",
                            {
                              commodity,
                              market:
                                item.market ||
                                t(
                                  "marketPrices.theMarket"
                                ),
                              price:
                                formatPrice(
                                  item.modalPrice
                                ),
                            }
                          );

                        if (
                          "speechSynthesis" in
                          window
                        ) {

                          window.speechSynthesis.cancel();

                          const speech =
                            new SpeechSynthesisUtterance(
                              message
                            );

                          speech.lang =
                            i18n.language === "hi"
                              ? "hi-IN"
                              : i18n.language === "mr"
                              ? "mr-IN"
                              : "en-IN";

                          speech.rate =
                            0.95;

                          window.speechSynthesis.speak(
                            speech
                          );
                        }

                      }}
                    >
                      🔊 {t("marketPrices.listen")}
                    </button>

                  </div>

                </article>
              );
            })}

          </section>
        )}


      {/* =====================================================
          NO DATA
      ===================================================== */}

      {!loading &&
        !error &&
        marketData.length === 0 && (

          <div className="market-error">

            <div className="error-icon">
              🌾
            </div>

            <h2>
              {t("marketPrices.noData")}
            </h2>

            <p>
              {t("marketPrices.noDataDescription")}
            </p>

            <button
              className="retry-button"
              onClick={fetchMarketPrices}
              type="button"
            >
              {t("marketPrices.refreshData")}
            </button>

          </div>
        )}


      {/* =====================================================
          INFORMATION BOX
      ===================================================== */}

      {!loading && !error && (
        <section className="market-info">

          <div className="info-icon">
            💡
          </div>

          <div>

            <h2>
              {t("marketPrices.informedSelling")}
            </h2>

            <p>
              {t("marketPrices.informedSellingDescription")}
            </p>

          </div>

        </section>
      )}


      {/* =====================================================
          VOICE ASSISTANT
      ===================================================== */}

      <VoiceAssistant />

    </main>
  );
}

export default MarketPrices;