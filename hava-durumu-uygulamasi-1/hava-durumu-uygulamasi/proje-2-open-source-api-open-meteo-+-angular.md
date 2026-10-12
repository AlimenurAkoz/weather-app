# Proje 2: Open Source API (Open-Meteo + Angular)

&#x20;   Bu projede Python backend'i yazmak yerine, dışarıdaki hazır ve ücretsiz bir açık kaynak servis olan Open-Meteo API'si doğrudan Angular arayüzünden kullanıldı.



### **1. İki Aşamalı İstek Sistemi:**

&#x20;   Open-Meteo'nun hava durumu servisi doğrudan şehir adıyla çalışmayıp dünyanın neresi olduğunu anlamak için enlem ve boylam koordinatlarına ihtiyaç duyar. Bu yüzden süreç iki adımda gerçekleşti: 1. İstek (Geocoding API): Kullanıcının yazdığı şehir adını (örneğin _Sivas_) alır ve koordinatlarına çevirir, 2. İstek (Forecast API): Gelen bu koordinatları kullanarak o bölgenin güncel hava durumu bilgilerini çeker.

_**Sistem Akışı:**_

1. _Kullanıcı şehri yazar_
2. _Geocoding API, şehri koordinatlara çevirir_
3. _Forecast API koordinattan güncel hava durumunu bulur_&#x20;
4. _Ekrana yazdırılır_

### 2. Servis Mimarisi (_weather-api.ts_):

&#x20; Angular tarafında dış servislerle iletişim kurmak için _WeatherApi_ servisi oluşturuldu. İçerisinde:

* **HttpClient:** Angular'ın dış dünyadaki web adreslerine (API'lere) HTTP istekleri göndermesini sağlar
* **RxJS (**_**switchMap**_**&#x20;ve&#x20;**_**map**_**):**
  * Koordinat alma işleminin ardından hava durumu verisinin çekilmesi gerektiğinden, bu iki bağımlı süreç _switchMap_ operatörü ile birbirine bağlandı. _map_ fonksiyonu ise Open-Meteo servisinden dönen karmaşık JSON verisinden yalnızca gerekli alanların (sıcaklık, nem vb.) süzülerek filtrelenmesinde kullanıldı.
  * _Kod Çevirisi (WEATHER\_CODES):_ Open-Meteo servisinin sayısal kodlar halinde ilettiği hava durumu verilerini (örneğin: 0 = Açık, 61 = Hafif Yağmur) kullanıcı arayüzünde Türkçe metin olarak görüntüleyebilmek adına bir dönüştürme sözlüğü (_RECORD_) tanımlandı.
  * _Hata Yönetimi (throwError):_ Geçersiz veya bulunamayan şehir aramalarında sistemin kararsız duruma geçmesini önlemek amacıyla kontrollü hata fırlatma mekanizması kuruldu ve hatalar arayüze yansıtıldı.

### _3._ Arayüz ve Bileşen Yönetimi _(weather.ts ve weather.html)_

* **Otomatik Başlangıç:** Sayfanın ilk yüklenişinde boş bir ekran oluşmasını engellemek adına, yapıcı metot (constructor) içerisinde örnek veri olarak "Isparta" şehri için otomatik arama ayarlandı.
* **Signals Kullanımı:** Arayüzdeki verilerin takibi için Angular'ın _signal_ yapısı tercih edilmiştir. API'den gelen güncel veriler _.set()_ metodu ile aktarılarak arayüzün anlık güncellenmesi sağlandı.
* **Görsel Nem Göstergesi:** Nem oranı verisi yüzde (%) değerine dönüştürülmüş ve _CSS \[style.width.%]_ özniteliği üzerinden dinamik bir grafik çubuğa bağlandı.

<figure><img src=".gitbook/assets/image (8).png" alt=""><figcaption></figcaption></figure>

<figure><img src=".gitbook/assets/image (9).png" alt=""><figcaption></figcaption></figure>

<figure><img src=".gitbook/assets/image (10).png" alt=""><figcaption></figcaption></figure>
