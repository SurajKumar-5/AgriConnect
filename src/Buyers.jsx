import React, { useEffect, useMemo, useState } from "react";
import "./Buyers.css";
import { useTranslation } from "react-i18next";

import API_URL from "./config";

function Buyers({ user, onRequireLogin }) {
  const { t } = useTranslation();

  const [buyers, setBuyers] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] =
    useState("All Locations");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBuyer, setSelectedBuyer] =
    useState(null);

  const [contactRequests, setContactRequests] =
    useState([]);

  const [requestSent, setRequestSent] =
    useState(false);

  const [requestLoading, setRequestLoading] =
    useState(false);

  const [requestError, setRequestError] =
    useState("");


  // ============================================================
  // LOAD BUYERS
  // ============================================================

  useEffect(() => {
    fetchBuyers();
  }, []);


  // ============================================================
  // LOAD FARMER CONTACT REQUESTS
  // ============================================================

  useEffect(() => {
    if (user?.email) {
      loadContactRequests();
    } else {
      setContactRequests([]);
    }
  }, [user]);


  // ============================================================
  // FETCH BUYERS
  // ============================================================

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/buyers`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load buyers"
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Buyer service unavailable"
        );
      }

      setBuyers(result.data || []);

    } catch (err) {
      console.error(
        "Buyer API Error:",
        err
      );

      setError(
        "Unable to connect to the buyer service."
      );

    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // LOAD CONTACT REQUESTS FROM BACKEND
  // ============================================================

  const loadContactRequests = async () => {
    if (!user?.email) {
      setContactRequests([]);
      return;
    }

    try {
      const encodedEmail =
        encodeURIComponent(user.email);

      const response = await fetch(
        `${API_URL}/api/contact-requests/farmer/${encodedEmail}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load contact requests"
        );
      }

      const result =
        await response.json();

      if (result.success) {
        setContactRequests(
          result.data || []
        );
      } else {
        throw new Error(
          result.message ||
            "Unable to load requests"
        );
      }

    } catch (err) {
      console.error(
        "Contact request loading error:",
        err
      );

      setContactRequests([]);
    }
  };


  // ============================================================
  // LOCATION OPTIONS
  // ============================================================

  const locations = useMemo(() => {
    const uniqueLocations = [
      ...new Set(
        buyers.map(
          (buyer) => buyer.location
        )
      ),
    ];

    return uniqueLocations;
  }, [buyers]);


  // ============================================================
  // SEARCH + FILTER
  // ============================================================

  const filteredBuyers = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    return buyers.filter((buyer) => {

      const matchesSearch =
        buyer.name
          ?.toLowerCase()
          .includes(searchText) ||

        buyer.crop
          ?.toLowerCase()
          .includes(searchText) ||

        buyer.location
          ?.toLowerCase()
          .includes(searchText);

      const matchesLocation =
        locationFilter ===
          "All Locations" ||
        buyer.location ===
          locationFilter;

      return (
        matchesSearch &&
        matchesLocation
      );
    });

  }, [
    buyers,
    search,
    locationFilter,
  ]);


  // ============================================================
  // CONTACT BUYER
  // ============================================================

  const handleContactBuyer = (
    buyer
  ) => {

    if (!user) {

      if (onRequireLogin) {
        onRequireLogin();
      } else {
        alert(
          t("loginToContactBuyers")
        );
      }

      return;
    }

    setRequestError("");
    setRequestSent(false);
    setSelectedBuyer(buyer);
  };


  // ============================================================
  // SEND CONTACT REQUEST TO FASTAPI
  // ============================================================

  const handleSendRequest = async () => {

    if (
      !user ||
      !selectedBuyer ||
      requestLoading
    ) {
      return;
    }

    try {

      setRequestLoading(true);
      setRequestError("");

      const requestData = {

        farmerName:
          user.name || "Farmer",

        farmerEmail:
          user.email,

        buyerId:
          selectedBuyer.id,

        buyerName:
          selectedBuyer.name,

        buyerLocation:
          selectedBuyer.location,

        crop:
          selectedBuyer.crop,

        quantity:
          selectedBuyer.quantity,

        offeredPrice:
          selectedBuyer.price
      };


      const response = await fetch(
        `${API_URL}/api/contact-requests`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(
              requestData
            )
        }
      );


      const result =
        await response.json();


      // --------------------------------------------------------
      // DUPLICATE PENDING REQUEST
      // --------------------------------------------------------

      if (
        !response.ok ||
        !result.success
      ) {

        if (
          result.request &&
          result.message?.includes(
            "already have a pending"
          )
        ) {

          setRequestError(
            t("pendingRequestExists")
          );

          return;
        }

        throw new Error(
          result.message ||
            result.detail ||
            "Unable to send contact request."
        );
      }


      // --------------------------------------------------------
      // SUCCESS
      // --------------------------------------------------------

      const newRequest =
        result.request;

      setContactRequests(
        (previous) => {

          const exists =
            previous.some(
              (request) =>
                request.id ===
                newRequest.id
            );

          if (exists) {
            return previous;
          }

          return [
            ...previous,
            newRequest
          ];
        }
      );

      setRequestSent(true);

    } catch (err) {

      console.error(
        "Contact request error:",
        err
      );

      setRequestError(
        err.message ||
          t("sendRequestError")
      );

    } finally {

      setRequestLoading(false);
    }
  };


  // ============================================================
  // VIEW MY REQUESTS
  // ============================================================

  const handleViewMyRequests = () => {

    setSelectedBuyer(null);
    setRequestSent(false);
    setRequestError("");

    setTimeout(() => {

      document
        .getElementById(
          "my-contact-requests"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

    }, 150);
  };


  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeContactModal = () => {

    setSelectedBuyer(null);
    setRequestSent(false);
    setRequestError("");
  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (
      <main className="buyers-page">

        <section className="buyers-header">

          <div className="section-label">
            {t("buyerNetwork")}
          </div>

          <h1>
            {t("findBuyers")}
          </h1>

          <p>
            {t("buyerDescription")}
          </p>

        </section>

        <div className="no-buyers">

          <div>⏳</div>

          <h3>
            {t("loadingBuyers")}
          </h3>

          <p>
            {t("connectingBuyerNetwork")}
          </p>

        </div>

      </main>
    );
  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error) {

    return (
      <main className="buyers-page">

        <section className="buyers-header">

          <div className="section-label">
            {t("buyerNetwork")}
          </div>

          <h1>
            {t("findBuyers")}
          </h1>

          <p>
            {t("buyerDescription")}
          </p>

        </section>

        <div className="no-buyers">

          <div>⚠️</div>

          <h3>
            {t("buyerServiceUnavailable")}
          </h3>

          <p>
            {t("backendPortMessage")}
          </p>

          <button
            className="contact-btn"
            onClick={fetchBuyers}
          >
            {t("tryAgain")}
          </button>

        </div>

      </main>
    );
  }


  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (
    <main className="buyers-page">


      {/* ======================================================
          HEADER
          ====================================================== */}

      <section className="buyers-header">

        <div className="section-label">
          {t("buyerNetwork")}
        </div>

        <h1>
          {t("findBuyers")}
        </h1>

        <p>
          {t("buyerDescription")}
        </p>

      </section>


      {/* ======================================================
          SEARCH + FILTER
          ====================================================== */}

      <section className="buyer-filters">

        <div className="search-box">

          <span>
            🔎
          </span>

          <input
            type="text"
            placeholder={t("searchCropBuyer")}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <select
          value={locationFilter}
          onChange={(e) =>
            setLocationFilter(
              e.target.value
            )
          }
        >

          <option value="All Locations">
            {t("allLocations")}
          </option>

          {locations.map(
            (location) => (

              <option
                key={location}
                value={location}
              >
                {location}
              </option>

            )
          )}

        </select>

      </section>


      {/* ======================================================
          RESULTS HEADER
          ====================================================== */}

      <section className="buyers-results-header">

        <h2>
          {t("availableBuyers")}
        </h2>

        <span>

          {filteredBuyers.length}{" "}

          {filteredBuyers.length === 1
            ? t("buyer")
            : t("buyers")}{" "}

          {t("found")}

        </span>

      </section>


      {/* ======================================================
          BUYER CARDS
          ====================================================== */}

      {filteredBuyers.length > 0 ? (

        <section className="buyer-grid">

          {filteredBuyers.map(
            (buyer) => (

              <article
                className="buyer-card"
                key={buyer.id}
              >

                <div className="buyer-top">

                  <div className="buyer-avatar">
                    {buyer.icon || "🤝"}
                  </div>

                  <div>

                    <h3>
                      {buyer.name}
                    </h3>

                    <div className="verified">
                      ✓ {t("verifiedBuyer")}
                    </div>

                  </div>

                </div>


                <div className="buyer-location">
                  📍 {buyer.location}
                </div>


                <div className="buyer-demand">

                  <div>

                    <span>
                      {t("lookingFor")}
                    </span>

                    <strong>
                      {buyer.crop}
                    </strong>

                  </div>


                  <div>

                    <span>
                      {t("quantity")}
                    </span>

                    <strong>
                      {buyer.quantity}
                    </strong>

                  </div>

                </div>


                <div className="buyer-price">

                  <span>
                    {t("offeredPrice")}
                  </span>

                  <strong>
                    {buyer.price}
                  </strong>

                </div>


                <button
                  className="contact-btn"
                  onClick={() =>
                    handleContactBuyer(
                      buyer
                    )
                  }
                >
                  {t("contactBuyer")} →
                </button>

              </article>

            )
          )}

        </section>

      ) : (

        <div className="no-buyers">

          <div>
            🔍
          </div>

          <h3>
            {t("noBuyersFound")}
          </h3>

          <p>
            {t("changeSearchLocation")}
          </p>

        </div>

      )}


      {/* ======================================================
          MY CONTACT REQUESTS
          ====================================================== */}

      {user &&
        contactRequests.length > 0 && (

        <section
          id="my-contact-requests"
          className="my-requests-section"
        >

          <div className="my-requests-header">

            <div>

              <div className="section-label">
                {t("farmerActivity")}
              </div>

              <h2>
                {t("myContactRequests")}
              </h2>

            </div>

            <span>

              {contactRequests.length}{" "}

              {contactRequests.length === 1
                ? t("request")
                : t("requests")}

            </span>

          </div>


          <div className="requests-list">

            {contactRequests
              .slice()
              .reverse()
              .map(
                (request) => (

                  <div
                    className="request-card"
                    key={request.id}
                  >

                    <div className="request-main">

                      <div className="request-icon">
                        🤝
                      </div>

                      <div>

                        <h3>
                          {request.buyerName}
                        </h3>

                        <p>
                          {request.crop}
                          {" • "}
                          {request.quantity}
                        </p>

                        <small>
                          {t("requestId")}:{" "}
                          {request.id}
                        </small>

                      </div>

                    </div>


                    <div className="request-right">

                      <strong>
                        {request.offeredPrice}
                      </strong>

                      <span
                        className="request-status"
                      >
                        ●{" "}
                        {request.status}
                      </span>

                    </div>

                  </div>

                )
              )}

          </div>

        </section>

      )}


      {/* ======================================================
          CONTACT BUYER MODAL
          ====================================================== */}

      {selectedBuyer && (

        <div
          className="modal-overlay"
          onClick={
            closeContactModal
          }
        >

          <div
            className="contact-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="close-modal"
              onClick={
                closeContactModal
              }
              type="button"
            >
              ×
            </button>


            {!requestSent ? (

              <>

                <div className="modal-icon">
                  {selectedBuyer.icon ||
                    "🤝"}
                </div>


                <div className="section-label">
                  {t("contactBuyerLabel")}
                </div>


                <h2>
                  {selectedBuyer.name}
                </h2>


                <p>
                  {t("interestedInSelling")}{" "}

                  <strong>
                    {selectedBuyer.crop}
                  </strong>

                  ?
                </p>


                <div className="contact-details">

                  <div>

                    <span>
                      📍 {t("location")}
                    </span>

                    <strong>
                      {selectedBuyer.location}
                    </strong>

                  </div>


                  <div>

                    <span>
                      📦 {t("requiredQuantity")}
                    </span>

                    <strong>
                      {selectedBuyer.quantity}
                    </strong>

                  </div>


                  <div>

                    <span>
                      💰 {t("offeredPrice")}
                    </span>

                    <strong>
                      {selectedBuyer.price}
                    </strong>

                  </div>

                </div>


                {/* BACKEND ERROR */}

                {requestError && (

                  <div
                    style={{
                      marginTop: "16px",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      background:
                        "#fff1f2",
                      color:
                        "#b91c1c",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >
                    {requestError}
                  </div>

                )}


                <button
                  className="modal-contact-btn"
                  onClick={
                    handleSendRequest
                  }
                  type="button"
                  disabled={
                    requestLoading
                  }
                >

                  {requestLoading
                    ? t("sendingRequest")
                    : t("sendContactRequest")} →

                </button>

              </>

            ) : (

              <div className="request-success">

                <div className="success-icon">
                  ✓
                </div>


                <div className="section-label">
                  {t("requestSent")}
                </div>


                <h2>
                  {t("contactRequestSent")}
                </h2>


                <p>
                  {t("requestSentTo")}{" "}

                  <strong>
                    {selectedBuyer.name}
                  </strong>
                  .
                </p>


                <div className="success-details">

                  <div>

                    <span>
                      {t("crop")}
                    </span>

                    <strong>
                      {selectedBuyer.crop}
                    </strong>

                  </div>


                  <div>

                    <span>
                      {t("status")}
                    </span>

                    <strong>
                      {t("pending")}
                    </strong>

                  </div>

                </div>


                <button
                  className="modal-contact-btn"
                  onClick={
                    handleViewMyRequests
                  }
                  type="button"
                >
                  {t("viewMyRequests")} →
                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </main>
  );
}

export default Buyers;