# UniMeta

واجهة UniMeta مبنية بـ Next.js 16.4.5 وتتصل بخادم Laravel عبر Next.js BFF. خادم Laravel ليس ضمن هذا المستودع؛ استخدم عنوان بيئة محلية أو staging مصرحاً بها.

## البدء

يتطلب Node.js 20.9 أو أحدث وnpm 9 أو أحدث.

```bash
git clone -b feat/connect-backend https://github.com/saja-abo-hassn/UniMeta.git
cd UniMeta
npm ci
```

في PowerShell انسخ ملف البيئة:

```powershell
Copy-Item .env.example .env.local
```

ثم شغّل الواجهة:

```bash
npm run dev
```

افتح <http://localhost:3000>. قبل التشغيل، اضبط `BACKEND_API_URL` في `.env.local` إلى API محلي أو staging ينتهي بـ `/api/v1`. يمكن تركه فارغاً لتشغيل الواجهة دون اتصال بالباك. لا تستخدم API الإنتاج لتجارب الكتابة.

## التحقق

```bash
npx tsc --noEmit
npm run lint
npm run build
npm run test:api
```

اختبارات API تستخدم mocks محلية. نجاحها لا يثبت عمل التكامل مع خادم Laravel.

## التوثيق

- [دليل التجربة للمطوّر](docs/FRIEND_TESTING_GUIDE.md)
- [عقد API](docs/openapi.yaml)
- [فجوات الباك إند](docs/backend-gaps.md)
- [تسليم الباك إند](docs/BACKEND_HANDOFF.md)
