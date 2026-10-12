# Proje 1 ve Proje 2 'nin Temel Farkları

| **Özellik**   | **Proje 1 (Yerel API)**                                      | **Proje 2 (Open-Meteo)**                                                   |
| ------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Backend       | Python / FastAPI tabanlı sunucu kullanılmıştır.              | Backend kullanılmamış; frontend doğrudan dış API'ye bağlanmıştır.          |
| İstek Sayısı  | Tek bir "_/weather?city=..."_ isteği yürütülmüştür.          | Zincirleme iki aşamalı istek (Geocoding ve Forecast) gerçekleştirilmiştir. |
| Veri Kaynağı  | _main.py_ dosyasındaki sabit Python verileri kullanılmıştır. | Canlı ve gerçek zamanlı dış servis verileri çekilmiştir.                   |
| Çalışma Portu | Frontend 4200, Backend 8000 portu üzerinde çalıştırılmıştır. | Yalnızca 4200 portu üzerinde frontend çalıştırılmıştır.                    |
