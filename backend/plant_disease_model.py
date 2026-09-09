from transformers import pipeline
from PIL import Image


print("Loading AgriConnect Plant Disease AI...")

MODEL_NAME = "A2H0H0R1/resnet-50-plant-disease"

classifier = pipeline(
    "image-classification",
    model=MODEL_NAME,
    device=-1
)

print("Plant Disease AI loaded successfully!")
print("Classes:", classifier.model.config.num_labels)


def analyze_plant(image: Image.Image, top_k: int = 5):

    image = image.convert("RGB")

    results = classifier(
        image,
        top_k=top_k
    )

    predictions = []

    for result in results:

        predictions.append({
            "label": result["label"],
            "confidence": round(
                float(result["score"]) * 100,
                2
            )
        })

    return predictions


if __name__ == "__main__":

    print("")
    print("=" * 60)
    print("AGRICONNECT PLANT DISEASE AI TEST")
    print("=" * 60)
    print("")
    print("Model is ready.")