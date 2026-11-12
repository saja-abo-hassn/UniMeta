# UniMeta API Contract — proposal for Laravel

هذه العقود تمثل طريقة وصل الواجهة المطلوبة. `Implemented in client` تعني أن استدعاء الخدمة موجود في TypeScript، ولا تعني أن الخادم موجود أو أن fixture أصبح حقيقيًا. `Proposed` عمليات لازمة لاستبدال التخزين المحلي المرصود في الواجهة. ثبّت أسماء المسارات والحقول مع الفريق قبل migrations النهائية. كل المسارات تحت `/api`، JSON UTF-8، وتستخدم Sanctum عبر BFF ما عدا الدخول/التسجيل/التحقق العام.

## Envelope موحد

نجاح HTTP 2xx:

```json
{ "data": {}, "message": "تمت العملية بنجاح." }
```

خطأ HTTP المناسب:

```json
{ "message": "البيانات غير صالحة.", "errors": { "email": ["البريد مستخدم."] } }
```

`errors` كائن أخطاء حقول (أو null عند عدم وجودها). استخدم 401 غير مصادق، 403 مصادق بلا صلاحية، 404 سجل غير موجود/غير مرئي، 409 تعارض حالة، 413 ملف كبير، 422 تحقق، 429 rate limit، و5xx عطل خادم. لا ترسل stack traces. عميل الواجهة يطبّع `data:null` و`status` للخطأ بعد الاستلام.

## الجلسة والدعوات

| الحالة | Method + URL | Request | Success data | الصلاحية/ملاحظات |
|---|---|---|---|---|
| موجود في خدمة auth | `POST /login` | `{ "identifier": "email أو رقم جامعي", "password": "..." }` | `{ "token": "Sanctum PAT", "user": User }` | عام؛ تحقق البريد والحالة، وإرجاع 422 للبيانات/الحساب غير المقبول. BFF يحفظ token في HttpOnly Cookie ولا يعيده للمتصفح. |
| موجود في خدمة auth | `POST /register` | `{ fullName, email, password, confirmPassword, studentId, faculty, agreedToTerms }` | `{ user, requiresVerification: true }` أو session عند اعتماد تسجيل مباشر | عام؛ إنشاء طالب فقط؛ email وstudentId فريدان؛ كلمة مرور قوية وتأكيد وشروط؛ لا يقبل role من العميل. |
| موجود في خدمة auth | `POST /verify-email` | `{ email, code }` | `{ token, user }` | عام بمعدل محدود؛ رمز hash، قصير العمر، محاولات محدودة، استخدام مرة واحدة؛ BFF يخزن التوكن إن أعاده. |
| موجود في خدمة auth | `POST /email/resend-verification` | `{ email }` | `{ message, expiresInMinutes }` | عام بمعدل محدود؛ لا يكشف وجود البريد في الرد. |
| مطلوب في التهيئة | `POST /password/forgot` | `{ email }` | `{ message }` | عام، استجابة لا تكشف الحساب، throttling. لا توجد صفحة UI حاليًا. |
| مطلوب في التهيئة | `POST /password/reset` | `{ token, email, password, passwordConfirmation }` | `{ message }` | عام برمز مؤقت أحادي الاستخدام. لا توجد صفحة UI حاليًا. |
| مطلوب في التهيئة | `GET /me` | — | `{ id,name,email,role,studentId?,faculty?,title?,avatarUrl?,emailVerified,permissions? }` | أي جلسة صالحة؛ إرجاع الدور من قاعدة البيانات، لا من cookie/المتصفح. مستخدم لتهيئة الهيدر والسايدبار. |
| مطلوب في التهيئة | `POST /logout` | — | `null` | مصادق؛ إبطال PAT الحالي. BFF يمسح cookie حتى لو فشل الاتصال. |
| موجود في service | `GET /invitations/{token}` | — | `{ email, role, department, expiresAt, status }` | عام برمز عشوائي hash؛ لا يكشف سجلات أخرى. |
| موجود في service | `POST /invitations/{token}/accept` | `{ password }` | `{ email }` أو `{ user, token }` | عام برمز صالح؛ تفعيل مشرف مدعو فقط، token مرة واحدة. |

`User` الحقول: `{ id, name, email, role: "student"|"moderator"|"super_admin", studentId?, faculty?, title?, avatarUrl?, emailVerified }`. لا تعرض password hash أو PAT أو national ID كاملًا.

## الخطط والمواد والإشعارات

