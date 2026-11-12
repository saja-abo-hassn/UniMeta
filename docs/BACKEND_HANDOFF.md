# UniMeta — دليل تسليم Laravel

## الغرض والتقنيات

UniMeta واجهة عربية RTL لطلاب جامعة الأزهر في غزة، تجمع الأدوات الأكاديمية ومكتبة المقررات والتبادل الطلابي، مع لوحتي الطالب والإدارة. الواجهة Next.js App Router 16 وReact 19 وTypeScript وTailwind CSS 4. مصدر خطط البرامج هو `src/data/study-plans-data.ts`؛ الصور والخطوط المستخدمة موجودة تحت `public/`. لا يوجد Laravel أو قاعدة بيانات في هذا المستودع.

يحتوي `UNIMETA_SPEC_KIT_PLAN.md` على الخطة الرئيسية ويجب الاحتفاظ به باسمه ومحتواه. بعض مواصفات Spec Kit أقدم من التطبيق الحالي؛ عند التعارض، خذ مسارات ووظائف الشيفرة الحالية مرجعًا لما هو موجود، واتفق مع مالك المنتج على قواعد العمل قبل نقل المقترحات القديمة إلى Laravel.

## الصفحات ووظائفها الحالية

| المسار | الوظيفة |
|---|---|
| `/` | Landing Page: تعريف UniMeta، المميزات، فريق العمل، واختبار الميول التمهيدي. |
| `/login`, `/register`, `/verify-email` | دخول، إنشاء حساب طالب، وتأكيد البريد. لا تظهر واجهة استعادة كلمة المرور أو تغييرها في شجرة المسارات الحالية. |
| `/invite/[token]` | عرض دعوة مشرف والتحقق منها ثم قبولها/تفعيل الحساب. |
| `/student` | لوحة الطالب ومؤشرات المسار والإشعارات والاختصارات. |
| `/student/academic` | متابعة الخطة والمواد والتقدم والمعدل. |
| `/gpa-calculator`, `/student/gpa-calculator` | حاسبة معدل موزون بالساعات، علامات من 0 إلى 100، مع فصول ومواد قابلة للتحرير. |
| `/fee-calculator`, `/student/fee-calculator` | تقدير الرسوم حسب ساعات الخطة والمعدل الساعي؛ تقدير لا تحصيل مالي. |
| `/my-hours`, `/student/my-hours` | المواد والساعات المنجزة والمتبقية وتعديل/إضافة مواد محليًا. |
| `/student/library` | مكتبة حسب المساق تعرض كتبًا وملخصات ونماذج ومواد؛ الطالب يرفع مساهمة لمراجعتها. |
| `/student/interests` | اختبار ميول، حفظ تقدّم/نتيجة محليًا، واقتراح خطة من الخطط المتاحة. |
| `/student/productivity` | مؤقت Pomodoro، مهام، ملاحظات/إحصاءات؛ إعدادات وبيانات كثيرة محلية. |
| `/student/projects`, `/student/projects/[id]` | استعراض مشاريع التخرج وتفاصيلها، إنشاء/تقديم طلبات انضمام. مصدر المشاريع تجريبي. |
| `/student/teams`, `/student/teams/[id]` | فرق ومشاريع التخرج وطلبات الانضمام؛ يلزم ربط التخزين الفعلي. |
| `/student/exchange/books`, `/student/exchange/devices` | عروض بيع/استئجار/تبادل الكتب والأجهزة وإضافة عروض وبدء طلب. البيانات الحالية محلية/تجريبية. |
| `/student/agreements` | الطلبات الواردة والصادرة والاتفاقيات النشطة وحالة الإرجاع. |
| `/student/settings` | تفضيلات الملف والإشعارات والظهور؛ الحفظ الحالي يصرّح بأنه محلي. |
| `/admin` | لوحة ملخص الإدارة. |
| `/admin/students`, `/admin/members` | استعراض الحسابات وحالاتها. |
| `/admin/library`, `/admin/content` | مكتبة الإدارة: مواد ومساهمات، تعديل/حذف/نشر أو رفض، ورفع ملفات. |
| `/admin/agreements` | مراجعة اتفاقيات الإعارة، قبول/رفض/طلب تعديل، كشف بيانات حساسة بسجل تدقيق. |
| `/admin/reports`, `/admin/moderation` | تصفية البلاغات، مراجعتها، وتسجيل الإجراء/إغلاقها. |
| `/admin/moderators`, `/admin/permissions` | دعوة مشرف، إلغاء/إعادة دعوة، تفعيل/تعطيل، وحفظ مصفوفة الصلاحيات. |
| `/admin/settings` | إعدادات المنصة والسياسات والبريد. |
| `/403` | رسالة منع وصول عامة. |

