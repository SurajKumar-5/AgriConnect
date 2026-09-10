from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
from io import BytesIO
from datetime import datetime
from typing import Optional
import os
import json
import uuid
import requests
import re
import threading
from dotenv import load_dotenv
from plant_disease_model import analyze_plant


# ============================================================
# AGRICONNECT BACKEND
# ============================================================

load_dotenv()

app = FastAPI(
    title="AgriConnect API",
    description="Smart Agriculture Platform Backend",
    version="1.3.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://agri-connect-12o4pmu66-agri-connect3.vercel.app",
        "https://agri-connect-seven-umber.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DATA.GOV.IN CONFIGURATION
# ============================================================

DATA_GOV_API_KEY = os.getenv("DATA_GOV_API_KEY")

DATA_GOV_RESOURCE_ID = (
    "9ef84268-d588-465a-a308-a864a43d0070"
)

DATA_GOV_URL = (
    f"https://api.data.gov.in/resource/"
    f"{DATA_GOV_RESOURCE_ID}"
)


# ============================================================
# CONTACT REQUEST STORAGE
# ============================================================

CONTACT_REQUESTS_FILE = os.path.join(
    os.path.dirname(__file__),
    "contact_requests.json"
)


def load_contact_requests():
    """
    Load contact requests from local JSON file.
    """
    try:
        if not os.path.exists(CONTACT_REQUESTS_FILE):
            return []

        with open(
            CONTACT_REQUESTS_FILE,
            "r",
            encoding="utf-8"
        ) as file:
            data = json.load(file)

        if isinstance(data, list):
            return data

        return []

    except Exception as e:
        print(
            "Unable to load contact requests:",
            str(e)
        )
        return []


def save_contact_requests(requests_data):
    """
    Save contact requests to local JSON file.
    """
    try:
        with open(
            CONTACT_REQUESTS_FILE,
            "w",
            encoding="utf-8"
        ) as file:
            json.dump(
                requests_data,
                file,
                indent=2,
                ensure_ascii=False
            )

        return True

    except Exception as e:
        print(
            "Unable to save contact requests:",
            str(e)
        )
        return False


# ============================================================
# DEAL STORAGE
# ============================================================

DEALS_FILE = os.path.join(
    os.path.dirname(__file__),
    "deals.json"
)


# ============================================================
# SHARED FILE LOCK
# ============================================================

DEAL_LOCK = threading.Lock()


# ============================================================
# DEAL LOADING
# ============================================================

def load_deals():
    """
    Load deals from local JSON file.

    Duplicate protection:
    If multiple deals have the same contactRequestId,
    only the first one is returned.

    This protects the application even if old duplicate
    records are present in deals.json.
    """
    try:
        if not os.path.exists(DEALS_FILE):
            return []

        with open(
            DEALS_FILE,
            "r",
            encoding="utf-8"
        ) as file:
            data = json.load(file)

        if not isinstance(data, list):
            return []

        unique_deals = []
        seen_request_ids = set()

        for deal in data:

            if not isinstance(deal, dict):
                continue

            request_id = deal.get(
                "contactRequestId"
            )

            if not request_id:
                unique_deals.append(deal)
                continue

            if request_id in seen_request_ids:

                print(
                    "⚠️ Duplicate deal ignored:",
                    deal.get("id"),
                    "for request:",
                    request_id
                )

                continue

            seen_request_ids.add(
                request_id
            )

            unique_deals.append(
                deal
            )

        return unique_deals

    except Exception as e:

        print(
            "Unable to load deals:",
            str(e)
        )

        return []


def save_deals(deals_data):
    """
    Save deals to local JSON file.
    """
    try:
        with open(
            DEALS_FILE,
            "w",
            encoding="utf-8"
        ) as file:
            json.dump(
                deals_data,
                file,
                indent=2,
                ensure_ascii=False
            )

        return True

    except Exception as e:

        print(
            "Unable to save deals:",
            str(e)
        )

        return False


# ============================================================
# CONTACT REQUEST MODELS
# ============================================================

class ContactRequestCreate(BaseModel):
    farmerName: str
    farmerEmail: str
    buyerId: int
    buyerName: str
    buyerLocation: str
    crop: str
    quantity: str
    offeredPrice: str


class ContactRequestStatusUpdate(BaseModel):
    status: str


# ============================================================
# DEAL MODELS
# ============================================================

class DealStatusUpdate(BaseModel):
    status: str


# ============================================================
# GENERAL HELPERS
# ============================================================

def normalize_text(value):
    """
    Normalize text for reliable duplicate comparison.
    """
    if value is None:
        return ""

    return " ".join(
        str(value)
        .strip()
        .lower()
        .split()
    )


# ============================================================
# CONTACT REQUEST TRANSACTION KEY
# ============================================================

def get_transaction_key_from_request(
    contact_request
):
    """
    Generate the logical transaction key.

    Same transaction means:
        farmer email + buyer ID + crop

    Quantity and price are intentionally NOT included.
    """

    farmer_email = normalize_text(
        contact_request.get(
            "farmerEmail"
        )
    )

    buyer_id = str(
        contact_request.get(
            "buyerId",
            ""
        )
    ).strip()

    crop = normalize_text(
        contact_request.get(
            "crop"
        )
    )

    return (
        farmer_email,
        buyer_id,
        crop
    )


# ============================================================
# DEAL KEYS
# ============================================================

def get_deal_key_from_request(
    contact_request
):
    """
    Generate the logical transaction key.

    Same active transaction means:
        farmer + buyer + crop
    """

    return get_transaction_key_from_request(
        contact_request
    )


def get_deal_key_from_deal(deal):
    """
    Generate the same logical transaction key
    for an existing deal.
    """

    farmer_email = normalize_text(
        deal.get(
            "farmerEmail"
        )
    )

    buyer_id = str(
        deal.get(
            "buyerId",
            ""
        )
    ).strip()

    crop = normalize_text(
        deal.get(
            "crop"
        )
    )

    return (
        farmer_email,
        buyer_id,
        crop
    )


def is_active_deal(deal):
    """
    Return True only for currently active deals.
    """

    return normalize_text(
        deal.get(
            "status"
        )
    ) == "active"


# ============================================================
# DATE SORTING HELPER
# ============================================================

def creation_sort_key(item):
    """
    Safely sort stored records by creation time.
    """

    value = item.get(
        "createdAt",
        ""
    )

    if value is None:
        return ""

    return str(value)


# ============================================================
# PRICE / QUANTITY HELPERS
# ============================================================

def extract_first_number(value):
    """
    Extract first number from a string.

    Example:
        500 kg -> 500
    """

    if value is None:
        return None

    text = str(value).replace(
        ",",
        ""
    )

    match = re.search(
        r"\d+(?:\.\d+)?",
        text
    )

    if not match:
        return None

    try:

        return float(
            match.group(0)
        )

    except ValueError:

        return None


def extract_price_range(value):
    """
    Extract price numbers.

    Examples:
        ₹30–35/kg -> 30, 35
        ₹30-35/kg -> 30, 35
        ₹35/kg    -> 35, 35
    """

    if value is None:
        return None, None

    text = str(value).replace(
        ",",
        ""
    )

    numbers = re.findall(
        r"\d+(?:\.\d+)?",
        text
    )

    if not numbers:
        return None, None

    try:

        prices = [
            float(number)
            for number in numbers
        ]

        if len(prices) == 1:

            return (
                prices[0],
                prices[0]
            )

        return (
            prices[0],
            prices[1]
        )

    except ValueError:

        return None, None


def calculate_deal_value(
    quantity,
    offered_price
):
    """
    Calculate estimated total deal value.
    """

    quantity_kg = extract_first_number(
        quantity
    )

    min_price, max_price = (
        extract_price_range(
            offered_price
        )
    )

    if (
        quantity_kg is None
        or min_price is None
        or max_price is None
    ):

        return {

            "quantityKg":
                None,

            "minPricePerKg":
                None,

            "maxPricePerKg":
                None,

            "estimatedTotalMin":
                None,

            "estimatedTotalMax":
                None,

            "estimatedTotalValue":
                "Not available"
        }

    total_min = (
        quantity_kg * min_price
    )

    total_max = (
        quantity_kg * max_price
    )

    if total_min == total_max:

        total_value = (
            f"₹{total_min:,.0f}"
        )

    else:

        total_value = (
            f"₹{total_min:,.0f} – "
            f"₹{total_max:,.0f}"
        )

    return {

        "quantityKg":
            round(
                quantity_kg,
                2
            ),

        "minPricePerKg":
            round(
                min_price,
                2
            ),

        "maxPricePerKg":
            round(
                max_price,
                2
            ),

        "estimatedTotalMin":
            round(
                total_min,
                2
            ),

        "estimatedTotalMax":
            round(
                total_max,
                2
            ),

        "estimatedTotalValue":
            total_value
    }


# ============================================================
# FIND EXISTING ACTIVE DEAL
# ============================================================

def find_existing_active_deal(
    contact_request,
    deals_data
):
    """
    Find an existing active deal for:
        farmer + buyer + crop
    """

    target_key = get_deal_key_from_request(
        contact_request
    )

    for deal in deals_data:

        if not is_active_deal(
            deal
        ):
            continue

        if (
            get_deal_key_from_deal(
                deal
            )
            == target_key
        ):

            return deal

    return None


# ============================================================
# CREATE OR REUSE DEAL
# ============================================================

def create_deal_from_request(
    contact_request,
    deals_data
):
    """
    Create a deal from an accepted contact request.

    Duplicate protection:

    1. Exact contactRequestId
    2. Same farmer + buyer + crop active deal

    Therefore multiple accepted requests cannot create
    multiple ACTIVE deals for the same transaction.
    """

    request_id = contact_request.get(
        "id"
    )

    # --------------------------------------------------------
    # CHECK 1:
    # Exact contact request already linked
    # --------------------------------------------------------

    for existing_deal in deals_data:

        if (
            existing_deal.get(
                "contactRequestId"
            )
            == request_id
        ):

            print(
                "♻️ Existing deal reused:",
                existing_deal.get("id"),
                "for request:",
                request_id
            )

            return existing_deal

    # --------------------------------------------------------
    # CHECK 2:
    # Same farmer + buyer + crop already active
    # --------------------------------------------------------

    existing_active_deal = (
        find_existing_active_deal(
            contact_request,
            deals_data
        )
    )

    if existing_active_deal:

        print(
            "♻️ Existing active deal reused:",
            existing_active_deal.get(
                "id"
            )
        )

        return existing_active_deal

    # --------------------------------------------------------
    # CALCULATE DEAL VALUE
    # --------------------------------------------------------

    value_data = calculate_deal_value(
        contact_request.get(
            "quantity"
        ),
        contact_request.get(
            "offeredPrice"
        )
    )

    now = datetime.now().isoformat()

    # --------------------------------------------------------
    # CREATE NEW DEAL
    # --------------------------------------------------------

    deal = {

        "id":
            f"DEAL-{uuid.uuid4().hex[:10].upper()}",

        "contactRequestId":
            request_id,

        "farmerName":
            contact_request.get(
                "farmerName"
            ),

        "farmerEmail":
            contact_request.get(
                "farmerEmail"
            ),

        "buyerId":
            contact_request.get(
                "buyerId"
            ),

        "buyerName":
            contact_request.get(
                "buyerName"
            ),

        "buyerLocation":
            contact_request.get(
                "buyerLocation"
            ),

        "crop":
            contact_request.get(
                "crop"
            ),

        "quantity":
            contact_request.get(
                "quantity"
            ),

        "offeredPrice":
            contact_request.get(
                "offeredPrice"
            ),

        "quantityKg":
            value_data[
                "quantityKg"
            ],

        "minPricePerKg":
            value_data[
                "minPricePerKg"
            ],

        "maxPricePerKg":
            value_data[
                "maxPricePerKg"
            ],

        "estimatedTotalMin":
            value_data[
                "estimatedTotalMin"
            ],

        "estimatedTotalMax":
            value_data[
                "estimatedTotalMax"
            ],

        "estimatedTotalValue":
            value_data[
                "estimatedTotalValue"
            ],

        "status":
            "Active",

        "createdAt":
            now,

        "updatedAt":
            now
    }

    deals_data.append(
        deal
    )

    print(
        "🆕 New deal created:",
        deal["id"]
    )

    return deal


# ============================================================
# CLEAN DUPLICATE ACTIVE DEALS
# ============================================================

def cleanup_duplicate_active_deals():
    """
    Clean duplicate ACTIVE deals already stored.

    For each:
        farmer + buyer + crop

    combination, only ONE active deal is kept.

    The oldest active deal is preserved.

    Completed and Cancelled deals remain untouched.
    """

    with DEAL_LOCK:

        deals_data = load_deals()

        if not deals_data:

            print(
                "🤝 No deals found. "
                "Duplicate cleanup skipped."
            )

            return

        kept_deals = []

        seen_active_keys = set()

        removed_deals = []

        deals_data_sorted = sorted(
            deals_data,
            key=creation_sort_key
        )

        for deal in deals_data_sorted:

            if not is_active_deal(
                deal
            ):

                kept_deals.append(
                    deal
                )

                continue

            deal_key = (
                get_deal_key_from_deal(
                    deal
                )
            )

            if deal_key in seen_active_keys:

                removed_deals.append(
                    deal
                )

                print(
                    "🧹 Removing duplicate "
                    "active deal:",
                    deal.get("id")
                )

                continue

            seen_active_keys.add(
                deal_key
            )

            kept_deals.append(
                deal
            )

        if removed_deals:

            if save_deals(
                kept_deals
            ):

                print(
                    "🧹 Duplicate deal cleanup complete."
                )

                print(
                    "Removed duplicate deals:",
                    len(removed_deals)
                )

            else:

                print(
                    "❌ Could not save cleaned deals."
                )

        else:

            print(
                "✅ No duplicate active deals found."
            )


# ============================================================
# CLEAN DUPLICATE CONTACT REQUESTS
# ============================================================

def cleanup_duplicate_contact_requests():
    """
    Clean duplicate contact requests caused by previous
    versions of the application.

    Rules:

    1. Group requests by:
         farmer email + buyer ID + crop

    2. If one or more ACCEPTED requests exist:
         - Keep the oldest ACCEPTED request.
         - Remove duplicate ACCEPTED requests.
         - Remove duplicate PENDING requests for the
           same transaction.
         - Preserve rejected historical requests.

    3. If no ACCEPTED request exists:
         - Keep the oldest PENDING request.
         - Remove duplicate PENDING requests.
         - Preserve rejected historical requests.

    4. The canonical request can then be linked to the
       single canonical deal during synchronization.

    This prevents the Buyer Dashboard from showing:
         Accepted = 3

    when there is actually only one transaction.
    """

    with DEAL_LOCK:

        requests_data = (
            load_contact_requests()
        )

        if not requests_data:

            print(
                "📨 No contact requests found. "
                "Request cleanup skipped."
            )

            return

        # ----------------------------------------------------
        # Group requests by logical transaction.
        # ----------------------------------------------------

        groups = {}

        for item in requests_data:

            if not isinstance(
                item,
                dict
            ):
                continue

            transaction_key = (
                get_transaction_key_from_request(
                    item
                )
            )

            if transaction_key not in groups:

                groups[
                    transaction_key
                ] = []

            groups[
                transaction_key
            ].append(
                item
            )

        kept_requests = []

        removed_requests = []

        # ----------------------------------------------------
        # Process every transaction group.
        # ----------------------------------------------------

        for transaction_key, group in groups.items():

            # Oldest first.
            group_sorted = sorted(
                group,
                key=creation_sort_key
            )

            accepted_requests = [

                item

                for item in group_sorted

                if normalize_text(
                    item.get(
                        "status"
                    )
                )
                == "accepted"

            ]

            pending_requests = [

                item

                for item in group_sorted

                if normalize_text(
                    item.get(
                        "status"
                    )
                )
                == "pending"

            ]

            rejected_requests = [

                item

                for item in group_sorted

                if normalize_text(
                    item.get(
                        "status"
                    )
                )
                == "rejected"

            ]

            # ------------------------------------------------
            # CASE 1:
            # Accepted transaction exists.
            # ------------------------------------------------

            if accepted_requests:

                canonical_request = (
                    accepted_requests[0]
                )

                kept_requests.append(
                    canonical_request
                )

                # Remove duplicate accepted requests.
                for duplicate in (
                    accepted_requests[1:]
                ):

                    removed_requests.append(
                        duplicate
                    )

                    print(
                        "🧹 Removing duplicate "
                        "accepted request:",
                        duplicate.get("id"),
                        "keeping:",
                        canonical_request.get("id")
                    )

                # Remove pending requests for an already
                # accepted transaction.
                for duplicate in (
                    pending_requests
                ):

                    removed_requests.append(
                        duplicate
                    )

                    print(
                        "🧹 Removing stale pending "
                        "request:",
                        duplicate.get("id"),
                        "because accepted request exists:",
                        canonical_request.get("id")
                    )

                # Preserve rejected historical requests.
                for rejected in (
                    rejected_requests
                ):

                    kept_requests.append(
                        rejected
                    )

            # ------------------------------------------------
            # CASE 2:
            # No accepted transaction exists.
            # ------------------------------------------------

            elif pending_requests:

                canonical_request = (
                    pending_requests[0]
                )

                kept_requests.append(
                    canonical_request
                )

                # Remove duplicate pending requests.
                for duplicate in (
                    pending_requests[1:]
                ):

                    removed_requests.append(
                        duplicate
                    )

                    print(
                        "🧹 Removing duplicate "
                        "pending request:",
                        duplicate.get("id"),
                        "keeping:",
                        canonical_request.get("id")
                    )

                # Preserve rejected history.
                for rejected in (
                    rejected_requests
                ):

                    kept_requests.append(
                        rejected
                    )

            # ------------------------------------------------
            # CASE 3:
            # Only rejected history exists.
            # ------------------------------------------------

            else:

                for rejected in (
                    rejected_requests
                ):

                    kept_requests.append(
                        rejected
                    )

        # ----------------------------------------------------
        # Preserve original ordering.
        # ----------------------------------------------------

        kept_requests = sorted(
            kept_requests,
            key=creation_sort_key
        )

        # ----------------------------------------------------
        # Save if changes were made.
        # ----------------------------------------------------

        if removed_requests:

            if save_contact_requests(
                kept_requests
            ):

                print(
                    "🧹 Contact request cleanup complete."
                )

                print(
                    "Removed duplicate/stale requests:",
                    len(
                        removed_requests
                    )
                )

                print(
                    "Remaining requests:",
                    len(
                        kept_requests
                    )
                )

            else:

                print(
                    "❌ Could not save cleaned "
                    "contact requests."
                )

        else:

            print(
                "✅ No duplicate contact requests found."
            )


# ============================================================
# LINK CANONICAL ACCEPTED REQUESTS TO DEALS
# ============================================================

def link_accepted_requests_to_existing_deals():
    """
    After duplicate cleanup, make sure accepted requests
    point to the canonical active deal.

    If a deal is linked to an older duplicate request,
    the deal is reassigned to the canonical request.
    """

    with DEAL_LOCK:

        requests_data = (
            load_contact_requests()
        )

        deals_data = (
            load_deals()
        )

        if not requests_data:

            return

        changed_requests = False
        changed_deals = False

        # ----------------------------------------------------
        # Process accepted requests.
        # ----------------------------------------------------

        for contact_request in requests_data:

            if normalize_text(
                contact_request.get(
                    "status"
                )
            ) != "accepted":

                continue

            existing_deal = (
                find_existing_active_deal(
                    contact_request,
                    deals_data
                )
            )

            if not existing_deal:

                continue

            canonical_deal_id = (
                existing_deal.get(
                    "id"
                )
            )

            # Link request → deal.
            if contact_request.get(
                "dealId"
            ) != canonical_deal_id:

                contact_request[
                    "dealId"
                ] = canonical_deal_id

                contact_request[
                    "updatedAt"
                ] = datetime.now().isoformat()

                changed_requests = True

                print(
                    "🔗 Linked accepted request:",
                    contact_request.get("id"),
                    "→",
                    canonical_deal_id
                )

            # ------------------------------------------------
            # Make deal point to canonical request.
            # ------------------------------------------------

            if existing_deal.get(
                "contactRequestId"
            ) != contact_request.get(
                "id"
            ):

                existing_deal[
                    "contactRequestId"
                ] = contact_request.get(
                    "id"
                )

                existing_deal[
                    "updatedAt"
                ] = datetime.now().isoformat()

                changed_deals = True

                print(
                    "🔗 Updated deal:",
                    existing_deal.get("id"),
                    "→ request",
                    contact_request.get("id")
                )

        # ----------------------------------------------------
        # Save changes.
        # ----------------------------------------------------

        if changed_deals:

            if not save_deals(
                deals_data
            ):

                print(
                    "⚠️ Unable to save canonical "
                    "deal links."
                )

        if changed_requests:

            if not save_contact_requests(
                requests_data
            ):

                print(
                    "⚠️ Unable to save canonical "
                    "request links."
                )


# ============================================================
# BASIC ROUTES
# ============================================================

@app.get("/")
def root():

    return {

        "message":
            "AgriConnect Backend is running",

        "status":
            "connected"
    }


@app.get("/health")
def health():

    return {

        "status":
            "healthy",

        "service":
            "AgriConnect Backend",

        "timestamp":
            datetime.now().isoformat()
    }


# ============================================================
# CROP NAME EXTRACTION
# ============================================================

def extract_crop_name(label):

    if not label:
        return "Unknown"

    text = str(label).strip()

    text = text.replace(
        "___",
        " "
    )

    text = text.replace(
        "__",
        " "
    )

    text = text.replace(
        "_",
        " "
    )

    text = text.replace(
        "-",
        " "
    )

    text = " ".join(
        text.split()
    )

    crop_names = [

        "Apple",
        "Blueberry",
        "Cherry",
        "Corn",
        "Grape",
        "Orange",
        "Peach",
        "Pepper",
        "Potato",
        "Raspberry",
        "Soybean",
        "Squash",
        "Strawberry",
        "Tomato",
        "Wheat"
    ]

    lower_text = text.lower()

    for crop in crop_names:

        if crop.lower() in lower_text:
            return crop

    words = text.split()

    if words:
        return words[0].capitalize()

    return "Unknown"


# ============================================================
# SAFE CONFIDENCE CONVERSION
# ============================================================

def safe_confidence(value):

    try:

        confidence = float(
            value
        )

    except (
        TypeError,
        ValueError
    ):

        return 0.0

    if confidence != confidence:
        return 0.0

    if confidence < 0:
        return 0.0

    if confidence > 100:
        return 100.0

    return confidence


# ============================================================
# CONFIDENCE LEVEL
# ============================================================

def get_confidence_level(
    confidence
):

    confidence = safe_confidence(
        confidence
    )

    if confidence >= 80:
        return "High"

    if confidence >= 60:
        return "Moderate"

    if confidence >= 40:
        return "Low"

    return "Very low"


# ============================================================
# HEALTH STATUS
# ============================================================

def get_health_status(
    confidence
):

    confidence = safe_confidence(
        confidence
    )

    if confidence >= 80:
        return "High confidence"

    if confidence >= 60:
        return "Moderate confidence"

    if confidence >= 40:
        return "Low confidence"

    return "Very low confidence"


# ============================================================
# PREDICTION MARGIN
# ============================================================

def get_prediction_margin(
    predictions
):

    if (
        not predictions
        or len(predictions) < 2
    ):

        return None

    first = safe_confidence(
        predictions[0].get(
            "confidence",
            0
        )
    )

    second = safe_confidence(
        predictions[1].get(
            "confidence",
            0
        )
    )

    return round(
        first - second,
        2
    )


# ============================================================
# UNCERTAINTY CHECK
# ============================================================

def is_uncertain_prediction(
    confidence,
    margin
):

    confidence = safe_confidence(
        confidence
    )

    if confidence < 40:
        return True

    if (
        margin is not None
        and margin < 8
    ):

        return True

    return False


# ============================================================
# RECOMMENDATION
# ============================================================

def get_recommendation(
    confidence,
    disease_name,
    margin=None,
    uncertain=False
):

    confidence = safe_confidence(
        confidence
    )

    if confidence < 40:

        return (
            "The AI prediction has very low confidence. "
            "Please upload a clear close-up image of the leaf "
            "or affected crop part with good lighting and minimal "
            "background. Avoid blurry images. The result should "
            "be verified with a local agricultural expert before "
            "taking treatment decisions."
        )

    if (
        uncertain
        and margin is not None
        and margin < 8
    ):

        return (
            "The AI detected a possible issue, but the prediction "
            "is ambiguous because multiple conditions received "
            "similar confidence scores. Please upload a clearer "
            "close-up image of the affected area with good lighting "
            "and minimal background. Verify the result with a local "
            "agricultural expert before taking treatment decisions."
        )

    if confidence < 60:

        return (
            "The AI prediction has limited confidence. "
            "Please upload a clearer image showing the affected "
            "leaf or crop area. Good lighting and a close-up view "
            "can improve analysis. Verify the result with a local "
            "agricultural expert before taking treatment decisions."
        )

    if confidence < 80:

        return (
            f"The AI model detected {disease_name} with moderate "
            "confidence. Consider uploading a clearer close-up "
            "image for additional confirmation. Please verify the "
            "result with a local agricultural expert before taking "
            "treatment decisions."
        )

    return (
        f"The AI model detected {disease_name} with high confidence. "
        "For important treatment decisions, the result should still "
        "be verified with a local agricultural expert."
    )


# ============================================================
# NORMALIZE PREDICTIONS
# ============================================================

def normalize_predictions(
    raw_predictions
):

    if not raw_predictions:
        return []

    cleaned_predictions = []

    for prediction in raw_predictions:

        if not isinstance(
            prediction,
            dict
        ):

            continue

        label = prediction.get(
            "label",
            "Unknown"
        )

        confidence = safe_confidence(
            prediction.get(
                "confidence",
                0
            )
        )

        cleaned_predictions.append(

            {
                "label":
                    str(label),

                "confidence":
                    round(
                        confidence,
                        2
                    )
            }
        )

    cleaned_predictions.sort(
        key=lambda item:
            item["confidence"],
        reverse=True
    )

    return cleaned_predictions


# ============================================================
# CROP HEALTH AI ANALYSIS
# ============================================================

@app.post("/api/crop/analyze")
async def analyze_crop(
    file: UploadFile = File(...)
):

    print("")
    print("=" * 60)
    print("🌱 NEW CROP ANALYSIS REQUEST")
    print("=" * 60)

    print(
        "Filename:",
        file.filename
    )

    print(
        "Content type:",
        file.content_type
    )

    try:

        if not file.filename:

            return {

                "success":
                    False,

                "message":
                    "No image file was uploaded."
            }

        if (
            file.content_type
            and not file.content_type.startswith(
                "image/"
            )
        ):

            return {

                "success":
                    False,

                "message":
                    "Please upload a valid image file."
            }

        image_bytes = await file.read()

        if not image_bytes:

            return {

                "success":
                    False,

                "message":
                    "The uploaded image is empty."
            }

        print(
            "Image bytes received:",
            len(image_bytes)
        )

        image = Image.open(
            BytesIO(image_bytes)
        ).convert("RGB")

        width, height = image.size

        print(
            f"Image loaded successfully: "
            f"{width} x {height}"
        )

        print(
            "Running Plant Disease AI..."
        )

        raw_predictions = analyze_plant(
            image,
            top_k=5
        )

        print(
            "Raw AI predictions:",
            raw_predictions
        )

        predictions = normalize_predictions(
            raw_predictions
        )

        if not predictions:

            print(
                "ERROR: AI returned no valid predictions."
            )

            return {

                "success":
                    False,

                "message":
                    "AI model returned no valid predictions.",

                "ai_status":
                    "No valid prediction"
            }

        best_prediction = predictions[0]

        predicted_label = (
            best_prediction.get(
                "label",
                "Unknown"
            )
        )

        top_confidence = safe_confidence(
            best_prediction.get(
                "confidence",
                0
            )
        )

        prediction_margin = (
            get_prediction_margin(
                predictions
            )
        )

        confidence_level = (
            get_confidence_level(
                top_confidence
            )
        )

        health_status = (
            get_health_status(
                top_confidence
            )
        )

        uncertain = (
            is_uncertain_prediction(
                top_confidence,
                prediction_margin
            )
        )

        crop_name = (
            extract_crop_name(
                predicted_label
            )
        )

        if uncertain:

            disease_name = (
                "Uncertain prediction"
            )

        else:

            disease_name = (
                predicted_label
            )

        recommendation = (
            get_recommendation(
                confidence=top_confidence,
                disease_name=predicted_label,
                margin=prediction_margin,
                uncertain=uncertain
            )
        )

        if top_confidence < 40:

            prediction_status = (
                "Very low confidence"
            )

        elif uncertain:

            prediction_status = (
                "Ambiguous prediction"
            )

        elif top_confidence < 60:

            prediction_status = (
                "Low confidence"
            )

        elif top_confidence < 80:

            prediction_status = (
                "Moderate confidence"
            )

        else:

            prediction_status = (
                "High confidence"
            )

        result = {

            "success":
                True,

            "filename":
                file.filename,

            "crop":
                crop_name,

            "health":
                health_status,

            "confidence":
                round(
                    top_confidence,
                    2
                ),

            "confidence_level":
                confidence_level,

            "prediction_status":
                prediction_status,

            "prediction_margin":
                prediction_margin,

            "uncertain":
                uncertain,

            "disease":
                disease_name,

            "recommendation":
                recommendation,

            "image_width":
                width,

            "image_height":
                height,

            "ai_model":
                "ResNet50 Plant Disease Model",

            "predictions":
                predictions,

            "backend":
                "Connected",

            "ai_status":
                "Plant disease inference successful"
        }

        print("")
        print(
            "✅ CROP ANALYSIS SUCCESSFUL"
        )

        print(
            "Crop:",
            crop_name
        )

        print(
            "Disease:",
            disease_name
        )

        print(
            "Confidence:",
            top_confidence
        )

        print(
            "Confidence level:",
            confidence_level
        )

        print(
            "Prediction status:",
            prediction_status
        )

        print(
            "Prediction margin:",
            prediction_margin
        )

        print(
            "Uncertain:",
            uncertain
        )

        print("=" * 60)
        print("")

        return result

    except Exception as e:

        print("")
        print("=" * 60)
        print("❌ CROP ANALYSIS ERROR")
        print("=" * 60)

        print(
            "Error:",
            str(e)
        )

        print("=" * 60)
        print("")

        return {

            "success":
                False,

            "error":
                str(e),

            "message":
                (
                    "Unable to analyze the uploaded image. "
                    "Please check that the AI model is loaded "
                    "and try again."
                ),

            "ai_status":
                "Analysis failed"
        }


# ============================================================
# BUYERS
# ============================================================

@app.get("/api/buyers")
def get_buyers():

    return {

        "success":
            True,

        "source":
            "AgriConnect Buyer Service",

        "count":
            6,

        "data": [

            {
                "id": 1,
                "name": "FreshFarm Foods",
                "category": "Food Processing",
                "location": "Pune, Maharashtra",
                "crop": "Tomato",
                "quantity": "500 kg",
                "price": "₹30–35/kg",
                "verified": True,
                "icon": "🏭"
            },

            {
                "id": 2,
                "name": "Nashik Agro Traders",
                "category": "Agricultural Trader",
                "location": "Nashik, Maharashtra",
                "crop": "Onion",
                "quantity": "1000 kg",
                "price": "₹26–30/kg",
                "verified": True,
                "icon": "🚜"
            },

            {
                "id": 3,
                "name": "GreenHarvest Organics",
                "category": "Organic Produce",
                "location": "Mumbai, Maharashtra",
                "crop": "Potato",
                "quantity": "300 kg",
                "price": "₹23–27/kg",
                "verified": True,
                "icon": "🌱"
            },

            {
                "id": 4,
                "name": "Maharashtra Grain Co.",
                "category": "Grain Buyer",
                "location": "Nagpur, Maharashtra",
                "crop": "Wheat",
                "quantity": "2000 kg",
                "price": "₹28–32/kg",
                "verified": True,
                "icon": "🌾"
            },

            {
                "id": 5,
                "name": "Latur Soy Foods",
                "category": "Food Manufacturer",
                "location": "Latur, Maharashtra",
                "crop": "Soybean",
                "quantity": "1500 kg",
                "price": "₹44–48/kg",
                "verified": True,
                "icon": "🏢"
            },

            {
                "id": 6,
                "name": "Vidarbha Cotton Traders",
                "category": "Cotton Buyer",
                "location": "Akola, Maharashtra",
                "crop": "Cotton",
                "quantity": "2500 kg",
                "price": "₹70–76/kg",
                "verified": True,
                "icon": "🌿"
            }

        ]
    }


# ============================================================
# CONTACT REQUESTS
# ============================================================

@app.post("/api/contact-requests")
def create_contact_request(
    request: ContactRequestCreate
):

    try:

        with DEAL_LOCK:

            requests_data = (
                load_contact_requests()
            )

            deals_data = (
                load_deals()
            )

            # ------------------------------------------------
            # PREVENT DUPLICATE PENDING REQUESTS
            # ------------------------------------------------

            target_key = (
                get_transaction_key_from_request(
                    {
                        "farmerEmail":
                            request.farmerEmail,

                        "buyerId":
                            request.buyerId,

                        "crop":
                            request.crop
                    }
                )
            )

            for existing in requests_data:

                existing_key = (
                    get_transaction_key_from_request(
                        existing
                    )
                )

                if (
                    existing_key == target_key
                    and normalize_text(
                        existing.get(
                            "status"
                        )
                    ) == "pending"
                ):

                    return {

                        "success":
                            False,

                        "message":
                            (
                                "You already have a pending "
                                "request for this buyer."
                            ),

                        "request":
                            existing
                    }

            # ------------------------------------------------
            # PREVENT NEW REQUEST WHILE ACTIVE DEAL EXISTS
            # ------------------------------------------------

            existing_active_deal = (
                find_existing_active_deal(
                    {
                        "farmerEmail":
                            request.farmerEmail,

                        "buyerId":
                            request.buyerId,

                        "crop":
                            request.crop
                    },

                    deals_data
                )
            )

            if existing_active_deal:

                return {

                    "success":
                        False,

                    "message":
                        (
                            "An active deal already exists "
                            "for this farmer, buyer and crop."
                        ),

                    "deal":
                        existing_active_deal
                }

            # ------------------------------------------------
            # CREATE REQUEST
            # ------------------------------------------------

            now = datetime.now().isoformat()

            new_request = {

                "id":
                    f"REQ-{uuid.uuid4().hex[:10].upper()}",

                "farmerName":
                    request.farmerName,

                "farmerEmail":
                    request.farmerEmail,

                "buyerId":
                    request.buyerId,

                "buyerName":
                    request.buyerName,

                "buyerLocation":
                    request.buyerLocation,

                "crop":
                    request.crop,

                "quantity":
                    request.quantity,

                "offeredPrice":
                    request.offeredPrice,

                "status":
                    "Pending",

                "createdAt":
                    now,

                "updatedAt":
                    now
            }

            requests_data.append(
                new_request
            )

            if not save_contact_requests(
                requests_data
            ):

                raise HTTPException(
                    status_code=500,
                    detail=(
                        "Unable to save contact request."
                    )
                )

            return {

                "success":
                    True,

                "message":
                    "Contact request created successfully.",

                "request":
                    new_request
            }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Contact request creation error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to create contact request."
            )
        )


