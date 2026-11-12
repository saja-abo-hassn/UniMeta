export interface ProjectMember {
  name: string;
  role: string;
  major: string;
  initials: string;
}

export interface ProjectMilestone {
  title: string;
  date: string;
  status: "completed" | "in_progress" | "pending";
}

export type ProjectScope = "مشروع 1" | "مشروع 2" | "مشروع 1 و 2";

export interface GraduationProject {
  id: string;
  title: string;
  major: string;
  department: string;
  supervisor: string;
  leader: string;
  projectScope: ProjectScope;
  members: ProjectMember[];
  neededCount: number;
  neededRoles: string[];
  stage: "فكرة معتمدة" | "المرحلة 1 (بحث ونمذجة)" | "المرحلة 2 (تطوير واختبار)" | "جاهز للمناقشة";
  status: "يبحث عن شركاء" | "مكتمل الفريق" | "قيد التقييم الأكاديمي";
  summary: string;
  problemStatement: string;
  objectives: string[];
  technologies: string[];
  milestones: ProjectMilestone[];
  submissionDate: string;
  academicYear: string;
}

export const initialGraduationProjects: GraduationProject[] = [
  {
    id: "proj-1",
    title: "نظام ذكي لإدارة ومراقبة النفايات الطبية عبر إنترنت الأشياء (IoT)",
    major: "هندسة أنظمة الحاسوب",
    department: "كلية الهندسة وتكنولوجيا المعلومات",
    supervisor: "د. سارة الخطيب",
    leader: "محمد العوضي",
    projectScope: "مشروع 2",
    members: [
      { name: "محمد العوضي", role: "قائد الفريق ومطور متحكمات", major: "هندسة الحاسوب", initials: "مع" },
      { name: "ريم النجار", role: "مهندسة برمجيات وواجهات الويب", major: "هندسة البرمجيات", initials: "رن" },
    ],
    neededCount: 1,
    neededRoles: ["مطور خوارزميات ذكاء اصطناعي (AI/CV)"],
    stage: "المرحلة 2 (تطوير واختبار)",
    status: "يبحث عن شركاء",
    summary: "نظام متكامل يربط حاويات النفايات الطبية الخطرة في المستشفيات بحساسات ذكية وشبكة سحابية لرصد الامتلاء والتعقيم ومنع التسرب في الوقت الحقيقي.",
    problemStatement: "تراكم النفايات الطبية في المراكز الصحية دون متابعة لحظية يشكل خطراً بيئياً وصحياً بالغاً على الطواقم والمرضى.",
    objectives: [
      "تصميم عقد استشعار ذكية ومنخفضة استهلاك الطاقة باستخدام ESP32.",
      "بناء لوحة تحكم سحابية لمتابعة مسار شاحنات الجمع والكميات المستلمة.",
      "تطبيق نموذج رؤية حاسوبية لتصنيف خطورة النفايات قبل الإغلاق.",
    ],
    technologies: ["IoT", "ESP32", "React", "Node.js", "Python", "MQTT", "Tailwind CSS"],
    milestones: [
      { title: "تسليم وثيقة المتطلبات والمعمارية البرمجية (SRS)", date: "2025-11-20", status: "completed" },
      { title: "بناء النموذج الأولي للدارة الإلكترونية والمستشعرات", date: "2026-01-15", status: "completed" },
      { title: "تطوير لوحة التحكم السحابية وربط واجهات API", date: "2026-03-30", status: "in_progress" },
      { title: "الاختبار الميداني والتسليم النهائي للمناقشة", date: "2026-05-15", status: "pending" },
    ],
    submissionDate: "2026-05-20",
    academicYear: "2025/2026",
  },
  {
    id: "proj-2",
    title: "منصة تعليمية تفاعلية لدعم الطلاب ذوي الاحتياجات السمعية عبر الذكاء الاصطناعي",
    major: "هندسة البرمجيات",
    department: "كلية الهندسة وتكنولوجيا المعلومات",
    supervisor: "د. حازم مقداد",
    leader: "سارة النجار",
    projectScope: "مشروع 1",
    members: [
      { name: "سارة النجار", role: "قائدة الفريق ومصممة تجربة المستخدم UI/UX", major: "هندسة البرمجيات", initials: "سن" },
      { name: "أحمد صالحة", role: "مطور الواجهات الخلفية وقواعد البيانات", major: "تكنولوجيا المعلومات", initials: "أص" },
    ],
    neededCount: 1,
    neededRoles: ["مطور تطبيقات هواتف ذكية (Flutter)"],
    stage: "المرحلة 1 (بحث ونمذجة)",
    status: "يبحث عن شركاء",
    summary: "منصة تعتمد نماذج الذكاء الاصطناعي لتحويل المحاضرات الصوتية والمرئية فورياً إلى لغة الإشارة العربية المعيارية ونصوص تفاعلية مبسطة.",
    problemStatement: "صعوبة وصول الطلاب الصم وضعاف السمع للمحتوى الجامعي الأكاديمي الحي بنفس جودة وسرعة أقرانهم.",
    objectives: [
      "بناء نموذج تعلم آلي للتعرف على الكلام العربي وتحويله إلى تسلسل حركي ثلاثي الأبعاد (Avatar).",
      "توفير تطبيق جوال يتيح للطالب متابعة المحاضرة الجامعية بترجمة فورية متزامنة.",
      "إنشاء قاموس أكاديمي مصور ومفتوح للمصطلحات الهندسية والطبية.",
    ],
    technologies: ["Flutter", "Python", "TensorFlow", "FastAPI", "WebRTC", "PostgreSQL"],
    milestones: [
      { title: "جمع وتصنيف بيانات لغة الإشارة العربية", date: "2025-12-10", status: "completed" },
      { title: "تدريب النموذج الأولي لمعالجة الكلام", date: "2026-02-28", status: "in_progress" },
      { title: "برمجة تطبيق الموبايل وواجهات المستخدم", date: "2026-04-10", status: "pending" },
    ],
    submissionDate: "2026-06-01",
    academicYear: "2025/2026",
  },
  {
    id: "proj-3",
    title: "منظومة توثيق الشهادات والوثائق الأكاديمية اللامركزية بتقنية البلوكتشين",
    major: "علم البيانات والذكاء الاصطناعي",
    department: "كلية الهندسة وتكنولوجيا المعلومات",
    supervisor: "د. طارق المشهراوي",
    leader: "خالد شاهين",
    projectScope: "مشروع 1 و 2",
    members: [
      { name: "خالد شاهين", role: "مطور عقود ذكية Smart Contracts", major: "علوم الحاسوب", initials: "خش" },
      { name: "طارق زياد", role: "مهندس أمن سيبراني وتشفير", major: "تكنولوجيا المعلومات", initials: "تز" },
      { name: "ميسرة خليل", role: "مطور ويب متكامل Full Stack", major: "هندسة البرمجيات", initials: "مخ" },
    ],
    neededCount: 0,
    neededRoles: [],
    stage: "المرحلة 2 (تطوير واختبار)",
    status: "مكتمل الفريق",
    summary: "شبكة خاصة مبنية على Ethereum/Hyperledger لمنح وتحقق فوري من مصداقية الشهادات الجامعية وكشوف العلامات دون وسيط ورقي وبمنتهى الأمان.",
    problemStatement: "تزوير الوثائق الورقية والوقت الطويل المستغرق في تصديق الشهادات بين الجامعات وسوق العمل والمؤسسات الدولية.",
    objectives: [
      "كتابة عقود ذكية متوافقة مع معايير W3C Verifiable Credentials.",
      "توفير بوابة تحقق فورية للشركات عبر قراءة رمز QR Code مشفر.",
      "الحفاظ على خصوصية درجات الطالب عبر إثبات المعرفة الصفرية (Zero-Knowledge Proofs).",
    ],
    technologies: ["Solidity", "Ethereum", "Next.js", "IPFS", "Docker", "Node.js"],
    milestones: [
      { title: "نشر العقود الذكية على شبكة الاختبار Testnet", date: "2026-01-30", status: "completed" },
      { title: "اختبار الأمان والفحص ضد الثغرات الأمنية (Smart Contract Audit)", date: "2026-03-15", status: "completed" },
      { title: "إطلاق البوابة التجريبية لعمادة القبول والتسجيل", date: "2026-04-25", status: "in_progress" },
    ],
    submissionDate: "2026-05-30",
    academicYear: "2025/2026",
  },
  {
    id: "proj-4",
    title: "منصة الكشف المبكر عن الآفات الزراعية باستخدام الطائرات المسيرة والتعلم العميق",
    major: "علوم الحاسوب",
    department: "كلية الهندسة وتكنولوجيا المعلومات",
    supervisor: "د. محمود قاسم",
    leader: "هبة الدلو",
    projectScope: "مشروع 1",
    members: [
      { name: "هبة الدلو", role: "باحثة ذكاء اصطناعي ومعالجة صور", major: "علوم الحاسوب", initials: "هد" },
      { name: "عمر الشرفا", role: "مهندس تحكم وبرمجة أنظمة مدمجة", major: "هندسة أنظمة الحاسوب", initials: "عش" },
    ],
    neededCount: 2,
    neededRoles: ["مطور خوادم سحابية", "محلل بيانات جغرافية GIS"],
    stage: "فكرة معتمدة",
    status: "يبحث عن شركاء",
    summary: "استخدام طائرات درون مزودة بكاميرات متعددة الأطياف لمسح المحاصيل الزراعية وتحديد بؤر الإصابة الحشرية والأمراض النباتية آلياً.",
    problemStatement: "تأخر اكتشاف الآفات يؤدي لخسائر فادحة في المحاصيل واستخدام مفرط للمبيدات الكيميائية.",
    objectives: [
      "بناء نموذج YOLO مخصص لرصد وتحديد أعراض 12 آفة زراعية شائعة.",
      "توليد خرائط حرارية لتوزيع الإصابة وتوجيه المزارعين للرش الموضعي.",
    ],
    technologies: ["YOLOv8", "PyTorch", "OpenCV", "GIS", "FastAPI", "React Native"],
    milestones: [
      { title: "اعتماد المقترح وخطة البحث من مجلس الكلية", date: "2026-02-01", status: "completed" },
      { title: "جمع وتصنيف الصور الحقلية للآفات", date: "2026-03-20", status: "in_progress" },
    ],
    submissionDate: "2026-06-15",
    academicYear: "2025/2026",
  },
];

