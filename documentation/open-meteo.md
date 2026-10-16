# Open-Meteo

Uygulama iki ayrı Open-Meteo servisi kullanır:

| Servis        | Adres                                            | Ne için kullanılır                              |
| ------------- | ------------------------------------------------ | ----------------------------------------------- |
| Geocoding API | `https://geocoding-api.open-meteo.com/v1/search` | Şehir adından koordinat ve şehir önerisi bulmak |
| Forecast API  | `https://api.open-meteo.com/v1/forecast`         | Koordinattan hava durumu verisini çekmek        |

Her ikisi de ücretsizdir ve API anahtarı gerektirmez.

{% hint style="info" %}
Bu sayfadaki tüm istekler Angular kurulu olmadan da tarayıcının adres çubuğundan denenebilir.
{% endhint %}

## 1. Geocoding API

**Örnek istek:**

```
https://geocoding-api.open-meteo.com/v1/search?name=Sivas&count=1&language=tr
```

**Kullanılan parametreler:**

<table><thead><tr><th width="111.800048828125">Parametre</th><th>Değer</th><th>Anlamı</th></tr></thead><tbody><tr><td><code>name</code></td><td>Kullanıcının yazdığı metin</td><td>Aranacak şehir adı</td></tr><tr><td><code>count</code></td><td><code>1</code> veya <code>3</code></td><td>Dönecek sonuç sayısı. Hava durumu aramasında en iyi eşleşme yeterli olduğu için <code>1</code>, öneri listesinde <code>3</code> kullanıldı.</td></tr><tr><td><code>language</code></td><td><code>tr</code></td><td>Ülke ve bölge adlarının Türkçe dönmesini sağlar (ör. “Türkiye Cumhuriyeti”).</td></tr></tbody></table>

**Örnek cevap (kısaltılmış):**

```json
{
  "results": [
    {
      "name": "Sivas",
      "latitude": 39.74833,
      "longitude": 37.01611,
      "country": "Türkiye Cumhuriyeti",
      "country_code": "TR",
      "admin1": "Sivas"
    }
  ]
}
```

{% hint style="info" %}
Gerçek cevapta her sonuçta başka alanlar da bulunur. Uygulamada yalnızca yukarıdaki altı alan kullanılır.&#x20;
{% endhint %}

Şehir bulunamazsa API hata döndürmez. Cevapta **`results`** alanı hiç bulunmaz. Bulunamama iki farklı şekilde ortaya çıkabilir:

1. #### **Hiç eşleşmeyen yazım:**

**Örnek istek:**

```
https://geocoding-api.open-meteo.com/v1/search?name=asdfgh&count=1&language=tr
```

**Örnek cevap:**

<div align="left"><figure><img src=".gitbook/assets/Ekran görüntüsü 2026-10-14 174714.png" alt=""><figcaption><p>Tarayıcıdan alınan cevap</p></figcaption></figure> <figure><img src=".gitbook/assets/image (2).png" alt="" width="563"><figcaption><p>Uygulamadan alınan cevap</p></figcaption></figure></div>

```typescript
error: () => {
        this.weather.set(null);
        this.loading.set(false);
        this.error.set(
          "Şehir bulunamadı veya API'ye ulaşılamadı",
        );
        this.trySuggestion(value);
      },
```

2. #### **Yazım hatası olabilecek yazım:**

**Örnek istek:**

```
https://geocoding-api.open-meteo.com/v1/search?name=sivast&count=1&language=tr
```

**Örnek cevap:**

<div><figure><img src=".gitbook/assets/image (3).png" alt=""><figcaption></figcaption></figure> <figure><img src=".gitbook/assets/image (4).png" alt="" width="563"><figcaption></figcaption></figure></div>

`sivast` bir şehir değildir, bu yüzden API bu yazımla da `results` döndürmez. Ancak yazım gerçek bir şehre çok yakındır (`Sivas`). Uygulama bu durumda hata mesajını gösterir, sonra yazımı bir harf kısaltıp (`sivas`) tekrar sorar ve sonuç varsa **"**[**Bunu mu demek istediniz?**](component-bilesen-mantigi-weather.ts.md#sehir-onerileri)**"** kutusunda önerir.&#x20;

## 2. Forecast API

**Örnek istek:**

Sivas koordinatlarıyla (Geocoding cevabından gelen `latitude` ve `longitude`):