| الحالة | Method + URL | Request | Success data | الصلاحية |
|---|---|---|---|---|
| موجود في `plans-service.ts` | `GET /student/study-plan` | — | مصفوفة `{ code, name, credits, semester, category, grade? }` | طالب؛ أرجع خطة الطالب المعتمدة أو 404 إذا لم يختر خطة. |
| مطلوب لاستكمال خطة UI | `GET /study-plans` | `?faculty=&degree=` | خطط `{ id, major, college, degree, totalCredits, hourlyRate, semestersCount }` | مستخدم مصادق/أو عام إذا قرر المنتج إظهارها؛ القيم الحالية fixtures ويجب مراجعتها. |
| مطلوب لاستكمال خطة UI | `GET /study-plans/{id}` | — | `{ plan, courses:[{ code,name,credits,semester,category,prerequisites }] }` | مثل القراءة أعلاه. |
| مطلوب | `PUT /student/academic-record` | `{ planId, completedCourseIds, grades:{ courseId: number }, customCourses:[], overrides:{} }` | `{ record, gpa, completedCredits }` | الطالب نفسه فقط؛ العلامة 0..100، ساعات موجبة، لا يغير الخطة الرسمية. |
| موجود في `materials-service.ts` | `GET /materials` | `?category=` | مصفوفة مادة منشورة `{ id, courseId, courseCode, courseName, title, category, fileType, fileSize, downloads, author, date, url }` | مستخدم مصادق؛ لا تُرجع غير المنشور. |
| مطلوب | `POST /materials` | `multipart/form-data`: `courseId,title,category,description,file` أو `url` | `{ material }` بالحالة `قيد المراجعة` | طالب؛ 50MB حد واجهة حالي، افحص الخادم أيضًا. |
| مطلوب | `GET /admin/content` | `?status=&courseId=&category=` | `{ items, pagination }` | `manage_content`. يحوي المنشور والمعلّق للمراجعة. |
| مطلوب | `POST /admin/content` | multipart metadata/file، اختياري `status` | `{ material }` | `manage_content`; رفع/إضافة. |
| مطلوب | `PATCH /admin/content/{id}` | `{ title?,description?,category?,courseId?,isFeatured? }` | `{ material }` | `manage_content`. |
| مطلوب | `POST /admin/content/{id}/publish` | `{}` | `{ material }` | `manage_content`; قرار نشر ذري مع reviewer/time. |
| مطلوب | `POST /admin/content/{id}/reject` | `{ reason }` | `{ material }` | `manage_content`; احفظ السبب. |
| مطلوب | `DELETE /admin/content/{id}` | — | `null` | `manage_content`; soft-delete وسجل تدقيق. |
| موجود في service | `GET /student/notifications` | — | مصفوفة `{ id,title,message,category,createdAt,read,link }` | الطالب الحالي. |
| موجود في service | `POST /student/notifications/{id}/read` | `{}` | `{ success:true }` | المالك فقط. |
| موجود في service | `POST /student/notifications/read-all` | `{}` | `{ success:true }` | الطالب الحالي. |

## سوق الكتب والأجهزة والاتفاقيات

المسارات هنا **مقترحة** لأن hooks الحالية تستخدم initial data وlocalStorage، ولا يوجد real service لهذه المزايا.

