# 📘 Rejestr Oprogramowania Open-Source

### Autor: [Twój Nick]
---

## 📄 Opis Projektu
Program **Rejestr Oprogramowania Open-Source** to aplikacja webowa, która pozwala na zarządzanie bazą danych oprogramowania open-source. Umożliwia dodawanie, usuwanie, wyszukiwanie oraz eksportowanie i importowanie danych. Dzięki połączeniu **JavaScript** i **AVL Tree** jako struktury danych, aplikacja zapewnia szybkie i wydajne przetwarzanie rekordów.

---

## 📑 Funkcjonalności
- **Dodawanie rekordów** – możliwość wprowadzania szczegółowych danych o oprogramowaniu, takich jak nazwa, wersja, data wydania itp.
- **Usuwanie rekordów** – usuwanie wybranego rekordu na podstawie ID.
- **Wyszukiwanie rekordów** – zaawansowane wyszukiwanie po nazwie lub ID.
- **Eksportowanie** – zapisywanie danych do plików JSON i TXT.
- **Importowanie** – wczytywanie danych z plików JSON i TXT.
- **Konsola komend** – interaktywna konsola wbudowana w aplikację umożliwia szybkie wykonywanie operacji za pomocą komend.

---

## 📊 Struktura Danych: AVL Tree
Aplikacja wykorzystuje **AVL Tree** (zbalansowane drzewo binarne) do przechowywania i szybkiego wyszukiwania danych o rekordach. Dzięki AVL Tree:
- Wyszukiwanie, dodawanie oraz usuwanie rekordów jest bardziej wydajne.
- Aplikacja może obsługiwać większe zbiory danych z minimalnymi opóźnieniami.

---

## 💻 Instrukcja Obsługi

### 1. **Widok Graficzny**
   - W górnym pasku nawigacyjnym znajdziesz przyciski:
     - **Dodaj** – dodaje nowy rekord do tabeli.
     - **Usuń** – usuwa rekord na podstawie ID.
     - **Znajdź** – wyszukuje rekord według ID lub nazwy.
     - **Import** – wczytuje dane z pliku.
     - **Eksport** – zapisuje dane do pliku.

### 2. **Obsługa Konsoli Komend**
   Konsola umożliwia wykonywanie operacji na bazie danych za pomocą komend. Wpisanie `/mhelp` wyświetla listę dostępnych komend.

---

## 🔧 Komendy Konsoli

| Komenda                       | Opis                                                                                                                                                        |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/mhelp`                      | Wyświetla listę wszystkich dostępnych komend.                                                                                                                |
| `/mclear`                     | Czyści ekran konsoli.                                                                                                                                        |
| `/madd arg1 arg2 ... arg7`    | Dodaje rekord z argumentami: **arg1** – nazwa, **arg2** – wersja, **arg3** – data wydania, **arg4** – typ licencji, **arg5** – język, **arg6** –                                    współtwórcy, **arg7** – stabilna wersja. |
| `/mfind arg1`                 | Wyszukuje rekord na podstawie **arg1** (ID lub nazwy).                                                                                                       |
| `/mdel arg1`                  | Usuwa rekord na podstawie **arg1** (ID).                                                                                                                     |
| `/mexport arg1 arg2`          | Eksportuje dane. **arg1** – nazwa pliku, **arg2** – format (json/txt).                                                                                       |
| `/mimport`                    | Importuje dane z pliku JSON lub TXT.                                                                                                                         |
| `/mref`                       | Odświeża tabelę rekordów w widoku graficznym.                                                                                                                |

---

## 📥 Importowanie i 📤 Eksportowanie Danych

### Importowanie
1. **Format JSON**: Plik JSON powinien mieć strukturę tablicy obiektów, gdzie każdy obiekt reprezentuje rekord, np.:
   ```json
   [
     {
       "id": 1,
       "name": "VSCode",
       "version": "1.60",
       "releaseDate": "2021-09-01",
       "licenseType": "MIT",
       "language": "JavaScript",
       "contributors": 30,
       "isStable": "Tak"
     }
   ]
