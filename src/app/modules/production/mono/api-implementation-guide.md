# Olive Insurance – Exploitation Service API

Version: 1.1.0

This document consolidates all endpoints and payload schemas exposed by the Exploitation microservice to enable front-end implementation from this spec alone.

Base URL (local): `http://localhost:8080/exploitation`

- App endpoints: prefixed with `/app/...`
- Interservice endpoints: prefixed with `/interservices/...`

Security

- Authorization: Bearer JWT required (unless otherwise configured)
  - Header: `Authorization: Bearer <token>`
- Correlation: `X-Correlation-Id` header is recommended for tracing.

Error Handling

- Typical statuses: `200`, `201`, `204`, `400`, `404`, `409`, `422`, `500`.
- Error payloads may vary; assume `{ "message": string }` when not otherwise specified.

## Enums

- `StatusPolice`: `BROUILLON`, `EN_ATTENTE_PAIEMENT`, `EN_VIGUEUR`, `SUSPENDU`, `RESILIE`, `EXPIRE`
- `TypeContrat`: `FERME`, `TERME`
- `NatureContrat`: `AVEC_TACITE_RECONDUCTION`, `SANS_TACITE_RECONDUCTION`
- `TypeTarif`: `FORFAITAIRE`, `CALCULE`, `MANUEL_SUPERVISE`
- `RegimeBM`: `AUCUN`, `BONUS_MALUS_STANDARD`, `REGIME_PARTICULIER`

---

## 1) Policies (Police)

Resource path: `/app/policies`

### 1.1 Create

- Method: `POST /app/policies`
- Body: `PoliceCreateRequest`

```json
{
  "numPolice": "POL-2025-0001", // optional
  "companyUuid": "<uuid>",
  "pointOfSaleUuid": "<uuid>",
  "productUuid": "<uuid>",
  "insuredUuid": "<uuid>",
  "riskUuid": "<uuid>",
  "exonerationUuid": "<uuid>",
  "stampTypeUuid": "<uuid>",
  "durationUuid": "<uuid>",
  "discountUuid": "<uuid>",
  "commissionPrincipaleUuid": "<uuid>",
  "commissionApporteurUuid": "<uuid>",
  "warrantiesUuids": ["<uuid>", "<uuid>"],
  "formulePTUuid": "<uuid>",
  "nbPT": 5,
  "nbVehicule": 1,
  "typeContrat": "FERME",
  "natureContrat": "AVEC_TACITE_RECONDUCTION",
  "statusPolice": "BROUILLON",
  "typeTarif": "CALCULE",
  "regimeBM": "AUCUN",
  "coefBM": 1.0,
  "stampQte": 1,
  "stampValue": 200.0,
  "tauxApport": 0.1,
  "tauxGestion": 0.05,
  "dateEffet": "2025-01-01",
  "echeance": "2025-12-31",
  "caracteristiques": [
    {
      "caracteristiqueUuid": "<uuid>",
      "valeur": "123",
      "contexteAssociation": "POLICE",
      "entiteAssocieeUuid": null
    }
  ]
}
```

- Response: `200 OK` with `PoliceResponse` (see 1.4)

### 1.2 Get

- Method: `GET /app/policies/{uuid}`
- Response: `200 OK` with `PoliceResponse`

### 1.3 List

- Method: `GET /app/policies`
- Response: `200 OK` with `PoliceResponse[]`
- Note: no pagination parameters currently; returns non-deleted policies.

### 1.4 Update

- Method: `PUT /app/policies/{uuid}`
- Body: `PoliceUpdateRequest` (same fields as create, all optional)
- Response: `200 OK` with `PoliceResponse`

### 1.5 Soft Delete

- Method: `DELETE /app/policies/{uuid}`
- Response: `204 No Content`

### 1.6 Manage Caractéristiques (values on a police)

- Add/Upsert value
  - `POST /app/policies/{uuid}/caracteristiques`
  - Body `ValeurCaracteristiqueRequest`
  - Response `200 OK` `ValeurCaracteristiqueResponse`

- List values
  - `GET /app/policies/{uuid}/caracteristiques?contexte=POLICE|RISQUE|ASSURE|GARANTIE`
  - Response `200 OK` `ValeurCaracteristiqueResponse[]`

- Remove value
  - `DELETE /app/policies/{uuid}/caracteristiques/{caracteristiqueUuid}?entiteAssocieeUuid=<uuid>`
  - Response `204 No Content`

### 1.7 Schemas

- PoliceResponse

