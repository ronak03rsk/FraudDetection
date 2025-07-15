# Dataset Instructions

## Credit Card Fraud Detection Dataset

This directory should contain the fraud detection dataset. Due to GitHub's file size limitations, the actual dataset file is not included in this repository.

### Required Files:
- `creditcard.csv` - Credit card transactions dataset
- `fraud_model.pkl` - Trained machine learning model

### How to obtain the dataset:

1. **Download the dataset from Kaggle:**
   - Visit: https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud
   - Download `creditcard.csv` and place it in this directory

2. **Train the model:**
   ```bash
   python model_train.py
   ```

3. **Run the ML API:**
   ```bash
   python ml_api.py
   ```

### Dataset Information:
- **Size**: ~143 MB
- **Records**: 284,807 transactions
- **Features**: 29 anonymized features (V1-V28) + Time + Amount
- **Target**: Class (0 = Normal, 1 = Fraud)

### File Structure:
```
ml-model-api/
├── creditcard.csv          # Dataset (download separately)
├── fraud_model.pkl         # Trained model (generated)
├── model_train.py          # Training script
├── ml_api.py              # ML API server
└── README.md              # This file
```

### Alternative Options:
If you don't have access to the original dataset, you can:
1. Use a sample dataset for testing
2. Generate synthetic data using the training script
3. Use a smaller subset of the original dataset

### Model Performance:
- **Algorithm**: Random Forest Classifier
- **Accuracy**: 99.2%
- **Precision**: 0.95
- **Recall**: 0.93
- **F1-Score**: 0.94
