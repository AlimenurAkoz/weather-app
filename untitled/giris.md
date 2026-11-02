---
description: >-
  Alışveriş Listem; kullanıcının eksik ürünlerini yazıp listeye eklediği,
  adetlerini yönettiği ve dilediğinde tek tek ya da toplu olarak silebildiği tek
  sayfalık bir web uygulamasıdır.
---

# Giriş

## Projenin Amacı

Proje, JavaScript dizi (array) işlemlerini ve Angular'ın temel kavramlarını gerçek bir arayüz&#x20;üzerinde uygulamak için geliştirildi. Uygulamada backend ve veritabanı bulunmamaktadır. Tüm veriler&#x20;tarayıcıda, bir nesne dizisinde (object array) tutulur.

Kullanım akışı şu şekildedir:

* Kullanıcı ürün ekleme(input) çubuğuna ürünü girer ve "**Ekle**" butonu ya da "enter tuşu" aracılığıyla ekleme işlemi yapar. "[Ürün Ekleme](ozellikler-ve-metotlar.md#urun-ekleme)" başlığından detaylara ulaşabilirsiniz.
* Eklenmek istenen ürün listede mevcutsa mevcut olduğuna ve adedine dair ekrana bildirim gelir. Adet artırarak ("**Artıralım**" butonuyla) ve ya değişiklik yapamayarak ("**Yeterli**" butonuyla) işleme devam edilir. "[Tekrar Eden Ürün Uyarısı](ozellikler-ve-metotlar.md#tekrar-eden-urun-uyarisi)" başlığından detaylara ulaşabilirsiniz.
* Eklenmek istenen ürün listede mevcut değilse listeye ekleyip ekrandaki tabloda gösterir.&#x20;
* Tabloda ilgili ürün sayısı artırıp azaltılabilir veya silinebilir. "[Adet Artırma ve Azaltma](ozellikler-ve-metotlar.md#adet-artirma-ve-azaltma)" başlığından detaylara ulaşabilirsiniz.
* Tablonun üstündeki arama çubuğu ile ürün aranabilir. "[Listede Arama](ozellikler-ve-metotlar.md#listede-arama)" başlığından detaylara ulaşabilirsiniz.
* Tablonun altındaki; "**Seç**" butonuyla istenen ürünler toplu seçilip silme işlemi yapılabilir, "**Toplam Ürün Adedi**" kutusuyla toplam ürün adedi gösterilir, "**Listeyi Temizle**" butonuyla da tüm liste temizlenebilir. "[Seçim Modu ve Toplu Silme](ozellikler-ve-metotlar.md#secim-modu-ve-toplu-silme)" başlığından detaylara ulaşabilirsiniz.
* Liste boş ise "**Eksik Yok**" yazısıyla boş bir ekran ile karşılaşılır.

<div><figure><img src=".gitbook/assets/bosListe (2).png" alt="" width="563"><figcaption></figcaption></figure> <figure><img src=".gitbook/assets/doluListe (1).png" alt="" width="563"><figcaption></figcaption></figure></div>

## Kullanılan Teknolojiler

<table><thead><tr><th width="128.79998779296875">Araç</th><th>Kullanım Amacı</th></tr></thead><tbody><tr><td>Angular</td><td>Bileşen yapısı, veri bağlama (data binding), olay bağlama (event binding) ve kontrol akışı blokları (<code>@if</code>, <code>@for</code>, <code>@empty</code>)</td></tr><tr><td>TypeScript</td><td>Tip güvenliği; Product arayüzü (interface) ve tipli dizi (<code>Product[]</code>)</td></tr><tr><td>HTML</td><td>Form, tablo, buton ve onay kutusu yapısı</td></tr><tr><td>CSS</td><td>Flexbox ile yerleşim, konumlandırma, tema renkleri</td></tr><tr><td>FormsModule</td><td><code>[(ngModel)]</code> ile iki yönlü veri bağlama ve (<code>ngSubmit</code>) ile form gönderimi</td></tr><tr><td>Web Storage API</td><td><code>sessionStorage</code> ile verilerin sekme açık kaldığı sürece saklanması</td></tr><tr><td>SweetAlert2 </td><td>Tekrar eden ürün eklenirken çıkan onay penceresi ("Artıralım" / "Yeterli") ve "Ürün eklenmedi." bildirimi </td></tr></tbody></table>
