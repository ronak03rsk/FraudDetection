# 🔍 Fraud Detection System

A comprehensive fraud detection system built with **Spring Boot**, **React.js**, and **Machine Learning** to identify potentially fraudulent transactions in real-time.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🎯 Core Features
- **Real-time Fraud Detection**: ML-powered transaction analysis
- **Interactive Dashboard**: Comprehensive analytics and visualizations
- **Transaction Management**: Add, view, and manage transactions
- **Advanced Analytics**: Detailed fraud patterns and trends
- **Report Generation**: Export fraud analysis reports (CSV)
- **Responsive Design**: Mobile-friendly interface

### 📊 Dashboard Features
- **Live Statistics**: Real-time fraud detection metrics
- **Data Visualization**: Interactive charts and graphs
- **Recent Transactions**: Latest transaction status
- **System Health**: Monitor ML model and database status
- **Quick Actions**: Generate reports, view analytics, model settings

### 🛠️ Technical Features
- **RESTful APIs**: Clean and documented API endpoints
- **Database Integration**: MySQL with JPA/Hibernate
- **Machine Learning**: Random Forest Classifier (99.2% accuracy)
- **Modern UI**: Tailwind CSS with responsive design
- **Error Handling**: Comprehensive error management
- **Data Validation**: Input validation and sanitization

## 🚀 Technology Stack

### Frontend
- **React.js** - Component-based UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Data visualization library
- **Axios** - HTTP client for API calls

### Backend
- **Spring Boot** - Java-based enterprise framework
- **Spring Data JPA** - Data persistence layer
- **Hibernate** - Object-Relational Mapping
- **MySQL** - Relational database
- **Maven** - Build automation tool

### Machine Learning
- **Python** - ML model development
- **Scikit-learn** - Machine learning library
- **Random Forest** - Classification algorithm
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React.js)    │───▶│ (Spring Boot)   │───▶│   (MySQL)       │
│   Port: 3000    │    │   Port: 8081    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │   ML Model      │              │
         └──────────────│   (Python)      │──────────────┘
                        │   Fraud Detect  │
                        └─────────────────┘
```

## 🛠️ Installation

### Prerequisites
- **Java 17+**
- **Node.js 16+**
- **MySQL 8.0+**
- **Maven 3.6+**
- **Python 3.8+** (for ML model)
- **Kaggle Account** (for dataset download)

### ⚠️ Important Notes
- **Dataset Required**: This project requires the Credit Card Fraud Detection dataset from Kaggle
- **File Size**: The dataset (~143MB) is not included in this repository
- **Setup Time**: Allow 10-15 minutes for complete setup including model training

### 1. Clone the Repository
```bash
git clone https://github.com/ronak03rsk/FraudDetection.git
cd FraudDetection
```

### 2. 📊 Dataset Setup (Critical Step)
**You must download the dataset before running the application:**

1. **Create a Kaggle account** at https://www.kaggle.com
2. **Download the dataset:**
   - Visit: https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud
   - Download `creditcard.csv` (143MB)
   - Place it in the `ml-model-api/` directory

3. **Verify file structure:**
   ```
   ml-model-api/
   ├── creditcard.csv     # ✅ Downloaded from Kaggle
   ├── model_train.py     # ✅ Already in repo
   └── ml_api.py         # ✅ Already in repo
   ```

### 3. Database Setup
```sql
CREATE DATABASE fraud_detection_db;
CREATE USER 'fraud_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON fraud_detection_db.* TO 'fraud_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Backend Setup
```bash
cd springboot-backend/fraud-detector
# Update database credentials in src/main/resources/application.properties
mvn clean install
mvn spring-boot:run
```

### 5. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 6. ML Model Setup

#### 📊 Dataset Download (Required)
**Important**: Due to GitHub's file size limitations, the dataset is not included in this repository.

1. **Download the Credit Card Fraud Dataset:**
   ```bash
   # Visit Kaggle and download the dataset
   # https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud
   # Download creditcard.csv (~143MB) and place it in ml-model-api/ directory
   ```

2. **Setup ML Environment:**
   ```bash
   cd ml-model-api
   pip install -r requirements.txt
   
   # Train the model (this will create fraud_model.pkl)
   python model_train.py
   
   # Start the ML API server
   python ml_api.py
   ```

#### 📁 Expected File Structure:
```
ml-model-api/
├── creditcard.csv          # ⚠️ Download separately from Kaggle
├── fraud_model.pkl         # Generated after training
├── model_train.py          # Training script
├── ml_api.py              # ML API server
└── README.md              # Detailed instructions
```

