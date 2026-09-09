import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useTranslation } from "react-i18next";
import "./VoiceAssistant.css";
import API_URL from "./config";

function VoiceAssistant() {
  const { t, i18n } = useTranslation();

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const [prices, setPrices] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const pricesRef = useRef([]);
  const processingRef = useRef(false);
  const answeredRef = useRef(false);
  const lastTranscriptRef = useRef("");

  // =====================================================
  // CURRENT LANGUAGE
  // =====================================================

  const currentLanguage =
    (i18n.language || "en").split("-")[0];

  const speechLanguage =
    currentLanguage === "hi"
      ? "hi-IN"
      : currentLanguage === "mr"
      ? "mr-IN"
      : "en-IN";

  // =====================================================
  // LOAD MARKET DATA
  // =====================================================

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/market-prices`
        );

        if (!response.ok) {
          throw new Error("Market API failed");
        }

        const result = await response.json();

        if (
          result.success &&
          Array.isArray(result.data)
        ) {
          setPrices(result.data);
          pricesRef.current = result.data;

          console.log(
            "Voice Assistant market data:",
            result.data
          );
        }
      } catch (error) {
        console.error(
          "Voice market data error:",
          error
        );
      }
    };

    loadPrices();
  }, []);

  // =====================================================
  // SPEAK ANSWER
  // =====================================================

  const speakAnswer = (text) => {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;

      synth.cancel();

      const speech =
        new SpeechSynthesisUtterance(text);

      const voices = synth.getVoices();

      const languagePrefixes = {
        en: ["en-IN", "en-US", "en-GB", "en"],
        hi: ["hi-IN", "hi"],
        mr: ["mr-IN", "mr"],
      };

      const preferredLanguages =
        languagePrefixes[currentLanguage] ||
        languagePrefixes.en;

      let voice = null;

      for (const lang of preferredLanguages) {
        voice = voices.find(
          (item) =>
            item.lang.toLowerCase() ===
            lang.toLowerCase()
        );

        if (voice) break;
      }

      if (!voice) {
        const prefix =
          currentLanguage === "hi"
            ? "hi"
            : currentLanguage === "mr"
            ? "mr"
            : "en";

        voice = voices.find((item) =>
          item.lang
            .toLowerCase()
            .startsWith(prefix)
        );
      }

      if (voice) {
        speech.voice = voice;
        speech.lang = voice.lang;
      } else {
        speech.lang = speechLanguage;
      }

      speech.rate =
        currentLanguage === "en"
          ? 1.05
          : 0.95;

      speech.volume = 1;
      speech.pitch = 1;

      speech.onend = resolve;
      speech.onerror = resolve;

      synth.speak(speech);
    });
  };

  // =====================================================
  // CROP ALIASES
  // =====================================================

  const cropAliases = {
    tomato: [
      "tomato",
      "tomatoes",
      "tamatar",
      "टमाटर",
      "टोमॅटो",
      "tomato price",
      "tomato rate",
      "tomato bhav",
      "tomato mandi",
      "टमाटर भाव",
      "टमाटर का भाव",
      "टोमॅटो भाव",
      "टोमॅटोचा भाव",
    ],

    onion: [
      "onion",
      "onions",
      "pyaz",
      "pyaaz",
      "piaz",
      "प्याज",
      "प्याज़",
      "कांदा",
      "कांदे",
      "onion price",
      "onion rate",
      "onion bhav",
      "onion mandi",
      "प्याज का भाव",
      "कांद्याचा भाव",
    ],

    potato: [
      "potato",
      "potatoes",
      "aloo",
      "alu",
      "allo",
      "आलू",
      "बटाटा",
      "बटाटे",
      "potato price",
      "potato rate",
      "potato bhav",
      "potato mandi",
      "आलू का भाव",
      "बटाट्याचा भाव",
    ],

    wheat: [
      "wheat",
      "gehun",
      "gehu",
      "gahu",
      "गेहूं",
      "गहू",
      "wheat price",
      "wheat rate",
      "wheat bhav",
      "wheat mandi",
      "गेहूं का भाव",
      "गव्हाचा भाव",
    ],

    soybean: [
      "soybean",
      "soyabean",
      "soya bean",
      "soy bean",
      "soya",
      "soy",
      "सोयाबीन",
      "soybean price",
      "soybean rate",
      "soybean bhav",
      "soybean mandi",
      "सोयाबीन का भाव",
      "सोयाबीनचा भाव",
    ],

    cotton: [
      "cotton",
      "kapas",
      "कपास",
      "कापूस",
      "cotton price",
      "cotton rate",
      "cotton bhav",
      "cotton mandi",
      "कपास का भाव",
      "कापसाचा भाव",
    ],
  };

  // =====================================================
  // NORMALIZE TEXT
  // =====================================================

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .replace(/[?!.,'"]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // =====================================================
  // MARATHI SPEECH RECOGNITION CORRECTION
  // =====================================================

  const correctSpeechTranscript = (text) => {
    if (!text) {
      return "";
    }

    let corrected = text.trim();

    // -----------------------------------------------------
    // Common Marathi speech-recognition mistake:
    //
    // User says:
    // "टोमॅटोचा भाव काय आहे?"
    //
    // Browser may recognize:
    // "चाक भाव काय आहे?"
    //
    // Correct it when the context clearly indicates
    // a tomato-price question.
    // -----------------------------------------------------

    if (currentLanguage === "mr") {
      const normalized = normalizeText(corrected);

      const isPriceQuestion =
        normalized.includes("भाव") ||
        normalized.includes("किंमत") ||
        normalized.includes("दर");

      const tomatoMistakes = [
        "चाक",
        "चक",
        "चाकचा",
        "चका",
      ];

      const hasTomatoMistake =
        tomatoMistakes.some((word) =>
          normalized.includes(word)
        );

      if (
        isPriceQuestion &&
        hasTomatoMistake
      ) {
        corrected = corrected
          .replace(/चाकचा/g, "टोमॅटोचा")
          .replace(/चाक/g, "टोमॅटो")
          .replace(/चक/g, "टोमॅटो")
          .replace(/चका/g, "टोमॅटो");

        console.log(
          "Corrected Marathi speech:",
          text,
          "=>",
          corrected
        );
      }
    }

    return corrected;
  };

  // =====================================================
  // FIND CROP
  // =====================================================

  const findCrop = (question) => {
    const text =
      normalizeText(question);

    console.log(
      "Voice question received:",
      question
    );

    console.log(
      "Normalized question:",
      text
    );

    const currentPrices =
      pricesRef.current || [];

    // -----------------------------------------------------
    // 1. DIRECT COMMODITY MATCH
    // -----------------------------------------------------

    for (const item of currentPrices) {
      const commodity =
        normalizeText(
          item.commodity || ""
        );

      if (!commodity) {
        continue;
      }

      if (text.includes(commodity)) {
        console.log(
          "Crop matched directly:",
          item.commodity
        );

        return item;
      }
    }

    // -----------------------------------------------------
    // 2. ALIAS MATCHING
    // -----------------------------------------------------

    for (const item of currentPrices) {
      const commodity =
        normalizeText(
          item.commodity || ""
        );

      if (!commodity) {
        continue;
      }

      const aliases =
        cropAliases[commodity] || [
          commodity,
        ];

      for (const alias of aliases) {
        const normalizedAlias =
          normalizeText(alias);

        if (
          text.includes(
            normalizedAlias
          )
        ) {
          console.log(
            "Crop matched using alias:",
            alias,
            "=>",
            item.commodity
          );

          return item;
        }
      }
    }

    // -----------------------------------------------------
    // 3. WORD FALLBACK
    // -----------------------------------------------------

    const words = text.split(" ");

    for (const item of currentPrices) {
      const commodity =
        normalizeText(
          item.commodity || ""
        );

      if (!commodity) {
        continue;
      }

      const aliases =
        cropAliases[commodity] || [
          commodity,
        ];

      const found =
        aliases.some((alias) => {
          const aliasWords =
            normalizeText(alias).split(
              " "
            );

          return aliasWords.some(
            (word) =>
              word.length > 2 &&
              words.includes(word)
          );
        });

      if (found) {
        console.log(
          "Crop matched using word fallback:",
          item.commodity
        );

        return item;
      }
    }

    console.log(
      "No crop matched for:",
      text
    );

    return null;
  };

  // =====================================================
  // PRICE PER KG
  // =====================================================

  const pricePerKg = (value) => {
    return Math.round(
      Number(value) / 100
    );
  };

  // =====================================================
  // SPECIFIC CROP ANSWER
  // =====================================================

  const createCropAnswer = (crop) => {
    const modal =
      pricePerKg(crop.modalPrice);

    const min =
      pricePerKg(crop.minPrice);

    const max =
      pricePerKg(crop.maxPrice);

    if (currentLanguage === "hi") {
      return (
        `${crop.commodity} का वर्तमान भाव ` +
        `${crop.market} में लगभग ₹${modal} प्रति किलोग्राम है। ` +
        `न्यूनतम भाव ₹${min} और अधिकतम भाव ₹${max} प्रति किलोग्राम है।`
      );
    }

    if (currentLanguage === "mr") {
      return (
        `${crop.commodity} चा सध्याचा बाजारभाव ` +
        `${crop.market} मध्ये अंदाजे ₹${modal} प्रति किलो आहे. ` +
        `किमान भाव ₹${min} आणि कमाल भाव ₹${max} प्रति किलो आहे.`
      );
    }

    return (
      `${crop.commodity} is currently ` +
      `₹${modal} per kilogram at ` +
      `${crop.market}. ` +
      `The minimum price is ₹${min} per kilogram, ` +
      `and the maximum price is ₹${max} per kilogram.`
    );
  };

  // =====================================================
  // ALL PRICES ANSWER
  // =====================================================

  const createAllPricesAnswer = () => {
    const currentPrices =
      pricesRef.current || [];

    if (currentPrices.length === 0) {
      return t("voiceAssistant.marketLoading");
    }

    if (currentLanguage === "hi") {
      const parts =
        currentPrices.map((crop) => {
          const modal =
            pricePerKg(
              crop.modalPrice
            );

          return (
            `${crop.commodity} ₹${modal} प्रति किलोग्राम`
          );
        });

      return (
        `एग्रीकनेक्ट की वर्तमान बाजार कीमतें हैं: ` +
        `${parts.join(", ")}।`
      );
    }

    if (currentLanguage === "mr") {
      const parts =
        currentPrices.map((crop) => {
          const modal =
            pricePerKg(
              crop.modalPrice
            );

          return (
            `${crop.commodity} ₹${modal} प्रति किलो`
          );
        });

      return (
        `अ‍ॅग्रीकनेक्टचे सध्याचे बाजारभाव आहेत: ` +
        `${parts.join(", ")}.`
      );
    }

    const parts =
      currentPrices.map((crop) => {
        const modal =
          pricePerKg(
            crop.modalPrice
          );

        return (
          `${crop.commodity} is ₹${modal} per kilogram`
        );
      });

    return (
      `${t("voiceAssistant.currentPrices")} ` +
      `${parts.join(". ")}.`
    );
  };

  // =====================================================
  // HIGHEST PRICE
  // =====================================================

  const createHighestPriceAnswer = () => {
    const currentPrices =
      pricesRef.current || [];

    if (currentPrices.length === 0) {
      return t("voiceAssistant.marketLoading");
    }

    const highest =
      currentPrices.reduce(
        (best, current) =>
          Number(
            current.modalPrice
          ) >
            Number(
              best.modalPrice
            )
            ? current
            : best
      );

    const price =
      pricePerKg(
        highest.modalPrice
      );

    if (currentLanguage === "hi") {
      return (
        `उपलब्ध फसलों में ${highest.commodity} ` +
        `का सबसे अधिक भाव है। ` +
        `इसका भाव ${highest.market} में ` +
        `₹${price} प्रति किलोग्राम है।`
      );
    }

    if (currentLanguage === "mr") {
      return (
        `उपलब्ध पिकांमध्ये ${highest.commodity} ` +
        `चा सर्वाधिक बाजारभाव आहे. ` +
        `हा भाव ${highest.market} मध्ये ` +
        `₹${price} प्रति किलो आहे.`
      );
    }

    return (
      `${highest.commodity} has the highest ` +
      `modal price among the available crops, ` +
      `at ₹${price} per kilogram at ` +
      `${highest.market}.`
    );
  };

  // =====================================================
  // LOWEST PRICE
  // =====================================================

  const createLowestPriceAnswer = () => {
    const currentPrices =
      pricesRef.current || [];

    if (currentPrices.length === 0) {
      return t("voiceAssistant.marketLoading");
    }

    const lowest =
      currentPrices.reduce(
        (best, current) =>
          Number(
            current.modalPrice
          ) <
            Number(
              best.modalPrice
            )
            ? current
            : best
      );

    const price =
      pricePerKg(
        lowest.modalPrice
      );

    if (currentLanguage === "hi") {
      return (
        `उपलब्ध फसलों में ${lowest.commodity} ` +
        `का सबसे कम भाव है। ` +
        `इसका भाव ${lowest.market} में ` +
        `₹${price} प्रति किलोग्राम है।`
      );
    }

    if (currentLanguage === "mr") {
      return (
        `उपलब्ध पिकांमध्ये ${lowest.commodity} ` +
        `चा सर्वात कमी बाजारभाव आहे. ` +
        `हा भाव ${lowest.market} मध्ये ` +
        `₹${price} प्रति किलो आहे.`
      );
    }

    return (
      `${lowest.commodity} has the lowest ` +
      `modal price among the available crops, ` +
      `at ₹${price} per kilogram at ` +
      `${lowest.market}.`
    );
  };

  // =====================================================
  // QUESTION DETECTION
  // =====================================================

  const isHighestPriceQuestion = (
    question
  ) => {
    const text =
      normalizeText(question);

    const phrases = [
      "highest price",
      "highest rate",
      "highest bhav",
      "maximum price",
      "maximum rate",
      "max price",
      "most expensive",
      "highest priced",
      "which crop has the highest",
      "which crop has maximum",

      "सबसे ज्यादा भाव",
      "सबसे अधिक भाव",
      "सबसे ज्यादा कीमत",
      "सबसे अधिक कीमत",
      "अधिकतम भाव",
      "सबसे महंगी फसल",

      "सर्वाधिक भाव",
      "सर्वात जास्त भाव",
      "सर्वाधिक किंमत",
      "सर्वात जास्त किंमत",
      "जास्त भावाचे पीक",
    ];

    return phrases.some((phrase) =>
      text.includes(
        normalizeText(phrase)
      )
    );
  };

  const isLowestPriceQuestion = (
    question
  ) => {
    const text =
      normalizeText(question);

    const phrases = [
      "lowest price",
      "lowest rate",
      "lowest bhav",
      "minimum price",
      "minimum rate",
      "min price",
      "cheapest",
      "lowest priced",
      "which crop has the lowest",
      "which crop has minimum",

      "सबसे कम भाव",
      "सबसे कम कीमत",
      "न्यूनतम भाव",
      "न्यूनतम कीमत",
      "सबसे सस्ती फसल",

      "सर्वात कमी भाव",
      "सर्वात कमी किंमत",
      "किमान भाव",
      "किमान किंमत",
      "सर्वात स्वस्त पीक",
    ];

    return phrases.some((phrase) =>
      text.includes(
        normalizeText(phrase)
      )
    );
  };

  const isAllPricesQuestion = (
    question
  ) => {
    const text =
      normalizeText(question);

    const phrases = [
      "all prices",
      "all price",
      "all rates",
      "all crops",
      "all crop prices",
      "market prices",
      "current prices",
      "show prices",
      "list prices",
      "what are the prices",

      "सभी भाव",
      "सभी कीमत",
      "सभी कीमतें",
      "सभी फसलों के भाव",
      "सभी फसलों की कीमत",
      "बाजार भाव",
      "आज के भाव",
      "आज का बाजार भाव",

      "सर्व बाजारभाव",
      "सर्व भाव",
      "सर्व पिकांचे भाव",
      "आजचे बाजारभाव",
      "आजचा बाजारभाव",
      "सध्याचे बाजारभाव",
    ];

    return phrases.some((phrase) =>
      text.includes(
        normalizeText(phrase)
      )
    );
  };

  // =====================================================
  // PROCESS QUESTION
  // =====================================================

  const processQuestion = async (
    question
  ) => {
    if (processingRef.current) {
      return;
    }

    if (answeredRef.current) {
      return;
    }

    const correctedQuestion =
      correctSpeechTranscript(question);

    const cleanQuestion =
      correctedQuestion?.trim();

    if (!cleanQuestion) {
      return;
    }

    if (
      cleanQuestion ===
      lastTranscriptRef.current
    ) {
      return;
    }

    lastTranscriptRef.current =
      cleanQuestion;

    processingRef.current = true;

    setProcessing(true);
    setStatus(
      t("voiceAssistant.thinking")
    );

    console.log(
      "AgriConnect question:",
      cleanQuestion
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 400)
    );

    const currentPrices =
      pricesRef.current || [];

    if (currentPrices.length === 0) {
      setStatus(
        t("voiceAssistant.preparing")
      );

      await speakAnswer(
        t("voiceAssistant.marketLoading")
      );

      answeredRef.current = true;
      processingRef.current = false;

      setProcessing(false);
      setStatus("");

      return;
    }

    // ===================================================
    // HIGHEST
    // ===================================================

    if (
      isHighestPriceQuestion(
        cleanQuestion
      )
    ) {
      const answer =
        createHighestPriceAnswer();

      console.log(
        "AgriConnect answer:",
        answer
      );

      setStatus(
        t("voiceAssistant.speaking")
      );

      await speakAnswer(answer);

      answeredRef.current = true;
      processingRef.current = false;

      setProcessing(false);
      setStatus("");

      return;
    }

    // ===================================================
    // LOWEST
    // ===================================================

    if (
      isLowestPriceQuestion(
        cleanQuestion
      )
    ) {
      const answer =
        createLowestPriceAnswer();

      console.log(
        "AgriConnect answer:",
        answer
      );

      setStatus(
        t("voiceAssistant.speaking")
      );

      await speakAnswer(answer);

      answeredRef.current = true;
      processingRef.current = false;

      setProcessing(false);
      setStatus("");

      return;
    }

    // ===================================================
    // ALL PRICES
    // ===================================================

    if (
      isAllPricesQuestion(
        cleanQuestion
      )
    ) {
      const answer =
        createAllPricesAnswer();

      console.log(
        "AgriConnect answer:",
        answer
      );

      setStatus(
        t("voiceAssistant.speaking")
      );

      await speakAnswer(answer);

      answeredRef.current = true;
      processingRef.current = false;

      setProcessing(false);
      setStatus("");

      return;
    }

    // ===================================================
    // SPECIFIC CROP
    // ===================================================

    const crop =
      findCrop(cleanQuestion);

    if (!crop) {
      setStatus(
        t("voiceAssistant.preparing")
      );

      await speakAnswer(
        t("voiceAssistant.marketCrop")
      );

      answeredRef.current = true;
      processingRef.current = false;

      setProcessing(false);
      setStatus("");

      return;
    }

    // ===================================================
    // SPECIFIC CROP PRICE
    // ===================================================

    const answer =
      createCropAnswer(crop);

    console.log(
      "AgriConnect answer:",
      answer
    );

    setStatus(
      t("voiceAssistant.speaking")
    );

    await speakAnswer(answer);

    answeredRef.current = true;
    processingRef.current = false;

    setProcessing(false);
    setStatus("");
  };

  // =====================================================
  // WATCH FINAL SPEECH
  // =====================================================

  useEffect(() => {
    if (listening) {
      return;
    }

    if (processingRef.current) {
      return;
    }

    if (answeredRef.current) {
      return;
    }

    const finalText =
      finalTranscript?.trim();

    if (!finalText) {
      return;
    }

    console.log(
      "Final speech:",
      finalText
    );

    processQuestion(finalText);
  }, [
    listening,
    finalTranscript,
  ]);

  // =====================================================
  // START MICROPHONE
  // =====================================================

  const startListening = async () => {
    window.speechSynthesis.cancel();

    answeredRef.current = false;
    processingRef.current = false;

    lastTranscriptRef.current = "";

    setProcessing(false);
    setStatus("");

    resetTranscript();

    try {
      await SpeechRecognition.startListening({
        continuous: false,
        language: speechLanguage,
      });

      console.log(
        "AgriConnect microphone started:",
        speechLanguage
      );
    } catch (error) {
      console.error(
        "Speech recognition error:",
        error
      );

      setStatus(
        t("voiceAssistant.micNeeded")
      );
    }
  };

  // =====================================================
  // CLEANUP
  // =====================================================

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();

      SpeechRecognition.stopListening();
    };
  }, []);

  // =====================================================
  // BROWSER SUPPORT
  // =====================================================

  if (
    !browserSupportsSpeechRecognition
  ) {
    return (
      <div className="voice-assistant">
        <div className="voice-panel">
          <h3>
            {t("voiceAssistant.unavailable")}
          </h3>

          <p>
            {t("voiceAssistant.noSupport")}
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MICROPHONE PERMISSION
  // =====================================================

  if (
    isMicrophoneAvailable === false
  ) {
    return (
      <div className="voice-assistant">
        <div className="voice-panel">
          <h3>
            {t("voiceAssistant.micNeeded")}
          </h3>

          <p>
            {t("voiceAssistant.micMessage")}
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // DISPLAY TEXT
  // =====================================================

  const rawDisplayedTranscript =
    transcript ||
    interimTranscript ||
    t("voiceAssistant.speakQuestion");

  const displayedTranscript =
    correctSpeechTranscript(
      rawDisplayedTranscript
    );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="voice-assistant">

      {/* =================================================
          LISTENING
      ================================================= */}

      {listening && (
        <div className="voice-panel">
          <h3>
            {t("voiceAssistant.ask")}
          </h3>

          <p className="voice-listening">
            🎤 {t("voiceAssistant.listening")}
          </p>

          <p>
            {displayedTranscript}
          </p>
        </div>
      )}

      {/* =================================================
          THINKING / ANSWERING
      ================================================= */}

      {!listening &&
        processing && (
          <div className="voice-panel">
            <h3>
              {t("voiceAssistant.ask")}
            </h3>

            <p>
              🤔{" "}
              {status ||
                t("voiceAssistant.thinking")}
            </p>

            <p>
              {correctSpeechTranscript(
                finalTranscript ||
                  transcript ||
                  t("voiceAssistant.processing")
              )}
            </p>

            <p>
              {t("voiceAssistant.finding")}
            </p>
          </div>
        )}

      {/* =================================================
          MICROPHONE
      ================================================= */}

      {!listening &&
        !processing && (
          <button
            className="voice-button"
            onClick={
              startListening
            }
            title={t("voiceAssistant.ask")}
          >
            🎤
          </button>
        )}

    </div>
  );
}

export default VoiceAssistant;