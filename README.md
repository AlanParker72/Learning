# Google Places Address Autocomplete Demo

This zip contains two independent applications:

- `backend` - Spring Boot 3 / Java 21 API
- `frontend` - React + TypeScript + MUI UI

The UI calls only your Spring Boot backend. The Google API key is never exposed to React.

## Backend features

- Controller layer
- Service interface
- Service implementation
- Google Places client layer
- DTOs for Google response and UI response
- Address component mapper
- CORS config
- Global exception handler
- Validation
- Timeout handling
- Unit test for address mapping

## Google APIs used

1. Place Autocomplete while typing
2. Place Details after user selects a suggestion

## Run backend

```bash
cd backend
export GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_KEY
mvn spring-boot:run
```

Windows PowerShell:

```powershell
cd backend
$env:GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_KEY"
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

Test backend directly:

```bash
curl "http://localhost:8080/api/addresses/autocomplete?input=10444&sessionToken=test-token"
```

After selecting a returned `placeId`:

```bash
curl "http://localhost:8080/api/addresses/details?placeId=PLACE_ID_FROM_AUTOCOMPLETE&sessionToken=test-token"
```

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

Type `10444`, select a suggestion, and City / State / ZIP / Country will be populated automatically.

## Important notes

- Autocomplete API does not always return city/state/zip separately.
- UI must call details API after selection using `placeId`.
- ZIP+4 may come as `postal_code` + `postal_code_suffix`; backend combines them when suffix exists.