```
https://api.open-meteo.com/v1/forecast
  ?latitude=39.75
  &longitude=37.0167
  &current=temperature_2m,relative_humidity_2m,weather_code
  &hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,wind_speed_10m,weather_code
  &daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,weather_code,sunrise,sunset
  &forecast_days=7
  &timezone=auto
```

**Kullanılan parametreler:**

| Parametre               | Değer                         | Anlamı                                                   |
| ----------------------- | ----------------------------- | -------------------------------------------------------- |
| `latitude`, `longitude` | Geocoding’den gelen koordinat | Hava durumu istenen konum                                |
| `current`               | 3 alan                        | **Şu anki** durum                                        |
| `hourly`                | 6 alan                        | **Saatlik** tahmin                                       |
| `daily`                 | 7 alan                        | **Günlük** tahmin                                        |
| `forecast_days`         | `7`                           | Kaç günlük tahmin döneceği                               |
| `timezone`              | `auto`                        | Saatleri, sorgulanan konumun yerel saatine göre döndürür |

**Örnek cevap (kısaltılmış)**

```json
{
  "timezone": "Europe/Istanbul",
  "current": {
    "temperature_2m": 13.7,
    "relative_humidity_2m": 66,
    "weather_code": 3
  },
  "hourly": {
    "time": ["2026-10-14T00:00", "2026-10-14T01:00"],
    "temperature_2m": [13.7, 12.7],
    "weather_code": [3, 3]
  },
  "daily": {
    "time": ["2026-10-14", "2026-10-15"],
    "temperature_2m_max": [17.5, 17.3],
    "sunrise": ["2026-10-14T06:40", "2026-10-15T06:41"]
  }
}
```

**Koddaki alanların karşılıkları:**

<table><thead><tr><th width="285.6000061035156">API Alanı</th><th>Karşılığı</th></tr></thead><tbody><tr><td><code>current.temperature_2m</code></td><td>Büyük sıcaklık değeri</td></tr><tr><td><code>current.relative_humidity_2m</code></td><td>Nem yüzdesi ve ilerleme çubuğu</td></tr><tr><td><code>current.weather_code</code> / <code>hourly.weather_code</code></td><td>Durum metni / Saatlik durum metni</td></tr><tr><td><code>hourly.temperature_2m</code></td><td>Saatlik kartta sıcaklık</td></tr><tr><td><code>daily.temperature_2m_max</code></td><td>Günün en yüksek sıcaklığı</td></tr><tr><td><code>daily.sunrise</code></td><td>Gün doğumu</td></tr></tbody></table>

{% hint style="info" %}
Alan sayısını kısaltmak için `hourly` ve `daily` içinde yalnızca birkaç alan ve değer gösterildi.
{% endhint %}

{% hint style="info" %}
#### Cevabın yapısı hakkında:

**1. Veriler “paralel dizilerdir”.** `hourly` ve `daily` içindeki her alan ayrı bir dizidir ve aynı sıradaki elemanlar birbirine aittir. Örneğin `time[3]`, `temperature_2m[3]` ve `weather_code[3]` aynı saate ait değerlerdir. Ekranda saat başına bir kart göstereceğimiz için bu diziler servis kodunda `index` ile birleştirilip nesne listesine çevrilir.(WeatherApi Servisi sayfasındaki [**`map`** ile veri süzme başlığı](weatherapi-servisi-weather-api.ts.md#map-ile-veri-suzme)na bakabilirsiniz.)

**2. Zaman bilgisi saat dilimi eki taşımaz.** `timezone=auto` sayesinde saatler `2026-10-14T00:00` biçiminde, sorgulanan şehrin yerel saatiyle gelir. Günlük listedeki tarih ise `2026-10-14` biçimindedir. Bu iki biçimin başlangıcı aynı olduğu için, seçilen günün saatlerini bulurken saatin metin olarak o tarihle başlayıp başlamadığına bakılır.(Component(Bileşen) Mantığı sayfasındaki[ **`getSelectedDayHours`** başlığ](component-bilesen-mantigi-weather.ts.md#gun-secimi-ve-saatlik-liste)ına bakabilirsiniz.)

**3. Hava durumu kodu sayıdır.** `weather_code` değeri `0`, `2`, `61` gibi bir sayıdır. Türkçe karşılıklarına çevirmek için uygulamada bir sözlük tutulur.(WeatherApi Servisi sayfasındaki [`WEATHER_CODES` sözlüğü](weatherapi-servisi-weather-api.ts.md#weather_codes-sozlugu) başlığına bakabilirsiniz.)
{% endhint %}
