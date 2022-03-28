# iranian-news-agencies-crawler
a crawler to fetch last news from Iranian(Persian) news agencies.
# دریافت اخرین اخبار خبرگزاری های ایران
این کتابخانه ماانند یک API  برای دریافت اخرین اخبار از خبرگزاری های مهم  فارسی زبان داخلی و خارجی است به زبان node.js که خبرگزاری های زیر را پشتیبانی می‌کند:



| نام خبرگزاری     | کلید |  لوگو |
| ---            | ---             | ---       |
| [خبرگزاری فارس](https://www.farsnews.ir/) |      fars       | <img width="137" alt="image" src="https://user-images.githubusercontent.com/1645233/159900066-a2d1629e-8bcd-4070-8ec4-e81bf6105a18.png">       |
| [خبرگزاری ایرنا](https://www.irna.ir/) |      irna       | <img width="131" alt="image" src="https://user-images.githubusercontent.com/1645233/159900199-48346182-8ed1-4856-b1cd-8b5f8b021727.png">       |
| [باشگاه خبرنگاران جوان](https://www.yjc.news/) |     yjc        | <img width="213" alt="image" src="https://user-images.githubusercontent.com/1645233/159900384-c8a3a43b-1d13-4b20-b033-e0548b5bc8b9.png">       |
| [خبرگزاری ایسنا](https://www.isna.ir/) |   isna          | <img width="203" alt="image" src="https://user-images.githubusercontent.com/1645233/159900535-6c7a64f3-944e-4200-bc36-34eb98d02223.png">       |
| [خبرگزاری تسنیم](https://www.tasnimnews.com/) |   tasnim         | <img width="122" alt="image" src="https://user-images.githubusercontent.com/1645233/159900653-f9a1b84f-be62-47e5-bac1-588aaed4d339.png">       |
| [بی بی سی](https://www.bbc.com/persian) |      bbc       | <img width="86" alt="image" src="https://user-images.githubusercontent.com/1645233/159900987-f7c55971-f7a1-4d30-8c1a-b66ca4cfd924.png">       |
| [خبرگزاری مهر](https://www.mehrnews.com/) |    mehr         | <img width="221" alt="image" src="https://user-images.githubusercontent.com/1645233/159901166-07f3c07b-b616-4f9b-9113-a2c6bcb2b9cc.png">       |
| [خبرگزاری ایلنا](https://www.ilna.news/) |   ilna          | <img width="114" alt="image" src="https://user-images.githubusercontent.com/1645233/159901298-9edef4a6-8b12-4e4b-a097-271dd9f8040f.png">       |
| [خبرگزاری موج ](https://www.mojnews.com/) |     moj        | <img width="175" alt="image" src="https://user-images.githubusercontent.com/1645233/159901756-2f8b6199-c59a-4c35-94f0-df134c9b4eca.png">       |
| [خبرگزاری تابناک](https://www.tabnak.ir/) |    tabnak         | <img width="130" alt="image" src="https://user-images.githubusercontent.com/1645233/159901868-0d3b1555-172b-4e69-991e-b2733f10400e.png">       |
| [خبرآنلاین](https://www.khabaronline.ir/) |     khabaronline        | <img width="227" alt="image" src="https://user-images.githubusercontent.com/1645233/159901976-09fa9397-0b0c-4574-a867-8f657267f4a9.png">       |
| [خبرگزاری برنا](https://www.borna.news/) |    borna         | <img width="182" alt="image" src="https://user-images.githubusercontent.com/1645233/159902057-e651f9ba-b56c-47a7-9aa9-84b5c9e38112.png">       |
| [خبرگزاری آنا](https://www.ana.press/) |     ana        | <img width="101" alt="image" src="https://user-images.githubusercontent.com/1645233/159902185-3ef72db1-4d7a-4336-8dae-249ab8f60d6d.png">       |
| [الف](https://www.alef.ir/) |     alef        | <img width="71" alt="image" src="https://user-images.githubusercontent.com/1645233/159902335-52176429-23fc-4d5c-a865-4dfa31d737ca.png">       |
| [خبرگزاری صداسیما](https://www.iribnews.ir/) |     irib        | <img width="215" alt="image" src="https://user-images.githubusercontent.com/1645233/160103591-151e288d-a4d7-4a03-a8ae-10da7446f2d6.png">       |
| [خبرگزاری sputnik](https://ir.sputniknews.com/) |     sputnik        | <img width="217" alt="image" src="https://user-images.githubusercontent.com/1645233/160103720-7cbc3c8c-6991-452a-a886-2f0869b48a7a.png">       |
| [خبرگزاری independent](https://www.independentpersian.com/) |    independent         | <img width="232" alt="image" src="https://user-images.githubusercontent.com/1645233/160103926-488acd8a-87e0-459b-936a-cb0c948d7265.png">       |
| [VOA فارسی](https://ir.voanews.com/) |     voa        | <img width="116" alt="image" src="https://user-images.githubusercontent.com/1645233/160104130-bb8a3f68-1b30-4d5a-b9f5-34d47e14546f.png">       |



## نصب
```sh
npm i iranian-news-agencies-crawler
```

## نحوه استفاده 
```javascript
const fetchNews = require('iranian-news-agencies-crawler');
...
// دریافت عنواوین خبر بدون متن اصلی 
// تاخیر زیر ۱ ثانیه
var lastNews = await fetchNews('isna', { includeNewsText: false });
...

// دریافت عنواوین خبر به همراه متن اصلی 
// تاخیر بسته به نوع خبرگزاری و سرعت اینترنت سرور بین ۲ تا ۶ ثانیه
var lastNews = await fetchNews('fars', { includeNewsText: true });
...
...
...
/* خروجی :
 lastNews = [
 {
  title:'عنوان خبر',
  text:'عنوان خبر',
  img:'عکس خبر در صورت پیدا شدن',
  keywords: [ارایه ای از کلمات کلیدی پیدا شده از خبر],
  categories: [ آرایه ای از دسته بندی های پیدا شده از خبر],
  date:'Thu, 24 Mar 2022 10:26:50 GMT'
  id:'https://farsnews.ir/xxxxx'
  link:'https://farsnews.ir/xxxxx'
 }
...
]
*/

```  

- **پارامتر اول** نام خبرگزاری است که در جدول بالا و در ستون **کلید** هر خبرگزاری درج شده است.
- بدیهی است که برای دریافت خبر های  خبرگزاری های خارج از ایران مثل بی بی سی VOA و independent باید سرور خارج از کشور باشد و در محیط لوکال VPN متصل باشد.
- با توجه با تاخیر ذکر شده توصیه میشود این کد به صورت یک task  با بازه زمانی مشخص اجرا شود.

> این کتاب خونه بسیار سادست و خودتون هم می‌تونید توسعش بدید ولی با این حال خوشحال می‌شم نظرو یا باگ های احتمالیش رو همینجا از طریق
 [`'گیت هاب'`](http://github.com/hamid) 
 و یا 
 [`توییتر`](https://twitter.com/hamid_salimian)
 بهم بگید. 😊😊