# ============================================================
# FARMER CONTACT REQUESTS
# ============================================================

@app.get(
    "/api/contact-requests/farmer/{email}"
)
def get_farmer_contact_requests(
    email: str
):

    try:

        requests_data = (
            load_contact_requests()
        )

        farmer_requests = [

            request

            for request in requests_data

            if normalize_text(
                request.get(
                    "farmerEmail",
                    ""
                )
            )
            ==
            normalize_text(
                email
            )

        ]

        return {

            "success":
                True,

            "count":
                len(
                    farmer_requests
                ),

            "data":
                farmer_requests
        }

    except Exception as e:

        print(
            "Farmer request error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to load farmer requests."
            )
        )


# ============================================================
# BUYER CONTACT REQUESTS
# ============================================================

@app.get(
    "/api/contact-requests/buyer/{buyer_id}"
)
def get_buyer_contact_requests(
    buyer_id: int
):

    try:

        requests_data = (
            load_contact_requests()
        )

        buyer_requests = [

            request

            for request in requests_data

            if request.get(
                "buyerId"
            )
            == buyer_id

        ]

        return {

            "success":
                True,

            "count":
                len(
                    buyer_requests
                ),

            "data":
                buyer_requests
        }

    except Exception as e:

        print(
            "Buyer request error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to load buyer requests."
            )
        )


