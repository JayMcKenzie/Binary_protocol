# BinaryProtocol


# Overview

Protokół wykonujący podstawowe operacje arytmetyczne (dodawanie/odejmowanie/mnożenie/dzielenie)

# Description

Implementacja protokołu komunikacyjnego, aplikacji klienckiej oraz aplikacji serwerowej w środowisku Node.JS.
Komunikacja w relacji n:1 odbywa się poprzez serwer, w oparciu o połączenowy protokół komunikacyjny.
Wszystkie dane przesyłane są w postaci binarnej.

Klient nawiązuje połączenie z serwerem i uzyskuje identyfikator sesji wygenerowany przez serwer. 
Następnie, po podaniu przez klienta operacji arytmetycznej (w postaci polecenia add/subtract/multiply/divide) oraz dwóch wartości w postaci dziesiętnej, serwer konwertuje podane wyrażenie na wartości binarne i umieszcza je w ciągu bitów zapisanych w kolejności: pole operacji (2b), pola liczb (3x 32b), pole statusu (4b), pole identyfikatora (6b).


# Tools

### Software:
- Microsoft Visual Studio Code

### Languages
- JavaScript (Node.js)


# License

MIT


# Credits

### Creators:
- Jakub Małecki
- Filip Olszewski
