---
description: >-
  Uygulamanın o anki hali (listede hangi ürünler var, seçim modu açık mı, arama
  kutusuna ne yazılmış) App bileşenindeki birkaç değişkende tutulur.
---

# Değişkenler ve Veri Akışı

[`app.html`](https://github.com/AlimenurAkoz/shopping-list-app/blob/main/src/app/app.html), bu değişkenlere bağlıdır. Bir değişken değiştiğinde Angular ekranı otomatik olarak günceller; ekranı elle değiştiren bir kod yoktur.

## Değişkenler

`app.ts`

| Değişken        | Tip              | Başlangıç | Görevi                                              |
| --------------- | ---------------- | --------- | --------------------------------------------------- |
| `objectName`    | `string`         | `''`      | Ürün ekleme kutusuna yazılan metin                  |
| `products`      | `Product[]`      | `[]`      | Tüm ürünlerin tutulduğu ana dizi                    |
| `counter`       | `number`         | `1`       | Bir sonraki ürüne verilecek sıra numarası           |
| `isOpen`        | `boolean`        | `false`   | Seçim modunun açık olup olmadığı                    |
| `searchProduct` | `string`         | `''`      | Arama kutusuna yazılan metin                        |
| `highlightedId` | `number \| null` | `null`    | Vurgulanan ürünün sıra numarası; vurgu yoksa `null` |

#### Yardımcı değişkenler

Bu değişkenler ekranda doğrudan görünmez, durumu yönetmeye yardım eder:

<table><thead><tr><th width="139.79998779296875">Değişken</th><th>Görevi</th></tr></thead><tbody><tr><td><code>highlightTime</code></td><td>Vurguyu birkaç saniye sonra kaldıracak zamanlayıcının kaydı. Yeni bir vurgu başladığında eski zamanlayıcıyı iptal etmek için tutulur.</td></tr><tr><td><code>cdr</code></td><td>Angular'ın değişiklik algılayıcısı (<code>ChangeDetectorRef</code>). Bekleme gerektiren işlemlerden (onay penceresi, zamanlayıcı) sonra Angular'a "ekranı yeniden kontrol et" demek için kullanılır.</td></tr><tr><td><code>title</code></td><td>Angular'ın proje şablonundan kalan değişken; uygulamada kullanılmaz.</td></tr></tbody></table>

`private` ile tanımlanan değişkenler (`cdr`, `highlightTime`) yalnızca sınıfın içinden kullanılabilir; şablondan erişilemez.

### Değişkenlerin ekrandaki karşılıkları

<table><thead><tr><th width="211">Değişken</th><th>Ekranda etkilediği yer</th></tr></thead><tbody><tr><td><code>objectName</code></td><td>Ekleme kutusunun içeriği; doluysa x butonu görünür</td></tr><tr><td><code>products</code></td><td>Tablo satırları; boşsa "Eksik Yok" ekranı görünür</td></tr><tr><td><code>isOpen</code></td><td>Son sütunda çöp kutusu mu onay kutusu mu görüneceği, buton yazıları ("Seç" / "Vazgeç", "Listeyi Temizle" / "Seçilenleri Sil"), arama kutusunun pasif olması</td></tr><tr><td><code>searchProduct</code></td><td>Tabloda hangi satırların görüneceği; doluysa arama kutusundaki x butonu</td></tr><tr><td><code>highlightedId</code></td><td>Vurgulanan satırın rengi ve o satırdaki + butonunun yanıp sönmesi</td></tr></tbody></table>

### Hesaplanan değerler

Bazı değerler ayrı bir değişkende saklanmaz; ihtiyaç duyulduğunda diziden yeniden hesaplanır.&#x20;

<table><thead><tr><th width="204">Değer</th><th>Hesaplayan</th><th>Ekranda nerede</th></tr></thead><tbody><tr><td>Toplam ürün adedi</td><td><code>totalQuantity()</code></td><td>Alt bardaki "Toplam Ürün Adedi"</td></tr><tr><td>En az bir ürün seçili mi?</td><td><code>isSelected()</code></td><td>"Seçilenleri Sil" butonunun aktif/pasif durumu</td></tr><tr><td>Aramaya uyan ürünler</td><td><code>filterProducts()</code></td><td>Tablo satırları</td></tr><tr><td>Liste boş mu?</td><td><code>products.length == 0</code></td><td>"Eksik Yok" ekranı</td></tr></tbody></table>

**Örnek:** Toplam adedi ayrı bir değişkende tutup her işlemde artırmak/azaltmak, silme veya temizleme gibi bir işlemde güncellemenin unutulmasına açıktır. `totalQuantity()` her çağrıldığında toplamı diziden baştan hesapladığı için bu sorun oluşmaz.

## Veri akışı

```
Kullanıcı işlemi (yazma / tıklama)
        │
        ▼
Şablondaki bağlama: [(ngModel)], (click), (ngSubmit)
        │
        ▼
app.ts metodu: products dizisini veya durum değişkenini değiştirir
        │
        ├──► save() → sessionStorage güncellenir
        │
        ▼
Angular değişikliği algılar → @if / @for / {{ }} yeniden hesaplanır
        │
        ▼
Ekran güncellenir
```

### İki yönlü bağlama(Two way binding)

Ekleme kutusu, arama kutusu ve onay kutuları `[(ngModel)]` ile doğrudan değişkenlere bağlıdır. Akış iki yönlüdür:

* **Ekran → değişken:** Kullanıcı yazdıkça (veya işaretledikçe) değişken anında güncellenir.
* **Değişken → ekran:** Kodda değişken değiştirildiğinde ekran da değişir. Örneğin `clean()` metodu `objectName`'i boşalttığında ekleme kutusu da boşalır.

### Uygulamanın açılışı

Bileşen oluşturulurken `constructor` bir kez çalışır:

```ts
constructor() {
  const record = sessionStorage.getItem("products");
  if (record) {
    this.products = JSON.parse(record);
    this.counter = this.products.length + 1;
    this.closeSelect();
  }
}
```

1. `sessionStorage`'da `products` anahtarıyla kayıt aranır.
2. Kayıt varsa metin diziye çevrilip `products`'a atanır.
3. Sayaç, yeni eklenecek ürünün doğru numarayı alması için "eleman sayısı + 1" yapılır.
4. Önceki oturumdan kalmış olabilecek işaretler `closeSelect()` ile temizlenir; çünkü seçim modu (`isOpen`) her açılışta kapalı başlar.

Kayıt yoksa uygulama boş listeyle açılır ve "Eksik Yok" ekranı görünür.

### Bekleme gerektiren işlemler(Asenkron İşlemler)

Çoğu işlem anında tamamlanır ve Angular ekranı hemen günceller. İki işlem de bekleme içerir:

* **Onay penceresi:** `add()` ve `availableProduct()` metotları `async` olarak tanımlıdır. `await Swal.fire(...)` satırında kod, kullanıcı "Artıralım" ya da "Yeterli"ye basana kadar bekler.
* **Zamanlayıcılar:** Vurgu `setTimeout` ile 6 saniye sonra kaldırılır; satıra kaydırma da kısa bir gecikmeyle yapılır.

Onay penceresi kapandıktan sonra ve vurgu kaldırıldığında, Angular'ın ekranı yeniden kontrol etmesi için `this.cdr.markForCheck()` çağrılır. Böylece ekran güncellenir.