# ============================================================
# UPDATE CONTACT REQUEST STATUS
# ============================================================

@app.put(
    "/api/contact-requests/{request_id}/status"
)
def update_contact_request_status(
    request_id: str,
    request: ContactRequestStatusUpdate
):

    allowed_statuses = [
        "Pending",
        "Accepted",
        "Rejected"
    ]

    if request.status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid status. "
                "Use Pending, Accepted or Rejected."
            )
        )

    try:

        with DEAL_LOCK:

            requests_data = (
                load_contact_requests()
            )

            deals_data = (
                load_deals()
            )

            found_request = None

            # ------------------------------------------------
            # FIND REQUEST
            # ------------------------------------------------

            for item in requests_data:

                if item.get(
                    "id"
                ) == request_id:

                    found_request = item
                    break

            if not found_request:

                raise HTTPException(
                    status_code=404,
                    detail=(
                        "Contact request not found."
                    )
                )

            # ------------------------------------------------
            # EXTRA PROTECTION:
            # Do not accept a duplicate request if an
            # active deal already exists for the same
            # farmer + buyer + crop.
            # ------------------------------------------------

            if request.status == "Accepted":

                existing_active_deal = (
                    find_existing_active_deal(
                        found_request,
                        deals_data
                    )
                )

                if existing_active_deal:

                    found_request[
                        "status"
                    ] = "Accepted"

                    found_request[
                        "dealId"
                    ] = (
                        existing_active_deal[
                            "id"
                        ]
                    )

                    found_request[
                        "updatedAt"
                    ] = (
                        datetime.now().isoformat()
                    )

                    if not save_contact_requests(
                        requests_data
                    ):

                        raise HTTPException(
                            status_code=500,
                            detail=(
                                "Unable to save contact "
                                "request."
                            )
                        )

                    return {

                        "success":
                            True,

                        "message":
                            (
                                "Request accepted and "
                                "existing active deal linked."
                            ),

                        "request":
                            found_request,

                        "deal":
                            existing_active_deal
                    }

            # ------------------------------------------------
            # UPDATE STATUS
            # ------------------------------------------------

            found_request["status"] = (
                request.status
            )

            found_request["updatedAt"] = (
                datetime.now().isoformat()
            )

            created_deal = None

            # ------------------------------------------------
            # ACCEPTED → CREATE OR REUSE DEAL
            # ------------------------------------------------

            if request.status == "Accepted":

                created_deal = (
                    create_deal_from_request(
                        found_request,
                        deals_data
                    )
                )

                found_request["dealId"] = (
                    created_deal["id"]
                )

                if not save_deals(
                    deals_data
                ):

                    raise HTTPException(
                        status_code=500,
                        detail=(
                            "Request was accepted but "
                            "deal could not be saved."
                        )
                    )

            # ------------------------------------------------
            # SAVE REQUEST
            # ------------------------------------------------

            if not save_contact_requests(
                requests_data
            ):

                raise HTTPException(
                    status_code=500,
                    detail=(
                        "Unable to update contact request."
                    )
                )

            response = {

                "success":
                    True,

                "message":
                    "Contact request status updated.",

                "request":
                    found_request
            }

            if created_deal:

                response["deal"] = (
                    created_deal
                )

            return response

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Request status update error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to update request status."
            )
        )


