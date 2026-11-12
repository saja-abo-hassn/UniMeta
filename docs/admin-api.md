# توثيق واجهة برمجة تطبيقات لوحة الإدارة (UniMeta Admin API)

## 1. مسار بيانات المسؤول الحالي (Admin Profile)

### `GET /api/admin/me`
يعيد بيانات حساب الإدارة المسجل في الجلسة النشطة.

```json
{
  "data": {
    "id": "1",
    "name": "اسم المستخدم",
    "email": "admin@example.com",
    "role": "super_admin",
    "title": "المسؤول العام",
    "avatarUrl": null
  },
  "message": "Success"
}
```

- `role`: أحد الدورين `super_admin` (المسؤول العام) أو `moderator` (مشرف).
- `title`: المسمى الوظيفي المخصص أو يرجع للقيمة الافتراضية للدور.
- `avatarUrl`: رابط صورة الأفاتار إن وُجد، أو `null` ليقوم الفرونت بتوليد الحرفين الأولين تلقائيًا.

---

## 2. مسار إحصائيات النظرة العامة (Admin Overview KPIs)

### `GET /api/admin/overview`
يعيد جميع المؤشرات الحيوية للوحة التحكم الإدارية.

```json
{
  "data": {
    "totalStudents": 150,
    "activeNow": 12,
    "pendingAgreements": 4,
    "activeLoans": 9,
    "contentCount": 42,
    "coveredCourses": 8,
    "totalCourses": 10,
    "openReports": 2
  },
  "message": "Success"
}
```

### طريقة حساب كل إحصائية في Laravel Eloquent:

1. **`totalStudents` (إجمالي حسابات الطلاب):**
   ```php
   User::where('role', 'student')->count();
   ```

2. **`activeNow` (الطلاب النشطون خلال آخر 15 دقيقة):**
   ```php
   User::where('role', 'student')
       ->where('last_active_at', '>=', now()->subMinutes(15))
       ->count();
   ```

3. **`pendingAgreements` (اتفاقيات تنتظر قرار الأدمن):**
   ```php
   Agreement::where('status', 'قيد الانتظار')->count();
   ```

4. **`activeLoans` (العهد النشطة):**
   ```php
   Agreement::where('status', 'موافق عليها')->count();
   ```

5. **`contentCount` (المواد والمحتويات المنشورة فقط):**
   ```php
   Material::where('status', 'منشور')->count();
   ```

6. **`coveredCourses` (المساقات المغطاة التي تحتوي على ملف منشور واحد على الأقل):**
   ```php
   Course::whereHas('materials', function ($query) {
       $query->where('status', 'منشور');
   })->count();
   ```

7. **`totalCourses` (إجمالي المساقات المعتمدة في النظام):**
   ```php
   Course::count();
   ```

8. **`openReports` (البلاغات المفتوحة بانتظار المشرف):**
   ```php
   Report::where('status', 'مفتوح')->count();
   ```

