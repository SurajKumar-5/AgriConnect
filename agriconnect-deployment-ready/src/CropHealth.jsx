import { useState } from "react";
import "./CropHealth.css";
import { useTranslation } from "react-i18next";

import API_URL from "./config";

function CropHealth() {
  const { t, i18n } = useTranslation();

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // FILE SELECTION
  // ============================================================

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(t("cropHealth.invalidImage"));
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setError("");

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  // ============================================================
  // AI CROP ANALYSIS
  // ============================================================

  const analyzeCrop = async () => {
    if (!selectedFile) {
      setError(t("cropHealth.uploadFirst"));
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        `${API_URL}/api/crop/analyze`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message ||
            t("cropHealth.analysisError")
        );
      }

      setResult(data);
    } catch (err) {
      console.error(
        "Crop analysis error:",
        err
      );

      setError(
        t("cropHealth.connectionError")
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // REMOVE IMAGE
  // ============================================================

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(null);
    setPreview("");
    setResult(null);
    setError("");
  };

  // ============================================================
  // CONFIDENCE DISPLAY
  // ============================================================

  const getConfidenceClass = () => {
    if (!result) {
      return "";
    }

    if (result.uncertain) {
      return "low";
    }

    if (result.confidence >= 80) {
      return "high";
    }

    if (result.confidence >= 60) {
      return "medium";
    }

    return "low";
  };

  const getConfidenceMessage = () => {
    if (!result) {
      return "";
    }

    if (result.uncertain) {
      return t("cropHealth.confidenceUncertain");
    }

    if (result.confidence >= 80) {
      return t("cropHealth.confidenceHigh");
    }

    if (result.confidence >= 60) {
      return t("cropHealth.confidenceModerate");
    }

    return t("cropHealth.confidenceLow");
  };

  return (
    <main className="crop-health-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="crop-health-hero">

        <span className="crop-health-label">
          {t("cropHealth.label")}
        </span>

        <h1>
          {t("cropHealth.title")}
        </h1>

        <p>
          {t("cropHealth.description")}
        </p>

      </section>


      {/* =====================================================
          UPLOAD SECTION
      ===================================================== */}

      <section className="crop-upload-section">

        {/* ===================================================
            UPLOAD CARD
        =================================================== */}

        <div className="crop-upload-card">

          <div className="upload-icon">
            🌱
          </div>

          <h2>
            {t("cropHealth.uploadTitle")}
          </h2>

          <p>
            {t("cropHealth.uploadDescription")}
          </p>

          {!preview && (
            <label className="upload-box">

              <div className="upload-box-icon">
                📷
              </div>

              <strong>
                {t("cropHealth.chooseImage")}
              </strong>

              <span>
                {t("cropHealth.fileTypes")}
              </span>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
              />

            </label>
          )}

          {/* =================================================
              IMAGE PREVIEW
          ================================================= */}

          {preview && (
            <div className="crop-preview">

              <img
                src={preview}
                alt={t("cropHealth.selectedCrop")}
              />

              <div className="preview-info">

                <strong>
                  {selectedFile?.name}
                </strong>

                <span>
                  {selectedFile
                    ? `${(
                        selectedFile.size / 1024
                      ).toFixed(1)} KB`
                    : ""}
                </span>

              </div>

              <button
                className="remove-image-button"
                onClick={removeImage}
                type="button"
              >
                {t("cropHealth.removeImage")}
              </button>

            </div>
          )}

          {/* =================================================
              ANALYZE BUTTON
          ================================================= */}

          {preview && (
            <button
              className="analyze-button"
              onClick={analyzeCrop}
              disabled={loading}
              type="button"
            >
              {loading
                ? t("cropHealth.analyzing")
                : t("cropHealth.analyze")}
            </button>
          )}

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="crop-loading">

              <div className="crop-spinner"></div>

              <strong>
                {t("cropHealth.aiAnalyzing")}
              </strong>

              <span>
                {t("cropHealth.modelProcessing")}
              </span>

            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="crop-error">

              <span>
                ⚠️
              </span>

              <p>
                {error}
              </p>

            </div>
          )}

        </div>


        {/* ===================================================
            INFORMATION CARD
        =================================================== */}

        <div className="crop-info-card">

          <div className="info-icon">
            🤖
          </div>

          <h2>
            {t("cropHealth.howItWorks")}
          </h2>

          <div className="analysis-steps">

            <div className="analysis-step">

              <span>
                1
              </span>

              <div>

                <strong>
                  {t("cropHealth.uploadStep")}
                </strong>

                <p>
                  {t("cropHealth.uploadStepDescription")}
                </p>

              </div>

            </div>

            <div className="analysis-step">

              <span>
                2
              </span>

              <div>

                <strong>
                  {t("cropHealth.aiAnalysisStep")}
                </strong>

                <p>
                  {t("cropHealth.aiAnalysisStepDescription")}
                </p>

              </div>

            </div>

            <div className="analysis-step">

              <span>
                3
              </span>

              <div>

                <strong>
                  {t("cropHealth.insightsStep")}
                </strong>

                <p>
                  {t("cropHealth.insightsStepDescription")}
                </p>

              </div>

            </div>

          </div>

          {/* MODEL INFORMATION */}

          <div
            style={{
              marginTop: "25px",
              padding: "15px",
              borderRadius: "10px",
              background: "#f3faf4",
            }}
          >

            <strong
              style={{
                display: "block",
                marginBottom: "5px",
              }}
            >
              🤖 {t("cropHealth.aiModel")}
            </strong>

            <span
              style={{
                fontSize: "14px",
                color: "#557060",
              }}
            >
              ResNet50 Plant Disease Model
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          ANALYSIS RESULT
      ===================================================== */}

      {result && (
        <section className="crop-result-section">

          <div className="result-heading">

            <span className="crop-health-label">
              {t("cropHealth.analysisComplete")}
            </span>

            <h2>
              {t("cropHealth.reportTitle")}
            </h2>

            <p>
              {t("cropHealth.reportDescription")}
            </p>

          </div>


          {/* =================================================
              MAIN RESULT CARDS
          ================================================= */}

          <div className="crop-result-grid">

            {/* CROP */}

            <div className="result-card">

              <span className="result-icon">
                🌾
              </span>

              <span className="result-label">
                {t("cropHealth.cropIdentified")}
              </span>

              <strong className="result-value">
                {result.crop || t("cropHealth.unknown")}
              </strong>

            </div>


            {/* HEALTH */}

            <div className="result-card health-result">

              <span className="result-icon">
                ❤️
              </span>

              <span className="result-label">
                {t("cropHealth.healthStatus")}
              </span>

              <strong className="result-value">
                {result.health || t("cropHealth.unknown")}
              </strong>

            </div>


            {/* CONFIDENCE */}

            <div className="result-card">

              <span className="result-icon">
                🎯
              </span>

              <span className="result-label">
                {t("cropHealth.confidence")}
              </span>

              <strong className="result-value">
                {result.confidence !== undefined
                  ? `${result.confidence}%`
                  : "—"}
              </strong>

            </div>

          </div>


          {/* =================================================
              CONFIDENCE INFORMATION
          ================================================= */}

          <div
            className={`confidence-summary ${getConfidenceClass()}`}
            style={{
              marginTop: "20px",
              padding: "18px",
              borderRadius: "12px",
              background: "#f7faf8",
              border: "1px solid #dce9df",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >

              <strong>
                {t("cropHealth.aiConfidence")}
              </strong>

              <strong>
                {result.confidence !== undefined
                  ? `${result.confidence}%`
                  : "—"}
              </strong>

            </div>

            {result.confidence !== undefined && (
              <div
                style={{
                  height: "8px",
                  width: "100%",
                  background: "#e3ebe5",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >

                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(
                      Math.max(
                        Number(result.confidence) || 0,
                        0
                      ),
                      100
                    )}%`,
                    background:
                      result.uncertain
                        ? "#d99a19"
                        : "#21863b",
                    borderRadius: "20px",
                    transition:
                      "width 0.5s ease",
                  }}
                />

              </div>
            )}

            <p
              style={{
                margin: "10px 0 0",
                fontSize: "14px",
              }}
            >
              {getConfidenceMessage()}
            </p>

          </div>


          {/* =================================================
              DISEASE / ISSUE
          ================================================= */}

          <div className="result-detail-card">

            <div className="detail-icon">
              🔬
            </div>

            <div>

              <span className="result-label">
                {t("cropHealth.diseaseIssue")}
              </span>

              <h3>
                {result.disease ||
                  t("cropHealth.noInformation")}
              </h3>

            </div>

          </div>


          {/* =================================================
              RECOMMENDATION
          ================================================= */}

          <div className="recommendation-card">

            <div className="recommendation-icon">
              💡
            </div>

            <div>

              <span className="result-label">
                {t("cropHealth.recommendation")}
              </span>

              <h3>
                {t("cropHealth.whatToDo")}
              </h3>

              <p>
                {result.recommendation ||
                  t("cropHealth.noRecommendation")}
              </p>

            </div>

          </div>


          {/* =================================================
              TOP AI PREDICTIONS
          ================================================= */}

          {Array.isArray(result.predictions) &&
            result.predictions.length > 0 && (

              <div
                className="result-detail-card"
                style={{
                  display: "block",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "18px",
                  }}
                >

                  <div className="detail-icon">
                    📊
                  </div>

                  <div>

                    <span className="result-label">
                      {t("cropHealth.predictionDetails")}
                    </span>

                    <h3>
                      {t("cropHealth.topPredictions")}
                    </h3>

                  </div>

                </div>

                <div>

                  {result.predictions.map(
                    (prediction, index) => (

                      <div
                        key={`${prediction.label}-${index}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding:
                            "10px 0",
                          borderBottom:
                            index <
                            result.predictions
                              .length -
                              1
                              ? "1px solid #e7eee9"
                              : "none",
                        }}
                      >

                        <span
                          style={{
                            width: "28px",
                            height: "28px",
                            minWidth: "28px",
                            borderRadius: "50%",
                            background:
                              index === 0
                                ? "#e4f4e7"
                                : "#f1f4f2",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            fontSize: "13px",
                            fontWeight: "700",
                          }}
                        >
                          {index + 1}
                        </span>

                        <div
                          style={{
                            flex: 1,
                          }}
                        >

                          <strong
                            style={{
                              display:
                                "block",
                              fontSize:
                                "14px",
                            }}
                          >
                            {prediction.label}
                          </strong>

                          <div
                            style={{
                              marginTop:
                                "6px",
                              height: "5px",
                              background:
                                "#e5ebe7",
                              borderRadius:
                                "10px",
                              overflow:
                                "hidden",
                            }}
                          >

                            <div
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    Number(
                                      prediction.confidence
                                    ) || 0,
                                    0
                                  ),
                                  100
                                )}%`,
                                height: "100%",
                                background:
                                  "#21863b",
                                borderRadius:
                                  "10px",
                              }}
                            />

                          </div>

                        </div>

                        <strong
                          style={{
                            minWidth:
                              "55px",
                            textAlign:
                              "right",
                            fontSize:
                              "14px",
                          }}
                        >
                          {prediction.confidence}%
                        </strong>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}


          {/* =================================================
              TECHNICAL INFORMATION
          ================================================= */}

          <div
            className="result-detail-card"
            style={{
              display: "block",
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "15px",
              }}
            >

              <div className="detail-icon">
                ⚙️
              </div>

              <div>

                <span className="result-label">
                  {t("cropHealth.technicalInformation")}
                </span>

                <h3>
                  {t("cropHealth.aiService")}
                </h3>

              </div>

            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
              }}
            >

              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#f7faf8",
                }}
              >

                <small>
                  {t("cropHealth.aiModel")}
                </small>

                <strong
                  style={{
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  {result.ai_model ||
                    "ResNet50 Plant Disease Model"}
                </strong>

              </div>

              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#f7faf8",
                }}
              >

                <small>
                  {t("cropHealth.predictionStatus")}
                </small>

                <strong
                  style={{
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  {result.prediction_status ||
                    t("cropHealth.analysisCompleteSimple")}
                </strong>

              </div>

              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#f7faf8",
                }}
              >

                <small>
                  {t("cropHealth.backend")}
                </small>

                <strong
                  style={{
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  {result.backend ||
                    t("cropHealth.connected")}
                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              BACKEND STATUS
          ================================================= */}

          <div className="backend-status">

            <span className="status-dot"></span>

            {t("cropHealth.serviceConnected")}

          </div>

        </section>
      )}


      {/* =====================================================
          BOTTOM INFORMATION
      ===================================================== */}

      <section className="crop-health-info">

        <div className="info-icon">
          🌱
        </div>

        <div>

          <h2>
            {t("cropHealth.betterDecisions")}
          </h2>

          <p>
            {t("cropHealth.betterDecisionsDescription")}
          </p>

        </div>

      </section>

    </main>
  );
}

export default CropHealth;