# ============================================================
# DEALS
# ============================================================

@app.get("/api/deals")
def get_all_deals():

    try:

        deals_data = (
            load_deals()
        )

        return {

            "success":
                True,

            "count":
                len(
                    deals_data
                ),

            "data":
                deals_data
        }

    except Exception as e:

        print(
            "Deal loading error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to load deals."
            )
        )


# ============================================================
# FARMER DEALS
# ============================================================

@app.get(
    "/api/deals/farmer/{email}"
)
def get_farmer_deals(
    email: str
):

    try:

        deals_data = (
            load_deals()
        )

        farmer_deals = [

            deal

            for deal in deals_data

            if normalize_text(
                deal.get(
                    "farmerEmail",
                    ""
                )
            )
            ==
            normalize_text(
                email
            )

        ]

        return {

            "success":
                True,

            "count":
                len(
                    farmer_deals
                ),

            "data":
                farmer_deals
        }

    except Exception as e:

        print(
            "Farmer deals error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to load farmer deals."
            )
        )


# ============================================================
# BUYER DEALS
# ============================================================

@app.get(
    "/api/deals/buyer/{buyer_id}"
)
def get_buyer_deals(
    buyer_id: int
):

    try:

        deals_data = (
            load_deals()
        )

        buyer_deals = [

            deal

            for deal in deals_data

            if deal.get(
                "buyerId"
            )
            == buyer_id

        ]

        return {

            "success":
                True,

            "count":
                len(
                    buyer_deals
                ),

            "data":
                buyer_deals
        }

    except Exception as e:

        print(
            "Buyer deals error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to load buyer deals."
            )
        )


