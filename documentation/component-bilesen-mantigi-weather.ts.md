# Component(Bileşen) Mantığı(weather.ts)

`weather.ts`  kullanıcının yazdığı şehri servise iletir, gelen veriyi signal’lerde tutar ve şablonun kullanacağı yardımcı metotları sağlar. Dosyanın tamamı için GitHub’daki [`src/app/weather/weather.ts`](https://github.com/AlimenurAkoz/weather-app/blob/main/weather-open-api/frontend/src/app/weather/weather.ts) dosyasına bakabilirsiniz.

### Servis ve Signal’ler

* Component servisi `inject` ile alır ve ekranın bağlı olduğu durumu signal’lerde tutar:

```ts
export class Weather {
  private api = inject(WeatherApi);
  weather = signal<WeatherData | null>(null);
  error = signal('');//Hata mesajı yokken boş metin
  suggestions = signal<CitySuggestion[]>([]);//Şehir önerileri listesi
  showSuggestions = signal(false);//Açılır listenin görünüp görünmeyeceği 
  loading = signal(false);//İstek sürerken true
  selectedDay = signal(0);//Seçili günün sırası(0 = bugün)
  private searchSubject = new Subject<string>();
  ...
}
```

`weather` signal’i `WeatherData | null` tipindedir. Veri gelmeden önce `null` olduğu için şablon `@if (weather(); as w)` ile kontrol eder.

#### Constructor: otomatik başlangıç

Sayfa ilk açıldığında boş ekran görünmesin diye constructor “Sivas” araması yapar:

```ts
constructor() {
  this.search('Sivas');
  this.searchSubject
    .pipe( ... );
}
```

İkinci satırdaki zincir yazarken çıkan öneri listesidir, aşağıdaki **Şehir önerileri** bölümünde anlatılıyor.

#### `search`: servisi çağırma

"Ara" düğmesine basılması, kutuda Enter tuşu ve açılış araması bu metodu çağırır:

```ts
search(city: string) {
  const value = city.trim();
  if (!value) {
    return;
  }
  this.error.set('');
  this.loading.set(true);
  this.showSuggestions.set(false);
  this.api.getWeather(value).subscribe({
    next: (data) => {
      this.weather.set(data);
      this.selectedDay.set(0);
      this.loading.set(false);
    },
    error: () => {
      this.weather.set(null);
      this.loading.set(false);
      this.error.set("Şehir bulunamadı veya API'ye ulaşılamadı");
      this.trySuggestion(value);
    },
  });
}
```

* **Başlangıç:** Boş metin aranmaz. İstek başlarken eski hata temizlenir, `loading` açılır ve öneri listesi kapatılır.
* **`subscribe` zorunludur:** `getWeather` bir Observable döndürür, istek `subscribe` edilene kadar gitmez (ilk sayfa).
* **`next`:** Veri `weather` signal’ine yazılır, böylece ekran otomatik güncellenir. `selectedDay` her yeni aramada `0`’a döner, yani şehir değişince bugünün kartı seçili gelir.
* **`error`:** Servisteki `throwError` (WeatherApi Servisi sayfası) veya ağ hatası buraya düşer. Hata mesajı iki durumu ayırt etmez, ikisi için de aynıdır. Eski veri ekranda kalmasın diye `weather` `null` yapılır.

#### Gün seçimi ve saatlik liste

Haftalık kartlardan biri seçilince saatlik liste o günün saatlerine göre değişir:

```ts
selectDay(index: number) {
  this.selectedDay.set(index);
}
getSelectedDayHours(weather: WeatherData) {
  const selectedDate = 
    weather.daily[this.selectedDay()]?.date;
  if (!selectedDate) {
    return [];
  }
  return weather.hourly.filter((hour) =>
    hour.time.startsWith(selectedDate),
  );
}
```

**`getSelectedDayHours`**: Servis, 7 günün 168 saatini tek bir `hourly` listesinde verir. Metot seçili günün tarihini alır ve yalnızca saati bu metinle başlayan elemanları ayırır. Bu yöntem, `timezone=auto` sayesinde saatlerin `2026-10-14T13:00` biçiminde ve şehrin yerel saatiyle gelmesine dayanır. Tarih karşılaştırması için ayrıca `Date` nesnesine çevirmeye gerek kalmaz.

`?.` ile `date` okunurken liste boş veya seçim geçersizse hata yerine boş liste döner.

#### Biçimlendirme metotları

1. **Şablon tarih ve saatleri bu üç metotla Türkçe gösterir:**

```ts
formatDay(value: string): string {
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}
formatHour(value: string): string {
  const date = new Date(value);
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
formatShortHour(value: string): string {
  const date = new Date(value);
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
  });
}
```

* `formatShortHour` yalnızca saati gösterir (`hour: '2-digit'`).&#x20;
* `formatDay` tarihe `T12:00:00` ekler.



2. **Durum metni için component servise yönlendirir:**

```ts
getWeatherDescription(code: number): string {
  return this.api.getWeatherDescription(code);
}
```

#### Şehir Önerileri

Aynı `suggestions` signal’i iki farklı yerde kullanılır. Ayrımı `showSuggestions` yapar:

<table data-header-hidden><thead><tr><th width="531.7999572753906"></th><th></th></tr></thead><tbody><tr><td>Durum</td><td><code>showSuggestions</code></td></tr><tr><td>Şehir aramasında kullanıcı kutuya şehir yazarken</td><td><code>true</code></td></tr><tr><td>Arama sonuç vermeyince ("Bunu mu demek istediniz?")</td><td><code>false</code></td></tr></tbody></table>

**Yazarken öneri:**

Şablondaki giriş kutusu her tuş vuruşunda `onInput`’u çağırır:

```ts
onInput(value: string) {
  this.searchSubject.next(value);
}
```

Değerler constructor’daki zincirden geçer:

```ts
this.searchSubject
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((value) => {
      if (value.trim().length < 2) {
        return of([]);
      }
      return this.api.getSuggestions(value);
    }),
  )
  .subscribe({
    next: (data) => {
      this.suggestions.set(data);
      this.showSuggestions.set(data.length > 0);
    },
    error: () => {
      this.suggestions.set([]);
      this.showSuggestions.set(false);
    },
  });
```

* `debounceTime(300)`: kullanıcı yazmayı bıraktıktan 300 milisaniye (0,3 saniye) sonra istek atılır. Bu süre dolmadan yeni bir tuşa basılırsa bekleme sıfırlanır. Böylece her tuş vuruşu için ayrı bir API isteği gönderilmez.
* `distinctUntilChanged()`: değer değişmediyse tekrar sorulmaz.
* `switchMap`: yeni yazım gelince önceki istek iptal edilir, yalnızca en son yazımın cevabı kullanılır.

Listeden bir öneriye tıklanınca şu metot çalışır:

```ts
selectSuggestion(suggestion: CitySuggestion) {
  this.search(suggestion.name);
  this.suggestions.set([]);
  this.showSuggestions.set(false);
}
```

`search` hata verince `trySuggestion` çağrılır. Bu metot aranan metnin son harfini atıp öneri sorar (Bunu mu demek istediniz?):

```ts
private trySuggestion(value: string) {
  const shortenedValue =
    value.length > 3
      ? value.substring(0, value.length - 1)
      : value;
  this.api.getSuggestions(shortenedValue).subscribe({
    next: (suggestions) => {
      if (suggestions.length > 0) {
        this.suggestions.set(suggestions.slice(0, 3));
        this.showSuggestions.set(false);
      }
    },
  });
}
```

[**Örnek**](open-meteo.md#id-1.-geocoding-api)**:** `sivast` aranır, Geocoding sonuç vermez (Open-Meteo sayfasındaki örnek). `sivas` ile yapılan ikinci istek sonuç döndürürse ilk üç öneri `suggestions`’a yazılır ve hata mesajının altındaki kutuda gösterilir.

{% hint style="info" %}
Bu projede tek bir yazım hatasına odaklanıldı. Birçok yazım hatası olasılığı için algoritma eklenip proje geliştirilebilir.
{% endhint %}

