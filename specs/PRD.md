# PRD: ChemFlash – Webová aplikace pro výuku chemie (MVP)

## 1. Přehled projektu

Vytvoření jednoduché, moderní webové aplikace (SPA - Single Page Application) pro výuku chemie formou "Flashcards" (kartiček). MVP se zaměřuje na Periodickou tabulku prvků. Aplikace musí fungovat lokálně bez buildovacích nástrojů (npm, webpack) a musí být hostovatelná na GitHub Pages.

## 2. Technický Stack & Architektura

* **Frontend:** Čisté HTML5, CSS3 (CSS Variables pro témata), Vanilla JavaScript (ES6+).
* **Bez Frameworků:** Žádný React/Angular/Vue build step. Použití nativních Web Components nebo modulárního JS (`type="module"`).
* **Data:** Externí JSON soubory. Aplikace načte data asynchronně (`fetch`).
* **Hosting:** Statický hosting (GitHub Pages / Netlify).
* **Responsivita:** Mobile-first přístup.

## 3. Datová struktura (Data Schema)

Data budou oddělena od logiky. Hlavní datový soubor: `data/elements.json`.

### Struktura JSON položky (Příklad):

```json
{
  "id": 1,
  "symbol": "H",
  "name_cz": "Vodík",
  "name_en": "Hydrogen",
  "name_lat": "Hydrogenium",
  "atomic_number": 1,
  "group": 1,
  "period": 1,
  "category": "nonmetal" // Pro budoucí stylování
}

```

## 4. Funkční požadavky

### 4.1 Nastavení běhu (Game Setup)

Před spuštěním učení uživatel vidí obrazovku nastavení:

1. **Výběr datasetu:** Defaultně "Chemické prvky" (příprava na škálovatelnost pro jiné předměty).
2. **Režim zkoušení (Direction):**
* Značka -> Název (CZ)
* Název (CZ) -> Značka
* Náhodně (Mix)


3. **Počet karet (Batch Size):** Tlačítka [12, 24, 48, Vše].
4. **Filtr (Multichoice):**
* Podle Periody (Řádek 1–7)
* Podle Skupiny (Sloupec 1–18)
* *Logika:* Pokud není nic vybráno, bere se vše.



### 4.2 Průběh učení (Game Loop)

* **Zobrazení karty:**
* Uživatel vidí přední stranu (např. "H").
* Kliknutím na kartu nebo mezerníkem se karta otočí (animace flip).


* **Zadní strana (Reveal):**
* Zobrazí hlavní odpověď (např. "Vodík").
* Zobrazí metadata: Protonové číslo, Skupina, EN název, LAT název.


* **Hodnocení:**
* Tlačítko **"Nevím" (X)**: Karta se označí jako neznalá a vrátí se do aktuálního balíčku (např. za 3 karty nebo na konec).
* Tlačítko **"Vím" (V)**: Karta se označí jako hotová a zmizí z aktuálního balíčku.


* **Progress Bar:** Vizualizace postupu (např. 5/12).

### 4.3 Ukončení a Reset

* Po dokončení všech karet se zobrazí souhrn (Score screen).
* Tlačítka: "Znovu zamíchat stejný výběr", "Nové nastavení", "Resetovat naučené".

## 5. UI/UX Design Guidelines

Vzhled inspirovaný Duolingo, ale minimalistický.

* **Barevná paleta:**
* Hravé, jasné barvy pro akce (Zelená pro "Vím", Červená/Oranžová pro "Nevím").
* Neutrální pozadí (Off-white pro light mode, Dark-grey pro dark mode).
* Karty musí vypadat "kliknutelně" (stíny, hover efekty).


* **Typografie:** Bezpatkové písmo (Sans-serif), čitelné, větší font pro hlavní symboly/názvy.
* **Dark/Light Mode:**
* Přepínač v rohu obrazovky (ikona slunce/měsíc).
* Implementováno přes CSS Variables (`:root` vs `[data-theme="dark"]`).


* **Layout:**
* Centrální karta.
* Ovládací prvky (tlačítka) dole (snadno dostupné palcem na mobilu).



## 6. Souborová struktura (Návrh)

```text
/
├── index.html          # Hlavní vstupní bod
├── style.css           # Globální styly a proměnné
├── app.js              # Hlavní logika (Controller)
├── modules/
│   ├── deck.js         # Logika míchání a filtrování karet
│   ├── ui.js           # Manipulace s DOMem
│   └── storage.js      # Ukládání nastavení (Local Storage)
├── data/
│   └── elements.json   # Databáze prvků
└── README.md

```

## 7. Rozšiřitelnost (Future Proofing)

* Kód musí být napsán tak, aby přidání nového předmětu znamenalo pouze přidání nového JSON souboru do složky `data/` a jeho registraci v configu, bez nutnosti přepisovat logiku aplikace.
