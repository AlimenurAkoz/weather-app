# Görünüm ve İlk Çalıştırma

Bu sayfada önce uygulamanın görünümünü sağlayan iki CSS dosyası, sonra component'i ekrana yerleştiren kök dosyaları ve uygulamanın ilk çalıştırılması anlatılıyor. Dosyaların tamamı için GitHub’daki [`src/styles.css`](https://github.com/AlimenurAkoz/weather-app/blob/main/weather-open-api/frontend/src/styles.css) ve [`src/app/weather/weather.css`](https://github.com/AlimenurAkoz/weather-app/blob/main/weather-open-api/frontend/src/app/weather/weather.css) dosyalarına bakabilirsiniz.

<table><thead><tr><th width="192">Dosya</th><th width="225.4000244140625">Kapsamı</th><th>Ne için</th></tr></thead><tbody><tr><td><code>src/styles.css</code></td><td>Tüm uygulama</td><td>Renk değişkenleri, <code>box-sizing</code>, sayfa arka planı ve yazı tipi</td></tr><tr><td><code>weather/weather.css</code></td><td>Yalnızca <code>Weather</code> component'i</td><td>Kartlar, arama alanı, nem çubuğu, öneri listeleri</td></tr></tbody></table>

{% hint style="info" %}
Angular, component CSS’ini yalnızca o component'in şablonuna uygular. Bu yüzden ortak değerler (renkler) genel dosyada tanımlanır, component dosyası onları kullanır.
{% endhint %}

## Genel stiller: `styles.css`

```css
:root {
  --ink: #16202b;
  --fog: #eef2f5;
  --cloud: #d3dce4;
  --water: #1f6fa8;
  --alert: #b3261e;
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

* `weather.css` renkleri yazmak yerine buradaki değişkenleri kullanır (`var(--water)` gibi). Değişkenler tanımlı değilse component stilleri renksiz kalır.

<table><thead><tr><th width="184.60000610351562">Değişken</th><th>Kullanıldığı yer</th></tr></thead><tbody><tr><td><code>--ink</code></td><td>Metin rengi</td></tr><tr><td><code>--fog</code></td><td>Sayfa arka planı, ince ayırıcı çizgiler</td></tr><tr><td><code>--cloud</code></td><td>Kart ve kutu kenarlıkları, nem çubuğunun boş kısmı</td></tr><tr><td><code>--water</code></td><td>Vurgu rengi: düğme, seçili kart, nem çubuğu</td></tr><tr><td><code>--alert</code></td><td>Hata mesajı</td></tr></tbody></table>



## Component stilleri: `weather.css`

Dosya, [`weather.html`](https://github.com/AlimenurAkoz/weather-app/blob/main/weather-open-api/frontend/src/app/weather/weather.html) 'deki bölümlerle aynı sırayı izler: arama, hata ve öneri kutuları, güncel hava kartı, haftalık kartlar, saatlik kartlar, mobil düzen. Aşağıda yalnızca davranışı belirleyen kısımlar var.

#### **Nem çubuğu**

```css
.meter {
  height: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--cloud);
}
.meter-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--water);
}
```

* `.meter` dış çubuğu, `.meter-fill` iç dolguyu çizer.&#x20;
* `overflow: hidden` ile `border-radius: inherit` iç çubuğun köşelerinin dış çubukla uyumlu olmasını sağlar.

#### **Açılır öneri listesi**

```css
.input-wrapper { position: relative; flex: 1; }

.suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  ...
}
```

* Öneri listesi arama kutusunun hemen altında açılır ve alttaki kartları aşağı itmez, onların üstüne biner. Bunun için üç ayar yapılır:&#x20;
  1. `.input-wrapper`, `position: relative` alır. Liste, konumunu bu kutuya göre belirler.
  2. `.suggestions` ,`position: absolute` alır ve `top: calc(100% + 8px)` ile kutunun alt kenarının 8 piksel altına yerleştirilir. `left: 0` ve `right: 0` listeyi kutuyla aynı genişliğe getirir. `absolute` olduğu için sayfa düzeninde yer kaplamaz, bu yüzden altındaki içerik yerinden oynamaz.
  3. `.search-area`, `z-index: 10` alır. Bu, listeyi altındaki kartların önünde gösterir. Olmazsa kartlar listenin üstünde çizilebilir.

#### **Yatay kaydırma: haftalık ve saatlik liste**

```css
.daily-list {
  display: grid;
  grid-template-columns: repeat(7, minmax(135px, 1fr));
  gap: 10px;
  overflow-x: auto;
}

.hourly-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}

.hour-card { min-width: 145px; }
```

* Haftalık liste 7 eşit sütunlu bir ızgaradır. Her sütun en az 135 px olduğu için dar ekranda sığmayan kartlar sağa kaydırılır.
* Saatlik liste yan yana dizilen esnek bir satırdır. 24 kart sığmayacağı için `overflow-x: auto` ile yatay kaydırılır, `min-width` kartların daralmasını önler.

#### Mobil düzen

```css
@media (max-width: 700px) {
  ...
}
```

* 700 piksel altında arama kutusu ile düğme alt alta dizilir, güncel hava kartı tek sütuna geçer, haftalık kartlar 145 px genişlikte kalıp kaydırılır.

#### Component'i ekrana yerleştirme

`weather` component'i kendi başına ekrana gelmez. Uygulama `index.html`'deki `<app-root>` etiketiyle başlar ve bu etiketin içini kök component (`App`) çizer.&#x20;

Weather'ın görünmesi için kök component'in şablonunda çağrılması gerekir. Bunun için iki dosyada iki değişiklik yapılır.

1. **Etiketi yazmak:** [**`app.html`**](https://github.com/AlimenurAkoz/weather-app/blob/main/weather-open-api/frontend/src/app/app.html)

```html
<app-weather />
```

* `ng new` ile gelen hazır içerik silinip yerine bu tek satır yazılır.&#x20;
* `app-weather`, `weather.ts` içindeki `selector` değeridir.

2. **Component'i tanıtmak:** [**`app.ts`**](https://github.com/AlimenurAkoz/weather-app/blob/main/weather-open-api/frontend/src/app/app.ts)&#x20;

```ts
import { Weather } from './weather/weather';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [Weather],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
...
```

* Angular, bir component’in şablonunda yalnızca o component’in `imports` listesindeki component’lerin etiketlerini tanır. Bu yüzden `Weather`, `App`’in `imports` listesine eklenir. Eklenmezse `<app-weather />` etiketi tanınmaz.

## **Başlangıç akışı**

* `main.ts` → `App` (`<app-root>`) → `app.html` içindeki `<app-weather />` → `Weather` component'i.
* [`main.ts`](https://github.com/AlimenurAkoz/weather-app/blob/main/weather-open-api/frontend/src/main.ts), `bootstrapApplication(App, appConfig)` ile uygulamayı başlatır.

## İlk çalıştırma

`frontend` klasöründeyken terminalde:

```bash
npm start
```

Tarayıcıda `http://localhost:4200` adresini açın. Uygulama açılışta Sivas için arama yapar (Component Mantığı sayfasındaki constructor).

#### Beklenen sonuç

Sayfa üstte başlık ve arama kutusuyla açılır. Altında Sivas’ın güncel hava kartı, 7 günlük kartlar ve ilk günün saatlik kartları görünür.

<figure><img src=".gitbook/assets/image (10).png" alt=""><figcaption></figcaption></figure>