`/student/academic` لا يعرض تقويمًا أكاديميًا أو مواعيد امتحانات متصلة بخدمة حالية. شاشة الامتحانات والإشعارات/البلاغات لها تمثيل إداري وتجريبي، ولا توجد واجهة تقويم مستقلة. المساعد العائم حاليًا stub محلي وليس نموذجًا ذكاءً اصطناعيًا متصلًا.

## الأدوار والمصادقة

- `student`: خدمات الطالب وبياناته فقط.
- `moderator`: صلاحيات إدارية ممنوحة فرديًا. المرجع البرمجي `lib/permissions.ts`: الافتراضي يسمح بـ`manage_content` و`manage_reports` فقط.
- `super_admin`: كل مفاتيح الصلاحية الحالية: `manage_content`, `manage_exams`, `manage_agreements`, `manage_finances`, `manage_reports`, `manage_members`, `manage_moderators`, `manage_settings`.
- الشيفرة ما زالت تقبل دور `admin` قديمًا في بعض الواجهات؛ لا تنشئه في العقد الجديد. انقل الحسابات القديمة صراحة إلى أحد دوري الإدارة أعلاه.

التسجيل الحالي يجمع الاسم الكامل والرقم الجامعي والكلية والبريد وكلمة المرور وتأكيدها والموافقة. البريد يحتاج تأكيدًا برمز؛ خدمة التحقق الحالية تعتمد التخزين المحلي والبريد stub، وليست تحققًا جامعيًا حقيقيًا. الدخول يقبل البريد أو الرقم الجامعي. الدعوات تنتهي بعد 48 ساعة في mock. لا تثق بدور أو رقم جامعي أو هوية أو صلاحية قادمة من المتصفح.

في وضع Laravel يمر الاتصال عبر Route Handler في `app/api/backend/[...segments]/route.ts`. يحفظ Access Token الوارد من Laravel في Cookie باسم `unimeta_session` بخصائص HttpOnly وSameSite=Lax وSecure في production، ولا يعيده للمتصفح إلا sentinel غير سري تحتاجه واجهة الدخول القديمة. تمر كل طلبات API الحقيقية عبر هذا الـ BFF مع Bearer token من الخادم. في وضع Mock، `/api/mock-session` يحفظ الرمز الاصطناعي في Cookie HttpOnly؛ بيانات العرض التجريبية فقط تبقى محلية. يتحقق الـ BFF من Origin لطلبات التغيير؛ اضبط `NEXT_PUBLIC_API_URL` على عنوان Laravel الذي ينتهي بـ`/api`.

في وضع Laravel يمنع `middleware.ts` الدخول إلى `/student/*` و`/admin/*` عند غياب cookie، ثم تحمّل الواجهة `GET /me` وتوجّه الدور غير المناسب إلى `/403`. هذا فحص وجود cookie/تحسين UX فقط؛ Laravel وحده مصدر القرار النهائي. يجب أن تطبق كل Route Policy/Gate وفحص ملكية السجل، ولا تعتبر middleware أو حالة React أو بيانات المستخدم المحفوظة محليًا حماية أمنية. لا توجد حاليًا صفحة تغيير كلمة مرور؛ أضف واجهاتها فقط بعد اعتماد مسار API، من دون تعطيل المسارات الحالية.

## الخدمات والعمليات التي تحتاج تخزينًا فعليًا

### مكتبة ومراجعة المحتوى

المادة تربط بمساق: عنوان، نوع/تصنيف، ملف أو رابط، وصف، رافع، تاريخ، حالة (`منشور`, `مسودة`, `قيد المراجعة`, `مرفوض`) وعدّاد تنزيل/تمييز. الطالب يرفع مساهمة؛ الإدارة تستعرض المعلّق وتعدّل وتنشر أو ترفض وتحذف. قيود الواجهة: 50MB وامتدادات PDF/DOC/DOCX/PPT/PPTX/PNG/JPG/MP4/ZIP. تحقق MIME والحجم والمحتوى في الخادم، خزّن الملف بمعرّف عشوائي خاص، واستخدم روابط تنزيل موقعة مع فحص الصلاحية. لا تسمح بتحميل ملفات غير منشورة للطالب.

