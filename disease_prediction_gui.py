import tkinter as tk
from tkinter import ttk
import pickle
import numpy as np
import pandas as pd

# Load the trained model
with open("./ExtraTrees_model.pkl", 'rb') as f:
    model = pickle.load(f)

# Load the symptom descriptions and precautions
desc = pd.read_csv("./Data/symptom_Description.csv")
prec = pd.read_csv("./Data/symptom_precaution.csv")

# List of all symptoms (replace `x` with the actual list of symptoms from your dataset)
# Assuming `x` is the list of all 222 symptoms

t = pd.Series([0] * len(x), index=x)

# Function to predict disease
def predict_disease():
    # Get user input (symptoms separated by commas)
    user_input = symptom_entry.get().strip()
    if not user_input:
        result_text.delete(1.0, tk.END)
        result_text.insert(tk.END, "Please enter symptoms.")
        return
    
    # Split the input into individual symptoms
    selected_symptoms = [s.strip() for s in user_input.split(",")]
    
    # Create a binary vector for symptoms
    t = pd.Series([0] * len(x), index=x)
    for symptom in selected_symptoms:
        if symptom in x:
            t.loc[symptom] = 1
    
    # Convert to numpy array and reshape
    t = t.to_numpy()
    t = t.reshape(1, -1)
    
    # Predict the disease
    prediction = model.predict_proba(t)
    top5_idx = np.argsort(prediction[0])[-5:][::-1]
    top5_proba = np.sort(prediction[0])[-5:][::-1]
    top5_diseases = model.classes_[top5_idx]
    
    # Display the results
    result_text.delete(1.0, tk.END)
    for i in range(5):
        disease = top5_diseases[i]
        probability = top5_proba[i]
        result_text.insert(tk.END, f"Disease Name: {disease}\n")
        result_text.insert(tk.END, f"Probability: {probability:.2f}\n")
        
        # Display disease description
        if disease in desc["Disease"].unique():
            disp = desc[desc['Disease'] == disease].values[0][1]
            result_text.insert(tk.END, f"Disease Description: {disp}\n")
        
        # Display precautions
        if disease in prec["Disease"].unique():
            c = np.where(prec['Disease'] == disease)[0][0]
            precuation_list = []
            for j in range(1, len(prec.iloc[c])):
                precuation_list.append(prec.iloc[c, j])
            result_text.insert(tk.END, "Recommended Things to do at home: \n")
            for precaution in precuation_list:
                result_text.insert(tk.END, f"{precaution}\n")
        
        result_text.insert(tk.END, "\n")

# Create the main window
root = tk.Tk()
root.title("Disease Prediction")

# Create a frame for symptom input
input_frame = ttk.LabelFrame(root, text="Enter Symptoms (comma-separated)")
input_frame.grid(row=0, column=0, padx=10, pady=10)

# Create an entry widget for symptom input
symptom_entry = ttk.Entry(input_frame, width=80)
symptom_entry.grid(row=0, column=0, padx=10, pady=10)

# Create a button to predict the disease
predict_button = ttk.Button(root, text="Predict Disease", command=predict_disease)
predict_button.grid(row=1, column=0, pady=10)

# Create a text widget to display the results
result_text = tk.Text(root, height=20, width=80)
result_text.grid(row=2, column=0, padx=10, pady=10)

# Run the application
root.mainloop()