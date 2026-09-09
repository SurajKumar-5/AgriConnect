import torch
import timm

from PIL import Image
from timm.data import resolve_model_data_config, create_transform


# ============================================================
# AGRICONNECT AI MODEL
# ============================================================

print("Loading AgriConnect ResNet50 AI model...")

# Load pretrained ResNet50
# This is the model that we already successfully downloaded.
model = timm.create_model(
    "resnet50",
    pretrained=True
)

# Evaluation mode
model.eval()

# Get the correct preprocessing configuration for this model
data_config = resolve_model_data_config(model)

transform = create_transform(
    **data_config,
    is_training=False
)

print("AgriConnect AI model loaded successfully!")
print("Model: ResNet50")
print("Input size:", data_config["input_size"])
print("Classes:", model.num_classes)


# ============================================================
# IMAGE CLASSIFICATION
# ============================================================

def analyze_image(image: Image.Image, top_k: int = 5):

    # Make sure image is RGB
    image = image.convert("RGB")

    # Prepare image
    image_tensor = transform(image).unsqueeze(0)

    # Run inference without calculating gradients
    with torch.no_grad():
        output = model(image_tensor)

    # Convert model output to probabilities
    probabilities = torch.nn.functional.softmax(
        output[0],
        dim=0
    )

    # Get top predictions
    values, indices = torch.topk(
        probabilities,
        min(top_k, model.num_classes)
    )

    predictions = []

    for value, index in zip(values, indices):

        predictions.append({
            "class_index": int(index.item()),
            "confidence": round(float(value.item()) * 100, 2)
        })

    return predictions


# ============================================================
# TEST FUNCTION
# ============================================================

if __name__ == "__main__":

    print("")
    print("=" * 60)
    print("AGRICONNECT AI MODEL TEST")
    print("=" * 60)
    print("")
    print("Model is ready for image analysis.")
    print("")