# ============================================================
# SINGLE DEAL
# ============================================================

@app.get(
    "/api/deals/{deal_id}"
)
def get_deal(
    deal_id: str
):

    try:

        deals_data = (
            load_deals()
        )

        for deal in deals_data:

            if deal.get(
                "id"
            ) == deal_id:

                return {

                    "success":
                        True,

                    "deal":
                        deal
                }

        raise HTTPException(
            status_code=404,
            detail="Deal not found."
        )

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Single deal error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to load deal."
            )
        )


# ============================================================
# UPDATE DEAL STATUS
# ============================================================

@app.put(
    "/api/deals/{deal_id}/status"
)
def update_deal_status(
    deal_id: str,
    request: DealStatusUpdate
):

    allowed_statuses = [
        "Active",
        "Completed",
        "Cancelled"
    ]

    if request.status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid deal status. "
                "Use Active, Completed or Cancelled."
            )
        )

    try:

        with DEAL_LOCK:

            deals_data = (
                load_deals()
            )

            found_deal = None

            for deal in deals_data:

                if deal.get(
                    "id"
                ) == deal_id:

                    found_deal = deal
                    break

            if not found_deal:

                raise HTTPException(
                    status_code=404,
                    detail="Deal not found."
                )

            found_deal["status"] = (
                request.status
            )

            found_deal["updatedAt"] = (
                datetime.now().isoformat()
            )

            if not save_deals(
                deals_data
            ):

                raise HTTPException(
                    status_code=500,
                    detail=(
                        "Unable to save deal status."
                    )
                )

            return {

                "success":
                    True,

                "message":
                    "Deal status updated successfully.",

                "deal":
                    found_deal
            }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Deal status update error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to update deal status."
            )
        )


