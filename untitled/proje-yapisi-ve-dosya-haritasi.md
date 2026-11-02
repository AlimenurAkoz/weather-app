---
description: >-
  Bu sayfa, kodu yazmaya başlamadan önce hangi dosyanın nerede durduğunu ve ne
  işe yaradığını gösterir. Sonraki sayfalarda bir dosyadan söz edildiğinde
  yerini bu sayfadan bulabilirsiniz.
---

# Proje Yapısı ve Dosya Haritası

## Klasör yapısı

Geliştirmenin büyük kısmı `src/app` klasöründe yapılır; diğer dosyaların çoğu Angular tarafından otomatik oluşturulur ve genellikle değiştirilmez.

```
shopping-list/
├── public/
│   ├── background.png       → sayfa arka plan görseli
│   └── basket.png           → boş liste görseli
└── src/
    ├── app/
    │   ├── models/
    │   │   └── product.ts   → Product arayüzü (veri modeli)
    │   ├── app.ts           → bileşen mantığı: değişkenler ve metotlar
    │   ├── app.html         → arayüz şablonu
    │   ├── app.css          → bileşene ait stiller
    │   ├── app.config.ts    → uygulama ayarları
    │   ├── app.routes.ts    → sayfa yönlendirme tanımları (boş)
    │   └── app.spec.ts      → birim test dosyası
    ├── index.html           → ana sayfa: font bağlantıları, sayfa dili, sekme başlığı
    ├── main.ts              → uygulamanın başlangıç noktası
    └── styles.css           → tüm sayfaya uygulanan genel stiller
```



## Dosyaların görevleri <a href="#dosyalarin-gorevleri" id="dosyalarin-gorevleri"></a>

<table data-header-hidden data-search="false"><thead><tr><th width="169.60000610351562"></th><th></th></tr></thead><tbody><tr><td>Dosya</td><td>Görevi</td></tr><tr><td><code>models/product.ts</code></td><td>Bir ürünün hangi alanlardan oluştuğunu tarif eder. Kod çalıştırmaz, yalnızca şablon sağlar</td></tr><tr><td><code>app.ts</code></td><td>Ürün dizisini, sayaç ve mod değişkenlerini ve tüm işlemleri (ekleme, silme, arama, kaydetme) içerir</td></tr><tr><td><code>app.html</code></td><td>Başlık, form, arama kutusu, tablo, alt bar ve boş durum ekranlarını içerir.</td></tr><tr><td><code>app.css</code></td><td>Kart, form, tablo, butonlar ve kaydırma alanı stilleri. Yalnızca bu bileşeni etkiler.</td></tr><tr><td><code>styles.css</code></td><td><code>body</code>'nin arka planı, genel yazı tipi ve kenar boşlukları.</td></tr><tr><td><code>index.html</code></td><td>Google Fonts satırları, sayfa dili ve sekme başlığı</td></tr><tr><td><code>public/</code></td><td>Statik dosyalar. Buradaki dosyalara şablonda doğrudan adıyla ulaşılır(<code>src="basket.png"</code> gibi)</td></tr><tr><td></td><td></td></tr></tbody></table>
