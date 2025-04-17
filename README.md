# PayKrypt

PayKrypt is an advanced fraud detection system for financial transactions, designed to identify fraudulent payment activities using machine learning techniques.

## Project Overview

This project aims to build a robust fraud detection model by leveraging synthetic data generated based on patterns from the IEEE-CIS Fraud Detection dataset. It includes comprehensive data preprocessing, feature engineering, and multiple machine learning models to accurately identify fraudulent transactions.

## Dataset Generation

The project uses the IEEE-CIS Fraud Detection competition dataset from Kaggle as a reference for data generation:
[IEEE-CIS Fraud Detection Competition](https://www.kaggle.com/competitions/ieee-fraud-detection/data)

The IEEE dataset serves as a basis for generating synthetic transaction data with the following characteristics:
- Transaction identifiers and timestamps
- Payment amounts and methods
- Card information
- Address data
- Email domains
- Device information
- Various engineered features (C1-C14, D1-D15, V1-V339, etc.)

This approach allows us to create controlled test scenarios while maintaining realistic transaction patterns.

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/paykrypt.git
cd paykrypt

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download dataset
# Place the downloaded files in the 'data' directory
```

## Data Preprocessing

The project includes extensive data preprocessing steps for the generated data:
- Feature engineering based on transaction time
- Quantile and power transformations for numeric features
- Dimensionality reduction techniques (ICA, Random Projections)
- Probabilistic encoding for categorical variables
- Handling of missing values

All preprocessing and data generation steps are implemented in `data_preprocess.ipynb`.

## Usage

1. Run the data preprocessing notebook:
```bash
jupyter notebook data_preprocess.ipynb
```

2. Train the model:
```bash
python train_model.py
```

3. Make predictions:
```bash
python predict.py
```

## Project Structure

```
paykrypt/
│
├── data/                  # Data files
│   ├── generated_data/    # Generated synthetic data
│   └── reference_data/    # IEEE dataset (for reference only)
│
├── notebooks/             # Jupyter notebooks
│   ├── data_preprocess.ipynb
│   └── data_generation.ipynb
│
├── src/                   # Source code
│   ├── data_generation/   # Data generation modules
│   ├── preprocessing/
│   ├── models/
│   └── evaluation/
│
├── requirements.txt       # Dependencies
└── README.md              # This file
```

## License

[Your License Here]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.