| Method + URL | Request | Success data | الصلاحية |
|---|---|---|---|
| `GET /market/listings` | `?kind=book|device&type=&category=&q=&page=` | `{ items, pagination }` | مصادق؛ العروض المتاحة فقط. |
| `POST /market/listings` | `{ kind,type,title,category,condition,description,price?,dailyRate?,deposit?,rentalPeriod?,exchangeTarget? }` وملفات اختيارية | `{ listing }` | طالب؛ owner من session لا من payload. |
| `PATCH /market/listings/{id}` | حقول العرض القابلة للتعديل | `{ listing }` | المالك فقط؛ لا يعدل عرضًا عليه اتفاقية فعالة. |
| `DELETE /market/listings/{id}` | — | `null` | المالك أو `manage_agreements`؛ لا حذف فعلي لتاريخ مرتبط. |
| `POST /market/listings/{id}/requests` | `{ proposedStartDate,durationDays,notes,studentKyc,pledge,signature }` | `{ agreement }` | طالب غير المالك؛ يتحقق من توفر العرض وOTP/KYC والتعهد والتوقيع. |
| `GET /student/agreements` | `?direction=incoming|outgoing&status=` | `{ active, incoming, outgoing }`، بيانات هوية مقنّعة | الطالب الحالي كطرف. |
| `GET /admin/agreements` | `?status=&category=&q=&page=` | `{ items, pagination }` وقيم حساسة مقنّعة | `manage_agreements`. |
| `GET /admin/agreements/{id}` | — | تفاصيل الاتفاقية والتاريخ؛ الهوية مقنّعة افتراضيًا | `manage_agreements`. |
| `POST /admin/agreements/{id}/approve` | `{ note? }` | `{ agreement }` | `manage_agreements`; سجل actor ووقت القرار. |
| `POST /admin/agreements/{id}/reject` | `{ reason }` | `{ agreement }` | `manage_agreements`; السبب مطلوب. |
| `POST /admin/agreements/{id}/request-changes` | `{ note }` | `{ agreement }` | `manage_agreements`; الطالب يعيد الطلب عبر `POST /market/listings/{id}/requests` أو endpoint تعديل معتمد يثبت نفس الطلب. |
| `POST /admin/agreements/{id}/reveal-identity` | `{ reason }` | `{ maskedData, auditEventId }` | `manage_agreements`; لا يعيد كل السجل ولا يخزن كشفًا بالواجهة. |
| `POST /agreements/{id}/handover` | `{ confirmed:true }` | `{ agreement }` | أحد الطرفين؛ تحقق من قرار الإدارة والطرف الصحيح. |
| `POST /agreements/{id}/return` | `{ condition?,notes? }` | `{ agreement }` | الطرف/المشرف حسب السياسة؛ تحقق تاريخ الإرجاع والحالة. |

حالات النموذج الحالي: مراجعة، موافقة، رفض، طلب تعديل، نشطة، بانتظار الإرجاع، مكتملة. اتفق على state machine قبل التنفيذ؛ لا تفترض أن موافقة الإدارة وحدها تنشّط الاتفاقية. التوقيع وKYC وOTP في object storage خاص؛ قاعدة البيانات تحتفظ بالمفاتيح/البصمات فقط. لا تضع Base64 للتوقيع أو هوية كاملة في list response أو logs.

## الإدارة والدعوات والصلاحيات والبلاغات

| الحالة | Method + URL | Request | Success data | الصلاحية |
|---|---|---|---|---|
| موجود في `admin-service.ts` | `GET /admin/overview` | — | counters: `totalStudents,activeNow,pendingAgreements,activeLoans,contentCount,coveredCourses,totalCourses,openReports` | moderator أو super_admin؛ صفّر/أخفِ غير المسموح حسب صلاحيات العرض. |
| موجود في `moderators/real-moderators-service.ts` | `GET /admin/moderators` | `?q=&status=` | مصفوفة مشرفين وصلاحياتهم | `manage_moderators`. |
| موجود | `POST /admin/moderators/invite` | `{ email,name?,title?,assignedDepartment,permissions }` | `{ moderator,inviteUrl,token }` (token للعرض مرة واحدة فقط) | `manage_moderators` (super_admin افتراضيًا وفق `lib/permissions.ts`). |
| موجود | `PATCH /admin/moderators/{id}/permissions` | `{ permissions:{ manage_content:boolean,... } }` | `{ moderator }` | `manage_moderators`; لا يسمح للمشرف بمنح صلاحيات أعلى من نفسه. |
| موجود | `PATCH /admin/moderators/{id}/status` | `{ status:"نشط"|"معطل" }` | `{ moderator }` | `manage_moderators`. |
| موجود | `POST /admin/moderators/{id}/resend-invite` | `{}` | `{ inviteUrl,token }` | `manage_moderators`; إبطال القديم وخلق token جديد. |
| موجود | `DELETE /admin/invitations/{id}` | — | `null` | `manage_moderators`; ألغِ الدعوة. |
| موجود | `DELETE /admin/moderators/{id}` | — | `null` | `manage_moderators`; قيود آخر super_admin وسجل تدقيق. |
| مطلوب | `GET /admin/members` | `?q=&status=&page=` | `{ items,pagination }` | `manage_members`. |
| مطلوب | `PATCH /admin/members/{id}/status` | `{ status:"نشط"|"معلق"|"محظور" }` | `{ member }` | `manage_members`; لا يسمح بتجاوز سياسة الحساب. |
| مطلوب | `GET /admin/reports` | `?status=&targetType=&page=` | `{ items,pagination }` | `manage_reports`. |
| مطلوب | `POST /reports` | `{ targetType,targetId,reason }` | `{ report }` | مستخدم مصادق؛ منع spam والتبليغ المكرر. |
| مطلوب | `PATCH /admin/reports/{id}` | `{ status,actionTaken? }` | `{ report }` | `manage_reports`; إجراءات الإشراف لا تنفذ عقوبة تلقائية غير معتمدة. |
| مطلوب | `GET /admin/settings` | — | إعدادات عامة | `manage_settings`. |
| مطلوب | `PATCH /admin/settings` | `{ platformName?,academicYear?,currentSemester?,allowStudentUploads?,maintenanceMode?,requireAdminApprovalForAgreements?,supportEmail? }` | الإعدادات المحدثة | `manage_settings`; تحقق allowlist وقيّد maintenance mode. |
| مطلوب | `GET /admin/audit-logs` | `?targetType=&targetId=&page=` | `{ items,pagination }` | `manage_agreements` للهوية أو صلاحية تدقيق عامة يحددها المنتج؛ سجلات append-only. |

