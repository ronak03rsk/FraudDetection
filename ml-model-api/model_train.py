import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

# Load dataset
df = pd.read_csv("creditcard.csv")

# Drop 'Time' (not needed)
df = df.drop(columns=['Time'])

# Define features and labels
X = df.drop(columns=['Class'])  # All features
y = df['Class']                 # 0 = Not Fraud, 1 = Fraud

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# Save the model
joblib.dump(model, "fraud_model.pkl")
print("Model saved as fraud_model.pkl")
