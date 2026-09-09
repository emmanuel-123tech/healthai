# AfricareAI

### AI-powered decision support for Primary Health Care in Africa

AfricareAI is a web-based prototype built for the **AI for Smarter Primary Health Care in Africa** challenge hosted by DataFest Africa.

The project explores how fragmented Primary Health Care data can be transformed into clearer operational insight for health workers, LGA administrators, and state-level decision makers.

The pilot context is **Ondo State, Nigeria**, covering its 18 Local Government Areas and more than 200 Primary Health Care facilities.

**Prototype:** https://africareai.vercel.app/

---

## The Problem

Primary Health Care systems often struggle with fragmented reporting, slow visibility into disease patterns, uneven facility performance, and delayed supply or workload decisions.

AfricareAI was designed around a simple question:

> **How can routinely collected PHC data be turned into timely, role-specific intelligence for better health-system decisions?**

---

## What AfricareAI Does

The prototype brings multiple decision-support workflows into one role-based platform.

### Health Worker View

- facility-level data entry and monitoring
- patient-assessment / triage-assistant concept
- disease and activity visualisation
- quick access to operational trends

### LGA Administrator View

- oversight across PHCs within an LGA
- disease-trend monitoring
- facility-utilisation views
- stock and risk alerts
- comparative facility analysis

### State Official View

- consolidated state-level insight across LGAs
- comparative reports
- forecasting and risk views
- support for resource-allocation and planning decisions

---

## Product Architecture

```text
PHC / Facility Data
        ↓
Cleaning, Validation & Aggregation
        ↓
Facility-Level Summaries
LGA-Level Summaries
State-Level Summaries
        ↓
Predictive / Risk Modelling Layer
        ↓
Role-Based Web Application
        ↓
Health Worker | LGA Admin | State Official
```

The broader product concept connects data processing, forecasting, visual analytics, and role-based decision support in one system.

---

## Data & Analytics Workflow

The project used PHC records from the Ondo State Contributory Health Commission as the basis for data preparation and aggregation.

The analytical workflow included:

- data cleaning and validation
- facility-level aggregation
- LGA-level aggregation
- state-level aggregation
- exploratory analysis and visualisation
- preparation of structured datasets for forecasting and dashboard use

Python tools used in the data workflow included:

- Pandas
- NumPy
- Matplotlib
- Scikit-learn

The project was designed to support modelling around:

- disease trends
- facility utilisation
- stock-out risk

---

## Technology Stack

### Data & Machine Learning

- Python
- Pandas
- NumPy
- Scikit-learn
- Matplotlib

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Visualisation

- Chart.js
- Recharts

### Deployment

- Vercel

The application was structured to support serverless API integration and future connection to a persistent backend/database layer.

---

## Current Prototype Status

AfricareAI should be understood as a **hackathon prototype / proof of concept**, not a production health platform.

The prototype demonstrates the intended product flows, role-based dashboards, data visualisation, and predictive decision-support concept. Some production capabilities, including live backend ingestion, persistent multi-user data synchronisation, and full deployment of the predictive services, were not completed during the hackathon timeframe.

This distinction matters because the project is strongest as evidence of **product thinking, data-system design, applied analytics, and AI-assisted decision-support architecture**, rather than as a claim of a fully deployed health-information system.

---

## Team

**Neural Minds**

- Emmanuel Ebiendele
- Akanji Motunrayo
- Olusola Adekunle Stephen

---

## My Contribution

I contributed to the data and AI direction of the project, including the framing of the health-system problem, the data preparation / aggregation workflow, predictive-analytics concept, and development of the prototype experience that connects those insights to different user roles.

The project reflects the kind of work I am most interested in: taking a messy real-world problem, structuring the data, designing the intelligence layer, and turning the result into something decision makers can interact with.

---

## Why This Project Matters

The value of AI in health systems is not simply producing a prediction.

The real challenge is getting the right information to the right person early enough for it to influence a decision.

AfricareAI explores that idea across three levels of the PHC system:

```text
Facility → LGA → State
```

The goal is to make routine operational data more useful for planning, monitoring, and early response.

---

## Next Steps

A production version would require:

- secure, persistent health-data storage
- authenticated multi-user access with strict role permissions
- automated data ingestion and quality checks
- properly trained, validated, and monitored forecasting models
- documented evaluation metrics for every predictive module
- audit trails and model-version tracking
- privacy, security, and regulatory review appropriate for health data
- pilot testing with PHC staff and government stakeholders

---

## Run Locally

```bash
git clone https://github.com/emmanuel-123tech/healthai.git
cd healthai
pnpm install
pnpm dev
```

Then open:

```text
http://localhost:3000
```

---

## Author / Contact

**Emmanuel Ebiendele**  
AI/ML Engineer & AI Product Builder

- GitHub: https://github.com/emmanuel-123tech
- LinkedIn: https://www.linkedin.com/in/emmanuel-ebiendele-063ba0255/
