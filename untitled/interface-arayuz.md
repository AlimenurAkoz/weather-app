# Interface(Arayüz)

Listedeki her ürün, `Product` arayüzüne uyan bir nesnedir. Ürünler, bu arayüz kullanılarak tanımlanan bir nesne dizisinde tutulur.

## Product Arayüzü

Dosya: [`product.ts`](https://github.com/AlimenurAkoz/shopping-list-app/blob/main/src/app/models/product.ts)

```ts
export interface Product {
    id: number;
    productName: string;
    quantity: number;
    selected: boolean;
}
```

<table><thead><tr><th width="132.99993896484375">Alan</th><th width="110">Tip</th><th width="296.0001220703125">Açıklama</th><th>Başlangıç değeri</th></tr></thead><tbody><tr><td><code>id</code></td><td><code>number</code></td><td>Ürünün sıra numarası. Silme işlemlerinden sonra 1'den başlayarak yeniden verilir.</td><td>Sayaçtan (<code>counter</code>)</td></tr><tr><td><code>productName</code></td><td><code>string</code></td><td>Kullanıcının girdiği ürün adı</td><td>Giriş kutusundaki değer</td></tr><tr><td><code>quantity</code></td><td><code>number</code></td><td>Ürün adedi; 1'den küçük olamaz</td><td><code>1</code></td></tr><tr><td><code>selected</code></td><td><code>boolean</code></td><td>Seçim modunda ürünün işaretli olup olmadığı</td><td><code>false</code></td></tr></tbody></table>

**Örnek:** Uygulamada iki ürün eklendiğinde dizi şu şekilde görünür:

```json
[
  { "id": 1, "productName": "Elma",   "quantity": 2, "selected": false },
  { "id": 2, "productName": "Armut", "quantity": 1, "selected": false }
]
```

`product.ts` dosyası hiçbir işlem yapmaz, yalnızca bir ürünün neye benzediğini tarif eder. Ürün ekleme, silme, arama gibi asıl işler `app.ts` dosyasında yapılır.

Ürünler [`app.ts`](https://github.com/AlimenurAkoz/shopping-list-app/blob/main/src/app/app.ts) dosyasında, `Product` yapısına uyan nesnelerden oluşan, başlangıçta boş olan, `products` dizisi tanımlanır.

```ts
products: Product[] = [];
```

`product.ts` dosyasının yazılma amacı:

* Verilerin `id` ve isimden oluşan nesneler olarak bir nesne dizisinde saklanması için nesnelerin yapısını tanımlamak.
* Bir alan eksikse, yanlış yazılmışsa ya da yanlış tipte kullanılmışsa hatayı uygulama çalışmadan önce görmek. TypeScript, kodu derlerken her ürünü bu şablona göre kontrol eder.&#x20;

| Yapılan hata                                      | TypeScript'in verdiği uyarı                              |
| ------------------------------------------------- | -------------------------------------------------------- |
| Yeni ürün oluştururken `selected` alanı yazılmadı | `Property 'selected' is missing`                         |
| Var olmayan bir alan kullanıldı (`p.searchText`)  | `Property 'searchText' does not exist on type 'Product'` |
| Sayı tipindeki adet alanında `.length` kullanıldı | `Property 'length' does not exist on type 'number'`      |

* Metotların ne beklediğini, ne döndürdüğünü beliryerek kod okunabilirliğini kolaylaştırmak.
* Proje büyüdüğünde aynı arayüzü `import` ederek yeniden kullanılabilirliğini sağlamak. Interface'in başındaki `export` anahtar kelimesi import edilmesini sağlar.

```ts
import { Product } from './models/product';
```
