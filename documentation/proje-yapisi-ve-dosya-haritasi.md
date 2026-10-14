# Proje Yapısı ve Dosya Haritası

Bu sayfa, kodu yazmaya başlamadan önce hangi dosyanın nerede durduğunu ve ne işe yaradığını gösterir. Sonraki sayfalarda dosya yönlendirmelerinde dosyanın yerini bu sayfadan bulabilirsiniz.

## Klasör yapısı

Projenin ana dizini `weather-open-api/frontend`’dir. `src` klasörünün içeriği şu şekildedir:

```
frontend/src/
├── index.html
├── main.ts
├── styles.css
└── app/
    ├── weather/
    │   ├── weather.ts         → bileşen mantığı
    │   ├── weather.html       → arayüz şablonu
    │   ├── weather.css        → bileşen stilleri
    │   └── weather.spec.ts    → bileşen testi 
    ├── app.config.ts        → uygulama ayarları (provideHttpClient burada)
    ├── app.routes.ts        → yönlendirme (bu projede kullanılmıyor)
    ├── app.ts               → kök bileşen
    ├── app.html             → kök şablon
    ├── app.css              → kök bileşen stili(boş)
    ├── app.spec.ts          → kök bileşen testi
    ├── weather-api.ts       → Open-Meteo servisi
    └── weather-api.spec.ts  → servis testi
    
```

## Dosyaların görevleri

<table data-search="false"><thead><tr><th width="179">Dosya</th><th width="434.20001220703125">Görevi</th></tr></thead><tbody><tr><td><code>weather-api.ts</code></td><td>Open-Meteo’ya iki aşamalı istek atar (Geocoding → Forecast), veriyi sadeleştirir, hataları fırlatır. Uygulamanın dış dünyayla konuşan tek noktasıdır.</td></tr><tr><td><code>weather.ts</code></td><td>Kullanıcının yazdığı şehri servise iletir, gelen veriyi <code>signal</code>’lerde tutar. Arayüzün “beyni”dir.</td></tr><tr><td><code>weather.html</code></td><td><code>signal</code> değerlerini ekranda gösterir: arama kutusu, güncel hava, nem çubuğu, haftalık ve saatlik kartlar.</td></tr><tr><td><code>weather.css</code></td><td>Yalnızca <code>weather</code> bileşenine ait stiller.</td></tr><tr><td><code>app.config.ts</code></td><td>Uygulama genelindeki ayarlar. <code>provideHttpClient()</code> burada eklenir.</td></tr><tr><td><code>app.ts</code> / <code>app.html</code></td><td>Kök bileşen. <code>&#x3C;app-weather /></code> burada çağrılarak hava durumu ekrana yerleştirilir.</td></tr><tr><td><code>main.ts</code></td><td>Uygulamayı başlatır (<code>bootstrapApplication</code>). Değiştirilmez.</td></tr><tr><td><code>styles.css</code></td><td>Tüm uygulamayı kapsayan genel stiller.</td></tr><tr><td><code>*.spec.ts</code></td><td>Test dosyaları.</td></tr></tbody></table>

### Veri hangi dosyadan hangisine akar?

```
weather.html  →  weather.ts  →  weather-api.ts  →  Open-Meteo
(kullanıcı)      (bileşen)   ←    (servis)       ←   (dış API)
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

| Dosya                                                                    | Değişiklik                                                                | Neden                                                    |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------- | -------------------------------------------------------- |
| `app.config.ts`                                                          | `provideHttpClient()` eklendi                                             | `HttpClient` ile istek atabilmek için                    |
| `app.ts`                                                                 | `Weather` bileşeni `imports` listesine eklendi, `RouterOutlet` kaldırıldı | Bileşeni kullanabilmek ve routing uyarısını önlemek için |
| `app.html`                                                               | Hazır içerik silindi, yerine `<app-weather />` yazıldı                    | Hava durumu bileşenini ekrana yerleştirmek için          |
| `index.html`                                                             | `<title>` "Weather App" yapıldı                                           | Tarayıcı sekmesinde görünen başlık                       |
| `styles.css`                                                             | Renk değişkenleri ve `body` stili yazıldı                                 | Bileşen stilleri bu değişkenleri kullanır                |
| <p><code>tsconfig.app.json</code><br><code>tsconfig.spec.json</code></p> | `compilerOptions` içine `"rootDir": "./src"` eklendi                      | VS Code'da `outDir` satırında çıkan uyarıyı önlemek için |
| `angular.json`                                                           | `anyComponentStyle` içinde `maximumWarning` değeri `6kB` yapıldı          | `weather.css` varsayılan 4 kB sınırını aştığı için       |

Son iki değişikliğin sebebi ve hata mesajları Sorunlar ve Çözümler sayfasındadır.

## Dokunmadığımız dosyalar

`app.routes.ts` (`routes` listesi boş kalır, routing kullanmıyoruz), `tsconfig.json`, `main.ts`, `app.css`, `package.json`. `app.css` kök bileşenin stili boş kalır.

### Dosyaları oluşturma komutları

bash

```bash
ng generate component weather
ng generate service weather-api
```

İlk komut `src/app/weather/` klasörünü, ikincisi `src/app/weather-api.ts` dosyasını üretir. Detaylı proje oluşturabilmek  [**Projeyi Oluşturma**](./#id-3.-projeyi-olustur) bölümündedir.
