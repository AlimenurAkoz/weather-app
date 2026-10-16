# Arayüz Şablonu(weather.html)

`weather.html`, component'teki signal’leri ekrana çevirir. Şablonda iş mantığı yazılmaz, veri ve tarih biçimlendirmesi [component](component-bilesen-mantigi-weather.ts.md#gun-secimi-ve-saatlik-liste)'ten gelir. Dosyanın tamamı için GitHub’daki [`src/app/weather/weather.html`](https://github.com/AlimenurAkoz/weather-app/blob/main/weather-open-api/frontend/src/app/weather/weather.html) dosyasına bakabilirsiniz.

## Şablonun genel yapısı

Şablon yukarıdan aşağıya şu bölümlerden oluşur:

<table><thead><tr><th width="357.6000061035156">Bölüm</th><th>Ne zaman görünür</th><th>Bağlı signal</th></tr></thead><tbody><tr><td>Arama alanı ve öneri listesi</td><td>Her zaman</td><td><code>suggestions</code>, <code>showSuggestions</code></td></tr><tr><td>Hata mesajı ve “Bunu mu demek istediniz?” kutusu</td><td>Hata varsa</td><td><code>error</code>, <code>suggestions</code></td></tr><tr><td>Yükleniyor yazısı</td><td>İstek sürerken</td><td><code>loading</code></td></tr><tr><td>Güncel hava, haftalık ve saatlik tahmin</td><td>Veri geldiyse</td><td><code>weather</code>, <code>selectedDay</code></td></tr><tr><td>Veri kaynağı bağlantısı</td><td>Her zaman</td><td>-</td></tr></tbody></table>

Koşullu bölümler Angular’ın `@if` ve `@for` blokları ile yazılır. Bu bloklar yerleşik olduğu için component'in `imports` listesine bir şey eklemek gerekmez, `weather.ts`’teki `imports: []` listesi boş kalır.

### Arama alanı

```html
 <div class="search-area">
  <div class="search">
    <div class="input-wrapper">
     <input
         #cityInput
         type="text"
         placeholder="Şehir adı yaz"
         aria-label="Şehir adı"
         autocomplete="off"
         (input)="onInput(cityInput.value)"
         (keyup.enter)="search(cityInput.value)"
      />
      ...
    <button type="button" (click)="search(cityInput.value)">Ara</button>
```

* `#cityInput`, kutuya şablon içinde bir ad verir. Değer `cityInput.value` ile okunur, bu yüzden `FormsModule` veya `ngModel` kullanılmaz.
* Kutuda her tuş vuruşunda `onInput` çalışır. "Enter" tuşunda ve "Ara" düğmesinde ise `search` çalışır.
* `autocomplete="off"`, tarayıcının kendi öneri listesinin bizimkinin üstüne binmesini önler.



### **Yazarken açılan öneri listesi**

```html
@if (showSuggestions()) {
  <div class="suggestions">
    @for (
      suggestion of suggestions();
      track suggestion.name + suggestion.country
    ) {
      <button
        type="button"
        class="suggestion"
        (click)="selectSuggestion(suggestion)"
      >
        <span class="suggestion-city">
          {{ suggestion.name }}
        </span>
        <span class="suggestion-location">
          @if (suggestion.admin1) {
            {{ suggestion.admin1 }},
          }
          {{ suggestion.country }}
        </span>
      </button>
    }
  </div>
}
```

* Liste yalnızca `showSuggestions()` `true` iken çizilir.
* `@for` için `track` zorunludur. Burada şehir adı ile ülke birleştirilerek her satıra ayırt edici bir anahtar verilir.
* `admin1` (bölge adı) her sonuçta olmadığı için iç içe bir `@if` ile kontrol edilir.

<figure><img src=".gitbook/assets/image (5).png" alt=""><figcaption><p>Arama kutusuna "ankar" yazılınca çıkan öneri listesi</p></figcaption></figure>

### Hata mesajı ve “Bunu mu demek istediniz?”

```html
@if (error()) {
  <p class="error" role="alert">
    {{ error() }}
  </p>
  @if (suggestions().length > 0) {
    <div class="did-you-mean">
      <strong>Bunu mu demek istediniz?</strong>
      <div class="suggestion-list">
        @for (
          suggestion of suggestions();
          track suggestion.name + suggestion.country
        ) {
          <button
            type="button"
            (click)="selectSuggestion(suggestion)"
          >
            {{ suggestion.name }}, {{ suggestion.country }}
          </button>
        }
      </div>
    </div>
  }
}
```

*   İç içe yazılan iki `@if` kontrolü nedeniyle kutunun görünmesi için iki şartın da sağlanması gerekir:

    1. Hata mesajının bulunması (`error()`)
    2. Öneri listesinin dolu olması (`suggestions()`)

    Hata oluşmadığı sürece öneri listesi dolu olsa dahi kutu açılmaz.
* Yazarken açılan liste ile bu kutu aynı `suggestions` signal’ini kullanır. Ayrım `showSuggestions` ile yapılır, `trySuggestion` bu signal’i `false` bırakır. Ayrıntı için Component Mantığı sayfasındaki [Şehir Önerileri](component-bilesen-mantigi-weather.ts.md#sehir-onerileri) başlığının içeriğine bakınız.
* `role="alert"`, ekran okuyucuların hata mesajını hemen okumasını sağlar.



### Yükleniyor ve veri bloğu

```html
@if (loading()) {
  <div class="loading">Hava durumu yükleniyor...</div>
}
@if (weather(); as w) {
  <section class="report">
    ...
  </section>
}
```

*   `@if (weather(); as w)` yapısı iki temel işlev görür:

    1. `weather` verisi `null` (boş) olduğunda bu bloğu hiç ekrana çizmez.
    2. Veri dolu olduğunda ise gelen değeri `w` takma adıyla (alias) kullanıma sunar.

    Güncel hava durumu, haftalık ve saatlik kartların tamamı bu bloğun içinde yer alır ve `w.city`, `w.daily` gibi alanlara doğrudan `w` üzerinden erişir.

### Güncel hava kartı

```html
<div class="current-top">
  <div>
    <p class="label">ŞU ANDA</p>
    <h2 class="city">{{ w.city }}</h2>
    <p class="country">{{ w.country }}</p>
  </div>
  <div class="current-temperature">{{ w.temperature }}<small>°C</small></div>
</div>
<p class="description">{{ w.description }}</p>
```

Şehir, ülke, sıcaklık ve durum metni doğrudan `WeatherData` alanlarından yazılır. Hiçbiri şablonda dönüştürülmez, yuvarlama ve Türkçe metin [servisten ](weatherapi-servisi-weather-api.ts.md)hazır gelir.

<figure><img src=".gitbook/assets/image (6).png" alt=""><figcaption><p>Güncel Hava Kartı ve Nem Çubuğu</p></figcaption></figure>

### **Nem çubuğu**

```html
<div
  class="meter"
  role="meter"
  aria-label="Nem oranı"
  aria-valuemin="0"
  aria-valuemax="100"
  [attr.aria-valuenow]="w.humidity"
>
  <div 
    class="meter-fill" 
    [style.width.%]="w.humidity"
    ></div>
</div>
```

* `[style.width.%]="w.humidity"` nem değerini doğrudan genişlik yüzdesi yapar. Nem 61 ise iç çubuğun genişliği `%61` olur. Dış çubuğun (`.meter`) genişliği tam kutudur.
* &#x20;`aria-*` özellikleri çubuğun ekran okuyuculara nem göstergesi olarak tanıtılmasını sağlar.&#x20;
* `aria-valuenow` dinamik olduğu için `[attr.aria-valuenow]` ile bağlanır.



### Haftalık tahmin kartları

```html
@for (day of w.daily; track day.date; let i = $index) {
  <button
    type="button"
    class="day-card"
    [class.selected]="selectedDay() === i"
    (click)="selectDay(i)"
  >
    <div class="day-name">{{ formatDay(day.date) }}</div>
    <div class="day-description">{{ getWeatherDescription(day.weatherCode) }}</div>
    <div class="day-temperature">
      <strong>{{ day.temperatureMax }}°</strong>
      <span>{{ day.temperatureMin }}°</span>
    </div>
    ...
  </button>

```

* `let i = $index`, `@for` içinde kartın sırasını verir. Bu sıra hem seçili gün kontrolünde hem `selectDay(i)` çağrısında kullanılır.
* `[class.selected]="selectedDay() === i"` seçili karta `selected` sınıfını ekler. Sınıf yalnızca koşul doğruyken bulunur.
* Kart bir `<button>`’dır. Böylece klavye ile de seçim yapılabilir.
* Tarih ve durum metni için component'teki `formatDay` ve `getWeatherDescription` çağrılır. Gün doğumu ve batımı `formatShortHour` ile gösterilir.

### Saatlik tahmin kartları

```html
<section class="forecast-section">
  <div class="section-heading">
    <div>
      <p class="label">{{ formatDay(w.daily[selectedDay()].date) }}</p>
      <h2>Saatlik tahmin</h2>
     </div>
   </div>
   <div class="hourly-list">
     @for (hour of getSelectedDayHours(w); track hour.time) {
       <article class="hour-card">
         <strong class="hour">{{ formatHour(hour.time) }}</strong>
         <span class="hour-description">{{ getWeatherDescription(hour.weatherCode) }}</span>
         <strong class="hour-temperature">{{ hour.temperature }}°C</strong>
         ...
       </article>          
     }
    </div>
  </section>
</section>
```

* Başlıktaki tarih `w.daily[selectedDay()].date` ile seçili günden alınır, bir güne tıklayınca başlık da değişir.
* Liste `getSelectedDayHours(w)` metodunun sonucundan çizilir. Gün değişince `selectedDay` değişir, metot yeniden çalışır ve liste o günün saatlerine döner.
* `track hour.time` her saat için ayırt edici bir anahtardır.

<figure><img src=".gitbook/assets/image (7).png" alt="" width="563"><figcaption><p>Haftalık ve Saatlik Kartlar</p></figcaption></figure>