# ============================================================
# SYNC ACCEPTED REQUESTS TO DEALS
# ============================================================

def sync_accepted_requests_to_deals():
    """
    Synchronize accepted contact requests into deals.

    Each canonical accepted request has exactly one deal.

    Existing active deals are reused.
    Missing deals are created.
    """

    try:

        with DEAL_LOCK:

            requests_data = (
                load_contact_requests()
            )

            deals_data = (
                load_deals()
            )

            changed_requests = False
            changed_deals = False

            created_count = 0
            reused_count = 0

            for contact_request in requests_data:

                if normalize_text(
                    contact_request.get(
                        "status"
                    )
                ) != "accepted":

                    continue

                request_id = (
                    contact_request.get(
                        "id"
                    )
                )

                if not request_id:
                    continue

                # --------------------------------------------
                # CHECK LINKED DEAL
                # --------------------------------------------

                linked_deal = None

                linked_deal_id = (
                    contact_request.get(
                        "dealId"
                    )
                )

                if linked_deal_id:

                    for deal in deals_data:

                        if deal.get(
                            "id"
                        ) == linked_deal_id:

                            linked_deal = deal
                            break

                if linked_deal:

                    continue

                # --------------------------------------------
                # FIND ACTIVE DEAL
                # --------------------------------------------

                existing_active_deal = (
                    find_existing_active_deal(
                        contact_request,
                        deals_data
                    )
                )

                if existing_active_deal:

                    contact_request["dealId"] = (
                        existing_active_deal["id"]
                    )

                    changed_requests = True
                    reused_count += 1

                    print(
                        "♻️ Existing deal linked to "
                        "accepted request:",
                        request_id,
                        "→",
                        existing_active_deal["id"]
                    )

                    continue

                # --------------------------------------------
                # CREATE MISSING DEAL
                # --------------------------------------------

                new_deal = (
                    create_deal_from_request(
                        contact_request,
                        deals_data
                    )
                )

                contact_request["dealId"] = (
                    new_deal["id"]
                )

                changed_requests = True
                changed_deals = True
                created_count += 1

            # ------------------------------------------------
            # SAVE DEALS
            # ------------------------------------------------

            if changed_deals:

                if not save_deals(
                    deals_data
                ):

                    print(
                        "⚠️ Unable to save synchronized deals."
                    )

            # ------------------------------------------------
            # SAVE REQUEST LINKS
            # ------------------------------------------------

            if changed_requests:

                if not save_contact_requests(
                    requests_data
                ):

                    print(
                        "⚠️ Unable to save request "
                        "deal links."
                    )

            print(
                "🤝 Deal synchronization complete."
            )

            print(
                "Deals created:",
                created_count
            )

            print(
                "Existing deals reused:",
                reused_count
            )

            print(
                "Total deals:",
                len(
                    deals_data
                )
            )

    except Exception as e:

        print(
            "Deal synchronization error:",
            str(e)
        )


