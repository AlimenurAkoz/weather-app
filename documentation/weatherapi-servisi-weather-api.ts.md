# WeatherApi Servisi(weather-api.ts)

`weather-api.ts` uygulamanın dış dünyayla konuşan tek dosyasıdır. Bu sayfada önce servisin kullandığı veri tiplerini, sonra Open-Meteo’ya iki aşamalı isteği nasıl attığı anlatılıyor. Dosyanın tamamı için GitHub'da [**`weather-app`**](https://github.com/AlimenurAkoz/weather-app) reposundaki [`src/app/weather-api.ts`](https://github.com/AlimenurAkoz/weather-app/blob/main/weather-open-api/frontend/src/app/weather-api.ts) dosyasına bakabilirsiniz.

Weather App sayfasındaki servisi oluşturma aşamasını incelemek için [buraya tıklayabilirsiniz.](./#id-4.-bilesen-ve-servisi-olustur)

## Veri Modelleri

Dosyada dört interface vardır. `WeatherData` ve `CitySuggestion` dışa açılır (`export`), çünkü bileşen (`weather.ts`) bunları import eder. `GeocodingResponse` ve `ForecastResponse` ise Open-Meteo cevaplarının ham halini tanımlar ve yalnızca bu dosyada kullanılır. Alan adları [Open-Meteo ](open-meteo.md)sayfasındaki JSON ile aynıdır.

Bileşenin kullandığı tip `WeatherData`'dır:

```ts
export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  hourly: {
    time: string;
    temperature: number;
    apparentTemperature: number;
    precipitationProbability: number;
    precipitation: number;
    windSpeed: number;
    weatherCode: number;
  }[];
  daily: {
    date: string;
    temperatureMax: number;
    temperatureMin: number;
    precipitationProbability: number;
    precipitation: number;
    weatherCode: number;
    sunrise: string;
    sunset: string;
  }[];
}
```

{% hint style="info" %}
Ham cevapta `hourly` ve `daily` alanları paralel dizilerdir. Burada her saat ve gün için tek bir nesne bulunur. Alan adları da API’dekinden farklıdır (`temperature_2m_max` yerine `temperatureMax`), böylece bileşen ve şablon API’nin adlandırmasından bağımsız kalır.&#x20;
{% endhint %}

Şehir önerileri için ayrı bir tip vardır:

```ts
export interface CitySuggestion {
  name: string;
  country: string;
  countryCode: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}
```

{% hint style="info" %}
`admin1?`'deki `?` bu alanın isteğe bağlı olduğunu gösterir. Geocoding cevabında bölge adı her sonuçta bulunmayabilir.
{% endhint %}

## Servis İskeleti

Servis sınıfı `@Injectable` ile işaretlenir, `HttpClient` `inject` ile alınır.

```ts
@Injectable({ providedIn: 'root' })
export class WeatherApi {
  private http = inject(HttpClient);
  private geocodingUrl =
    'https://geocoding-api.open-meteo.com/v1/search';
  private forecastUrl =
    'https://api.open-meteo.com/v1/forecast';
    ...
}
```

* `providedIn: 'root'` servisin uygulama genelinde tek bir örnek olarak oluşturulmasını sağlar. Bileşen onu `inject(WeatherApi)` ile alır.
* `inject(HttpClient)` çalışsın diye `app.config.ts` içine `provideHttpClient()` eklenmişti.

### `getWeather`: iki aşamalı istek

`getWeather(city)` metodu şehir adını alır ve `Observable<WeatherData>` döndürür. Bileşen `subscribe` edene kadar istek gönderilmez.

#### **1. Geocoding isteği**

```ts
getWeather(city: string): Observable<WeatherData> {
    return this.http
      .get<GeocodingResponse>(this.geocodingUrl, {
        params: {
          name: city.trim(),
          count: 1,
          language: 'tr',
        },
      })
      .pipe( ... );
```

`get<GeocodingResponse>` ifadesindeki tip, cevabın hangi biçimde olduğunu TypeScript’e söyler. `params` nesnesi adrese eklenir. `count: 1` verilmesinin sebebi, hava durumu için en iyi eşleşmenin yeterli olmasıdır.

#### **2. `switchMap` ile zincirleme**

Forecast isteği Geocoding’in sonucuna (koordinatlara) bağlı olduğu için `switchMap` ile zincirlenir:

```ts
.pipe(
  switchMap((geo) => {
    const place = geo.results?.[0];
    if (!place) {
      return throwError(
        () => new Error('Şehir bulunamadı')
      );
    }
    return this.http
      .get<ForecastResponse>(this.forecastUrl, {
        params: {
          latitude: place.latitude,
          longitude: place.longitude,
          current: 'temperature_2m,relative_humidity_2m,weather_code',
          hourly: 'temperature_2m,apparent_temperature,precipitation_probability,precipitation,wind_speed_10m,weather_code',
          daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,weather_code,sunrise,sunset',
          forecast_days: 7,
          timezone: 'auto',
      },
    })
    .pipe(...);
```

`switchMap` önceki isteğin sonucunu alır ve Forecast isteği olan yeni bir Observable döndürür. Koordinatlar `place.latitude` ve `place.longitude` olarak buradan gelir.

{% hint style="info" %}
`geo.results?.[0]` ifadesindeki `?.`, `results` alanı yoksa hata vermeden `undefined` döndürür. Şehir bulunamadığında API’de bu alan hiç gelmez.
{% endhint %}

### **`map` ile veri süzme:**

Forecast cevabı gelince `map` onu `WeatherData`’ya çevirir.

```ts
.pipe(
  map(
    (forecast): WeatherData => ({
      city: place.name,
      country: place.country ?? '',
      temperature: Math.round(
        forecast.current.temperature_2m,
      ),
      description:
        WEATHER_CODES[
          forecast.current.weather_code
        ] ?? 'Bilinmiyor',
      humidity:
        forecast.current.relative_humidity_2m,
      hourly: forecast.hourly.time.map(
        (time, index) => ({
          time,
          temperature: Math.round(
            forecast.hourly.temperature_2m[index],
          ),
          apparentTemperature: Math.round(
            forecast.hourly.apparent_temperature[index],
          ),
         ...
          weatherCode:
            forecast.hourly.weather_code[index],
        }),
      ),
      daily: forecast.daily.time.map(
        (date, index) => ({...}),
      ),
    }),
  )
)
```

**`.map((time, index) => ...)`:** `hourly.time` dizisinin her elemanı için, aynı `index`’teki diğer dizilerin elemanları bir nesnede toplanır. Paralel dizilerin birleştirildiği yer burasıdır.

### `WEATHER_CODES` sözlüğü

Open-Meteo hava durumunu sayı (WMO kodu) olarak verir. Türkçe metne çevirmek için dosyanın başında bir sözlük tutulur:

```ts
const WEATHER_CODES: Record<number, string> = {
   0: 'Açık',
  1: 'Çoğunlukla açık',
  2: 'Parçalı bulutlu',
  3: 'Kapalı',
  45: 'Sisli',
  61: 'Hafif yağmur',
  75: 'Yoğun kar',
  ...
};
```

**Bileşen, saatlik ve günlük kartlardaki durum metni için serviste çağırılan metot:**

```ts
getWeatherDescription(weatherCode: number): string {
   return WEATHER_CODES[weatherCode] ?? 'Bilinmiyor'; 
}
```

### `throwError` ile hata yönetimi

Şehir bulunamazsa zincir `switchMap` içinde kesilir:

```ts
if (!place) {
  return throwError(
    () => new Error('Şehir bulunamadı')
  );
}
```

Hata bileşendeki `subscribe`’ın `error` kısmında yakalanır ve uygulama çökmeden kullanıcıya mesaj gösterilir. Ağ hatalarını `HttpClient` kendisi fırlatır, kodda ayrıca bir işlem yoktur.

{% hint style="info" %}
Hata iki durumda oluşur: Geocoding sonuç vermezse (yukarıdaki kontrol) veya istek ağ hatasıyla başarısız olursa. İkinci durumda `HttpClient` hatayı kendisi fırlatır, kodda ayrıca bir işlem yoktur.
{% endhint %}

### `getSuggestions`: şehir önerisi

Aynı Geocoding servisi öneri listesi için de kullanılır. Bu kez sonuç sayısı 3'dir ve cevap `CitySuggestion` listesine çevrilir:

```ts
getSuggestions(city: string): Observable<CitySuggestion[]> {
  const value = city.trim();
  if (value.length < 2) {
    return of([]);
  }
  return this.http
    .get<GeocodingResponse>(this.geocodingUrl, {
      params: { 
        name: value,
        count: 3, 
        language: 'tr' },
    })
    .pipe(
      map((response) =>
        (response.results ?? []).map((place) => ({
          name: place.name,
          country: place.country ?? '',
          countryCode: place.country_code ?? '',
          admin1: place.admin1,
          latitude: place.latitude,
          longitude: place.longitude,
        })),
      ),
    );
}
```

İki harften kısa metinde istek atılmaz. Sonuç bulunamazsa hata fırlatılmaz, boş liste döner, çünkü öneri bulunmaması bir hata değildir. Metot bileşende iki yerde kullanılır: yazarken açılan liste ve “Bunu mu demek istediniz?” kutusu.

#### Beklenen sonuç

Servis tek başına ekranda bir şey göstermez. Çalıştığını görmek için uygulamayı başlatıp tarayıcının geliştirici araçlarında **Network(Ağ)** sekmesine bakabilirsiniz. Bir şehir aradığınızda iki istek görürsünüz:

1\. `geocoding-api.open-meteo.com`,&#x20;

2\. `api.open-meteo.com`.
