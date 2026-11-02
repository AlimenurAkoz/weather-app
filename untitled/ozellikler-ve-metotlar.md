---
description: >-
  Bu sayfada, uygulamanın her özelliğinin nasıl çalıştığı ve hangi metotları
  kullandığı anlatılıyor.
---

# Özellikler ve Metotlar

## Ürün Ekleme

Kullanıcının yazdığı ürün, yeni bir `Product` nesnesi olarak `push()` ile dizinin sonuna eklenir. Ürün listede zaten varsa yeni satır açılmaz; kullanıcıya adedi artırmak isteyip istemediği sorulur. [Tekrar eden ürün uyarısı](ozellikler-ve-metotlar.md#tekrar-eden-urun-uyarisi) kısmından detaylı incelenebilir.

`app.html`

```html
<form (ngSubmit)="add()">
  <div class="input-text">
    <input type="text" id="objectName" [(ngModel)]="objectName" name="objectName" placeholder="Ürün adını giriniz" />
    ...
</form>
```

* `(ngSubmit)` forma bağlı olduğu için hem "Ekle" butonu hem de enter tuşu `add()` metodunu çalıştırır.
* Form içinde `ngModel` kullanan giriş alanlarında `name` özelliği zorunludur.
* `ngModel`, `ngSubmit` gibi form özelliklerini kullanabilmek için `FormsModule app.ts` dosyasında import edilir.

```typescript
import { FormsModule } from '@angular/forms';
@Component({  
  imports: [FormsModule],
  ...
}
```

`app.ts`

```ts
async add() {
  const name = this.objectName.trim();
  if (name == '') {
    return;
  }
  const existing = this.findProduct(name);
  if (existing) {
    await this.availableProduct(existing);
    return;
  }
  const newProduct: Product = { id: this.counter, productName: name, quantity: 1, selected: false }
  this.products.push(newProduct);
  this.counter++;
  this.clean();
  this.save();
}
```

* `trim()` baştaki ve sondaki boşlukları siler. Böylece yalnızca boşluktan oluşan girişler reddedilir ve " Süt " gibi önünde boşluk olan girişler "Süt" olarak boşluksuz kaydedilir.
* `return`, koşul sağlanmadığında metodu erken bitirir; geri kalan satırlar çalışmaz.
* Metot `async` olarak tanımlanmıştır, çünkü ürün listede varsa onay penceresinin kapanmasını `await` ile bekler.(Asenkron işlem)

Ürün eklemek için kullanılan giriş kutusunu temizlemek için "x" butonu eklenir, `app.html`'de `type="button"` olarak tanımlanır. Bu butonun konumu ve stili `app.css`'te ayarlanır.

## Tekrar Eden Ürün Uyarısı

Listede mevcut olan bir ürün eklenmek istendiğinde yeni satır açılmaz. Kullanıcıya ürünün listede kaç adet olduğu gösterilir ve adedi artırmak isteyip istemediği sorulur.

<table><thead><tr><th width="125.39996337890625">Seçim/Buton</th><th>İşlem</th></tr></thead><tbody><tr><td>Artıralım</td><td>Pencere kapanır, ilgili satır vurgulanır ve görünür alana kaydırılır, satırdaki "+" butonu yanıp söner. Adet, kullanıcı "+" butonuna bastığında artar.</td></tr><tr><td>Yeterli</td><td>Pencere kapanır, ekleme yapılmaz, sağ alt köşede "Ürün eklenmedi." bildirimi görünür.</td></tr></tbody></table>

Her iki durumda da giriş kutusu temizlenir.

### Aynı ürünün tespiti

`app.ts`

```ts
findProduct(name: string): Product | undefined {
  const text = name.trim().toLocaleLowerCase('tr');
  return this.products.find(p => p.productName.trim().toLocaleLowerCase('tr') == text);
}
```

* `find()`, koşulu sağlayan ilk elemanın kendisini döndürür; bulamazsa `undefined` döner. Dönüş tipi `Product | undefined` bu yüzden iki seçenek içerir.
* `toLocaleLowerCase('tr')`, Türkçe kurallarına göre küçük harfe çevirir. `'tr'` yazılmazsa "I" harfi "ı" yerine "i" olur ve "Ispanak" ile "ispanak" eşleşmez.

<figure><img src=".gitbook/assets/image (4).png" alt="" width="545"><figcaption></figcaption></figure>

### Onay penceresi ve bildirim: SweetAlert2

Tarayıcının hazır `confirm()` penceresi buton yazılarının değiştirilmesine izin vermez ve görünümü özelleştirilemez. Bu nedenle pencere ve bildirim için "SweetAlert2" kütüphanesi kullanıldı. Kurulumuna [Proje Oluşturma ve Çalıştırma](projeyi-olusturma-ve-calistirma.md#projeyi-olusturma-sifirdan) sayfasından ulaşabilirsiniz.

#### Onay penceresi

```ts
const result = await Swal.fire({
  title: "Ürün Eklensin mi?",
  text: `Eklemeye çalıştığınız ürün listede ${product.quantity} adet bulunuyor. Sayısı artırmak ister misiniz?`,
  ...
});
```

* `Swal.fire()` bir söz (Promise) döndürür; `await` ile kullanıcı bir butona basana kadar beklenir. Sonuç `result.isConfirmed` ile okunur: "Artıralım" butonuna basıldıysa `true`, "Yeterli" butonuna basıldıysa veya pencere kapatıldıysa `false` olur.
* Metin ters tırnak (`` ` ``) ile yazılmıştır. Bu yazımda `${...}` içine değişken yerleştirilebilir (template literal); ürünün adedi metne bu şekilde eklenir.

Bildirim için aynı fonksiyon `toast: true` ile kullanılır. `position: 'bottom-end'` bildirimi sağ alt köşeye yerleştirir, `timer: 2500` 2,5 saniye sonra kapatır.

### Satır vurgusu

```ts
highlight(product: Product) {
  clearTimeout(this.highlightTime);
  this.highlightedId = product.id;

  setTimeout(() => {
    document.getElementById('row-' + product.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  this.highlightTime = setTimeout(() => this.clearHighlight(), 6000);
}
```

* Vurgulanan ürün, `highlightedId` değişkenindeki sıra numarasıyla belirlenir. Vurgu 6 saniye sonra `clearHighlight()` ile kaldırılır.
* `clearTimeout(this.highlightTime)` art arda iki vurgu yapıldığında önceki zamanlayıcıyı iptal eder. İptal etmeseydi eski zamanlayıcı yeni vurguyu erken kaldırırdı.
* `scrollIntoView()` satırı kaydırılabilir tablo alanında görünür konuma getirir. Gecikmesiz bir `setTimeout` içinde çağrılır, çünkü Angular satırı bir sonraki çizimde günceller.
* `?.` ile eleman bulunamazsa hata vermeden işlemi atlar.
* `highlightTime` değişkeninin tipi `ReturnType<typeof setTimeout>` olarak yazılmıştır; bu, "`setTimeout`'un döndürdüğü değerin tipi" anlamına gelir.

`app.html`

```html
<tr [id]="'row-' + product.id" [class.highlight]="product.id == highlightedId">
  ...
  <button class="operation" [class.pulse]="product.id == highlightedId" type="button" (click)="increase(product)">+</button>
</tr>
```

* `[id]` her satıra `row-1`, `row-2` gibi benzersiz bir kimlik verir; `scrollIntoView()` satırı bu kimlikle bulur.
* `[class.highlight]="koşul"` koşul doğruysa elemana `highlight` sınıfını ekler, değilse kaldırır.&#x20;

<figure><img src=".gitbook/assets/image (6).png" alt="" width="529"><figcaption></figcaption></figure>

### Ekran güncellemesi

Pencere kapandıktan ve vurgu zamanlayıcısı bittikten sonra `this.cdr.markForCheck()` çağrılır. Bu satır, bekleme sonrasında yapılan değişikliklerin (giriş kutusunun temizlenmesi, vurgunun kalkması) ekrana hemen yansıması için Angular'a ekranı yeniden kontrol etmesini söyler.

## Adet Artırma ve Azaltma

Her satırdaki "−" ve "+" butonları, o satırdaki ürünün adedini bir azaltır veya bir artırır.

`app.ts`

```ts
decrease(product: Product) {...}
```

`decrease()` metoduyla adet sayısı 1 azaltılır, `increase()` metoduyla ise adet sayısı  artırılır. Bu metotlarda;

* Sayı (`product.quantity`) değil, ürünün kendisi (`product`) alınır. Sayılar metoda kopya olarak gider; nesneler ise referans olarak gider. Bu yüzden metotta yapılan değişiklik dizideki asıl ürünü değiştirir ve tablo kendiliğinden güncellenir.
* Azaltma işleminde adet 1'in altına inemez. Şablonda `[disabled]="product.quantity == 1"` ile "−" butonu pasif yapılır; metottaki koşul da ayrıca bu sınırı korur.
* Vurgulu satırın "+" butonuna basıldığında adet artar ve vurgu kalkar.

## Ürün Silme

Belirli bir ürünü silmek için önce o ürünün dizideki konumu bulunur, sonra o konumdan silinir yani ürün diziden çıkarılır. Kalan ürünlerin sıra numaraları boşluk kalmayacak şekilde yeniden verilir. Bu iş için `findIndex()` ve `splice()` birlikte kullanılır.

`app.ts`

```ts
delete(product: Product) {
  const index = this.products.findIndex(p => p.id == product.id);
  this.products.splice(index, 1);
  this.clearHighlight();
  this.indexSort();
  this.save();
}

indexSort() {
  for (let i = 0; i < this.products.length; i++) {
    this.products[i].id = i + 1;
  }
  this.counter = this.products.length + 1;
}
```

* `findIndex()`, koşulu sağlayan ilk elemanın dizideki konumunu döndürür. `p => p.id == product.id` ifadesi "sıra numarası silinecek ürünle aynı olanı bul" anlamına gelir.
* `splice(index, 1)`, verilen konumdan başlayarak 1 eleman siler. Arkadaki elemanlar boşluk kalmadan öne kayar.
* `indexSort()`, her ürünün sıra numarasını dizideki yerine göre (`i + 1`) yeniden verir ve sayacı "eleman sayısı + 1" yapar. Sayaç güncellenmezse bir sonraki ürün eski yüksek numaradan devam eder.

Satırın tablodan kaybolması için ayrıca kod yazılmaz. Tablo satırları `@for` ile diziden üretildiği için, diziden eleman silindiği anda Angular tabloyu yeniden oluşturur.

Sıra numaralarının yeniden verilmesi hem tek ürün silmede hem de seçilenleri silmede gerekir. Bu yüzden `indexSort()` adında ayrı bir metot oluşturularak kod tekrarı önlenir.

## Listede Arama

Arama işlemi `filterProducts()` metoduyla sağlanır. Bu metotta:

* `filter()` , koşulu sağlayan elemanlardan yeni bir dizi döndürür; asıl dizi değişmez.
* `includes()` ürün adının arama metnini içerip içermediğine bakar.

```typescript
filterProducts(): Product[] {
    const searchText = this.searchProduct.trim().toLocaleLowerCase('tr');
    return this.products.filter(p => p.productName.toLocaleLowerCase('tr').includes(searchText));
  }
```

Tablonun `@for` döngüsü asıl dizi yerine bu metodun döndürdüğü diziyi dolaşır. Sonuç yoksa `@empty` bloğu "Ürün alışveriş listenizde bulunmuyor." mesajını gösterir.

Seçim modunda arama ile gizlenen işaretli ürünlerin de "Seçilenleri Sil" ile silinmemesi için arama kutusu `[disabled]="isOpen"` ile pasif olur.&#x20;

<figure><img src=".gitbook/assets/image (2).png" alt="" width="521"><figcaption></figcaption></figure>

## Seçim Modu ve Toplu Silme

Seç butonuna basıldığında; son sütundaki çöp kutuları onay kutularına, "Seç" butonu "Vazgeç" butonuna, "Listeyi Temizle" butonu "Seçilenleri Sil" butonuna dönüşür.&#x20;

`app.html`

```html
<td>
  @if (isOpen){
  <input type="checkbox" [(ngModel)]="product.selected">
  }@else {
  <button class="delete-btn" type="button" (click)="delete(product)">🗑️</button>
  }
</td>
```

* "Vazgeç" butonuna basılarak mod kapatma işleminde `openClose()` metodundaki `closeSelect()` tüm işaretleri kaldırır. Bu yapılmazsa mod tekrar açıldığında eski seçimler işaretli gelir.
* `isSelected()` işaretli ilk ürünü bulduğunda `return true` ile döngüden çıkar.
* Temizleme butonu `[disabled]="isOpen && !isSelected()"` ile yalnızca seçim modu açıkken hiçbir ürün işaretli değilse pasif olur.

<figure><img src=".gitbook/assets/image (7).png" alt="" width="563"><figcaption></figcaption></figure>

## Listeyi Temizleme

`clearList()` metoduyla;

* Seçim modu açıkken `filter()` ile işaretli olmayan ürünler bırakılır.
* Seçim modu kapalıyken dizinin `length` değeri 0 yapılır böylece dizi tamamen boşaltılır.

## Toplam Ürün Adedi

* Toplam ürün adedi ayrı bir değişkende tutulmaz. Ekleme, silme ve adet değişikliklerinden sonra `totalQuantity()` metodu çağırılarak yeniden hesaplanır.
* Toplam ürün adedi, `app.html`'de `{{ totalQuantity() }}` şeklinde çağrılır.

## Verilerin Saklanması

Liste tarayıcının `sessionStorage` alanında saklanır: sayfa yenilendiğinde korunur, sekme kapatıldığında silinir. Tarayıcı kapansa bile korunması için `sessionStorage` yerine `localStorage` kullanılmalıdır. \
Bu saklama alanları yalnızca metin saklar. Bu yüzden diziyi JSON metnine çevirmek için `JSON.stringify()` , tekrar diziye çevirmek için de `JSON.parse()` kullanılır.

`save()` metodu;

* Listeyi değiştiren her metodun sonunda çağrılır: `add()`, `increase()`, `decrease()`, `delete()`, `clearList()`.
* Seçim modu, arama metni ve satır vurgusu kaydedilmez; sayfa yenilendiğinde başlangıç değerlerine döner.

{% hint style="info" %}
Kayıt, tarayıcıda F12 → Application → Session Storage altında `products` anahtarıyla görülebilir.
{% endhint %}

## Kullanılan Metotların Özeti

<table data-header-hidden data-search="false"><thead><tr><th>Metot</th><th>Ne yapar</th><th>Kullanıldığı yer</th></tr></thead><tbody><tr><td><code>push()</code></td><td>Dizinin sonuna eleman ekler</td><td>Ürün Ekleme</td></tr><tr><td><code>length</code></td><td>Eleman sayısını verir; değer atanarak dizinin boyutu değiştirilebilir</td><td>Boş liste kontrolü, döngüler, Listeyi Temizleme</td></tr><tr><td><code>find()</code></td><td>Koşulu sağlayan ilk elemanın kendisini döndürür</td><td>Tekrar Eden Ürün Uyarısı</td></tr><tr><td><code>findIndex()</code></td><td>Koşulu sağlayan ilk elemanın konumunu döndürür</td><td>Ürün Silme</td></tr><tr><td><code>splice()</code></td><td>Belirli bir konumdan eleman siler</td><td>Ürün Silme</td></tr><tr><td><code>filter()</code></td><td>Koşulu sağlayan elemanlardan yeni bir dizi oluşturur</td><td>Listede Arama, Listeyi Temizleme</td></tr><tr><td><code>trim()</code></td><td>Baştaki ve sondaki boşlukları siler</td><td>Ürün Ekleme, Tekrar Eden Ürün Uyarısı, Listede Arama</td></tr><tr><td><code>toLocaleLowerCase('tr')</code></td><td>Türkçe kurallarına göre küçük harfe çevirir</td><td>Tekrar Eden Ürün Uyarısı, Listede Arama</td></tr><tr><td><code>includes()</code></td><td>Metnin başka bir metni içerip içermediğini kontrol eder</td><td>Listede Arama</td></tr><tr><td><code>JSON.stringify()</code></td><td>Diziyi metne çevirir</td><td>Verilerin Saklanması</td></tr><tr><td><code>JSON.parse()</code></td><td>Metni tekrar diziye çevirir</td><td>Verilerin Saklanması</td></tr></tbody></table>

Dizi fonksiyonlarından `pop()` her zaman dizinin son elemanını sildiği için, kullanıcının seçtiği belirli bir ürünü silmekte kullanılamaz. Bu yüzden silme işlemi `findIndex()` ve `splice()` ile yapıldı.
