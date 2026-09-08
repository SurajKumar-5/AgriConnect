import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import API_URL from "./config";

function Login({ onClose, onLogin }) {
  const { t } = useTranslation();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Farmer");

  // Buyer account linking
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyerId, setSelectedBuyerId] =
    useState("");
  const [buyersLoading, setBuyersLoading] =
    useState(false);
  const [buyersError, setBuyersError] =
    useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ============================================================
  // RESET MESSAGES
  // ============================================================

  const resetMessages = () => {
    setError("");
    setMessage("");
    setBuyersError("");
  };

  // ============================================================
  // LOAD BUYERS WHEN BUYER ROLE IS SELECTED
  // ============================================================

  useEffect(() => {
    if (role !== "Buyer" || mode !== "register") {
      return;
    }

    fetchBuyers();
  }, [role, mode]);

  const fetchBuyers = async () => {
    try {
      setBuyersLoading(true);
      setBuyersError("");

      const response = await fetch(
        `${API_URL}/api/buyers`
      );

      if (!response.ok) {
        throw new Error(
          t("login.unableLoadBuyerBusinesses")
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            t("login.buyerServiceUnavailable")
        );
      }

      setBuyers(result.data || []);

    } catch (err) {
      console.error(
        "Buyer loading error:",
        err
      );

      setBuyersError(
        t("login.buyerBackendError")
      );

      setBuyers([]);

    } finally {
      setBuyersLoading(false);
    }
  };

  // ============================================================
  // CREATE ACCOUNT
  // ============================================================

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    resetMessages();

    // ----------------------------------------------------------
    // BASIC VALIDATION
    // ----------------------------------------------------------

    if (!name.trim()) {
      setError(t("login.enterName"));
      return;
    }

    if (!email.trim()) {
      setError(t("login.enterEmail"));
      return;
    }

    if (!password.trim()) {
      setError(t("login.createPassword"));
      return;
    }

    if (password.length < 6) {
      setError(t("login.passwordLength"));
      return;
    }

    // ----------------------------------------------------------
    // BUYER VALIDATION
    // ----------------------------------------------------------

    if (
      role === "Buyer" &&
      !selectedBuyerId
    ) {
      setError(
        t("login.selectBuyerBusiness")
      );
      return;
    }

    const accounts =
      JSON.parse(
        localStorage.getItem(
          "agriConnectAccounts"
        )
      ) || [];

    // ----------------------------------------------------------
    // DUPLICATE EMAIL CHECK
    // ----------------------------------------------------------

    const existingAccount =
      accounts.find(
        (account) =>
          account.email.toLowerCase() ===
          email.toLowerCase()
      );

    if (existingAccount) {
      setError(
        t("login.emailAlreadyExists")
      );
      return;
    }

    // ----------------------------------------------------------
    // FIND SELECTED BUYER
    // ----------------------------------------------------------

    let selectedBuyer = null;

    if (role === "Buyer") {
      selectedBuyer =
        buyers.find(
          (buyer) =>
            String(buyer.id) ===
            String(selectedBuyerId)
        );

      if (!selectedBuyer) {
        setError(
          t("login.buyerNotFound")
        );
        return;
      }
    }

    // ----------------------------------------------------------
    // CREATE ACCOUNT OBJECT
    // ----------------------------------------------------------

    const newAccount = {
      name: name.trim(),

      email:
        email.trim().toLowerCase(),

      password,

      role,

      // Buyer-specific information
      ...(role === "Buyer" && {
        buyerId: selectedBuyer.id,
        buyerName: selectedBuyer.name,
        buyerLocation:
          selectedBuyer.location,
      }),
    };

    accounts.push(newAccount);

    localStorage.setItem(
      "agriConnectAccounts",
      JSON.stringify(accounts)
    );

    // ----------------------------------------------------------
    // SUCCESS
    // ----------------------------------------------------------

    setMessage(
      t("login.accountCreated")
    );

    setMode("login");

    setName("");
    setPassword("");
    setSelectedBuyerId("");
  };

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = (e) => {
    e.preventDefault();

    resetMessages();

    if (
      !email.trim() ||
      !password.trim()
    ) {
      setError(
        t("login.enterEmailPassword")
      );
      return;
    }

    const accounts =
      JSON.parse(
        localStorage.getItem(
          "agriConnectAccounts"
        )
      ) || [];

    const account =
      accounts.find(
        (item) =>
          item.email.toLowerCase() ===
          email.toLowerCase()
      );

    if (!account) {
      setError(
        t("login.accountNotFound")
      );
      return;
    }

    if (
      account.password !== password
    ) {
      setError(
        t("login.incorrectPassword")
      );
      return;
    }

    // ----------------------------------------------------------
    // BUYER ACCOUNT VALIDATION
    // ----------------------------------------------------------

    if (
      account.role === "Buyer" &&
      !account.buyerId
    ) {
      setError(
        t("login.buyerNotLinked")
      );
      return;
    }

    // ----------------------------------------------------------
    // LOGGED-IN USER
    // ----------------------------------------------------------

    const loggedInUser = {
      name: account.name,

      email: account.email,

      role: account.role,

      ...(account.role === "Buyer" && {
        buyerId: account.buyerId,
        buyerName: account.buyerName,
        buyerLocation:
          account.buyerLocation,
      }),
    };

    localStorage.setItem(
      "agriConnectUser",
      JSON.stringify(loggedInUser)
    );

    if (onLogin) {
      onLogin(loggedInUser);
    }

    if (onClose) {
      onClose();
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="modal-overlay">

      <div className="login-modal">

        {/* CLOSE */}

        <button
          className="close-modal"
          onClick={onClose}
          type="button"
        >
          ×
        </button>


        {/* LOGO */}

        <div
          style={{
            textAlign: "center",
          }}
        >

          <div className="login-logo">
            🌱
          </div>

          <h2>
            AgriConnect
          </h2>

          <p className="login-subtitle">
            {t("login.tagline")}
          </p>

        </div>


        {/* ====================================================
            MODE SWITCH
            ==================================================== */}

        <div className="role-selector">

          <button
            type="button"
            className={
              mode === "login"
                ? "role active-role"
                : "role"
            }
            onClick={() => {
              setMode("login");
              resetMessages();
            }}
          >
            {t("login.login")}
          </button>


          <button
            type="button"
            className={
              mode === "register"
                ? "role active-role"
                : "role"
            }
            onClick={() => {
              setMode("register");
              resetMessages();
            }}
          >
            {t("login.createAccount")}
          </button>

        </div>


        {/* ====================================================
            LOGIN
            ==================================================== */}

        {mode === "login" && (

          <form
            onSubmit={handleLogin}
          >

            <label>
              {t("login.emailAddress")}
            </label>

            <input
              type="email"
              placeholder={t(
                "login.enterEmailPlaceholder"
              )}
              value={email}
              onChange={(e) => {
                setEmail(
                  e.target.value
                );
                resetMessages();
              }}
            />


            <label>
              {t("login.password")}
            </label>

            <input
              type="password"
              placeholder={t(
                "login.enterPasswordPlaceholder"
              )}
              value={password}
              onChange={(e) => {
                setPassword(
                  e.target.value
                );
                resetMessages();
              }}
            />


            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            {message && (
              <div
                style={{
                  background:
                    "#eaf7ec",
                  color:
                    "#176a30",
                  padding: "11px",
                  borderRadius: "8px",
                  marginBottom:
                    "15px",
                  fontSize: "14px",
                }}
              >
                {message}
              </div>
            )}


            <button
              type="submit"
              className="login-btn"
              style={{
                width: "100%",
                marginTop: "15px",
              }}
            >
              {t("login.loginToAgriConnect")} →
            </button>


            <p className="demo-login-note">

              {t("login.newToAgriConnect")}{" "}

              <button
                type="button"
                onClick={() => {
                  setMode(
                    "register"
                  );
                  resetMessages();
                }}
                style={{
                  border: "none",
                  background:
                    "transparent",
                  color:
                    "#207d3a",
                  fontWeight:
                    "700",
                  cursor:
                    "pointer",
                }}
              >
                {t("login.createAccount")}
              </button>

            </p>

          </form>
        )}


        {/* ====================================================
            CREATE ACCOUNT
            ==================================================== */}

        {mode === "register" && (

          <form
            onSubmit={
              handleCreateAccount
            }
          >

            <label>
              {t("login.fullName")}
            </label>

            <input
              type="text"
              placeholder={t(
                "login.enterNamePlaceholder"
              )}
              value={name}
              onChange={(e) => {
                setName(
                  e.target.value
                );
                resetMessages();
              }}
            />


            <label>
              {t("login.emailAddress")}
            </label>

            <input
              type="email"
              placeholder={t(
                "login.enterEmailPlaceholder"
              )}
              value={email}
              onChange={(e) => {
                setEmail(
                  e.target.value
                );
                resetMessages();
              }}
            />


            <label>
              {t("login.password")}
            </label>

            <input
              type="password"
              placeholder={t(
                "login.createPasswordPlaceholder"
              )}
              value={password}
              onChange={(e) => {
                setPassword(
                  e.target.value
                );
                resetMessages();
              }}
            />


            {/* ==================================================
                ACCOUNT TYPE
                ================================================== */}

            <label>
              {t("login.accountType")}
            </label>

            <div className="role-selector">

              <button
                type="button"
                className={
                  role === "Farmer"
                    ? "role active-role"
                    : "role"
                }
                onClick={() => {
                  setRole("Farmer");
                  setSelectedBuyerId("");
                  resetMessages();
                }}
              >
                🌾 {t("login.farmer")}
              </button>


              <button
                type="button"
                className={
                  role === "Buyer"
                    ? "role active-role"
                    : "role"
                }
                onClick={() => {
                  setRole("Buyer");
                  resetMessages();
                }}
              >
                🏢 {t("login.buyer")}
              </button>

            </div>


            {/* ==================================================
                BUYER BUSINESS SELECTION
                ================================================== */}

            {role === "Buyer" && (

              <>

                <label
                  style={{
                    marginTop:
                      "14px",
                  }}
                >
                  {t("login.buyerBusiness")}
                </label>


                {buyersLoading ? (

                  <div
                    style={{
                      padding:
                        "12px",
                      background:
                        "#f3f7f4",
                      borderRadius:
                        "8px",
                      marginBottom:
                        "12px",
                      color:
                        "#176a30",
                      fontSize:
                        "14px",
                    }}
                  >
                    {t("login.loadingBuyerBusinesses")}
                  </div>

                ) : buyers.length > 0 ? (

                  <select
                    value={
                      selectedBuyerId
                    }
                    onChange={(e) => {
                      setSelectedBuyerId(
                        e.target.value
                      );
                      resetMessages();
                    }}
                    style={{
                      width:
                        "100%",
                      padding:
                        "12px",
                      border:
                        "1px solid #d8e4dc",
                      borderRadius:
                        "8px",
                      marginBottom:
                        "12px",
                      fontSize:
                        "14px",
                      background:
                        "#ffffff",
                    }}
                  >

                    <option value="">
                      {t("login.selectBuyerBusiness")}
                    </option>

                    {buyers.map(
                      (buyer) => (

                        <option
                          key={buyer.id}
                          value={
                            buyer.id
                          }
                        >
                          {buyer.name} —{" "}
                          {buyer.location}
                        </option>

                      )
                    )}

                  </select>

                ) : (

                  <div
                    style={{
                      padding:
                        "12px",
                      background:
                        "#fff7ed",
                      color:
                        "#9a3412",
                      borderRadius:
                        "8px",
                      marginBottom:
                        "12px",
                      fontSize:
                        "14px",
                    }}
                  >
                    {buyersError ||
                      t("login.noBuyerBusinesses")}
                  </div>

                )}

              </>
            )}


            {/* ==================================================
                ERRORS
                ================================================== */}

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            {buyersError &&
              role === "Buyer" && (
                <div
                  className="login-error"
                  style={{
                    marginTop:
                      "8px",
                  }}
                >
                  {buyersError}
                </div>
              )}


            {/* ==================================================
                CREATE BUTTON
                ================================================== */}

            <button
              type="submit"
              className="login-btn"
              style={{
                width: "100%",
                marginTop: "10px",
              }}
              disabled={
                role === "Buyer" &&
                (
                  buyersLoading ||
                  !selectedBuyerId
                )
              }
            >
              {t("login.createAgriConnectAccount")} →
            </button>


            <p className="demo-login-note">

              {t("login.alreadyHaveAccount")}{" "}

              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  resetMessages();
                }}
                style={{
                  border: "none",
                  background:
                    "transparent",
                  color:
                    "#207d3a",
                  fontWeight:
                    "700",
                  cursor:
                    "pointer",
                }}
              >
                {t("login.login")}
              </button>

            </p>

          </form>
        )}

      </div>

    </div>
  );
}

export default Login;