# Passenger Volume Prediction — Mexican Airlines

Forecasting monthly air passenger traffic for Mexico's domestic and international routes using SARIMA time-series models, with an interactive dashboard built on Next.js.

![Dashboard Preview](Web.png)

---

## Overview

This project analyzes over 30 years of official DGAC (Dirección General de Aeronáutica Civil) passenger records to build statistical models that project air traffic volumes for **Aeroméxico** and **Viva Aerobus** through 2028. The analysis accounts for structural breaks such as the 2008 financial crisis and the COVID-19 disruption.

---

## Features

- SARIMA models tuned per airline with seasonal period `s=12`
- 60-month forecast (2023–2028) with 95% confidence intervals
- Walk-forward temporal cross-validation
- Interactive dashboard with animated charts and model details
- Model persistence via `.sav` serialized files

---

## Stack

| Layer | Technology |
|---|---|
| Analysis & modeling | Python 3.11, Statsmodels, Pandas, NumPy |
| Visualization (notebooks) | Matplotlib, Seaborn |
| Dashboard | Next.js 16, TypeScript, Recharts, Framer Motion |
| Styling | Tailwind CSS v4 |

---

## Project Structure

```
.
├── data/                        # Raw yearly CSV files (1992–2023)
├── dashboard/                   # Next.js interactive dashboard
│   └── src/
│       ├── app/page.tsx
│       └── components/PredictionChart.tsx
├── Prediction.ipynb             # Full analysis notebook
├── Historico.csv                # Consolidated historical dataset
├── predictions_5_years.csv      # Raw forecast output
├── sarima_model.sav             # Serialized global model
├── sarima_model_aeromexico.sav  # Serialized Aeroméxico model
└── sarima_model_vivaaerobus.sav # Serialized Viva Aerobus model
```

---

## Getting Started

### Analysis (Python)

```bash
pip install -r requirements.txt
jupyter notebook Prediction.ipynb
```

### Dashboard (Next.js)

```bash
cd dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Models

| Model | Order | AIC | Training period |
|---|---|---|---|
| Global | (1,1,1)(1,1,1)[12] | 2847.3 | 1992–2022 |
| Aeroméxico | (1,1,1)(1,1,1)[12] | 1934.8 | 1992–2022 |
| Viva Aerobus | (1,1,1)(1,1,1)[12] | 1756.2 | 2006–2022 |

Model fit approximates **MAPE < 5%** on held-out test periods.

---

## Author

Diego Villagran

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/dvillagrans)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/dvillagrans)

