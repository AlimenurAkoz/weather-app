# Karşılaşılan Sorunlar ve Çözümler

### **1. Pylance Hatası (**_Import "fastapi" could not be resolved_**)**

* _**Sebep:**_ VS Code'un, sanal ortama (_.venv_) ait olan Python yorumlayıcısını otomatik olarak seçememesi.
* _**Çözüm:**_ Ayarlardan "_Python: Select Interpreter"_ ayarı seçildi ve .venv içerisindeki "_python.exe_" yolu elle seçilerek düzeltildi.

### **2. Angular CLI Çalışmama Hatası (**_not available when running..._**)**

* _**Sebep:**_ Komutun _"angular.json"_ dosyasının bulunmadığı boş bir klasörde çalıştırılmaya çalışılması.
* _**Çözüm:**_ "_ng new frontend"_ komutu ile yeni bir Angular çalışma alanı (workspace) oluşturuldu.

### **3. Eksik esbuild Paketi Hatası (**_The package "@esbuild/win32-x64" could not be found_**)**

* _**Sebep:**_ Paket indirmelerinin yarım kalması nedeniyle Windows için gerekli olan "_esbuild"_ dosyasının eksik inmesi.
* _**Çözüm:**_ _node\_modules_ klasörü ve dosyası tamamen silindi, ardından "_npm install"_ ile temiz ve eksiksiz bir kurulum yapıldı.

### **4. CORS (**_**Cross-Origin Resource Sharing**_**) Hatası**

* _**Belirti:**_ Tarayıcı konsolunda "blocked by CORS policy" hatası görünmesi.
* _**Sebep:**_ Tarayıcının, farklı portlar üzerinden haberleşen uygulamaları (_localhost:4200_ ve _localhost:8000_) güvenlik gerekçesiyle engellemesi.
* _**Çözüm:**_ FastAPI backend koduna _CORSMiddleware_ eklenerek sadece ilgili porttan gelen `GET` isteklerine açıkça izin verildi.

