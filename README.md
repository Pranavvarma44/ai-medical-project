#  COVID-19 Detection using Chest X-Ray Images

##  Overview
This project focuses on building a deep learning model to classify chest X-ray images into three categories: COVID-19, Normal, and Viral Pneumonia. The goal was to explore how machine learning can assist in medical image analysis and make the model usable through a simple web interface.

Instead of just training a model, I also developed a web application where users can upload an X-ray image and get predictions in real time.

##  What I Did
- Collected dataset from Kaggle (COVID-19 Radiography Database)
- Performed data preprocessing and splitting (train/validation/test)
- Built a deep learning model using EfficientNet (transfer learning)
- Trained and evaluated the model
- Developed a web interface to interact with the model
- Integrated the trained model into the website for live predictions

## Model Approach
I used transfer learning with EfficientNet as the base model. Since it is pre-trained on ImageNet, it helps extract meaningful features from images even with limited medical data.

A custom classification layer was added on top to predict:
- COVID-19  
- Normal  
- Viral Pneumonia  

## Web Application

To make the project more practical, I built a simple web app that allows users to test the model easily.

### Features
- Upload chest X-ray images  
- Get instant predictions  
- Clean and simple UI  
- Real-time model inference  

### Workflow
1. User uploads an image  
2. Image is preprocessed (resized, normalized)  
3. Model predicts the class  
4. Result is displayed on the UI  

### Tech Stack
- Frontend: react and css
- Backend:  Node.js  
- Model: TensorFlow / Keras  

##  Dataset
The dataset contains chest X-ray images categorized into:
- COVID-19  
- Normal  
- Viral Pneumonia  

Data split:
- 70% Training  
- 15% Validation  
- 15% Testing  

## Tools & Technologies
- Python  
- TensorFlow / Keras  
- NumPy, Matplotlib  
- Google Colab  
- (Flask / React / Express — update based on your stack)

## Results
The model learned meaningful patterns from X-ray images and achieved good performance on unseen data.

(You can add accuracy here if available)

## Key Learnings
- Transfer learning improves performance with limited data  
- Deployment is as important as model building  
- Integrating ML with web apps makes projects more impactful  

##  Challenges
- Handling large image datasets  
- Avoiding overfitting  
- Connecting the ML model with a web interface  
- Managing preprocessing consistency between training and deployment  

## Future Improvements
- Add confidence scores in UI  
- Deploy the app publicly (e.g., cloud)  
- Improve model accuracy with more data  
- Add user authentication and history  

## How to Run
1. Clone the repository  
2. Install dependencies  
3. Run the notebook to train the model (or use saved model)  
4. Start the backend server  
5. Open the web app and upload an image
## pre installs
## clone repository
- git clone https://github.com/Pranavvarma44/ai-medical-project.git
- cd your-repo-name

## create env (backend - python)
- python -m venv venv  
- windows: venv\Scripts\activate  
- mac: source venv/bin/activate  

## install backend libraries
- pip install tensorflow numpy matplotlib pillow flask

## install frontend & server dependencies
- cd client  
- npm install  
- cd ../server  
- npm install  

## dataset
- Download the COVID-19 Radiography Database from Kaggle  
- Extract and place it inside the project directory  

## model
- Run the notebook to train the model OR use the saved model file  

## run backend (ML API)
- cd server  
- node server.js  

## run frontend (React app)
- cd client  
- npm start  

## open application
- http://localhost:3000

## Note
This project is for educational purposes and should not be used for actual medical diagnosis.

## Acknowledgements
Dataset: Kaggle - COVID-19 Radiography Database  

## Author
Pranav Rudrar
