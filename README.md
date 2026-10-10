# 💳 FinTech Credit Risk Analytics & Limit Optimization System

> An end-to-end Machine Learning pipeline and interactive web dashboard designed to predict credit default risk, optimize safe credit limit allocations, and enable financial inclusion for thin-file applicants.

---

## 📌 Executive Summary

Financial institutions face a dual challenge: mitigating loan default losses from high-risk borrowers while avoiding the automatic rejection of "new-to-credit" (NTC) applicants who lack extensive repayment history. 

This project delivers a data-driven dual ML architecture trained on extensive credit records:
1. **Default Risk Classification:** A **Random Forest Classifier** predicting default risk with high accuracy and a strong ROC-AUC score.
2. **Limit Optimization:** A **Linear Regression** model recommending optimal credit limits based on historical repayment capacities.
3. **Automated Risk Governance:** Business rules hard-capping credit limits at **$10,000** for high-risk profiles (>60% default probability).
4. **Thin-File Mode (Exploratory Concept):** A cold-start evaluation framework using alternative demographic attributes (Age, Education, Status) to grant safe starter limits ($500–$1,000) to NTC applicants.

---

## 🏗️ System Architecture

```text
[ Raw Credit Data ]
         │
         ▼
[ Data Preprocessing & EDA ] (Jupyter Notebooks)
         │
         ├───► [ Random Forest Classifier ] ──► Default Probability (>60% Risk Cap)
         │
         ├───► [ Linear Regression Model ]  ──► Recommended Credit Limit
         │
         └───► [ Thin-File / NTC Mode ]     ──► Demographic Starter Limit Framework
                         │
                         ▼
      [ Interactive Web Dashboard ] (React, Vite, Tailwind CSS, TypeScript)