الصلاحيات المعرفة برمجيًا في `lib/permissions.ts` هي المرجع: `manage_content`, `manage_exams`, `manage_agreements`, `manage_finances`, `manage_reports`, `manage_members`, `manage_moderators`, `manage_settings`. الـ super_admin يتجاوزها على الخادم. مصفوفة المتصفح ليست قرارًا أمنيًا.

## فرق التخرج والمهام والإعدادات الطلابية

هذه data/hooks تجريبية؛ ثبّت قواعد المجال قبل بناء APIs. التوصية: `GET /projects`, `GET /projects/{id}`, `POST /projects`, `POST /projects/{id}/applications`, `PATCH /projects/{id}/applications/{applicationId}`؛ الطالب ينشئ/يعدل مشروعه أو يسحب طلبه، ومالك المشروع يقرر قبول/رفض أعضاءه. لا يوجد دور قائد إداري ولا قبول من الأدمن في workflow الحالي. لمهام الطالب الاختيارية: `GET/POST /student/tasks`, `PATCH/DELETE /student/tasks/{id}`؛ يمكن إبقاء Pomodoro محليًا. تفضيلات الطالب: `GET/PATCH /student/profile/preferences` بحقول الملف/الهاتف/الإشعار/الظهور التي تقرر اعتمادها، مع موافقة خصوصية للظهور.

## الأمان والتشغيل

- Sanctum PAT عبر BFF الحالي: Laravel يتحقق من Bearer token ويعيد user فقط في `GET /me`. revoke عند logout؛ expiration وتدوير configurable.
- استخدم `auth:sanctum`, Policies وGates لكل مورد. تحقق ownership وrole+permission داخل Laravel حتى عند الطلب المباشر إلى API.
- CORS يسمح لنطاق Vercel الإنتاجي ونطاق preview المطلوب فقط. لا تضع secrets في متغيرات `NEXT_PUBLIC_*`. امنع CSRF/Origin غير الموثوق على BFF؛ حافظ على Secure/SameSite/HttpOnly cookies.
- Validations server-side لكل معرف وسعر/إيداع/مدة/علامة وحالة انتقال وملكية. استخدم DB transactions لمنع حجز العرض أو تغيير الصلاحية المتزامن.
- Rate limit login, OTP, resend, invitations, reports, downloads/uploads. خزّن passwords عبر Laravel Hash. لا تكشف وجود بريد في تدفقات الاستعادة/التحقق العام.
- ملفات private disk، أسماء عشوائية، MIME sniffing وحد حجم، antivirus إن توفر، تنزيل موقّع قصير الصلاحية. لا تنفذ file URL من العميل مباشرة.
- التواريخ ISO-8601 UTC، العملة كما في الخطة النموذجية JOD حتى يؤكد المنتج غير ذلك. المعدل موزون بالساعات وبعلامة 0..100؛ الحسابات المحلية قابلة للتلاعب ولا تعتمد رسميًا قبل التحقق من اللوائح الجامعية.
- Vercel: اضبط `NEXT_PUBLIC_API_URL` إلى API origin مع `/api` و`NEXT_PUBLIC_SITE_URL` إلى أصل الواجهة و`NEXT_PUBLIC_USE_MOCK=false` ثم أعد build. Route Handler يمرر طلبات JSON/ملفات إلى Laravel، يرفق cookie token server-side، ويزيله من الرد عند login. اختبر CORS، upload، cookie Secure، `GET /me`، 401/403 وpreview domains قبل إطلاق الإنتاج.