### سوق الكتب والأجهزة والاتفاقية

القوائم تتضمن المالك، التخصص، الحالة، النوع، وصف/سعر أو إيداع/مدة. يبدأ الطالب طلبًا لعَرْض؛ تدفق الاتفاقية يجمع معلومات KYC، تحقق جوال OTP، نص/نسخة تعهد، موافقة، وتوقيع Canvas أو ملف. الطلب يذهب لمراجعة الإدارة؛ الإدارة توافق أو ترفض بسبب أو تطلب تعديلًا، ثم يتابع الطرفان التسليم/الإرجاع. البيانات الحساسة والتوقيع لا تخزن في `localStorage` ولا ترجع في قوائم. رقم الهوية والهاتف مقنّعان افتراضيًا، كشفهما يتطلب صلاحية `manage_agreements` وسببًا/سجل تدقيق. خزّن التوقيع كملف خاص مع checksum ووقت الموافقة ونسخة التعهد. OTP محدود المحاولات ومحدد العمر. تحقق أهلية الطالب والمالك والتوفر والتعارض على الخادم. mock الحالي يضيف الطلب مباشرة إلى تخزين المتصفح ويصطنع التحقق؛ لا يعتمد كدليل هوية أو موافقة فعلية.

### الخطط والدراسة والحسابات

توجد 11 خطة نموذجية في `src/data/study-plans-data.ts`: علوم الحاسوب، نظم المعلومات، هندسة أنظمة الحاسوب، هندسة الميكاترونكس، هندسة الحاسوب والاتصالات، هندسة المعدات الطبية، هندسة الطاقة المتجددة، الوسائط المتعددة التطبيقية، هندسة المساحة والجيوماتكس، علم البيانات (ماجستير)، الحوسبة ونظم المعلومات (ماجستير). الكلية الأولى للتسعة بكالوريوس هي كلية الهندسة وتكنولوجيا المعلومات؛ الماجستير تحت كلية الدراسات العليا. القيم والساعات في المصدر بيانات نموذجية ويجب مراجعتها مع الجامعة قبل اعتمادها.

المعدل = مجموع (العلامة × الساعات) ÷ مجموع ساعات المواد ذات العلامة، من 100؛ تقدم الخطة يعتمد الساعات المكتملة/المجموع. حاسبة المعدل والساعات والاختبار يحفظون جزءًا من الحالة في localStorage. الرسوم تقديرية من معدل الساعة المحفوظ في الخطة (JOD) ومصاريف إضافية محلية؛ لا يوجد دفع إلكتروني أو تأكيد رسوم رسمي.

### الإدارة وبقية الميزات

لوحة الإدارة تجمع أعداد الطلبة والمواد والاتفاقيات والبلاغات. إدارة المحتوى والاتفاقيات والأعضاء والمشرفين والصلاحيات والإعدادات والإشعارات وسجلات التدقيق كلها تعمل بمخازن mock/Local Storage أو حالات React بدرجات متفاوتة. لا تعد السجلات المالية المحلية أو أدوار تبديل العرض أو التنبيهات أحداثًا محاسبية أو صلاحيات موثوقة. المشاريع والفرق والمهام والاختبار والملف والتفضيلات تحتاج APIs أو يمكن أن تبقى تفضيلات محلية فقط بقرار المنتج.

## قاعدة بيانات مقترحة

هذه مخطط بداية مستنتج من نماذج TypeScript وسلوك الواجهة، وليس schema قائمًا. استخدم UUID/ULID، timestamps، soft delete حيث يلائم، وفهارس فريدة/مركبة.

