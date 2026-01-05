import tensorflow as tf
import numpy as np
import cv2
import os
from fastapi import FastAPI
from tensorflow.keras.applications import EfficientNetB3
from tensorflow.keras import layers, models

app = FastAPI()

IMG_SIZE = (300, 300)
CLASS_NAMES = ["COVID", "Normal", "Viral Pneumonia"]
NUM_CLASSES = 3

model = None


def load_model():
    global model
    if model is not None:
        return model

    print("🟡 Rebuilding model architecture...")

    base_model = EfficientNetB3(
        weights=None,                 # IMPORTANT
        include_top=False,
        input_shape=(300, 300, 3)
    )

    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.BatchNormalization(),
        layers.Dense(256, activation="relu"),
        layers.Dropout(0.4),
        layers.Dense(NUM_CLASSES, activation="softmax"),
    ])

    print("🟡 Loading weights only...")
    model.load_weights("models/xray_classifier_b3_3class1.keras")

    # warmup
    model.predict(np.zeros((1, 300, 300, 3)))

    print("✅ Model ready")
    return model


@app.post("/predict")
def predict(image_path: str):
    model = load_model()

    if not os.path.exists(image_path):
        return {"error": "Image not found"}

    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, IMG_SIZE)
    img = img / 255.0

    x = np.expand_dims(img, axis=0)

    preds = model.predict(x)[0]
    idx = int(np.argmax(preds))

    return {
        "predictedClass": CLASS_NAMES[idx],
        "confidence": float(preds[idx]),
        "predictions": {
            CLASS_NAMES[i]: float(preds[i]) for i in range(NUM_CLASSES)
        },
    }