```json
{
  "uuid": "<uuid>",
  "numPolice": "POL-2025-0001",
  "companyUuid": "<uuid>",
  "pointOfSaleUuid": "<uuid>",
  "productUuid": "<uuid>",
  "insuredUuid": "<uuid>",
  "riskUuid": "<uuid>",
  "exonerationUuid": "<uuid>",
  "stampTypeUuid": "<uuid>",
  "durationUuid": "<uuid>",
  "discountUuid": "<uuid>",
  "commissionPrincipaleUuid": "<uuid>",
  "commissionApporteurUuid": "<uuid>",
  "warrantiesUuids": ["<uuid>"],
  "formulePTUuid": "<uuid>",
  "nbPT": 5,
  "nbVehicule": 1,
  "typeContrat": "FERME",
  "natureContrat": "AVEC_TACITE_RECONDUCTION",
  "statusPolice": "BROUILLON",
  "typeTarif": "CALCULE",
  "regimeBM": "AUCUN",
  "coefBM": 1.0,
  "stampQte": 1,
  "stampValue": 200.0,
  "tauxApport": 0.1,
  "tauxGestion": 0.05,
  "dateEffet": "2025-01-01",
  "echeance": "2025-12-31",
  "caracteristiques": [
    {
      "caracteristiqueUuid": "<uuid>",
      "nom": "Cylindrée",
      "description": "…",
      "valeur": "1600",
      "contexteAssociation": "POLICE",
      "entiteAssocieeUuid": null,
      "typeCaracteristique": "NUMERIQUE",
      "typeAttente": "NUMBER",
      "obligatoire": true
    }
  ],
  "createdAt": "2025-01-01T12:00:00Z",
  "updatedAt": "2025-01-01T12:00:00Z",
  "createdBy": "SYSTEM"
}
```

- ValeurCaracteristiqueRequest

```json
{
  "caracteristiqueUuid": "<uuid>",
  "valeur": "123",
  "contexteAssociation": "POLICE",
  "entiteAssocieeUuid": null
}
```

---

## 2) Caractéristiques (Catalog management)

Resource path: `/caracteristique`

These endpoints manage the reference catalog of characteristics applicable to policies, risks, insured, or warranties.

### 2.1 Create

- `POST /caracteristique`
- Body: `CaracteristiqueRequest`

```json
{
  "nom": "Cylindrée",
  "description": "Cylindrée du véhicule",
  "contexteAssociation": "POLICE",
  "obligatoire": true,
  "ordreAffichage": 10,
  "typeCaracteristique": "NUMERIQUE", // TEXTE | NUMERIQUE | LISTE
  "valeurMin": 0,
  "valeurMax": 5000,
  "nombreDecimales": 0,
  "companyUuid": "<uuid>",
  "applicableWarrantiesUuids": ["<uuid>"]
}
```

- Response: `200 OK` `CaracteristiqueResponse`

### 2.2 Get one

- `GET /caracteristique/{uuid}` → `200 OK` `CaracteristiqueResponse`

### 2.3 List

- `GET /caracteristique` → `200 OK` `CaracteristiqueResponse[]`

### 2.4 Update

- `PUT /caracteristique/{uuid}` with `CaracteristiqueRequest` → `200 OK` `CaracteristiqueResponse`

### 2.5 Delete

- `DELETE /caracteristique/{uuid}` → `204 No Content`

---

## 3) Attributs tarifiables (Interservices)

Resource path: `/interservices/attributs-tarifiables`

These endpoints expose a schema of pricing-relevant attributes and allow retrieval of current values for a given policy.

### 3.1 Schema – all attributes

- `GET /interservices/attributs-tarifiables/schema?all=false`
  - Query `all=true` returns detailed entries; otherwise a simplified version.

Responses

- Simple entry (`all=false`):

```json
{
  "nom": "dateEffet",
  "libelle": "Date d'effet",
  "entite": "POLICE",
  "chemin": "police.dateEffet",
  "type": { "type": "DATE" }
}
```

- Detailed entry (`all=true`):

```json
{
  "nom": "regimeBM",
  "libelle": "Régime BM",
  "description": "Régime Bonus-Malus",
  "entite": "POLICE",
  "chemin": "police.regimeBM",
  "type": { "type": "REFERENCE", "nomTable": "ENUM_RegimeBM", "colonneKey": "value", "colonneValue": "label" },
  "obligatoire": true,
  "groupeAffichage": "CONTRACTUEL",
  "ordreAffichage": 5,
  "validation": { "requis": true }
}
```

### 3.2 Schema – by entity

- `GET /interservices/attributs-tarifiables/schema/entite/{entite}?all=false`
  - `entite`: `POLICE` | `CARACTERISTIQUE`

### 3.3 Schema – by group