# ============================================================
# DEMO MARKET DATA
# ============================================================

def get_demo_market_data():

    today = datetime.now().strftime(
        "%Y-%m-%d"
    )

    return [

        {
            "commodity":
                "Tomato",

            "variety":
                "Local",

            "grade":
                "A",

            "market":
                "Pune Market",

            "district":
                "Pune",

            "state":
                "Maharashtra",

            "minPrice":
                2800,

            "maxPrice":
                3600,

            "modalPrice":
                3200,

            "arrivalDate":
                today,

            "icon":
                "🍅",

            "trend":
                "Rising"
        },

        {
            "commodity":
                "Onion",

            "variety":
                "Red",

            "grade":
                "A",

            "market":
                "Nashik Market",

            "district":
                "Nashik",

            "state":
                "Maharashtra",

            "minPrice":
                2200,

            "maxPrice":
                3200,

            "modalPrice":
                2800,

            "arrivalDate":
                today,

            "icon":
                "🧅",

            "trend":
                "Stable"
        },

        {
            "commodity":
                "Potato",

            "variety":
                "Local",

            "grade":
                "A",

            "market":
                "Mumbai Market",

            "district":
                "Mumbai",

            "state":
                "Maharashtra",

            "minPrice":
                2000,

            "maxPrice":
                2800,

            "modalPrice":
                2400,

            "arrivalDate":
                today,

            "icon":
                "🥔",

            "trend":
                "Stable"
        },

        {
            "commodity":
                "Wheat",

            "variety":
                "Local",

            "grade":
                "A",

            "market":
                "Nagpur Market",

            "district":
                "Nagpur",

            "state":
                "Maharashtra",

            "minPrice":
                2600,

            "maxPrice":
                3400,

            "modalPrice":
                3000,

            "arrivalDate":
                today,

            "icon":
                "🌾",

            "trend":
                "Rising"
        },

        {
            "commodity":
                "Soybean",

            "variety":
                "Local",

            "grade":
                "A",

            "market":
                "Latur Market",

            "district":
                "Latur",

            "state":
                "Maharashtra",

            "minPrice":
                4200,

            "maxPrice":
                5000,

            "modalPrice":
                4600,

            "arrivalDate":
                today,

            "icon":
                "🫘",

            "trend":
                "Stable"
        },

        {
            "commodity":
                "Cotton",

            "variety":
                "Local",

            "grade":
                "A",

            "market":
                "Akola Market",

            "district":
                "Akola",

            "state":
                "Maharashtra",

            "minPrice":
                6800,

            "maxPrice":
                7800,

            "modalPrice":
                7300,

            "arrivalDate":
                today,

            "icon":
                "🌿",

            "trend":
                "Rising"
        }

    ]


