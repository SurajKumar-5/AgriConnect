import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  // ==========================================================
  // ENGLISH
  // ==========================================================
  en: {
    translation: {
      // --------------------------------------------------------
      // COMMON / NAVBAR
      // --------------------------------------------------------
      home: "Home",
      marketPrices: "Market Prices",
      buyers: "Buyers",
      cropHealth: "Crop Health",
      farmerDashboard: "Farmer Dashboard",
      buyerDashboard: "Buyer Dashboard",
      deals: "Deals",
      voiceAssistant: "Voice Assistant",
      login: "Login",
      logout: "Logout",
      tagline: "Farm Today • Connect Tomorrow",

      // --------------------------------------------------------
      // HOME PAGE
      // --------------------------------------------------------
      smartAgriculture: "SMART AGRICULTURE PLATFORM",

      heroTitle1: "Helping Farmers Grow Better",
      heroTitle2: "& Sell Smarter",

      heroDescription:
        "AgriConnect connects farmers with real-time market prices, verified buyers, crop health insights and better market opportunities.",

      explorePrices: "Explore Market Prices",
      findBuyers: "Find Buyers",

      liveMarket: "LIVE MARKET",
      todaysMarket: "Today's Market",
      currentPrices: "Current agricultural prices",
      pricesUpdated: "Prices updated regularly",

      liveAgriculturalPrices: "Live Agricultural Prices",

      marketDescription:
        "Check current mandi prices before deciding where to sell your produce.",

      viewAllPrices: "View All Market Prices",

      whatWeOffer: "WHAT AGRICONNECT OFFERS",
      everythingFarmersNeed:
        "Everything Farmers Need in One Platform",

      liveMarketPrices: "Live Market Prices",

      marketFeature:
        "Compare mandi prices and identify better markets for your produce.",

      viewPrices: "View Prices",

      verifiedBuyers: "Verified Buyers",

      buyersFeature:
        "Connect directly with businesses looking for agricultural produce.",

      aiCropHealth: "AI Crop Health",

      cropFeature:
        "Use AI-powered crop analysis to identify potential health problems.",

      checkCrop: "Check Crop",

      // --------------------------------------------------------
      // BUYERS PAGE
      // --------------------------------------------------------
      buyerNetwork: "BUYER NETWORK",

      buyerDescription:
        "Connect farmers with verified buyers, traders and businesses.",

      loadingBuyers: "Loading buyers...",

      connectingBuyerNetwork:
        "Connecting to AgriConnect buyer network.",

      buyerServiceUnavailable: "Buyer service unavailable",

      backendPortMessage:
        "Make sure your FastAPI backend is running on port 8000.",

      tryAgain: "Try Again",

      searchCropBuyer: "Search crop or buyer...",

      allLocations: "All Locations",

      availableBuyers: "Available Buyers",

      buyer: "buyer",
      buyers: "buyers",
      found: "found",

      verifiedBuyer: "Verified Buyer",

      lookingFor: "Looking for",

      quantity: "Quantity",

      offeredPrice: "Offered Price",

      contactBuyer: "Contact Buyer",

      noBuyersFound: "No buyers found",

      changeSearchLocation:
        "Try changing your search or location.",

      // --------------------------------------------------------
      // FARMER ACTIVITY / CONTACT REQUESTS
      // --------------------------------------------------------
      farmerActivity: "FARMER ACTIVITY",

      myContactRequests: "My Contact Requests",

      request: "request",
      requests: "requests",

      requestId: "Request ID",

      contactBuyerLabel: "CONTACT BUYER",

      interestedInSelling: "Interested in selling",

      location: "Location",

      requiredQuantity: "Required Quantity",

      sendingRequest: "Sending Request...",

      sendContactRequest: "Send Contact Request",

      requestSent: "REQUEST SENT",

      contactRequestSent: "Contact Request Sent",

      requestSentTo: "Your request has been sent to",

      crop: "Crop",

      status: "Status",

      pending: "Pending",

      viewMyRequests: "View My Requests",

      loginToContactBuyers:
        "Please login to contact buyers.",

      pendingRequestExists:
        "You already have a pending request for this buyer.",

      sendRequestError:
        "Unable to send the contact request. Please try again.",

      // ========================================================
      // MARKET PRICES
      // ========================================================
      marketPrices: {
        intelligence: "MARKET INTELLIGENCE",
        title: "Agricultural Market Prices",

        description:
          "Compare current market prices to make informed selling decisions.",

        demoData: "Demo Data",
        governmentData: "Government Data",

        lastUpdated: "Last Updated",

        demoExplanation:
          "Market prices shown are connected to the AgriConnect backend.",

        loading: "Loading market prices...",

        loadingDescription:
          "Fetching the latest available agricultural market information.",

        unavailable: "Market prices unavailable",

        loadError: "Unable to load market prices.",

        tryAgain: "Try Again",

        marketUnavailable:
          "Market information is currently unavailable.",

        modalPrice: "Modal Price",

        minimum: "Minimum",

        maximum: "Maximum",

        localVariety: "Local Variety",

        grade: "Grade",

        listen: "Listen",

        theMarket: "Market",

        speechMessage:
          "The current modal price is",

        noData: "No market data available",

        noDataDescription:
          "Market price information could not be loaded.",

        refreshData: "Refresh Data",

        informedSelling:
          "Make informed selling decisions",

        informedSellingDescription:
          "Compare prices across available markets before selling your produce."
      },

      // ========================================================
      // CROP HEALTH
      // ========================================================
      cropHealth: {
        invalidImage:
          "Please select a valid image file.",

        uploadFirst:
          "Please upload a crop image first.",

        analysisError:
          "Unable to analyze the image. Please try again.",

        connectionError:
          "Unable to connect to the crop analysis service.",

        confidenceUncertain: "Uncertain",
        confidenceHigh: "High",
        confidenceModerate: "Moderate",
        confidenceLow: "Low",

        label: "AI CROP HEALTH ANALYSIS",

        title: "Check Your Crop Health",

        description:
          "Upload a crop image and let AI analyze its health and possible disease.",

        uploadTitle: "Upload Crop Image",

        uploadDescription:
          "Choose a clear image of your crop for AI-powered analysis.",

        chooseImage: "Choose Image",

        fileTypes: "JPG, JPEG, PNG",

        selectedCrop: "Selected Crop",

        removeImage: "Remove Image",

        analyzing: "Analyzing...",

        analyze: "Analyze Crop",

        aiAnalyzing:
          "AI is analyzing your crop...",

        modelProcessing:
          "The AI model is processing the image.",

        howItWorks: "How It Works",

        uploadStep: "Upload Image",

        uploadStepDescription:
          "Choose a clear crop image.",

        aiAnalysisStep: "AI Analysis",

        aiAnalysisStepDescription:
          "The trained model analyzes the crop.",

        insightsStep: "Get Insights",

        insightsStepDescription:
          "Receive health information and recommendations.",

        aiModel: "AI Model",

        analysisComplete: "Analysis Complete",

        reportTitle: "Crop Health Report",

        reportDescription:
          "AI-generated crop health analysis.",

        cropIdentified: "Crop Identified",

        unknown: "Unknown",

        healthStatus: "Health Status",

        confidence: "Confidence",

        aiConfidence: "AI Confidence",

        diseaseIssue: "Disease / Issue",

        noInformation:
          "No information available",

        recommendation: "Recommendation",

        whatToDo: "What To Do",

        noRecommendation:
          "No recommendation available.",

        predictionDetails:
          "Prediction Details",

        topPredictions:
          "Top Predictions",

        technicalInformation:
          "Technical Information",

        aiService: "AI Service",

        predictionStatus:
          "Prediction Status",

        analysisCompleteSimple:
          "Analysis complete",

        backend: "Backend",

        connected: "Connected",

        serviceConnected:
          "AI analysis service is connected.",

        betterDecisions:
          "Better Crop Decisions",

        betterDecisionsDescription:
          "Use AI insights to support timely crop management decisions."
      },

      // ========================================================
      // FARMER DASHBOARD
      // ========================================================
      farmerDashboard: {
        loadError:
          "Unable to load farmer dashboard.",

        dateNotAvailable:
          "Date not available",

        loginRequired:
          "Login Required",

        loginRequiredDescription:
          "Please log in as a farmer to access your dashboard.",

        label: "FARMER DASHBOARD",

        welcome: "Welcome",

        farmer: "Farmer",

        description:
          "Manage buyer requests, track deals, and monitor your agricultural connections.",

        refreshing: "Refreshing...",

        refresh: "Refresh",

        tryAgain: "Try Again",

        pendingRequests:
          "Pending Requests",

        accepted: "Accepted",

        activeDeals:
          "Active Deals",

        completedDeals:
          "Completed Deals",

        loading: "Loading...",

        myBuyerRequests:
          "My Buyer Requests",

        myBuyerRequestsDescription:
          "Track requests from buyers interested in your produce.",

        noBuyerRequests:
          "No Buyer Requests",

        noBuyerRequestsDescription:
          "You do not have any buyer requests yet.",

        browseBuyers:
          "Browse Buyers",

        buyer: "Buyer",

        locationNotAvailable:
          "Location not available",

        pending: "Pending",

        crop: "Crop",

        quantity: "Quantity",

        offeredPrice:
          "Offered Price",

        requestDate:
          "Request Date",

        dealCreated:
          "Deal Created",

        dealId:
          "Deal ID",

        status:
          "Status",

        estimatedValue:
          "Estimated Value",

        dealSynchronizing:
          "Deal is synchronizing...",

        requestRejected:
          "Request Rejected",

        requestId:
          "Request ID",

        myDeals:
          "My Deals",

        myDealsDescription:
          "Track your farmer transactions and deal progress.",

        noDeals:
          "No Deals",

        noDealsDescription:
          "You do not have any deals yet.",

        deal:
          "Deal",

        created:
          "Created",

        request:
          "Request",

        activeDealMessage:
          "This deal is currently active.",

        completedDealMessage:
          "This deal has been completed.",

        cancelledDealMessage:
          "This deal has been cancelled."
      },

      // ========================================================
      // BUYER DASHBOARD
      // ========================================================
      buyerDashboard: {
        notLinked:
          "Buyer account is not linked to a buyer business.",

        loadRequestsError:
          "Unable to load buyer requests.",

        loadDealsError:
          "Unable to load buyer deals.",

        unableRequests:
          "Unable to load requests.",

        unableDeals:
          "Unable to load deals.",

        unableDashboard:
          "Unable to load dashboard.",

        unableUpdate:
          "Unable to update request.",

        updateTryAgain:
          "Please try again.",

        portal:
          "BUYER PORTAL",

        title:
          "Buyer Dashboard",

        description:
          "Manage farmer requests, connections, and agricultural deals.",

        loading:
          "Loading buyer dashboard...",

        loadingDescription:
          "Fetching your requests and deals.",

        unableLoad:
          "Unable to load your dashboard.",

        tryAgain:
          "Try Again",

        welcomeBack:
          "Welcome Back",

        manageNetwork:
          "Manage your farmer network and agricultural deals.",

        loggedInAs:
          "Logged in as",

        buyerBusiness:
          "Buyer Business",

        buyerId:
          "Buyer ID",

        totalRequests:
          "Total Requests",

        pending:
          "Pending",

        accepted:
          "Accepted",

        activeDeals:
          "Active Deals",

        farmerConnections:
          "Farmer Connections",

        incomingRequests:
          "Incoming Farmer Requests",

        refresh:
          "Refresh",

        noRequests:
          "No Requests",

        noRequestsDescription:
          "You do not have any incoming farmer requests yet.",

        requestId:
          "Request ID",

        crop:
          "Crop",

        quantity:
          "Quantity",

        offeredPrice:
          "Offered Price",

        requested:
          "Requested",

        updating:
          "Updating...",

        reject:
          "Reject",

        accept:
          "Accept",

        requestAccepted:
          "Request accepted",

        dealCreated:
          "Deal created",

        dealId:
          "Deal ID",

        status:
          "Status",

        estimatedValue:
          "Estimated Value",

        transactionTracked:
          "Transaction is now tracked as a deal.",

        acceptedContact:
          "Accepted Contact",

        dealSynchronizing:
          "Deal is synchronizing...",

        rejectedContact:
          "Rejected Contact",

        transactionManagement:
          "Transaction Management",

        yourDeals:
          "Your Deals",

        cropDeal:
          "Crop Deal",

        farmer:
          "Farmer",

        created:
          "Created",

        dealTracked:
          "Deal is being tracked."
      },

      // ========================================================
      // DEALS
      // ========================================================
      deals: {
        notLinked:
          "Your account is not linked to a buyer or farmer profile.",

        loginToView:
          "Please log in to view your deals.",

        unableLoad:
          "Unable to load deals.",

        backendConnectionError:
          "Unable to connect to the backend.",

        confirmCompleted:
          "Mark this deal as completed?",

        confirmCancelled:
          "Cancel this deal?",

        unableUpdateStatus:
          "Unable to update deal status.",

        unableUpdateTryAgain:
          "Please try again.",

        loginRequired:
          "Login Required",

        loginRequiredDescription:
          "Please log in to view your deals.",

        eyebrow:
          "TRANSACTION MANAGEMENT",

        title:
          "Your Deals",

        description:
          "Track agricultural transactions from request to completion.",

        refreshing:
          "Refreshing...",

        refresh:
          "Refresh",

        totalDeals:
          "Total Deals",

        active:
          "Active",

        completed:
          "Completed",

        loading:
          "Loading...",

        noDeals:
          "No Deals",

        noBuyerDeals:
          "You do not have any buyer deals yet.",

        noFarmerDeals:
          "You do not have any farmer deals yet.",

        management:
          "Deal Management",

        yourFarmerDeals:
          "Your Farmer Deals",

        yourBuyerDeals:
          "Your Buyer Deals",

        deal:
          "Deal",

        deals:
          "Deals",

        dealId:
          "Deal ID",

        crop:
          "Crop",

        quantity:
          "Quantity",

        offeredPrice:
          "Offered Price",

        estimatedValue:
          "Estimated Value",

        farmer:
          "Farmer",

        buyer:
          "Buyer",

        farmerEmail:
          "Farmer Email",

        location:
          "Location",

        created:
          "Created",

        activeMessage:
          "This deal is currently active.",

        updating:
          "Updating...",

        markCompleted:
          "Mark Completed",

        cancelDeal:
          "Cancel Deal",

        completedMessage:
          "This deal has been completed.",

        cancelledMessage:
          "This deal has been cancelled."
      },

      // ========================================================
      // LOGIN
      // ========================================================
      login: {
        unableLoadBuyerBusinesses:
          "Unable to load buyer businesses.",

        buyerServiceUnavailable:
          "Buyer service is unavailable.",

        buyerBackendError:
          "Unable to connect to buyer service.",

        enterName:
          "Please enter your name.",

        enterEmail:
          "Please enter your email.",

        createPassword:
          "Please create a password.",

        passwordLength:
          "Password must be at least 6 characters.",

        selectBuyerBusiness:
          "Please select a buyer business.",

        emailAlreadyExists:
          "An account with this email already exists.",

        buyerNotFound:
          "Buyer business not found.",

        accountCreated:
          "Account created successfully.",

        enterEmailPassword:
          "Please enter your email and password.",

        accountNotFound:
          "Account not found.",

        incorrectPassword:
          "Incorrect password.",

        buyerNotLinked:
          "Please select a buyer business.",

        tagline:
          "CONNECTING FARMERS TO BETTER MARKETS",

        login:
          "Login",

        createAccount:
          "Create Account",

        emailAddress:
          "Email Address",

        enterEmailPlaceholder:
          "Enter your email",

        password:
          "Password",

        enterPasswordPlaceholder:
          "Enter your password",

        loginToAgriConnect:
          "Login to AgriConnect",

        newToAgriConnect:
          "New to AgriConnect?",

        fullName:
          "Full Name",

        enterNamePlaceholder:
          "Enter your full name",

        createPasswordPlaceholder:
          "Create a password",

        accountType:
          "Account Type",

        farmer:
          "Farmer",

        buyer:
          "Buyer",

        buyerBusiness:
          "Buyer Business",

        loadingBuyerBusinesses:
          "Loading buyer businesses...",

        noBuyerBusinesses:
          "No buyer businesses available.",

        createAgriConnectAccount:
          "Create your AgriConnect account",

        alreadyHaveAccount:
          "Already have an account?"
      },

      // ========================================================
      // VOICE ASSISTANT
      // ========================================================
      voiceAssistant: {
        listening:
          "Listening...",

        thinking:
          "Thinking...",

        speaking:
          "Speaking...",

        ask:
          "Ask AgriConnect",

        unavailable:
          "Voice Assistant Unavailable",

        noSupport:
          "Your browser does not support speech recognition.",

        micNeeded:
          "Microphone Access Needed",

        micMessage:
          "Please allow microphone access for AgriConnect and try again.",

        preparing:
          "Preparing answer...",

        marketLoading:
          "Sorry, I cannot access the current market prices right now. Please try again in a moment.",

        noCrop:
          "Sorry, I could not identify the crop. Please try saying the crop name again.",

        marketCrop:
          "I can provide market prices for tomato, onion, potato, wheat, soybean and cotton. Please mention the crop name.",

        finding:
          "Finding the latest market information...",

        speakQuestion:
          "Speak your question...",

        processing:
          "Processing your question...",

        currentPrices:
          "Here are the current AgriConnect market prices.",

        highest:
          "Among the available crops,",

        lowest:
          "Among the available crops,"
      }
    }
  },

  // ==========================================================
  // HINDI
  // ==========================================================
  hi: {
    translation: {
      // --------------------------------------------------------
      // COMMON / NAVBAR
      // --------------------------------------------------------
      home: "होम",
      marketPrices: "बाज़ार भाव",
      buyers: "खरीदार",
      cropHealth: "फसल स्वास्थ्य",
      farmerDashboard: "किसान डैशबोर्ड",
      buyerDashboard: "खरीदार डैशबोर्ड",
      deals: "सौदे",
      voiceAssistant: "वॉइस असिस्टेंट",
      login: "लॉगिन",
      logout: "लॉगआउट",
      tagline: "आज खेती • कल जुड़ाव",

      // --------------------------------------------------------
      // HOME PAGE
      // --------------------------------------------------------
      smartAgriculture:
        "स्मार्ट कृषि प्लेटफॉर्म",

      heroTitle1:
        "किसानों को बेहतर खेती में मदद",

      heroTitle2:
        "और बेहतर कीमत पर बेचें",

      heroDescription:
        "एग्रीकनेक्ट किसानों को वास्तविक समय के बाज़ार भाव, सत्यापित खरीदार, फसल स्वास्थ्य जानकारी और बेहतर बाज़ार अवसरों से जोड़ता है।",

      explorePrices:
        "बाज़ार भाव देखें",

      findBuyers:
        "खरीदार खोजें",

      liveMarket:
        "लाइव बाज़ार",

      todaysMarket:
        "आज का बाज़ार",

      currentPrices:
        "वर्तमान कृषि भाव",

      pricesUpdated:
        "भाव नियमित रूप से अपडेट होते हैं",

      liveAgriculturalPrices:
        "लाइव कृषि भाव",

      marketDescription:
        "अपनी उपज बेचने का निर्णय लेने से पहले वर्तमान मंडी भाव देखें।",

      viewAllPrices:
        "सभी बाज़ार भाव देखें",

      whatWeOffer:
        "एग्रीकनेक्ट क्या प्रदान करता है",

      everythingFarmersNeed:
        "किसानों के लिए सभी सुविधाएँ एक ही प्लेटफॉर्म पर",

      liveMarketPrices:
        "लाइव बाज़ार भाव",

      marketFeature:
        "मंडी के भाव की तुलना करें और अपनी उपज के लिए बेहतर बाज़ार चुनें।",

      viewPrices:
        "भाव देखें",

      verifiedBuyers:
        "सत्यापित खरीदार",

      buyersFeature:
        "कृषि उपज खरीदने वाले व्यवसायों से सीधे जुड़ें।",

      aiCropHealth:
        "AI फसल स्वास्थ्य",

      cropFeature:
        "संभावित फसल स्वास्थ्य समस्याओं की पहचान करने के लिए AI का उपयोग करें।",

      checkCrop:
        "फसल जाँचें",

      // --------------------------------------------------------
      // BUYERS PAGE
      // --------------------------------------------------------
      buyerNetwork:
        "खरीदार नेटवर्क",

      buyerDescription:
        "किसानों को सत्यापित खरीदारों, व्यापारियों और व्यवसायों से जोड़ें।",

      loadingBuyers:
        "खरीदारों को लोड किया जा रहा है...",

      connectingBuyerNetwork:
        "AgriConnect खरीदार नेटवर्क से जुड़ रहा है।",

      buyerServiceUnavailable:
        "खरीदार सेवा उपलब्ध नहीं है",

      backendPortMessage:
        "सुनिश्चित करें कि आपका FastAPI बैकएंड पोर्ट 8000 पर चल रहा है।",

      tryAgain:
        "पुनः प्रयास करें",

      searchCropBuyer:
        "फसल या खरीदार खोजें...",

      allLocations:
        "सभी स्थान",

      availableBuyers:
        "उपलब्ध खरीदार",

      buyer:
        "खरीदार",

      buyers:
        "खरीदार",

      found:
        "मिले",

      verifiedBuyer:
        "सत्यापित खरीदार",

      lookingFor:
        "आवश्यकता",

      quantity:
        "मात्रा",

      offeredPrice:
        "प्रस्तावित कीमत",

      contactBuyer:
        "खरीदार से संपर्क करें",

      noBuyersFound:
        "कोई खरीदार नहीं मिला",

      changeSearchLocation:
        "अपनी खोज या स्थान बदलकर देखें।",

      // --------------------------------------------------------
      // FARMER ACTIVITY
      // --------------------------------------------------------
      farmerActivity:
        "किसान गतिविधि",

      myContactRequests:
        "मेरे संपर्क अनुरोध",

      request:
        "अनुरोध",

      requests:
        "अनुरोध",

      requestId:
        "अनुरोध आईडी",

      contactBuyerLabel:
        "खरीदार से संपर्क करें",

      interestedInSelling:
        "क्या आप बेचने में रुचि रखते हैं",

      location:
        "स्थान",

      requiredQuantity:
        "आवश्यक मात्रा",

      sendingRequest:
        "अनुरोध भेजा जा रहा है...",

      sendContactRequest:
        "संपर्क अनुरोध भेजें",

      requestSent:
        "अनुरोध भेजा गया",

      contactRequestSent:
        "संपर्क अनुरोध भेजा गया",

      requestSentTo:
        "आपका अनुरोध भेज दिया गया है",

      crop:
        "फसल",

      status:
        "स्थिति",

      pending:
        "लंबित",

      viewMyRequests:
        "मेरे अनुरोध देखें",

      loginToContactBuyers:
        "खरीदारों से संपर्क करने के लिए कृपया लॉगिन करें।",

      pendingRequestExists:
        "इस खरीदार के लिए आपका एक अनुरोध पहले से लंबित है।",

      sendRequestError:
        "संपर्क अनुरोध भेजने में समस्या हुई। कृपया पुनः प्रयास करें।",

      // ========================================================
      // MARKET PRICES
      // ========================================================
      marketPrices: {
        intelligence:
          "बाजार जानकारी",

        title:
          "कृषि बाजार भाव",

        description:
          "बेहतर बिक्री निर्णय लेने के लिए वर्तमान बाजार कीमतों की तुलना करें।",

        demoData:
          "डेमो डेटा",

        governmentData:
          "सरकारी डेटा",

        lastUpdated:
          "अंतिम अपडेट",

        demoExplanation:
          "दिखाए गए बाजार भाव एग्रीकनेक्ट बैकएंड से जुड़े हैं।",

        loading:
          "बाजार भाव लोड हो रहे हैं...",

        loadingDescription:
          "उपलब्ध नवीनतम कृषि बाजार जानकारी प्राप्त की जा रही है।",

        unavailable:
          "बाजार भाव उपलब्ध नहीं हैं",

        loadError:
          "बाजार भाव लोड नहीं हो सके।",

        tryAgain:
          "फिर कोशिश करें",

        marketUnavailable:
          "बाजार की जानकारी अभी उपलब्ध नहीं है।",

        modalPrice:
          "मॉडल भाव",

        minimum:
          "न्यूनतम",

        maximum:
          "अधिकतम",

        localVariety:
          "स्थानीय किस्म",

        grade:
          "ग्रेड",

        listen:
          "सुनें",

        theMarket:
          "बाजार",

        speechMessage:
          "वर्तमान मॉडल भाव है",

        noData:
          "बाजार डेटा उपलब्ध नहीं है",

        noDataDescription:
          "बाजार भाव की जानकारी लोड नहीं हो सकी।",

        refreshData:
          "डेटा रिफ्रेश करें",

        informedSelling:
          "जानकारी के आधार पर बिक्री निर्णय लें",

        informedSellingDescription:
          "उपज बेचने से पहले उपलब्ध बाजारों की कीमतों की तुलना करें।"
      },

      // ========================================================
      // CROP HEALTH
      // ========================================================
      cropHealth: {
        invalidImage:
          "कृपया मान्य इमेज फाइल चुनें।",

        uploadFirst:
          "कृपया पहले फसल की तस्वीर अपलोड करें।",

        analysisError:
          "इमेज का विश्लेषण नहीं हो सका। कृपया फिर कोशिश करें।",

        connectionError:
          "फसल विश्लेषण सेवा से कनेक्ट नहीं हो सका।",

        confidenceUncertain:
          "अनिश्चित",

        confidenceHigh:
          "उच्च",

        confidenceModerate:
          "मध्यम",

        confidenceLow:
          "कम",

        label:
          "AI फसल स्वास्थ्य विश्लेषण",

        title:
          "अपनी फसल का स्वास्थ्य जांचें",

        description:
          "फसल की तस्वीर अपलोड करें और AI से उसके स्वास्थ्य तथा संभावित बीमारी का विश्लेषण करवाएं।",

        uploadTitle:
          "फसल की तस्वीर अपलोड करें",

        uploadDescription:
          "AI विश्लेषण के लिए फसल की साफ तस्वीर चुनें।",

        chooseImage:
          "इमेज चुनें",

        fileTypes:
          "JPG, JPEG, PNG",

        selectedCrop:
          "चयनित फसल",

        removeImage:
          "इमेज हटाएं",

        analyzing:
          "विश्लेषण हो रहा है...",

        analyze:
          "फसल का विश्लेषण करें",

        aiAnalyzing:
          "AI आपकी फसल का विश्लेषण कर रहा है...",

        modelProcessing:
          "AI मॉडल इमेज को प्रोसेस कर रहा है।",

        howItWorks:
          "यह कैसे काम करता है",

        uploadStep:
          "इमेज अपलोड करें",

        uploadStepDescription:
          "फसल की साफ तस्वीर चुनें।",

        aiAnalysisStep:
          "AI विश्लेषण",

        aiAnalysisStepDescription:
          "प्रशिक्षित मॉडल फसल का विश्लेषण करता है।",

        insightsStep:
          "जानकारी प्राप्त करें",

        insightsStepDescription:
          "स्वास्थ्य संबंधी जानकारी और सुझाव प्राप्त करें।",

        aiModel:
          "AI मॉडल",

        analysisComplete:
          "विश्लेषण पूरा हुआ",

        reportTitle:
          "फसल स्वास्थ्य रिपोर्ट",

        reportDescription:
          "AI द्वारा तैयार फसल स्वास्थ्य विश्लेषण।",

        cropIdentified:
          "पहचानी गई फसल",

        unknown:
          "अज्ञात",

        healthStatus:
          "स्वास्थ्य स्थिति",

        confidence:
          "विश्वास स्तर",

        aiConfidence:
          "AI विश्वास स्तर",

        diseaseIssue:
          "रोग / समस्या",

        noInformation:
          "जानकारी उपलब्ध नहीं है",

        recommendation:
          "सुझाव",

        whatToDo:
          "क्या करें",

        noRecommendation:
          "कोई सुझाव उपलब्ध नहीं है।",

        predictionDetails:
          "पूर्वानुमान विवरण",

        topPredictions:
          "शीर्ष पूर्वानुमान",

        technicalInformation:
          "तकनीकी जानकारी",

        aiService:
          "AI सेवा",

        predictionStatus:
          "पूर्वानुमान स्थिति",

        analysisCompleteSimple:
          "विश्लेषण पूरा हुआ",

        backend:
          "बैकएंड",

        connected:
          "कनेक्टेड",

        serviceConnected:
          "AI विश्लेषण सेवा कनेक्टेड है।",

        betterDecisions:
          "बेहतर फसल निर्णय",

        betterDecisionsDescription:
          "समय पर फसल प्रबंधन निर्णयों के लिए AI जानकारी का उपयोग करें।"
      },

      // ========================================================
      // FARMER DASHBOARD
      // ========================================================
      farmerDashboard: {
        loadError:
          "किसान डैशबोर्ड लोड नहीं हो सका।",

        dateNotAvailable:
          "तारीख उपलब्ध नहीं है",

        loginRequired:
          "लॉगिन आवश्यक है",

        loginRequiredDescription:
          "डैशबोर्ड देखने के लिए कृपया किसान के रूप में लॉगिन करें।",

        label:
          "किसान डैशबोर्ड",

        welcome:
          "स्वागत है",

        farmer:
          "किसान",

        description:
          "खरीदार अनुरोध प्रबंधित करें, सौदे ट्रैक करें और अपने कृषि संपर्क देखें।",

        refreshing:
          "रिफ्रेश हो रहा है...",

        refresh:
          "रिफ्रेश",

        tryAgain:
          "फिर कोशिश करें",

        pendingRequests:
          "लंबित अनुरोध",

        accepted:
          "स्वीकृत",

        activeDeals:
          "सक्रिय सौदे",

        completedDeals:
          "पूर्ण सौदे",

        loading:
          "लोड हो रहा है...",

        myBuyerRequests:
          "मेरे खरीदार अनुरोध",

        myBuyerRequestsDescription:
          "आपकी उपज में रुचि रखने वाले खरीदारों के अनुरोध देखें।",

        noBuyerRequests:
          "कोई खरीदार अनुरोध नहीं",

        noBuyerRequestsDescription:
          "अभी आपके पास कोई खरीदार अनुरोध नहीं है।",

        browseBuyers:
          "खरीदार देखें",

        buyer:
          "खरीदार",

        locationNotAvailable:
          "स्थान उपलब्ध नहीं है",

        pending:
          "लंबित",

        crop:
          "फसल",

        quantity:
          "मात्रा",

        offeredPrice:
          "प्रस्तावित कीमत",

        requestDate:
          "अनुरोध की तारीख",

        dealCreated:
          "सौदा बनाया गया",

        dealId:
          "सौदा ID",

        status:
          "स्थिति",

        estimatedValue:
          "अनुमानित मूल्य",

        dealSynchronizing:
          "सौदा सिंक्रोनाइज़ हो रहा है...",

        requestRejected:
          "अनुरोध अस्वीकार किया गया",

        requestId:
          "अनुरोध ID",

        myDeals:
          "मेरे सौदे",

        myDealsDescription:
          "अपने किसान लेनदेन और सौदे की प्रगति ट्रैक करें।",

        noDeals:
          "कोई सौदा नहीं",

        noDealsDescription:
          "अभी आपके पास कोई सौदा नहीं है।",

        deal:
          "सौदा",

        created:
          "बनाया गया",

        request:
          "अनुरोध",

        activeDealMessage:
          "यह सौदा अभी सक्रिय है।",

        completedDealMessage:
          "यह सौदा पूरा हो चुका है।",

        cancelledDealMessage:
          "यह सौदा रद्द किया जा चुका है।"
      },

      // ========================================================
      // BUYER DASHBOARD
      // ========================================================
      buyerDashboard: {
        notLinked:
          "खरीदार खाता किसी खरीदार व्यवसाय से जुड़ा नहीं है।",

        loadRequestsError:
          "खरीदार अनुरोध लोड नहीं हो सके।",

        loadDealsError:
          "खरीदार सौदे लोड नहीं हो सके।",

        unableRequests:
          "अनुरोध लोड नहीं हो सके।",

        unableDeals:
          "सौदे लोड नहीं हो सके।",

        unableDashboard:
          "डैशबोर्ड लोड नहीं हो सका।",

        unableUpdate:
          "अनुरोध अपडेट नहीं हो सका।",

        updateTryAgain:
          "कृपया फिर कोशिश करें।",

        portal:
          "खरीदार पोर्टल",

        title:
          "खरीदार डैशबोर्ड",

        description:
          "किसान अनुरोध, संपर्क और कृषि सौदे प्रबंधित करें।",

        loading:
          "खरीदार डैशबोर्ड लोड हो रहा है...",

        loadingDescription:
          "आपके अनुरोध और सौदे प्राप्त किए जा रहे हैं।",

        unableLoad:
          "डैशबोर्ड लोड नहीं हो सका।",

        tryAgain:
          "फिर कोशिश करें",

        welcomeBack:
          "वापसी पर स्वागत है",

        manageNetwork:
          "अपने किसान नेटवर्क और कृषि सौदों को प्रबंधित करें।",

        loggedInAs:
          "लॉगिन है",

        buyerBusiness:
          "खरीदार व्यवसाय",

        buyerId:
          "खरीदार ID",

        totalRequests:
          "कुल अनुरोध",

        pending:
          "लंबित",

        accepted:
          "स्वीकृत",

        activeDeals:
          "सक्रिय सौदे",

        farmerConnections:
          "किसान संपर्क",

        incomingRequests:
          "आने वाले किसान अनुरोध",

        refresh:
          "रिफ्रेश",

        noRequests:
          "कोई अनुरोध नहीं",

        noRequestsDescription:
          "अभी आपके पास कोई किसान अनुरोध नहीं है।",

        requestId:
          "अनुरोध ID",

        crop:
          "फसल",

        quantity:
          "मात्रा",

        offeredPrice:
          "प्रस्तावित कीमत",

        requested:
          "अनुरोध किया गया",

        updating:
          "अपडेट हो रहा है...",

        reject:
          "अस्वीकार करें",

        accept:
          "स्वीकार करें",

        requestAccepted:
          "अनुरोध स्वीकार किया गया",

        dealCreated:
          "सौदा बनाया गया",

        dealId:
          "सौदा ID",

        status:
          "स्थिति",

        estimatedValue:
          "अनुमानित मूल्य",

        transactionTracked:
          "लेनदेन अब सौदे के रूप में ट्रैक किया जा रहा है।",

        acceptedContact:
          "संपर्क स्वीकार किया गया",

        dealSynchronizing:
          "सौदा सिंक्रोनाइज़ हो रहा है...",

        rejectedContact:
          "संपर्क अस्वीकार किया गया",

        transactionManagement:
          "लेनदेन प्रबंधन",

        yourDeals:
          "आपके सौदे",

        cropDeal:
          "फसल सौदा",

        farmer:
          "किसान",

        created:
          "बनाया गया",

        dealTracked:
          "सौदा ट्रैक किया जा रहा है।"
      },

      // ========================================================
      // DEALS
      // ========================================================
      deals: {
        notLinked:
          "आपका खाता खरीदार या किसान प्रोफाइल से जुड़ा नहीं है।",

        loginToView:
          "सौदे देखने के लिए कृपया लॉगिन करें।",

        unableLoad:
          "सौदे लोड नहीं हो सके।",

        backendConnectionError:
          "बैकएंड से कनेक्ट नहीं हो सका।",

        confirmCompleted:
          "क्या इस सौदे को पूर्ण करना है?",

        confirmCancelled:
          "क्या इस सौदे को रद्द करना है?",

        unableUpdateStatus:
          "सौदे की स्थिति अपडेट नहीं हो सकी।",

        unableUpdateTryAgain:
          "कृपया फिर कोशिश करें।",

        loginRequired:
          "लॉगिन आवश्यक है",

        loginRequiredDescription:
          "सौदे देखने के लिए कृपया लॉगिन करें।",

        eyebrow:
          "लेनदेन प्रबंधन",

        title:
          "आपके सौदे",

        description:
          "कृषि लेनदेन को अनुरोध से पूरा होने तक ट्रैक करें।",

        refreshing:
          "रिफ्रेश हो रहा है...",

        refresh:
          "रिफ्रेश",

        totalDeals:
          "कुल सौदे",

        active:
          "सक्रिय",

        completed:
          "पूर्ण",

        loading:
          "लोड हो रहा है...",

        noDeals:
          "कोई सौदा नहीं",

        noBuyerDeals:
          "अभी आपके पास कोई खरीदार सौदा नहीं है।",

        noFarmerDeals:
          "अभी आपके पास कोई किसान सौदा नहीं है।",

        management:
          "सौदा प्रबंधन",

        yourFarmerDeals:
          "आपके किसान सौदे",

        yourBuyerDeals:
          "आपके खरीदार सौदे",

        deal:
          "सौदा",

        deals:
          "सौदे",

        dealId:
          "सौदा ID",

        crop:
          "फसल",

        quantity:
          "मात्रा",

        offeredPrice:
          "प्रस्तावित कीमत",

        estimatedValue:
          "अनुमानित मूल्य",

        farmer:
          "किसान",

        buyer:
          "खरीदार",

        farmerEmail:
          "किसान ईमेल",

        location:
          "स्थान",

        created:
          "बनाया गया",

        activeMessage:
          "यह सौदा अभी सक्रिय है।",

        updating:
          "अपडेट हो रहा है...",

        markCompleted:
          "पूर्ण करें",

        cancelDeal:
          "सौदा रद्द करें",

        completedMessage:
          "यह सौदा पूरा हो चुका है।",

        cancelledMessage:
          "यह सौदा रद्द किया जा चुका है।"
      },

      // ========================================================
      // LOGIN
      // ========================================================
      login: {
        unableLoadBuyerBusinesses:
          "खरीदार व्यवसाय लोड नहीं हो सके।",

        buyerServiceUnavailable:
          "खरीदार सेवा उपलब्ध नहीं है।",

        buyerBackendError:
          "खरीदार सेवा से कनेक्ट नहीं हो सका।",

        enterName:
          "कृपया अपना नाम दर्ज करें।",

        enterEmail:
          "कृपया अपना ईमेल दर्ज करें।",

        createPassword:
          "कृपया पासवर्ड बनाएं।",

        passwordLength:
          "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",

        selectBuyerBusiness:
          "कृपया खरीदार व्यवसाय चुनें।",

        emailAlreadyExists:
          "इस ईमेल से खाता पहले से मौजूद है।",

        buyerNotFound:
          "खरीदार व्यवसाय नहीं मिला।",

        accountCreated:
          "खाता सफलतापूर्वक बनाया गया।",

        enterEmailPassword:
          "कृपया अपना ईमेल और पासवर्ड दर्ज करें।",

        accountNotFound:
          "खाता नहीं मिला।",

        incorrectPassword:
          "पासवर्ड गलत है।",

        buyerNotLinked:
          "कृपया खरीदार व्यवसाय चुनें।",

        tagline:
          "किसानों को बेहतर बाजारों से जोड़ना",

        login:
          "लॉगिन",

        createAccount:
          "खाता बनाएं",

        emailAddress:
          "ईमेल पता",

        enterEmailPlaceholder:
          "अपना ईमेल दर्ज करें",

        password:
          "पासवर्ड",

        enterPasswordPlaceholder:
          "अपना पासवर्ड दर्ज करें",

        loginToAgriConnect:
          "एग्रीकनेक्ट में लॉगिन करें",

        newToAgriConnect:
          "एग्रीकनेक्ट पर नए हैं?",

        fullName:
          "पूरा नाम",

        enterNamePlaceholder:
          "अपना पूरा नाम दर्ज करें",

        createPasswordPlaceholder:
          "पासवर्ड बनाएं",

        accountType:
          "खाता प्रकार",

        farmer:
          "किसान",

        buyer:
          "खरीदार",

        buyerBusiness:
          "खरीदार व्यवसाय",

        loadingBuyerBusinesses:
          "खरीदार व्यवसाय लोड हो रहे हैं...",

        noBuyerBusinesses:
          "कोई खरीदार व्यवसाय उपलब्ध नहीं है।",

        createAgriConnectAccount:
          "अपना एग्रीकनेक्ट खाता बनाएं",

        alreadyHaveAccount:
          "क्या आपका पहले से खाता है?"
      },

      // ========================================================
      // VOICE ASSISTANT
      // ========================================================
      voiceAssistant: {
        listening:
          "सुन रहा हूँ...",

        thinking:
          "सोच रहा हूँ...",

        speaking:
          "जवाब दे रहा हूँ...",

        ask:
          "एग्रीकनेक्ट से पूछें",

        unavailable:
          "वॉइस असिस्टेंट उपलब्ध नहीं है",

        noSupport:
          "आपका ब्राउज़र स्पीच रिकग्निशन को सपोर्ट नहीं करता।",

        micNeeded:
          "माइक्रोफोन की अनुमति चाहिए",

        micMessage:
          "कृपया एग्रीकनेक्ट के लिए माइक्रोफोन की अनुमति दें और फिर कोशिश करें।",

        preparing:
          "जवाब तैयार किया जा रहा है...",

        marketLoading:
          "माफ़ कीजिए, मैं अभी बाजार की कीमतों की जानकारी प्राप्त नहीं कर पा रहा हूँ। कृपया थोड़ी देर बाद कोशिश करें।",

        noCrop:
          "माफ़ कीजिए, मैं फसल की पहचान नहीं कर पाया। कृपया फसल का नाम फिर से बोलें।",

        marketCrop:
          "मैं टमाटर, प्याज़, आलू, गेहूँ, सोयाबीन और कपास की बाजार कीमत बता सकता हूँ। कृपया फसल का नाम बताएं।",

        finding:
          "बाजार की नवीनतम जानकारी खोज रहा हूँ...",

        speakQuestion:
          "अपना सवाल बोलें...",

        processing:
          "आपके सवाल को समझ रहा हूँ...",

        currentPrices:
          "एग्रीकनेक्ट की वर्तमान बाजार कीमतें इस प्रकार हैं।",

        highest:
          "उपलब्ध फसलों में सबसे अधिक",

        lowest:
          "उपलब्ध फसलों में सबसे कम"
      }
    }
  },

  // ==========================================================
  // MARATHI
  // ==========================================================
  mr: {
    translation: {
      // --------------------------------------------------------
      // COMMON / NAVBAR
      // --------------------------------------------------------
      home: "मुख्यपृष्ठ",
      marketPrices: "बाजार भाव",
      buyers: "खरेदीदार",
      cropHealth: "पीक आरोग्य",
      farmerDashboard: "शेतकरी डॅशबोर्ड",
      buyerDashboard: "खरेदीदार डॅशबोर्ड",
      deals: "व्यवहार",
      voiceAssistant: "व्हॉइस असिस्टंट",
      login: "लॉगिन",
      logout: "लॉगआउट",
      tagline: "आज शेती • उद्या जोडणी",

      // --------------------------------------------------------
      // HOME PAGE
      // --------------------------------------------------------
      smartAgriculture:
        "स्मार्ट कृषी प्लॅटफॉर्म",

      heroTitle1:
        "शेतकऱ्यांना चांगली शेती करण्यास मदत",

      heroTitle2:
        "आणि चांगल्या दरात विक्री करा",

      heroDescription:
        "AgriConnect शेतकऱ्यांना बाजारातील ताजे भाव, सत्यापित खरेदीदार, पीक आरोग्याची माहिती आणि चांगल्या बाजारपेठेच्या संधींशी जोडते.",

      explorePrices:
        "बाजार भाव पहा",

      findBuyers:
        "खरेदीदार शोधा",

      liveMarket:
        "थेट बाजार",

      todaysMarket:
        "आजचा बाजार",

      currentPrices:
        "सध्याचे कृषी बाजार भाव",

      pricesUpdated:
        "भाव नियमितपणे अपडेट केले जातात",

      liveAgriculturalPrices:
        "थेट कृषी बाजार भाव",

      marketDescription:
        "तुमचे उत्पादन कुठे विकायचे हे ठरवण्यापूर्वी सध्याचे मंडी भाव तपासा.",

      viewAllPrices:
        "सर्व बाजार भाव पहा",

      whatWeOffer:
        "AGRICONNECT काय देते",

      everythingFarmersNeed:
        "शेतकऱ्यांसाठी आवश्यक सर्व सुविधा एका प्लॅटफॉर्मवर",

      liveMarketPrices:
        "थेट बाजार भाव",

      marketFeature:
        "मंडीतील भावांची तुलना करा आणि तुमच्या उत्पादनासाठी चांगली बाजारपेठ निवडा.",

      viewPrices:
        "भाव पहा",

      verifiedBuyers:
        "सत्यापित खरेदीदार",

      buyersFeature:
        "कृषी उत्पादन खरेदी करणाऱ्या व्यवसायांशी थेट संपर्क साधा.",

      aiCropHealth:
        "AI पीक आरोग्य",

      cropFeature:
        "पीक आरोग्याच्या संभाव्य समस्या ओळखण्यासाठी AI चा वापर करा.",

      checkCrop:
        "पीक तपासा",

      // --------------------------------------------------------
      // BUYERS PAGE
      // --------------------------------------------------------
      buyerNetwork:
        "खरेदीदार नेटवर्क",

      buyerDescription:
        "शेतकऱ्यांना सत्यापित खरेदीदार, व्यापारी आणि व्यवसायांशी जोडा.",

      loadingBuyers:
        "खरेदीदार लोड होत आहेत...",

      connectingBuyerNetwork:
        "AgriConnect खरेदीदार नेटवर्कशी जोडले जात आहे.",

      buyerServiceUnavailable:
        "खरेदीदार सेवा उपलब्ध नाही",

      backendPortMessage:
        "तुमचा FastAPI बॅकएंड पोर्ट 8000 वर चालू असल्याची खात्री करा.",

      tryAgain:
        "पुन्हा प्रयत्न करा",

      searchCropBuyer:
        "पीक किंवा खरेदीदार शोधा...",

      allLocations:
        "सर्व ठिकाणे",

      availableBuyers:
        "उपलब्ध खरेदीदार",

      buyer:
        "खरेदीदार",

      buyers:
        "खरेदीदार",

      found:
        "सापडले",

      verifiedBuyer:
        "सत्यापित खरेदीदार",

      lookingFor:
        "आवश्यकता",

      quantity:
        "प्रमाण",

      offeredPrice:
        "प्रस्तावित किंमत",

      contactBuyer:
        "खरेदीदाराशी संपर्क करा",

      noBuyersFound:
        "कोणताही खरेदीदार सापडला नाही",

      changeSearchLocation:
        "तुमचा शोध किंवा ठिकाण बदलून पहा.",

      // --------------------------------------------------------
      // FARMER ACTIVITY
      // --------------------------------------------------------
      farmerActivity:
        "शेतकरी क्रियाकलाप",

      myContactRequests:
        "माझ्या संपर्क विनंत्या",

      request:
        "विनंती",

      requests:
        "विनंत्या",

      requestId:
        "विनंती आयडी",

      contactBuyerLabel:
        "खरेदीदाराशी संपर्क",

      interestedInSelling:
        "तुम्हाला विक्री करण्यात स्वारस्य आहे",

      location:
        "ठिकाण",

      requiredQuantity:
        "आवश्यक प्रमाण",

      sendingRequest:
        "विनंती पाठवत आहे...",

      sendContactRequest:
        "संपर्क विनंती पाठवा",

      requestSent:
        "विनंती पाठवली",

      contactRequestSent:
        "संपर्क विनंती पाठवली",

      requestSentTo:
        "तुमची विनंती पाठवली आहे",

      crop:
        "पीक",

      status:
        "स्थिती",

      pending:
        "प्रलंबित",

      viewMyRequests:
        "माझ्या विनंत्या पहा",

      loginToContactBuyers:
        "खरेदीदारांशी संपर्क साधण्यासाठी कृपया लॉगिन करा.",

      pendingRequestExists:
        "या खरेदीदारासाठी तुमची एक विनंती आधीपासून प्रलंबित आहे.",

      sendRequestError:
        "संपर्क विनंती पाठवता आली नाही. कृपया पुन्हा प्रयत्न करा.",

      // ========================================================
      // MARKET PRICES
      // ========================================================
      marketPrices: {
        intelligence:
          "बाजार माहिती",

        title:
          "कृषी बाजारभाव",

        description:
          "योग्य विक्री निर्णय घेण्यासाठी सध्याच्या बाजारभावांची तुलना करा.",

        demoData:
          "डेमो डेटा",

        governmentData:
          "शासकीय डेटा",

        lastUpdated:
          "शेवटचे अपडेट",

        demoExplanation:
          "दाखवलेले बाजारभाव अ‍ॅग्रीकनेक्ट बॅकएंडशी जोडलेले आहेत.",

        loading:
          "बाजारभाव लोड होत आहेत...",

        loadingDescription:
          "उपलब्ध ताजी कृषी बाजार माहिती मिळवत आहे.",

        unavailable:
          "बाजारभाव उपलब्ध नाहीत",

        loadError:
          "बाजारभाव लोड करता आले नाहीत.",

        tryAgain:
          "पुन्हा प्रयत्न करा",

        marketUnavailable:
          "बाजाराची माहिती सध्या उपलब्ध नाही.",

        modalPrice:
          "मॉडल भाव",

        minimum:
          "किमान",

        maximum:
          "कमाल",

        localVariety:
          "स्थानिक वाण",

        grade:
          "ग्रेड",

        listen:
          "ऐका",

        theMarket:
          "बाजार",

        speechMessage:
          "सध्याचा मॉडल भाव आहे",

        noData:
          "बाजार डेटा उपलब्ध नाही",

        noDataDescription:
          "बाजारभावाची माहिती लोड करता आली नाही.",

        refreshData:
          "डेटा रिफ्रेश करा",

        informedSelling:
          "माहितीच्या आधारे विक्रीचा निर्णय घ्या",

        informedSellingDescription:
          "उत्पादन विकण्यापूर्वी उपलब्ध बाजारांतील भावांची तुलना करा."
      },

      // ========================================================
      // CROP HEALTH
      // ========================================================
      cropHealth: {
        invalidImage:
          "कृपया वैध इमेज फाइल निवडा.",

        uploadFirst:
          "कृपया आधी पिकाचा फोटो अपलोड करा.",

        analysisError:
          "इमेजचे विश्लेषण करता आले नाही. कृपया पुन्हा प्रयत्न करा.",

        connectionError:
          "पिक विश्लेषण सेवेशी कनेक्ट करता आले नाही.",

        confidenceUncertain:
          "अनिश्चित",

        confidenceHigh:
          "उच्च",

        confidenceModerate:
          "मध्यम",

        confidenceLow:
          "कमी",

        label:
          "AI पिक आरोग्य विश्लेषण",

        title:
          "तुमच्या पिकाचे आरोग्य तपासा",

        description:
          "पिकाचा फोटो अपलोड करा आणि AI द्वारे त्याचे आरोग्य व संभाव्य रोगाचे विश्लेषण करा.",

        uploadTitle:
          "पिकाचा फोटो अपलोड करा",

        uploadDescription:
          "AI विश्लेषणासाठी पिकाचा स्पष्ट फोटो निवडा.",

        chooseImage:
          "इमेज निवडा",

        fileTypes:
          "JPG, JPEG, PNG",

        selectedCrop:
          "निवडलेले पीक",

        removeImage:
          "इमेज काढा",

        analyzing:
          "विश्लेषण करत आहे...",

        analyze:
          "पिकाचे विश्लेषण करा",

        aiAnalyzing:
          "AI तुमच्या पिकाचे विश्लेषण करत आहे...",

        modelProcessing:
          "AI मॉडेल इमेज प्रक्रिया करत आहे.",

        howItWorks:
          "हे कसे कार्य करते",

        uploadStep:
          "इमेज अपलोड करा",

        uploadStepDescription:
          "पिकाचा स्पष्ट फोटो निवडा.",

        aiAnalysisStep:
          "AI विश्लेषण",

        aiAnalysisStepDescription:
          "प्रशिक्षित मॉडेल पिकाचे विश्लेषण करते.",

        insightsStep:
          "माहिती मिळवा",

        insightsStepDescription:
          "आरोग्याची माहिती आणि शिफारसी मिळवा.",

        aiModel:
          "AI मॉडेल",

        analysisComplete:
          "विश्लेषण पूर्ण",

        reportTitle:
          "पिक आरोग्य अहवाल",

        reportDescription:
          "AI द्वारे तयार केलेले पिक आरोग्य विश्लेषण.",

        cropIdentified:
          "ओळखलेले पीक",

        unknown:
          "अज्ञात",

        healthStatus:
          "आरोग्य स्थिती",

        confidence:
          "विश्वास पातळी",

        aiConfidence:
          "AI विश्वास पातळी",

        diseaseIssue:
          "रोग / समस्या",

        noInformation:
          "माहिती उपलब्ध नाही",

        recommendation:
          "शिफारस",

        whatToDo:
          "काय करावे",

        noRecommendation:
          "शिफारस उपलब्ध नाही.",

        predictionDetails:
          "अंदाजाचे तपशील",

        topPredictions:
          "मुख्य अंदाज",

        technicalInformation:
          "तांत्रिक माहिती",

        aiService:
          "AI सेवा",

        predictionStatus:
          "अंदाज स्थिती",

        analysisCompleteSimple:
          "विश्लेषण पूर्ण",

        backend:
          "बॅकएंड",

        connected:
          "कनेक्टेड",

        serviceConnected:
          "AI विश्लेषण सेवा कनेक्टेड आहे.",

        betterDecisions:
          "चांगले पिक निर्णय",

        betterDecisionsDescription:
          "योग्य वेळी पिक व्यवस्थापनाचे निर्णय घेण्यासाठी AI माहिती वापरा."
      },

      // ========================================================
      // FARMER DASHBOARD
      // ========================================================
      farmerDashboard: {
        loadError:
          "शेतकरी डॅशबोर्ड लोड करता आला नाही.",

        dateNotAvailable:
          "तारीख उपलब्ध नाही",

        loginRequired:
          "लॉगिन आवश्यक",

        loginRequiredDescription:
          "डॅशबोर्ड पाहण्यासाठी कृपया शेतकरी म्हणून लॉगिन करा.",

        label:
          "शेतकरी डॅशबोर्ड",

        welcome:
          "स्वागत आहे",

        farmer:
          "शेतकरी",

        description:
          "खरेदीदारांच्या विनंत्या व्यवस्थापित करा, व्यवहारांचा मागोवा घ्या आणि कृषी संपर्क पहा.",

        refreshing:
          "रिफ्रेश होत आहे...",

        refresh:
          "रिफ्रेश",

        tryAgain:
          "पुन्हा प्रयत्न करा",

        pendingRequests:
          "प्रलंबित विनंत्या",

        accepted:
          "स्वीकारले",

        activeDeals:
          "सक्रिय व्यवहार",

        completedDeals:
          "पूर्ण व्यवहार",

        loading:
          "लोड होत आहे...",

        myBuyerRequests:
          "माझ्या खरेदीदार विनंत्या",

        myBuyerRequestsDescription:
          "तुमच्या उत्पादनात रस असलेल्या खरेदीदारांच्या विनंत्या पहा.",

        noBuyerRequests:
          "खरेदीदारांच्या विनंत्या नाहीत",

        noBuyerRequestsDescription:
          "तुमच्याकडे अद्याप कोणतीही खरेदीदार विनंती नाही.",

        browseBuyers:
          "खरेदीदार पहा",

        buyer:
          "खरेदीदार",

        locationNotAvailable:
          "ठिकाण उपलब्ध नाही",

        pending:
          "प्रलंबित",

        crop:
          "पीक",

        quantity:
          "प्रमाण",

        offeredPrice:
          "प्रस्तावित किंमत",

        requestDate:
          "विनंतीची तारीख",

        dealCreated:
          "व्यवहार तयार झाला",

        dealId:
          "व्यवहार ID",

        status:
          "स्थिती",

        estimatedValue:
          "अंदाजे मूल्य",

        dealSynchronizing:
          "व्यवहार सिंक्रोनाइझ होत आहे...",

        requestRejected:
          "विनंती नाकारली",

        requestId:
          "विनंती ID",

        myDeals:
          "माझे व्यवहार",

        myDealsDescription:
          "तुमच्या शेतकरी व्यवहारांचा आणि प्रगतीचा मागोवा घ्या.",

        noDeals:
          "व्यवहार नाहीत",

        noDealsDescription:
          "तुमच्याकडे अद्याप कोणतेही व्यवहार नाहीत.",

        deal:
          "व्यवहार",

        created:
          "तयार",

        request:
          "विनंती",

        activeDealMessage:
          "हा व्यवहार सध्या सक्रिय आहे.",

        completedDealMessage:
          "हा व्यवहार पूर्ण झाला आहे.",

        cancelledDealMessage:
          "हा व्यवहार रद्द करण्यात आला आहे."
      },

      // ========================================================
      // BUYER DASHBOARD
      // ========================================================
      buyerDashboard: {
        notLinked:
          "खरेदीदार खाते कोणत्याही खरेदीदार व्यवसायाशी जोडलेले नाही.",

        loadRequestsError:
          "खरेदीदार विनंत्या लोड करता आल्या नाहीत.",

        loadDealsError:
          "खरेदीदार व्यवहार लोड करता आले नाहीत.",

        unableRequests:
          "विनंत्या लोड करता आल्या नाहीत.",

        unableDeals:
          "व्यवहार लोड करता आले नाहीत.",

        unableDashboard:
          "डॅशबोर्ड लोड करता आला नाही.",

        unableUpdate:
          "विनंती अपडेट करता आली नाही.",

        updateTryAgain:
          "कृपया पुन्हा प्रयत्न करा.",

        portal:
          "खरेदीदार पोर्टल",

        title:
          "खरेदीदार डॅशबोर्ड",

        description:
          "शेतकरी विनंत्या, संपर्क आणि कृषी व्यवहार व्यवस्थापित करा.",

        loading:
          "खरेदीदार डॅशबोर्ड लोड होत आहे...",

        loadingDescription:
          "तुमच्या विनंत्या आणि व्यवहार मिळवत आहे.",

        unableLoad:
          "तुमचा डॅशबोर्ड लोड करता आला नाही.",

        tryAgain:
          "पुन्हा प्रयत्न करा",

        welcomeBack:
          "पुन्हा स्वागत आहे",

        manageNetwork:
          "तुमचे शेतकरी नेटवर्क आणि कृषी व्यवहार व्यवस्थापित करा.",

        loggedInAs:
          "लॉगिन म्हणून",

        buyerBusiness:
          "खरेदीदार व्यवसाय",

        buyerId:
          "खरेदीदार ID",

        totalRequests:
          "एकूण विनंत्या",

        pending:
          "प्रलंबित",

        accepted:
          "स्वीकारले",

        activeDeals:
          "सक्रिय व्यवहार",

        farmerConnections:
          "शेतकरी संपर्क",

        incomingRequests:
          "आलेल्या शेतकरी विनंत्या",

        refresh:
          "रिफ्रेश",

        noRequests:
          "विनंत्या नाहीत",

        noRequestsDescription:
          "तुमच्याकडे अद्याप कोणतीही शेतकरी विनंती नाही.",

        requestId:
          "विनंती ID",

        crop:
          "पीक",

        quantity:
          "प्रमाण",

        offeredPrice:
          "प्रस्तावित किंमत",

        requested:
          "विनंती केली",

        updating:
          "अपडेट होत आहे...",

        reject:
          "नकार द्या",

        accept:
          "स्वीकारा",

        requestAccepted:
          "विनंती स्वीकारली",

        dealCreated:
          "व्यवहार तयार झाला",

        dealId:
          "व्यवहार ID",

        status:
          "स्थिती",

        estimatedValue:
          "अंदाजे मूल्य",

        transactionTracked:
          "व्यवहार आता डील म्हणून ट्रॅक केला जात आहे.",

        acceptedContact:
          "संपर्क स्वीकारला",

        dealSynchronizing:
          "व्यवहार सिंक्रोनाइझ होत आहे...",

        rejectedContact:
          "संपर्क नाकारला",

        transactionManagement:
          "व्यवहार व्यवस्थापन",

        yourDeals:
          "तुमचे व्यवहार",

        cropDeal:
          "पिकाचा व्यवहार",

        farmer:
          "शेतकरी",

        created:
          "तयार",

        dealTracked:
          "व्यवहार ट्रॅक केला जात आहे."
      },

      // ========================================================
      // DEALS
      // ========================================================
      deals: {
        notLinked:
          "तुमचे खाते खरेदीदार किंवा शेतकरी प्रोफाइलशी जोडलेले नाही.",

        loginToView:
          "तुमचे व्यवहार पाहण्यासाठी कृपया लॉगिन करा.",

        unableLoad:
          "व्यवहार लोड करता आले नाहीत.",

        backendConnectionError:
          "बॅकएंडशी कनेक्ट करता आले नाही.",

        confirmCompleted:
          "हा व्यवहार पूर्ण म्हणून चिन्हांकित करायचा का?",

        confirmCancelled:
          "हा व्यवहार रद्द करायचा का?",

        unableUpdateStatus:
          "व्यवहाराची स्थिती अपडेट करता आली नाही.",

        unableUpdateTryAgain:
          "कृपया पुन्हा प्रयत्न करा.",

        loginRequired:
          "लॉगिन आवश्यक",

        loginRequiredDescription:
          "व्यवहार पाहण्यासाठी कृपया लॉगिन करा.",

        eyebrow:
          "व्यवहार व्यवस्थापन",

        title:
          "तुमचे व्यवहार",

        description:
          "कृषी व्यवहारांचा विनंतीपासून पूर्णतेपर्यंत मागोवा घ्या.",

        refreshing:
          "रिफ्रेश होत आहे...",

        refresh:
          "रिफ्रेश",

        totalDeals:
          "एकूण व्यवहार",

        active:
          "सक्रिय",

        completed:
          "पूर्ण",

        loading:
          "लोड होत आहे...",

        noDeals:
          "व्यवहार नाहीत",

        noBuyerDeals:
          "तुमच्याकडे अद्याप कोणतेही खरेदीदार व्यवहार नाहीत.",

        noFarmerDeals:
          "तुमच्याकडे अद्याप कोणतेही शेतकरी व्यवहार नाहीत.",

        management:
          "व्यवहार व्यवस्थापन",

        yourFarmerDeals:
          "तुमचे शेतकरी व्यवहार",

        yourBuyerDeals:
          "तुमचे खरेदीदार व्यवहार",

        deal:
          "व्यवहार",

        deals:
          "व्यवहार",

        dealId:
          "व्यवहार ID",

        crop:
          "पीक",

        quantity:
          "प्रमाण",

        offeredPrice:
          "प्रस्तावित किंमत",

        estimatedValue:
          "अंदाजे मूल्य",

        farmer:
          "शेतकरी",

        buyer:
          "खरेदीदार",

        farmerEmail:
          "शेतकऱ्याचा ईमेल",

        location:
          "ठिकाण",

        created:
          "तयार",

        activeMessage:
          "हा व्यवहार सध्या सक्रिय आहे.",

        updating:
          "अपडेट होत आहे...",

        markCompleted:
          "पूर्ण म्हणून चिन्हांकित करा",

        cancelDeal:
          "व्यवहार रद्द करा",

        completedMessage:
          "हा व्यवहार पूर्ण झाला आहे.",

        cancelledMessage:
          "हा व्यवहार रद्द करण्यात आला आहे."
      },

      // ========================================================
      // LOGIN
      // ========================================================
      login: {
        unableLoadBuyerBusinesses:
          "खरेदीदार व्यवसाय लोड करता आले नाहीत.",

        buyerServiceUnavailable:
          "खरेदीदार सेवा उपलब्ध नाही.",

        buyerBackendError:
          "खरेदीदार सेवेशी कनेक्ट करता आले नाही.",

        enterName:
          "कृपया तुमचे नाव भरा.",

        enterEmail:
          "कृपया तुमचा ईमेल भरा.",

        createPassword:
          "कृपया पासवर्ड तयार करा.",

        passwordLength:
          "पासवर्ड किमान 6 अक्षरांचा असावा.",

        selectBuyerBusiness:
          "कृपया खरेदीदार व्यवसाय निवडा.",

        emailAlreadyExists:
          "या ईमेलसह खाते आधीपासून अस्तित्वात आहे.",

        buyerNotFound:
          "खरेदीदार व्यवसाय सापडला नाही.",

        accountCreated:
          "खाते यशस्वीपणे तयार झाले.",

        enterEmailPassword:
          "कृपया तुमचा ईमेल आणि पासवर्ड भरा.",

        accountNotFound:
          "खाते सापडले नाही.",

        incorrectPassword:
          "पासवर्ड चुकीचा आहे.",

        buyerNotLinked:
          "कृपया खरेदीदार व्यवसाय निवडा.",

        tagline:
          "शेतकऱ्यांना चांगल्या बाजारपेठांशी जोडणे",

        login:
          "लॉगिन",

        createAccount:
          "खाते तयार करा",

        emailAddress:
          "ईमेल पत्ता",

        enterEmailPlaceholder:
          "तुमचा ईमेल भरा",

        password:
          "पासवर्ड",

        enterPasswordPlaceholder:
          "तुमचा पासवर्ड भरा",

        loginToAgriConnect:
          "अ‍ॅग्रीकनेक्टमध्ये लॉगिन करा",

        newToAgriConnect:
          "अ‍ॅग्रीकनेक्टवर नवीन आहात?",

        fullName:
          "पूर्ण नाव",

        enterNamePlaceholder:
          "तुमचे पूर्ण नाव भरा",

        createPasswordPlaceholder:
          "पासवर्ड तयार करा",

        accountType:
          "खाते प्रकार",

        farmer:
          "शेतकरी",

        buyer:
          "खरेदीदार",

        buyerBusiness:
          "खरेदीदार व्यवसाय",

        loadingBuyerBusinesses:
          "खरेदीदार व्यवसाय लोड होत आहेत...",

        noBuyerBusinesses:
          "खरेदीदार व्यवसाय उपलब्ध नाहीत.",

        createAgriConnectAccount:
          "तुमचे अ‍ॅग्रीकनेक्ट खाते तयार करा",

        alreadyHaveAccount:
          "आधीपासून खाते आहे?"
      },

      // ========================================================
      // VOICE ASSISTANT
      // ========================================================
      voiceAssistant: {
        listening:
          "ऐकत आहे...",

        thinking:
          "विचार करत आहे...",

        speaking:
          "उत्तर देत आहे...",

        ask:
          "अ‍ॅग्रीकनेक्टला विचारा",

        unavailable:
          "व्हॉइस असिस्टंट उपलब्ध नाही",

        noSupport:
          "तुमचा ब्राउझर स्पीच रिकग्निशनला सपोर्ट करत नाही.",

        micNeeded:
          "मायक्रोफोनची परवानगी आवश्यक आहे",

        micMessage:
          "कृपया अ‍ॅग्रीकनेक्टसाठी मायक्रोफोनची परवानगी द्या आणि पुन्हा प्रयत्न करा.",

        preparing:
          "उत्तर तयार करत आहे...",

        marketLoading:
          "माफ करा, सध्या बाजारभावाची माहिती मिळत नाही. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.",

        noCrop:
          "माफ करा, मला पीक ओळखता आले नाही. कृपया पिकाचे नाव पुन्हा सांगा.",

        marketCrop:
          "मी टोमॅटो, कांदा, बटाटा, गहू, सोयाबीन आणि कापूस यांचे बाजारभाव सांगू शकतो. कृपया पिकाचे नाव सांगा.",

        finding:
          "बाजारातील नवीनतम माहिती शोधत आहे...",

        speakQuestion:
          "तुमचा प्रश्न बोला...",

        processing:
          "तुमचा प्रश्न समजून घेत आहे...",

        currentPrices:
          "अ‍ॅग्रीकनेक्टचे सध्याचे बाजारभाव पुढीलप्रमाणे आहेत.",

        highest:
          "उपलब्ध पिकांमध्ये सर्वाधिक",

        lowest:
          "उपलब्ध पिकांमध्ये सर्वात कमी"
      }
    }
  }
};

// ==========================================================
// INITIALIZE I18NEXT
// ==========================================================

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    fallbackLng: "en",

    supportedLngs: ["en", "hi", "mr"],

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"]
    },

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;