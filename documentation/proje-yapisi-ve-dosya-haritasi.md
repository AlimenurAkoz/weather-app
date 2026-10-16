# Proje Yapısı ve Dosya Haritası

Bu sayfa, kodu yazmaya başlamadan önce hangi dosyanın nerede durduğunu ve ne işe yaradığını gösterir. Sonraki sayfalarda bir dosyadan söz edildiğinde yerini bu sayfadan bulabilirsiniz.

## Klasör yapısı

Projenin ana dizini [`weather-open-api/frontend`](../weather-open-api/frontend)’dir. `src` klasörünün içeriği şu şekildedir:

```
frontend/src/
├── index.html
├── main.ts
├── styles.css
└── app/
    ├── weather/
    │   ├── weather.ts         → component mantığı
    │   ├── weather.html       → arayüz şablonu(template)
    │   ├── weather.css        → component stilleri
    │   └── weather.spec.ts    → component testi 
    ├── app.config.ts        → uygulama ayarları (provideHttpClient burada)
    ├── app.routes.ts        → yönlendirme (bu projede kullanılmıyor)
    ├── app.ts               → kök component
    ├── app.html             → kök şablon
    ├── app.css              → kök component stili(boş)
    ├── app.spec.ts          → kök component testi
    ├── weather-api.ts       → Open-Meteo servisi
    └── weather-api.spec.ts  → servis testi
    
```

## Dosyaların görevleri

<table data-search="false"><thead><tr><th width="179">Dosya</th><th width="434.20001220703125">Görevi</th></tr></thead><tbody><tr><td><code>weather-api.ts</code></td><td>Open-Meteo’ya iki aşamalı istek atar (Geocoding → Forecast), veriyi sadeleştirir, hataları fırlatır. Uygulamanın dış dünyayla konuşan tek noktasıdır.</td></tr><tr><td><code>weather.ts</code></td><td>Kullanıcının yazdığı şehri servise iletir, gelen veriyi <code>signal</code>’lerde tutar. Arayüzün “beyni”dir.</td></tr><tr><td><code>weather.html</code></td><td><code>signal</code> değerlerini ekranda gösterir: arama kutusu, güncel hava, nem çubuğu, haftalık ve saatlik kartlar.</td></tr><tr><td><code>weather.css</code></td><td>Yalnızca <code>weather</code> component'ine ait stiller.</td></tr><tr><td><code>app.config.ts</code></td><td>Uygulama genelindeki ayarlar. <code>provideHttpClient()</code> burada eklenir.</td></tr><tr><td><code>app.ts</code> / <code>app.html</code></td><td>Uygulamanın kök component'i. <code>&#x3C;app-weather /></code> burada çağrılarak hava durumu ekrana yerleştirilir.</td></tr><tr><td><code>main.ts</code></td><td>Uygulamayı başlatır (<code>bootstrapApplication</code>). Değiştirilmez.</td></tr><tr><td><code>styles.css</code></td><td>Tüm uygulamayı kapsayan genel stiller.</td></tr><tr><td><code>*.spec.ts</code></td><td>Test dosyaları.</td></tr></tbody></table>

### Veri hangi dosyadan hangisine akar?

```
weather.html  →  weather.ts  →  weather-api.ts  →  Open-Meteo
(kullanıcı)      (component)   ←    (servis)       ←   (dış API)
     ↑               │
     └── signal ─────┘
```

1. Kullanıcı `weather.html` içindeki kutuya şehir yazar.
2. `weather.ts` bu değeri `weather-api.ts`’deki servise gönderir.
3. Servis Open-Meteo’dan veriyi alır, sadeleştirip geri döndürür.
4. `weather.ts` sonucu `signal`’e yazar, `weather.html` otomatik güncellenir.

Daha detaylı veri akışına [Veri Akışı](./#veri-akisi) başlığından ulaşabilirsiniz.

## Bu projede değiştirdiğimiz hazır dosyalar

`ng new` bazı dosyaları hazır üretir. Aşağıdakilerde küçük değişiklikler yaptık:

<table><thead><tr><th width="200.800048828125">Dosya</th><th>Değişiklik</th><th>Neden</th></tr></thead><tbody><tr><td><code>app.config.ts</code></td><td><code>provideHttpClient()</code> eklendi</td><td><code>HttpClient</code> 'ı açıkça kaydetmek için.</td></tr><tr><td><code>app.ts</code></td><td><code>Weather</code> component'i <code>imports</code> listesine eklendi, <code>RouterOutlet</code> kaldırıldı</td><td>Component'i kullanabilmek ve routing uyarısını önlemek için</td></tr><tr><td><code>app.html</code></td><td>Hazır içerik silindi, yerine <code>&#x3C;app-weather /></code> yazıldı</td><td>Hava durumu component'ini ekrana yerleştirmek için</td></tr><tr><td><code>index.html</code></td><td><code>&#x3C;title></code> "Weather App" yapıldı</td><td>Tarayıcı sekmesinde görünen başlık</td></tr><tr><td><code>styles.css</code></td><td>Renk değişkenleri ve <code>body</code> stili yazıldı</td><td>Component stilleri bu değişkenleri kullanır.</td></tr><tr><td><code>tsconfig.app.json</code><br><code>tsconfig.spec.json</code></td><td><code>compilerOptions</code> içine <code>"rootDir": "./src"</code> eklendi</td><td>VS Code'da <code>outDir</code> satırında çıkan uyarıyı önlemek için</td></tr><tr><td><code>angular.json</code></td><td><code>anyComponentStyle</code> içinde <code>maximumWarning</code> değeri <code>6kB</code> yapıldı</td><td><code>weather.css</code> varsayılan 4 kB sınırını aştığı için</td></tr><tr><td><code>app.spec.ts</code></td><td>Beklenen başlık <code>Hava durumu</code> yapıldı, <code>provideHttpClient()</code> ve <code>provideHttpClientTesting()</code> eklendi</td><td><code>ng new</code>’in testi hazır başlığı (<code>Hello, frontend</code>) arar. <code>Weather</code> component’i açılışta istek attığı için testte gerçek ağ isteği engellenir</td></tr></tbody></table>

## Dokunmadığımız dosyalar

`app.routes.ts` (`routes` listesi boş kalır, routing kullanmıyoruz), `tsconfig.json`, `main.ts`, `app.css`, `package.json`. `app.css` kök component'in stili boş kalır.

### Dosyaları oluşturma komutları

bash

```bash
ng generate component weather
ng generate service weather-api
```

İlk komut `src/app/weather/` klasörünü, ikincisi `src/app/weather-api.ts` dosyasını üretir. Ayrıntılar [**Projeyi Oluşturma**](./#id-3.-projeyi-olustur) bölümündedir.