- `GET /interservices/attributs-tarifiables/schema/groupe/{groupe}?all=false`

### 3.4 Values – batch for a policy

- `POST /interservices/attributs-tarifiables/valeurs`
- Body: `RecuperationValeursRequest`

```json
{
  "policeUuid": "<uuid>",
  "attributsDemandes": [
    "police.dateEffet",
    "police.pricing.totalTtc",
    "caracteristique.<uuid-carac>"
  ],
  "inclureCaracteristiques": true
}
```

- Response: array of `ValeurAttributResponse`

```json
[
  {
    "nomAttribut": "dateEffet",
    "chemin": "police.dateEffet",
    "entite": "POLICE",
    "valeur": "2025-01-01",
    "valeurAffichage": "2025-01-01",
    "typeAttribut": "DATE",
    "entiteUuid": "<uuid>",
    "entiteAssocieeUuid": null
  }
]
```

### 3.5 Value – single attribute

- `GET /interservices/attributs-tarifiables/valeurs/{policeUuid}/{cheminAttribut}`
  - Example `cheminAttribut`: `police.pricing.totalTtc` or `caracteristique.<uuid>`
  - Response `200 OK` `ValeurAttributResponse` or `404` if not found

### 3.6 Check attribute existence

- `GET /interservices/attributs-tarifiables/existe/{cheminAttribut}`
  - Response `200 OK` boolean

### 3.7 All values for a policy

- `GET /interservices/attributs-tarifiables/valeurs/police/{policeUuid}?inclureCaracteristiques=true`
  - Returns all core police values plus characteristics if requested.

### 3.8 Schema version

- `GET /interservices/attributs-tarifiables/schema/version`
  - Response example:

```json
{
  "version": "1.1.0",
  "dateGeneration": "2025-01-01T12:00:00",
  "nombreAttributs": 23,
  "entitesDisponibles": ["POLICE", "CARACTERISTIQUE"]
}
```

---

## Payload Schemas (DTOs)

### PoliceCreateRequest / PoliceUpdateRequest

- See 1.1 for Create example; Update shares the same fields (all optional).

### PoliceResponse

- See 1.7 for full schema.

### CaracteristiqueRequest

```json
{
  "nom": "Texte", "description": "…", "contexteAssociation": "POLICE",
  "obligatoire": true, "ordreAffichage": 1, "typeCaracteristique": "TEXTE",
  "longueurMin": 1, "longueurMax": 50, "regexValidation": "^[A-Za-z0-9]+$",
  "companyUuid": "<uuid>", "applicableWarrantiesUuids": ["<uuid>"]
}
```

### CaracteristiqueResponse

```json
{
  "uuid": "<uuid>", "nom": "…", "description": "…", "contexteAssociation": "POLICE",
  "obligatoire": true, "ordreAffichage": 10, "actif": true,
  "typeCaracteristique": "NUMERIQUE", "typeAttente": "NUMBER",
  "valeurMin": 0, "valeurMax": 1000, "nombreDecimales": 0,
  "selectionMultiple": false, "options": [],
  "companyUuid": "<uuid>", "applicableWarrantiesUuids": ["<uuid>"]
}
```

### AttributTarifiable (Schema entries)

- Simple:

```json
{ "nom": "dateEffet", "libelle": "Date d'effet", "entite": "POLICE", "chemin": "police.dateEffet", "type": { "type": "DATE" } }
```

- Detailed:

```json
{
  "nom": "regimeBM",
  "libelle": "Régime BM",
  "description": "Régime Bonus-Malus",
  "entite": "POLICE",
  "chemin": "police.regimeBM",
  "type": { "type": "REFERENCE", "nomTable": "ENUM_RegimeBM", "colonneKey": "value", "colonneValue": "label" },
  "obligatoire": true,
  "groupeAffichage": "CONTRACTUEL",
  "ordreAffichage": 5,
  "validation": { "requis": true }
}
```

### ValeurAttributResponse

```json
{
  "nomAttribut": "totalTtc",
  "chemin": "police.pricing.totalTtc",
  "entite": "POLICE",
  "valeur": 125000.0,
  "valeurAffichage": "125000.00",
  "typeAttribut": "DECIMAL",
  "entiteUuid": "<uuid>",
  "entiteAssocieeUuid": null
}
```

---

## Notes d’intégration

- All interservice calls should include the calling user’s JWT for auth propagation.
- Resolve display labels client-side using settings/admin services for `##ref` UUIDs when building UI views.
- Attribute paths follow the convention:
  - `police.<field>` for core policy fields.
  - `police.pricing.<field>` for pricing snapshot fields.
  - `caracteristique.<uuid>` for characteristic values.