| الجدول | الحقول/العلاقات الجوهرية |
|---|---|
| `users` | id, name, email unique, password hash, role, email_verified_at, status, avatar, timestamps. |
| `student_profiles` | user_id unique FK, student_number unique, faculty, major, phone, academic_year; بيانات الهوية الحساسة في مخزن منفصل/مشفّر. |
| `moderator_profiles` | user_id unique FK, title, department, status, invited_by. |
| `permissions`, `moderator_permissions` | permission key unique; moderator_id, permission_id, granted_by. `super_admin` bypass server-side. |
| `invitations` | email, role, token_hash unique, expiry, accepted_at, cancelled_at, inviter_id. لا تخزن رمز الدعوة الصريح. |
| `study_plans`, `courses`, `study_plan_courses` | major/degree/college/credits/hourly rate; course code/name; pivot semester/category/prerequisites. مصدر الخطة قابل للتصحيح والتأريخ. |
| `student_courses` | student_id, plan_course_id nullable, custom name, credits, grade, completed, overrides; unique per student/term/course as appropriate. |
| `materials`, `material_reviews`, `material_downloads` | course_id, uploader_id, storage key, metadata, status, reviewer_id, decision, download audit. |
| `listings` | owner_id, kind(book/device), type, title, category, condition, price/rate/deposit, availability/status. |
| `agreements`, `agreement_parties`, `agreement_signatures`, `agreement_events` | listing_id, requester/owner, dates, financial terms, status, pledge_version, signed_at; private file keys and immutable event timeline. |
| `phone_verifications` | user/phone, OTP hash, expiry, attempts, verified_at, resend window. |
| `reports` | reporter_id, target_type/id, reason, status, reviewer_id, action, resolved_at. |
| `notifications` | recipient_id or audience, category, title/body, read_at, link, created_at. |
| `audit_logs` | actor_id, action, target type/id, reason, before/after safe diff, request_id, IP, created_at. Never put raw password/token/OTP/signature/ID in logs. |
| `graduation_projects`, `project_applications`, `teams`, `team_members` | owner/project, stage, description, application status, membership status and timestamps. Confirm workflow with product. |
| `personal_access_tokens` / Laravel Sanctum tables | Sanctum-managed token hashes, abilities, last_used_at, expiry/revocation. |

لا تنشئ جداول مدفوعات فعلية: الواجهة لا تنفذ تحصيلًا. جدول `admin_payments` mock لا يبرر سجلًا ماليًا قبل تحديد مصدره.

## الربط والنشر

`NEXT_PUBLIC_USE_MOCK=true` هو الوضع الافتراضي، و`NEXT_PUBLIC_API_URL` عنوان Laravel API متضمّنًا بادئة `/api`، و`NEXT_PUBLIC_SITE_URL` أصل Next.js. هذه متغيرات build-time في Next؛ أعد بناء Vercel عند تغييرها. لا تضع أسرارًا في `NEXT_PUBLIC_*`. اجعل Laravel يسمح بأصل الموقع فقط، واضبط `SANCTUM_STATEFUL_DOMAINS`/CORS إذا اختيرت جلسات Sanctum cookie. المسار الحالي يستخدم Sanctum Personal Access Token مخزّنًا في HttpOnly Cookie عبر BFF؛ لا تستخدم token في localStorage. استخدم HTTPS، SameSite، Origin/CSRF حماية للعمليات، rate limiting، وسياسة تدوير/إبطال التوكنات. كل upload خاص، MIME/امتداد/حجم يتحقق خادميًا، مع فحص malware عند توفره.

التعامل الحالي في API Client يوحّد ردود النقل: النجاح `{ data, message }` (وفي TypeScript حقل `errors` يساوي null)، والفشل `{ message, errors }` (واجهة العميل تضم `data: null` و`status` اختياريًا للتوافق). 401 يمسح بيانات الجلسة المحلية ويطلق حدث انتهاء الجلسة، 403 منع، 422 أخطاء حقول، 429 حد طلبات، وأخطاء الشبكة تحت `errors.network`.

## ما على مطور Laravel تسليمه

ابدأ بإقرار `docs/API_CONTRACT.md` مع واجهة Next، ثم migrations وseed للخطط المعتمدة، Sanctum، Policies/Gates، الاختبارات، رفع/تنزيل الملفات الخاصة، البريد وOTP، سجل التدقيق، والـ endpoints. بدّل كل مخزن بيانات محلي إلى service حقيقي، واحتفظ بالـ mocks للوضع التجريبي. راجع مع الجامعة الأرقام والساعات والسياسات؛ لا تنشر محتوى أو رسومًا أو اعتمادًا رسميًا مستنتجًا من fixtures.
