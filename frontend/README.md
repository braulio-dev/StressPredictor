# Frontend — Breast Cancer Predictor

Static web interface for the breast cancer prediction tool. Collects tumor measurements and displays the model's classification result.

## Structure

```
frontend/
├── templates/
│   └── index.html       # Main page
└── static/
    ├── css/styles.css
    ├── js/app.js
    └── images/
```

## Usage

The frontend expects the backend API to be running at `http://localhost:8000`.

1. **Navigate to the `frontend` directory:**
   ```bash
   cd frontend
   ```

3. **Start the backend**:
   ```bash
   uvicorn api:app --reload
   ```

4. **Open the UI** — serve the frontend with any static file server, for example:
   ```bash
   # Python
   python -m http.server 5500

   # Node (npx)
   npx serve
   ```

5. Navigate to `http://localhost:5500` and enter the tumor measurements to get a prediction.

> **Note:** The browser must be able to reach `http://localhost:8000`. If you change the backend port, update `API_URL` in `static/js/app.js`.

## Input Fields

| Field | Description |
|---|---|
| Radius Worst | Largest mean distance from center to perimeter |
| Texture Worst | Highest std deviation of gray-scale values |
| Perimeter Worst | Largest tumor perimeter |
| Area Worst | Largest tumor area |
| Smoothness Worst | Highest local variation in radius lengths |
| Compactness Mean/Worst | (perimeter² / area) − 1.0 |
| Concavity Mean/Worst | Severity of concave portions of the contour |
| Concave Points Worst | Number of concave portions of the contour |

## Disclaimer

This tool is an **academic project** and does not replace professional medical diagnosis.