# ============================================================
# MARKET PRICES
# ============================================================

@app.get("/api/market-prices")
def market_prices(
    state: Optional[str] = None,
    district: Optional[str] = None,
    market: Optional[str] = None,
    commodity: Optional[str] = None,
    limit: int = 20
):

    try:

        if not DATA_GOV_API_KEY:

            data = (
                get_demo_market_data()
            )

            if commodity:

                data = [

                    item

                    for item in data

                    if item[
                        "commodity"
                    ].lower()
                    ==
                    commodity.lower()

                ]

            return {

                "success":
                    True,

                "source":
                    "AgriConnect Demo Market Service",

                "demo":
                    True,

                "updated":
                    datetime.now().strftime(
                        "%Y-%m-%d %H:%M:%S"
                    ),

                "count":
                    len(data),

                "data":
                    data[:limit]
            }

        params = {

            "api-key":
                DATA_GOV_API_KEY,

            "format":
                "json",

            "offset":
                0,

            "limit":
                limit
        }

        if state:

            params[
                "filters[state.keyword]"
            ] = state

        if district:

            params[
                "filters[district]"
            ] = district

        if market:

            params[
                "filters[market]"
            ] = market

        if commodity:

            params[
                "filters[commodity]"
            ] = commodity

        response = requests.get(
            DATA_GOV_URL,
            params=params,
            timeout=8
        )

        response.raise_for_status()

        result = response.json()

        records = result.get(
            "records",
            []
        )

        formatted_data = []

        for item in records:

            formatted_data.append({

                "commodity":
                    item.get(
                        "commodity"
                    ),

                "variety":
                    item.get(
                        "variety"
                    ),

                "grade":
                    item.get(
                        "grade"
                    ),

                "market":
                    item.get(
                        "market"
                    ),

                "district":
                    item.get(
                        "district"
                    ),

                "state":
                    item.get(
                        "state"
                    ),

                "minPrice":
                    item.get(
                        "min_price"
                    ),

                "maxPrice":
                    item.get(
                        "max_price"
                    ),

                "modalPrice":
                    item.get(
                        "modal_price"
                    ),

                "arrivalDate":
                    item.get(
                        "arrival_date"
                    ),

                "icon":
                    "🌾",

                "trend":
                    "Stable"
            })

        if not formatted_data:

            demo_data = (
                get_demo_market_data()
            )

            return {

                "success":
                    True,

                "source":
                    "AgriConnect Demo Market Service",

                "demo":
                    True,

                "message":
                    "Government API returned no records",

                "count":
                    len(
                        demo_data
                    ),

                "data":
                    demo_data[:limit]
            }

        return {

            "success":
                True,

            "source":
                "Government of India - data.gov.in",

            "demo":
                False,

            "updated":
                datetime.now().strftime(
                    "%Y-%m-%d %H:%M:%S"
                ),

            "count":
                len(
                    formatted_data
                ),

            "data":
                formatted_data
        }

    except requests.exceptions.RequestException as e:

        print(
            "Government market API error:",
            str(e)
        )

        data = (
            get_demo_market_data()
        )

        if commodity:

            data = [

                item

                for item in data

                if item[
                    "commodity"
                ].lower()
                ==
                commodity.lower()

            ]

        return {

            "success":
                True,

            "source":
                "AgriConnect Demo Market Service",

            "demo":
                True,

            "message":
                "Government API temporarily unavailable",

            "count":
                len(data),

            "data":
                data[:limit]
        }

    except Exception as e:

        return {

            "success":
                False,

            "message":
                "Market price service error",

            "error":
                str(e),

            "data":
                []
        }


# ============================================================
# SINGLE COMMODITY PRICE
# ============================================================

@app.get(
    "/api/market-prices/{commodity}"
)
def get_commodity_price(
    commodity: str
):

    try:

        data = (
            get_demo_market_data()
        )

        matching_data = [

            item

            for item in data

            if item[
                "commodity"
            ].lower()
            ==
            commodity.lower()

        ]

        if not matching_data:

            return {

                "success":
                    False,

                "commodity":
                    commodity,

                "message":
                    "Commodity not found",

                "count":
                    0,

                "data":
                    []
            }

        return {

            "success":
                True,

            "commodity":
                commodity,

            "source":
                "AgriConnect Market Service",

            "count":
                len(
                    matching_data
                ),

            "data":
                matching_data
        }

    except Exception as e:

        return {

            "success":
                False,

            "commodity":
                commodity,

            "message":
                "Unable to fetch commodity price",

            "error":
                str(e),

            "data":
                []
        }


# ============================================================
# STARTUP
# ============================================================

@app.on_event("startup")
async def startup_event():

    print("")
    print("=" * 60)
    print("🌱 AgriConnect Backend")
    print("=" * 60)

    print(
        "Server: http://127.0.0.1:8000"
    )

    print(
        "Docs:   http://127.0.0.1:8000/docs"
    )

    print(
        "Health: http://127.0.0.1:8000/health"
    )

    print(
        "AI:     /api/crop/analyze"
    )

    print(
        "Buyers: /api/buyers"
    )

    print(
        "Requests: /api/contact-requests"
    )

    print(
        "Deals:  /api/deals"
    )

    print(
        "Market: /api/market-prices"
    )

    print("=" * 60)
    print("")

    # --------------------------------------------------------
    # STEP 1:
    # Clean duplicate active deals.
    # --------------------------------------------------------

    cleanup_duplicate_active_deals()

    # --------------------------------------------------------
    # STEP 2:
    # Clean duplicate contact requests.
    # --------------------------------------------------------

    cleanup_duplicate_contact_requests()

    # --------------------------------------------------------
    # STEP 3:
    # Synchronize accepted requests with deals.
    # --------------------------------------------------------

    sync_accepted_requests_to_deals()

    # --------------------------------------------------------
    # STEP 4:
    # Make sure canonical requests and deals point
    # to each other.
    # --------------------------------------------------------

    link_accepted_requests_to_existing_deals()

    print("")
    print(
        "✅ AgriConnect startup initialization complete."
    )
    print("")