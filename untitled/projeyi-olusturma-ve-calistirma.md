# Projeyi Oluşturma ve Çalıştırma

## Projeyi Oluşturma(Sıfırdan)

1. Gereksinimleri kontrol et

```
node -v
npm -v
```

2. Angular CLI'ı Kur

```
npm install -g @angular/cli
ng version
```

3. Projeyi Oluştur

```
mkdir shopping-list-app
cd shopping-list-app
ng new shopping-list-app --directory .
```

`ng new` çalışırken sorulan sorulara bu projede verilen cevaplar:

<table><thead><tr><th width="675.8000183105469">Soru</th><th>Cevap</th></tr></thead><tbody><tr><td>Would you like to share pseudonymous usage data about this project with the Angular Team at Google under Google's Privacy Policy at https://policies.google.com/privacy. For more details and how to change this setting, see https://angular.dev/cli/analytics . (y/N) <br>(Google'ın https://policies.google.com/privacy adresindeki Gizlilik Politikası uyarınca, bu projeye ilişkin takma adla ilişkilendirilmiş kullanım verilerini Google'daki Angular Ekibi ile paylaşmak ister misiniz? Daha fazla bilgi ve bu ayarı nasıl değiştireceğinizi öğrenmek için https://angular.dev/cli/analytics adresini ziyaret edin.(e/H)</td><td><code>N</code> (hayır)</td></tr><tr><td>Stylesheet format</td><td><code>CSS</code></td></tr><tr><td>SSR / prerendering</td><td><code>No</code></td></tr><tr><td>AI tools</td><td><code>None</code></td></tr></tbody></table>

{% hint style="info" %}
Soruların sırası ve adı CLI sürümüne göre değişebilir.&#x20;
{% endhint %}

4. Her ürünün hangi alanlara sahip olacağını ve bu alanların tiplerini belirlemek amacıyla `product.ts` dosyasını oluştur:

```
cd src/app
ng generate interface models/product
```

5. Onay penceresi ve bildirim ekranı için SweetAlert2'yi yükle:

* Onay penceresi ve bildirim için kullanılan paket:

```bash
npm install sweetalert2
```

* `app.ts` dosyasında içeri alınır:

```ts
import Swal from 'sweetalert2';
```

## &#x20;Projeyi Çalıştırma

#### **Hazır projeyi bilgisayara alıp çalıştırmak için:**

```bash
git clone https://github.com/AlimenurAkoz/shopping-list-app
cd shopping-list-app
npm install
npm start
```

#### Geliştirme sunucusu aşağıdaki iki komuttan biriyle başlatılır:

<table><thead><tr><th width="125.79998779296875">Komut</th><th>Açıklama</th></tr></thead><tbody><tr><td><code>npm start</code></td><td><code>package.json</code> içindeki <code>start</code> betiğini çalıştırır. Projeyle birlikte inen yerel Angular CLI'ı kullandığı için Angular CLI'ın global kurulu olmasına gerek yoktur.</td></tr><tr><td><code>ng serve</code></td><td>Angular CLI'ın doğrudan komutudur. Global kurulu <code>ng</code> gerektirir. Ek parametreleri kolayca yazmak için uygundur (örneğin <code>ng serve --port 4300</code>).</td></tr></tbody></table>

`npm start`, arka planda `ng serve` komutunu çalıştırdığı için ikisi aynı sonucu verir. Sunucu başladığında uygulama `http://localhost:4200` adresinde açılır.

## **Diğer komutlar**:

#### Testleri çalıştırmak için(.spec.ts dosyaları):

* `ng` kullanılıyorsa:

```bash
ng test
```

* `npm` kullanılıyorsa:

```bash
npm test
```

Testler izleme modunda açılır. Beklenen sonuç:

<figure><img src=".gitbook/assets/image (1).png" alt=""><figcaption></figcaption></figure>

#### Uygulamayı derlemek için:

* `ng` kullanılıyorsa:

```bash
ng build
```

* `npm` kullanılıyorsa:

```bash
npm run build
```