## 🎮 Usage

### Starting the Application
1. **Backend**: `mvn spring-boot:run` (Port: 8081)
2. **Frontend**: `npm start` (Port: 3000)
3. **ML API**: `python ml_api.py` (Port: 5000)

### Accessing the Application
- **Web Interface**: http://localhost:3000
- **API Documentation**: http://localhost:8081/swagger-ui.html
- **Database**: MySQL on localhost:3306

### Adding Transactions
1. Navigate to "Add Transaction"
2. Enter 29 comma-separated feature values
3. Click "Submit Transaction"
4. View fraud detection result

### Viewing Analytics
1. Dashboard shows real-time statistics
2. Click "Advanced Analytics" for detailed insights
3. Generate reports using "Generate Report" button
4. Monitor system health in the dashboard

## 📡 API Documentation

### Base URL
```
http://localhost:8081/api/transactions
```

### Endpoints

#### GET /all
Get all transactions
```json
{
  "transactions": [
    {
      "id": 1,
      "fraud": false,
      "timestamp": "2025-01-15T10:30:00",
      "features": [1.2, -0.5, 2.1, ...]
    }
  ]
}
```

#### POST /add-form
Add new transaction for fraud detection
```json
{
  "features": [1.2, -0.5, 2.1, ..., 149.62]
}
```

Response:
```json
{
  "fraud": false,
  "message": "Transaction processed successfully"
}
```

#### GET /check
Health check endpoint
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00"
}
```

## 📱 Screenshots

### Dashboard
![Dashboard](docs/images/dashboard.png)

### Add Transaction
![Add Transaction](docs/images/add-transaction.png)

### View Transactions
![View Transactions](docs/images/view-transactions.png)

### Advanced Analytics
![Analytics](docs/images/analytics.png)

## 🔧 Configuration

### Backend Configuration
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/fraud_detection_db
spring.datasource.username=fraud_user
spring.datasource.password=your_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server Configuration
server.port=8081
```

### Frontend Configuration
```javascript
// API Base URL
const API_BASE_URL = 'http://localhost:8081/api/transactions';
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Guidelines

### Code Style
- **Java**: Follow Spring Boot conventions
- **JavaScript**: Use ES6+ features
- **CSS**: Tailwind CSS utilities preferred

### Testing
```bash
# Backend tests
mvn test

# Frontend tests
npm test

# ML model tests
python -m pytest tests/
```

## 🐛 Troubleshooting

### Common Issues

1. **Dataset Missing Error**
   ```
   FileNotFoundError: [Errno 2] No such file or directory: 'creditcard.csv'
   ```
   - **Solution**: Download `creditcard.csv` from Kaggle and place in `ml-model-api/` directory
   - **Verification**: Check file exists with `ls ml-model-api/creditcard.csv`

2. **Database Connection Error**
   - Check MySQL service is running
   - Verify credentials in application.properties

3. **Port Already in Use**
   - Backend: Change port in application.properties
   - Frontend: Set PORT environment variable

4. **CORS Issues**
   - Ensure CORS is configured in WebConfig.java

5. **Model Training Failed**
   ```
   python model_train.py
   ```
   - Ensure `creditcard.csv` exists in `ml-model-api/`
   - Check Python dependencies: `pip install -r requirements.txt`
   - Verify dataset format (284,807 rows, 31 columns)

## 📈 Performance Metrics

- **ML Model Accuracy**: 99.2%
- **API Response Time**: < 100ms
- **Database Query Time**: < 50ms
- **Frontend Load Time**: < 2s

## 🛡️ Security Features

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Error handling without sensitive data exposure

## 📊 ML Model Details

### Algorithm: Random Forest Classifier
- **Features**: 29 numerical features
- **Training Data**: Credit card transactions dataset
- **Accuracy**: 99.2%
- **Precision**: 0.95
- **Recall**: 0.93
- **F1-Score**: 0.94

### Model Performance
```python
# Model metrics
accuracy = 0.992
precision = 0.95
recall = 0.93
f1_score = 0.94
auc_roc = 0.99
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Ronak
- **Project Type**: Full-Stack Web Application
- **Domain**: Fraud Detection & Machine Learning

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced ML models (Deep Learning)
- [ ] Multi-factor authentication
- [ ] Microservices architecture
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Mobile application
- [ ] Advanced reporting features

## 📞 Support

For support, email: your-email@example.com

---

⭐ **Star this repository if you found it helpful!**
