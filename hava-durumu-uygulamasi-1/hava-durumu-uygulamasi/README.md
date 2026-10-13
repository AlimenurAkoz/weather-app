# Giriş ve Mimari Karşılaştırma

HAVA DURUMU UYGULAMASI&#x20;

Proje 1: weather-app\
Proje 2: weather-open-api

Github: [https://github.com/AlimenurAkoz/weather-app](https://github.com/AlimenurAkoz/weather-app)

#### Amaç:&#x20;

Hava durumu uygulamasında, backend Python ile FastAPI yazmak ve açık kaynak API kullanmak şeklinde iki farklı mimarinin deneyimlenmesi amacıyla iki ayrı proje yapılmıştır.

| Özellik      | Weather App (Yerel API)                        | Weather Open API App (Açık API)                     |
| ------------ | ---------------------------------------------- | --------------------------------------------------- |
| Mimari       | Angular → Kendi Python (FastAPI) API'miz       | Angular → Open-Meteo (Açık API)                     |
| Backend      | Var (Python / FastAPI)                         | Yok (Direct Frontend to API)                        |
| Veri Kaynağı | _main.py_ içerisindeki elle girilen sabit veri | _Open-Meteo_ Kullanarak Çekilen Gerçek Zamanlı Veri |
| Port         | <p>Frontend: 4200</p><p>Backend: 8000</p>      | Frontend: 4300                                      |
