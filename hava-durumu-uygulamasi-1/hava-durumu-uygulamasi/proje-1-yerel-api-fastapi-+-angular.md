# Proje 1: Yerel API (FastAPI + Angular)

### Python Kullanarak Yazılan API ile Hava Durumu Uygulaması

Bu projede, dışarıdan hazır bir servis kullanmak yerine Python / FastAPI backend'i yazılarak Angular arayüzü ile haberleştirildi.

**1. Backend Mimarisi (FastAPI)**

* **Veri Kontrolü :**
  * Gelen-giden verilerin tipleri Weather sınıfıyla ve değer aralıkları (örneğin nem yani humidity 0 ile 100 arasında olmak şartıyla sınırlandırıldı.
* **Türkçe Karakter Normalizasyonu:**
  * Kullanıcılar arama yaparken büyük/küçük harf veya Türkçe harf hatası gerçekleşmemesi için kelimeleri otomatik olarak düzgün formata çevirilmesi sağlandı.
* **Endpoints:**
  * _GET /:_ API'nin çalışıp çalışmadığını kontrol eder.
  * _GET /weather?city={sehir\_adi}:_ İstediğimiz şehrin hava durumunu getirir. Şehir bulunamazsa 404 (Bulunamadı) hatası verir.
  * _GET /cities:_ Sistemde kayıtlı olan tüm şehirlerin listesini gösterir.
* **CORS İzni:**
  * _CORSMiddleware_ eklenerek tarayıcı üzerinde [_http://localhost:4200_](http://localhost:4200/)_/_  adresinden (Angular frontend) gelen _GET_ isteklerine güvenli bir şekilde izin verilmiştir.

**2. Frontend İletişimi**

* **HTTP İstekleri:**
  * _WeatherApi_ servisi, Angular'ın _HttpClient_ modülünü kullanarak FastAPI backend'indeki [_http://127.0.0.1:8000/weather_](http://127.0.0.1:8000/weather) adresine sorgu parametreleriyle (params) istek atar.
* **Reaktif Veri Yönetimi (Signals):**
  * Python'dan gelen veri _signal_ yapılarıyla kaydedilir. Bu sayede veri geldiğinde ekran otomatik olarak güncellenir ve sonuçlar gösterilir.

