# UniMeta Frontend

الوضع الافتراضي يستخدم Laravel API عبر Next.js BFF. انسخ `.env.example` إلى `.env.local` واضبط `BACKEND_API_URL` ليشمل `/api/v1`، ثم شغّل `npm ci` و`npm run dev`. شغّل Laravel من جذر المشروع بـ `php artisan serve`.

القيمة `NEXT_PUBLIC_USE_MOCK=true` مخصصة لعرض النسخة التجريبية. الميزات التي لا يوجد لها باك تظهر كغير متاحة في الوضع الحقيقي.

راجع [تقرير الربط والـ APIs الناقصة](../../docs/analysis/frontend-api-integration.md) للتغطية الحالية والقيود. أوامر التحقق: `npm run test:api`, `npx tsc --noEmit`, `npm run build`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Geist, a font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## نظام الأدوار والصلاحيات
- واجهة واحدة تتغير حسب الدور: المشرف يجهّز (محتوى، بلاغات، مراجعة تحقق)، والأدمن يقرر (الاتفاقيات، المالية، الصلاحيات).
- الدور والصلاحيات تأتي من قاعدة البيانات عبر التوكن، والسيرفر يفحصها بكل طلب (403 عند عدم الصلاحية)، والواجهة تستخدمها للعرض فقط.
- الأدمن يعيّن المشرفين ويحدد صلاحياتهم من مصفوفة on/off، وكل إجراء للمشرف يُسجَّل في audit log.

هذه الفقرة تصف التصميم المستهدف. الباك الحالي يدعم STUDENT وADMIN؛ إدارة المشرفين والصلاحيات التفصيلية ضمن قائمة الـ APIs الناقصة في تقرير الربط.
