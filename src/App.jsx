import React, { useEffect, useState } from "react";

import "./App.css";

import MarketPrices from "./MarketPrices";
import CropHealth from "./CropHealth";
import Login from "./Login";
import Buyers from "./Buyers";
import BuyerDashboard from "./BuyerDashboard";
import FarmerDashboard from "./FarmerDashboard";
import Deals from "./Deals";
import VoiceAssistant from "./VoiceAssistant";

import { useTranslation } from "react-i18next";

import API_URL from "./config";

function App() {
  const { t, i18n } = useTranslation();

  // ============================================================
  // USER
  // ============================================================

  const savedUser = localStorage.getItem("agriConnectUser");

  const [user, setUser] = useState(
    savedUser ? JSON.parse(savedUser) : null
  );

  // ============================================================
  // PAGE
  // ============================================================

  const savedPage =
    localStorage.getItem("agriConnectActivePage");

  const [activePage, setActivePage] = useState(
    savedPage || "Home"
  );

  // ============================================================
  // LOGIN MODAL
  // ============================================================

  const [showLogin, setShowLogin] = useState(false);

  // ============================================================
  // MARKET DATA
  // ============================================================

  const [marketPrices, setMarketPrices] = useState([]);
  const [marketLoading, setMarketLoading] = useState(true);

  // ============================================================
  // NAVBAR LABELS
  // ============================================================

  const buyersNavLabel =
    i18n.language === "en"
      ? "Buyers"
      : t("buyers");

  const farmerDashboardNavLabel =
    i18n.language === "hi"
      ? "किसान डैशबोर्ड"
      : i18n.language === "mr"
      ? "शेतकरी डॅशबोर्ड"
      : "Farmer Dashboard";

  // ============================================================
  // LOAD MARKET PRICES
  // ============================================================

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  const fetchMarketPrices = async () => {
    try {
      setMarketLoading(true);

      const response = await fetch(
        `${API_URL}/api/market-prices`
      );

      if (!response.ok) {
        throw new Error("Unable to load market prices");
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setMarketPrices(result.data);
      } else {
        setMarketPrices([]);
      }
    } catch (error) {
      console.error("Market price error:", error);
      setMarketPrices([]);
    } finally {
      setMarketLoading(false);
    }
  };

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);

    localStorage.setItem(
      "agriConnectUser",
      JSON.stringify(loggedInUser)
    );

    setShowLogin(false);

    if (loggedInUser.role === "Buyer") {
      setActivePage("Buyer Dashboard");

      localStorage.setItem(
        "agriConnectActivePage",
        "Buyer Dashboard"
      );
    } else {
      setActivePage("Home");

      localStorage.setItem(
        "agriConnectActivePage",
        "Home"
      );
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("agriConnectUser");

    setUser(null);

    setActivePage("Home");

    localStorage.setItem(
      "agriConnectActivePage",
      "Home"
    );
  };

  // ============================================================
  // LANGUAGE
  // ============================================================

  const changeLanguage = async (language) => {
    try {
      await i18n.changeLanguage(language);
    } catch (error) {
      console.error("Language change error:", error);
    }
  };

  // ============================================================
  // NAVIGATION
  // ============================================================

  const goTo = (page) => {
    setActivePage(page);

    localStorage.setItem(
      "agriConnectActivePage",
      page
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // HOME MARKET PREVIEW
  // ============================================================

  const getPreviewPrice = (commodity) => {
    const item = marketPrices.find(
      (price) =>
        price.commodity?.toLowerCase() ===
        commodity.toLowerCase()
    );

    if (!item) {
      return "—";
    }

    const modal = Number(item.modalPrice);

    if (Number.isFinite(modal)) {
      return `₹${Math.round(modal / 100)}/kg`;
    }

    return "—";
  };

  // ============================================================
  // HOME PAGE
  // ============================================================

  const renderHome = () => {
    return (
      <main>
        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              🌾 {t("smartAgriculture")}
            </div>

            <h1>
              {t("heroTitle1")}
              <br />
              {t("heroTitle2")}
            </h1>

            <p>
              {t("heroDescription")}
            </p>

            <div className="hero-buttons">
              <button
                className="primary-button"
                onClick={() =>
                  goTo("Market Prices")
                }
              >
                {t("explorePrices")} →
              </button>

              <button
                className="secondary-button"
                onClick={() => {
                  if (user?.role === "Buyer") {
                    goTo("Deals");
                  } else {
                    goTo("Buyers");
                  }
                }}
              >
                {t("findBuyers")}
              </button>
            </div>
          </div>
        </section>

        {/* ====================================================
            MARKET PREVIEW
        ==================================================== */}

        <section className="market-preview-section">
          <div className="section-top">
            <div>
              <div className="live-label">
                <span>●</span>
                {t("liveMarket")}
              </div>

              <h2>
                {t("todaysMarket")}
              </h2>

              <p>
                {t("currentPrices")}
              </p>
            </div>
          </div>

          <div className="market-preview-grid">
            <div className="market-preview-card">
              <div className="market-preview-icon">
                🌾
              </div>

              <span>Tomato</span>

              <strong>
                {marketLoading
                  ? "Loading..."
                  : getPreviewPrice("Tomato")}
              </strong>
            </div>

            <div className="market-preview-card">
              <div className="market-preview-icon">
                🌾
              </div>

              <span>Onion</span>

              <strong>
                {marketLoading
                  ? "Loading..."
                  : getPreviewPrice("Onion")}
              </strong>
            </div>

            <div className="market-preview-card">
              <div className="market-preview-icon">
                🌾
              </div>

              <span>Potato</span>

              <strong>
                {marketLoading
                  ? "Loading..."
                  : getPreviewPrice("Potato")}
              </strong>
            </div>
          </div>

          <div className="market-updated">
            ✓ {t("pricesUpdated")}
          </div>
        </section>

        {/* ====================================================
            TODAY'S MARKET
        ==================================================== */}

        <section className="home-market-section">
          <div className="home-section-heading">
            <div>
              <div className="section-label">
                {t("todaysMarket")}
              </div>

              <h2>
                {t("liveAgriculturalPrices")}
              </h2>

              <p>
                {t("marketDescription")}
              </p>
            </div>
          </div>

          <div className="home-price-grid">
            <div className="home-price-card">
              <span>🌾</span>

              <strong>Tomato</strong>

              <b>
                {marketLoading
                  ? "Loading..."
                  : getPreviewPrice("Tomato")}
              </b>
            </div>

            <div className="home-price-card">
              <span>🌾</span>

              <strong>Onion</strong>

              <b>
                {marketLoading
                  ? "Loading..."
                  : getPreviewPrice("Onion")}
              </b>
            </div>

            <div className="home-price-card">
              <span>🌾</span>

              <strong>Potato</strong>

              <b>
                {marketLoading
                  ? "Loading..."
                  : getPreviewPrice("Potato")}
              </b>
            </div>
          </div>

          <button
            className="text-link-button"
            onClick={() =>
              goTo("Market Prices")
            }
          >
            {t("viewAllPrices")} →
          </button>
        </section>

        {/* ====================================================
            FEATURES
        ==================================================== */}

        <section className="features-section">
          <div className="features-heading">
            <div className="section-label">
              {t("whatWeOffer")}
            </div>

            <h2>
              {t("everythingFarmersNeed")}
            </h2>
          </div>

          <div className="features-grid">

            {/* MARKET */}

            <div className="feature-card">
              <div className="feature-icon">
                📊
              </div>

              <h3>
                {t("liveMarketPrices")}
              </h3>

              <p>
                {t("marketFeature")}
              </p>

              <button
                onClick={() =>
                  goTo("Market Prices")
                }
              >
                {t("viewPrices")} →
              </button>
            </div>

            {/* BUYERS */}

            <div className="feature-card">
              <div className="feature-icon">
                🤝
              </div>

              <h3>
                {t("verifiedBuyers")}
              </h3>

              <p>
                {t("buyersFeature")}
              </p>

              <button
                onClick={() =>
                  goTo("Buyers")
                }
              >
                {t("findBuyers")} →
              </button>
            </div>

            {/* CROP */}

            <div className="feature-card">
              <div className="feature-icon">
                🌱
              </div>

              <h3>
                {t("aiCropHealth")}
              </h3>

              <p>
                {t("cropFeature")}
              </p>

              <button
                onClick={() =>
                  goTo("Crop Health")
                }
              >
                {t("checkCrop")} →
              </button>
            </div>

          </div>
        </section>
      </main>
    );
  };

  // ============================================================
  // NAVBAR
  // ============================================================

  return (
    <div className="app">
      <header className="navbar">

        {/* ==================================================
            LOGO
        ================================================== */}

        <div
          className="navbar-logo"
          onClick={() =>
            goTo("Home")
          }
        >
          <div className="logo-icon">
            🌱
          </div>

          <div>
            <div className="logo-name">
              AgriConnect
            </div>

            <div className="logo-tagline">
              {t("tagline")}
            </div>
          </div>
        </div>

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <nav className="navbar-links">

          {/* HOME */}

          <button
            className={
              activePage === "Home"
                ? "active"
                : ""
            }
            onClick={() =>
              goTo("Home")
            }
          >
            {t("home")}
          </button>

          {/* MARKET PRICES */}

          <button
            className={
              activePage === "Market Prices"
                ? "active"
                : ""
            }
            onClick={() =>
              goTo("Market Prices")
            }
          >
            {t("marketPrices.title")}
          </button>

          {/* BUYERS */}

          {user?.role !== "Buyer" && (
            <button
              className={
                activePage === "Buyers"
                  ? "active"
                  : ""
              }
              onClick={() =>
                goTo("Buyers")
              }
            >
              {buyersNavLabel}
            </button>
          )}

          {/* CROP HEALTH */}

          <button
            className={
              activePage === "Crop Health"
                ? "active"
                : ""
            }
            onClick={() =>
              goTo("Crop Health")
            }
          >
            {t("cropHealth.title")}
          </button>

          {/* FARMER DASHBOARD */}

          {user?.role !== "Buyer" && user && (
            <button
              className={
                activePage ===
                "Farmer Dashboard"
                  ? "active"
                  : ""
              }
              onClick={() =>
                goTo("Farmer Dashboard")
              }
            >
              {farmerDashboardNavLabel}
            </button>
          )}

          {/* BUYER DASHBOARD */}

          {user?.role === "Buyer" && (
            <button
              className={
                activePage ===
                "Buyer Dashboard"
                  ? "active"
                  : ""
              }
              onClick={() =>
                goTo("Buyer Dashboard")
              }
            >
              {t("buyerDashboard.title")}
            </button>
          )}

          {/* DEALS */}

          {user && (
            <button
              className={
                activePage === "Deals"
                  ? "active"
                  : ""
              }
              onClick={() =>
                goTo("Deals")
              }
            >
              {t("deals.title")}
            </button>
          )}

        </nav>

        {/* ==================================================
            LANGUAGE
        ================================================== */}

        <div className="language-selector">

          <button
            type="button"
            onClick={() =>
              changeLanguage("en")
            }
          >
            English
          </button>

          <button
            type="button"
            onClick={() =>
              changeLanguage("hi")
            }
          >
            हिन्दी
          </button>

          <button
            type="button"
            onClick={() =>
              changeLanguage("mr")
            }
          >
            मराठी
          </button>

        </div>

        {/* ==================================================
            USER
        ================================================== */}

        {user ? (
          <div className="user-section">

            <div className="user-avatar">
              {user.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div className="user-info">

              <strong>
                {user.name}
              </strong>

              <span>
                {user.role}
              </span>

            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              {t("logout")}
            </button>

          </div>
        ) : (
          <button
            className="login-button"
            onClick={() =>
              setShowLogin(true)
            }
          >
            {t("login.login")}
          </button>
        )}

      </header>

      {/* ======================================================
          PAGE CONTENT
      ====================================================== */}

      {activePage === "Home" &&
        renderHome()}

      {activePage === "Market Prices" && (
        <MarketPrices user={user} />
      )}

      {activePage === "Buyers" && (
        <Buyers
          user={user}
          onLoginRequired={() =>
            setShowLogin(true)
          }
        />
      )}

      {activePage === "Crop Health" && (
        <CropHealth user={user} />
      )}

      {/* ======================================================
          FARMER DASHBOARD
      ====================================================== */}

      {activePage ===
        "Farmer Dashboard" && (
        user &&
        user.role !== "Buyer" ? (
          <FarmerDashboard
            user={user}
            navigate={goTo}
          />
        ) : (
          <div className="page-access-message">

            <h2>
              {t(
                "farmerDashboard.loginRequired"
              )}
            </h2>

            <p>
              {t(
                "farmerDashboard.loginRequiredDescription"
              )}
            </p>

            <button
              onClick={() =>
                setShowLogin(true)
              }
            >
              {t("login.login")}
            </button>

          </div>
        )
      )}

      {/* ======================================================
          BUYER DASHBOARD
      ====================================================== */}

      {activePage ===
        "Buyer Dashboard" && (
        user?.role === "Buyer" ? (
          <BuyerDashboard
            user={user}
          />
        ) : (
          <div className="page-access-message">

            <h2>
              {t(
                "buyerDashboard.notLinked"
              )}
            </h2>

            <p>
              {t(
                "buyerDashboard.unableDashboard"
              )}
            </p>

            <button
              onClick={() =>
                setShowLogin(true)
              }
            >
              {t("login.login")}
            </button>

          </div>
        )
      )}

      {/* ======================================================
          DEALS
      ====================================================== */}

      {activePage === "Deals" && (
        user ? (
          <Deals
            user={user}
          />
        ) : (
          <div className="page-access-message">

            <h2>
              {t(
                "deals.loginRequired"
              )}
            </h2>

            <p>
              {t(
                "deals.loginToView"
              )}
            </p>

            <button
              onClick={() =>
                setShowLogin(true)
              }
            >
              {t("login.login")}
            </button>

          </div>
        )
      )}

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">

        <div className="footer-brand">

          <div className="footer-logo">
            🌱 AgriConnect
          </div>

          <p>
            {t("tagline")}
          </p>

        </div>

        <div className="footer-links">

          <button
            onClick={() =>
              goTo("Home")
            }
          >
            {t("home")}
          </button>

          <button
            onClick={() =>
              goTo("Market Prices")
            }
          >
            {t("marketPrices.title")}
          </button>

          {user?.role !== "Buyer" && (
            <button
              onClick={() =>
                goTo("Buyers")
              }
            >
              {buyersNavLabel}
            </button>
          )}

          <button
            onClick={() =>
              goTo("Crop Health")
            }
          >
            {t("cropHealth.title")}
          </button>

          {user?.role !== "Buyer" && user && (
            <button
              onClick={() =>
                goTo("Farmer Dashboard")
              }
            >
              {farmerDashboardNavLabel}
            </button>
          )}

          {user?.role === "Buyer" && (
            <button
              onClick={() =>
                goTo("Buyer Dashboard")
              }
            >
              {t("buyerDashboard.title")}
            </button>
          )}

          {user && (
            <button
              onClick={() =>
                goTo("Deals")
              }
            >
              {t("deals.title")}
            </button>
          )}

        </div>

        <div className="footer-copy">
          © 2026 AgriConnect.
          SMART AGRICULTURE PLATFORM
        </div>

      </footer>

      {/* ======================================================
          LOGIN MODAL
      ====================================================== */}

      {showLogin && (
        <Login
          onLogin={handleLogin}
          onClose={() =>
            setShowLogin(false)
          }
        />
      )}

      {/* ======================================================
          VOICE ASSISTANT
      ====================================================== */}

      <VoiceAssistant />

    </div>
  );
}

export default App;