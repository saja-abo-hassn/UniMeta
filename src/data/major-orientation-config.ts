/**
 * UniMeta Orientation Quiz & Major Matching Configuration
 *
 * Holland RIASEC-inspired 15-question orientation assessment mapped strictly
 * to the actual study plans existing in Al-Azhar University (Faculty of Engineering & IT).
 */

export const STORAGE_QUIZ_PROGRESS_KEY = "unimeta_orientation_quiz_progress_v1";
export const STORAGE_QUIZ_RESULT_KEY = "unimeta_student_orientation_result_v1";

export type TraitKey = "T" | "S" | "H" | "B" | "C";

export interface TraitInfo {
  key: TraitKey;
  name: string;
  nameEn: string;
  shortDesc: string;
  fullDesc: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  icon: string;
}

export const TRAITS_CONFIG: Record<TraitKey, TraitInfo> = {
  T: {
    key: "T",
    name: "تقني ومنطقي",
    nameEn: "Technical & Logical",
    shortDesc: "شغف بالبرمجة، الخوارزميات، والعتاد والأنظمة المتقدمة.",
    fullDesc: "القدرة على التفكير التحليلي المنظم، حل المشكلات المعقدة بالخطوات، وحب التعامل مع الأجهزة والبرمجيات.",
    color: "#0057C8",
    badgeBg: "bg-brand-surface-blue",
    badgeBorder: "border-[#BEE3F8]",
    textColor: "text-brand-primary",
    icon: "💻",
  },
  S: {
    key: "S",
    name: "علمي ومخبري",
    nameEn: "Scientific & Laboratory",
    shortDesc: "حب الاستكشاف، التجارب المعملية، والفيزياء والأجهزة الحيوية.",
    fullDesc: "الفضول العلمي، فحص الأدلة، الاهتمام بعلوم الطاقة، الأجهزة الطبية والرعاية الصحية الدقيقة.",
    color: "#4DB7F2",
    badgeBg: "bg-brand-surface-blue",
    badgeBorder: "border-brand-border-soft",
    textColor: "text-brand-primary",
    icon: "🔬",
  },
  H: {
    key: "H",
    name: "إنساني واجتماعي",
    nameEn: "Humanistic & Social",
    shortDesc: "رغبة بمساعدة الناس، التواصل، وتطوير المجتمع والخدمات.",
    fullDesc: "التعاطف، الصبر، مهارات الاستماع، والاهتمام بإحداث أثر إيجابي في حياة الأفراد والرعاية المجتمعية.",
    color: "#2D78B7",
    badgeBg: "bg-brand-surface-blue",
    badgeBorder: "border-brand-border-soft",
    textColor: "text-brand-primary",
    icon: "🤝",
  },
  B: {
    key: "B",
    name: "إداري وأعمال",
    nameEn: "Business & Management",
    shortDesc: "تنظيم المشاريع، قيادة الفرق، وحوكمة البيانات والاستثمار.",
    fullDesc: "الريادة والمبادرة، التخطيط الاستراتيجي، إدارة الموارد والميزانيات وربط التقنية باحتياجات السوق.",
    color: "#0045A5",
    badgeBg: "bg-brand-surface-blue",
    badgeBorder: "border-brand-border-soft",
    textColor: "text-brand-primary",
    icon: "📊",
  },
  C: {
    key: "C",
    name: "لغوي وإبداعي",
    nameEn: "Creative & Design",
    shortDesc: "تصميم واجهات UI/UX، الرسوم، الميديا، والإنتاج البصري.",
    fullDesc: "الخيال الواسع، الابتكار الجمالي، التعبير الفني، وحب تحويل الأفكار إلى واجهات وتجارب مستخدم ملهمة.",
    color: "#0057C8",
    badgeBg: "bg-brand-surface-blue",
    badgeBorder: "border-brand-border-soft",
    textColor: "text-brand-primary",
    icon: "🎨",
  },
};

export interface QuizOption {
  label: string;
  trait: TraitKey;
  subtext?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  categoryHint: string;
  options: QuizOption[];
}

export const ORIENTATION_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "أي نشاط تفضّل ممارسته في وقت فراغك؟",
    categoryHint: "الأنشطة والهوايات المفضلة",
    options: [
      { label: "تجميع وإصلاح أجهزة إلكترونية أو تجربة أكواد برمجية", trait: "T" },
      { label: "إجراء تجارب عملية واستكشاف الطبيعة والظواهر العلمية", trait: "S" },
      { label: "مساعدة الناس والاستماع لمشاكلهم ومساندتهم", trait: "H" },
      { label: "تنظيم فعاليات، إدارة مجموعة شبابية، أو بدء فكرة مشروع", trait: "B" },
      { label: "الرسم، التصميم الرقمي، أو كتابة نصوص وصناعة محتوى إبداعي", trait: "C" },
    ],
  },
  {
    id: 2,
    question: "أي مادة كنت تستمتع بها وتتحمس لحصصها أكثر بالمدرسة؟",
    categoryHint: "المواد الدراسية المحببة",
    options: [
      { label: "الرياضيات وتكنولوجيا المعلومات وعلوم الحاسوب", trait: "T" },
      { label: "العلوم العامة، الأحياء، الفيزياء والكيمياء", trait: "S" },
      { label: "التربية المدنية، علم الاجتماع والتاريخ الإنساني", trait: "H" },
      { label: "الاقتصاد، إدارة الأعمال والعلوم المالية", trait: "B" },
      { label: "اللغات، الأدب، التعبير الفني والتصميم", trait: "C" },
    ],
  },
  {
    id: 3,
    question: "عندما تواجهك مشكلة معقدة، كيف تفضل حلّها؟",
    categoryHint: "أسلوب التفكير وحل المشكلات",
    options: [
      { label: "بخطوات منطقية منظمة، خوارزميات ومعادلات دقيقة", trait: "T" },
      { label: "بالتجربة المعملية، جمع القياسات وفحص الأدلة الملموسة", trait: "S" },
      { label: "بالحوار المباشر وتفهم وجهات النظر ومشاعر الأطراف", trait: "H" },
      { label: "بإعادة تنظيم الأولويات، خطة عمل وتوزيع المهام", trait: "B" },
      { label: "بابتكار زاوية جديدة غير مألوفة خارج الصندوق", trait: "C" },
    ],
  },
  {
    id: 4,
    question: "أي بيئة عمل تجد نفسك منسجماً ومنتجاً فيها؟",
    categoryHint: "بيئة ومكان العمل المستقبلي",
    options: [
      { label: "أمام شاشات الحاسوب، أنظمة السيرفرات والشبكات المتقدمة", trait: "T" },
      { label: "مختبر علمي متطور، ميدان تطبيقي أو غرفة أجهزة طبية", trait: "S" },
      { label: "مؤسسة تعليمية أو مركز تأهيلي يتعامل مباشرة مع الأفراد", trait: "H" },
      { label: "شركة استثمارية، مكتب تخطيط وإدارة مشاريع واستشارات", trait: "B" },
      { label: "استوديو تصميم تفاعلي، ورشة إنتاج وسائط ورسوم مرئية", trait: "C" },
    ],
  },
  {
    id: 5,
    question: "أي إنجاز من التالي يشعرك بأكبر قدر من الفخر والسعادة؟",
    categoryHint: "دوافع النجاح الشخصي",
    options: [
      { label: "كود برمجي أو نظام تقني معقد يعمل بنجاح وسلاسة", trait: "T" },
      { label: "اكتشاف نتيجة علمية مثبتة أو حل عطل في جهاز حساس", trait: "S" },
      { label: "رؤية إنسان تغيّرت حياته للأفضل وتجاوز محنته بمساعدتك", trait: "H" },
      { label: "مشروع ريادي أطلقته وحقق نجاحاً واسعاً وأرباحاً ملموسة", trait: "B" },
      { label: "عمل فني أو واجهة مستخدم مبهرة نالت إعجاب وتفاعل الجميع", trait: "C" },
    ],
  },
  {
    id: 6,
    question: "إذا سُئل أصدقاؤك عن أبرز صفاتك، بماذا سيصفونك؟",
    categoryHint: "السمات الشخصية البارزة",
    options: [
      { label: "دقيق، منطقي وعقلاني في تحليل الأمور", trait: "T" },
      { label: "فضولي، مستكشف، وتبحث دائماً عن كيفية عمل الأشياء", trait: "S" },
      { label: "متعاطف، صبور، وتضع مشاعر الآخرين واحتياجاتهم أولاً", trait: "H" },
      { label: "قيادي، منظم، وصاحب مبادرة وتوجيه للفرق", trait: "B" },
      { label: "واسع الخيال، ذو ذوق بصري لافت وحس إبداعي متجدد", trait: "C" },
    ],
  },
  {
    id: 7,
    question: "أي نوع من القراءة والمقالات يجذبك لتصفحه بشغف؟",
    categoryHint: "الاهتمامات المعرفية والثقافية",
    options: [
      { label: "أحدث ابتكارات الذكاء الاصطناعي، الأمن السيبراني ولغات البرمجة", trait: "T" },
      { label: "المقالات الطبية، أبحاث الطاقة المستدامة والاكتشافات الهندسية", trait: "S" },
      { label: "كتب علم النفس، تطوير الشخصية، والتربية المجتمعية", trait: "H" },
      { label: "قصص نجاح الشركات الناشئة، أساليب القيادة وأسواق المال", trait: "B" },
      { label: "روايات الأدب العالمي، فنون التصميم الجرافيكي ونقد الأفلام", trait: "C" },
    ],
  },
  {
    id: 8,
    question: "عند المشاركة في مشروع جماعي، ما الدور التلقائي الذي تختاره؟",
    categoryHint: "الأدوار ضمن فرق العمل",
    options: [
      { label: "تولي الشق التقني، البرمجة وبناء البنية التحتية للمشروع", trait: "T" },
      { label: "البحث، فحص الفرضيات، وجمع وتحليل البيانات بدقة", trait: "S" },
      { label: "التواصل بين الأعضاء، تحفيز الفريق وحل أي سوء تفاهم", trait: "H" },
      { label: "تنسيق خطة العمل، تقسيم المهام، ومتابعة المواعيد والمخرجات", trait: "B" },
      { label: "تصميم العرض التقديمي، الهوية البصرية وإخراج المواد بأبهى صورة", trait: "C" },
    ],
  },
  {
    id: 9,
    question: "أي مهارة جديدة تتمنى بشدة إتقانها والاحتراف فيها؟",
    categoryHint: "التطلعات والمهارات المستقبلية",
    options: [
      { label: "بناء تطبيقات ذكية، هندسة الخوارزميات وهياكل البيانات", trait: "T" },
      { label: "تشخيص الأعطال الإلكترونية الدقيقة وصيانة الأجهزة المعقدة", trait: "S" },
      { label: "الإرشاد، التدريب، وفنون التأثير الإيجابي في الناس", trait: "H" },
      { label: "إدارة المشاريع الرقمية، استراتيجيات التسويق ودراسات الجدوى", trait: "B" },
      { label: "تصميم واجهات المستخدم UI/UX، الرسوم المتحركة وصناعة الوسائط", trait: "C" },
    ],
  },
  {
    id: 10,
    question: "ما هي نظرتك وعلاقتك بالتعامل مع الأرقام والبيانات؟",
    categoryHint: "الميل للأرقام والحسابات",
    options: [
      { label: "أحبها وأتقنها، أراها لغة المنطق والبرمجة وحل الألغاز", trait: "T" },
      { label: "أراها أداة علمية جوهرية لقياس التجارب وتأكيد النتائج", trait: "S" },
      { label: "أفضّل التركيز على العلاقات الإنسانية والكلام المباشر أكثر من الجداول", trait: "H" },
      { label: "أعتبرها عصب القرارات المالية، حساب الأرباح وإدارة الميزانيات", trait: "B" },
      { label: "أفضّل تحويلها إلى رسوم بيانية وأشكال بصرية سهلة وجذابة", trait: "C" },
    ],
  },
  {
    id: 11,
    question: "أي تحدٍ وقضية عالمية تحلم بالمساهمة الحقيقية في حلها؟",
    categoryHint: "الأثر والرسالة المجتمعية",
    options: [
      { label: "تعزيز الأمن السيبراني وكفاءة الأنظمة السحابية والذكية", trait: "T" },
      { label: "تطوير الرعاية الصحية بالمستشفيات أو توفير مصادر طاقة نظيفة", trait: "S" },
      { label: "محاربة الجهل والفقر وتوفير الدعم النفسي والاجتماعي للفئات الهشة", trait: "H" },
      { label: "الحد من البطالة عبر خلق فرص عمل ومشاريع اقتصادية مستدامة", trait: "B" },
      { label: "إثراء المحتوى البصري الهادف وتسهيل وصول المعلومة بتصميم إنساني", trait: "C" },
    ],
  },
  {
    id: 12,
    question: "ما الطريقة التي تجعلك تستوعب المعلومات الجديدة بأسرع شكل؟",
    categoryHint: "أسلوب التعلّم المفضّل",
    options: [
      { label: "التطبيق العملي الفوري على الحاسوب وتصحيح الأخطاء ذاتياً", trait: "T" },
      { label: "التجارب المخبرية، فحص المجسمات والملاحظة بالعين المجردة", trait: "S" },
      { label: "النقاش التفاعلي، مجموعات العصف الذهني والشرح للزملاء", trait: "H" },
      { label: "دراسة أمثلة واقعية لشركات، دراسات حالة ومحاكاة مواقف عملية", trait: "B" },
      { label: "الرسوم التوضيحية، الفيديوهات التفاعلية، والخرائط الذهنية الملونة", trait: "C" },
    ],
  },
  {
    id: 13,
    question: "في أي ظروف عمل تشعر بأقصى درجات التركيز والإنتاجية؟",
    categoryHint: "طبيعة وشكل بيئة العمل",
    options: [
      { label: "بمفردي في هدوء تام على مهمة تقنية تتطلب تركيزاً عميقاً", trait: "T" },
      { label: "ضمن فريق بحثي صغير ومتخصص يدقق في كل جزئية علمية", trait: "S" },
      { label: "في وسط اجتماعي مليء بالحركة والتواصل المستمر مع الناس", trait: "H" },
      { label: "كرئيس فريق يدير الاجتماعات، يوجه الأعضاء ويتابع مؤشرات الإنجاز", trait: "B" },
      { label: "في بيئة مرنة وإبداعية تشجع على الابتكار والتعبير البصري الحر", trait: "C" },
    ],
  },
  {
    id: 14,
    question: "أي من المسميات الوظيفية التالية تشعر بأنه يمثّل طموحك؟",
    categoryHint: "التطلّع المهني المستقبلي",
    options: [
      { label: "مهندس برمجيات / مطوّر أنظمة وحلول ذكاء اصطناعي", trait: "T" },
      { label: "مهندس أجهزة طبية ومستشفيات / مهندس طاقة وأنظمة متجددة", trait: "S" },
      { label: "مستشار توجيه وتأهيل / منسق برامج دعم وتنمية مجتمعية", trait: "H" },
      { label: "مدير مشاريع تكنولوجية / محلل نظم مؤسسية واستشاري أعمال", trait: "B" },
      { label: "مصمم واجهات وتجربة مستخدم (UI/UX) / منتج وسائط تفاعلية", trait: "C" },
    ],
  },
  {
    id: 15,
    question: "ما المعيار الأهم الذي ستقيّم به نجاح مسيرتك المهنية بعد التخرج؟",
    categoryHint: "الدافع والغاية النهائية",
    options: [
      { label: "مواكبة أعلى التطورات التقنية وبناء حلول برمجية مبتكرة", trait: "T" },
      { label: "المساهمة في ابتكار وتطوير حلول هندسية وطبية تخدم العلم", trait: "S" },
      { label: "حجم الأثر الإنساني والمحبة والخدمة التي قدمتها للناس", trait: "H" },
      { label: "الوصول لمناصب قيادية، الاستقلال المالي وتحقيق نمو اقتصادي", trait: "B" },
      { label: "صناعة بصمة إبداعية متميزة وأعمال بصرية يفتخر بها الجميع", trait: "C" },
    ],
  },
];

/**
 * Mapping table: Study plan ID -> Trait weights (strictly for plans in the project)
 * Weights sum to 1.0 per major.
 */
export interface MajorWeightProfile {
  planId: string;
  majorName: string;
  collegeName: string;
  degree: "بكالوريوس" | "ماجستير";
  weights: Record<TraitKey, number>;
  highlightTraits: TraitKey[];
  recommendationReason: string;
  careerPath: string;
  iconName: string;
}

export const MAJOR_PROFILES: MajorWeightProfile[] = [
  {
    planId: "cs",
    majorName: "علوم الحاسوب",
    collegeName: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    weights: { T: 0.52, S: 0.16, B: 0.12, C: 0.14, H: 0.06 },
    highlightTraits: ["T", "C"],
    recommendationReason:
      "تظهر إجاباتك شغفاً كبيراً بالتفكير المنطقي، حل المشكلات بالخوارزميات، وشغف بناء البرمجيات الذكية؛ مما يجعل علوم الحاسوب وجهتك الطبيعية للتميز.",
    careerPath: "مطور برمجيات كاملة، مهندس خوارزميات وذكاء اصطناعي، مطور تطبيقات وأنظمة سحابية.",
    iconName: "computer",
  },
  {
    planId: "is",
    majorName: "نظم المعلومات",
    collegeName: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    weights: { T: 0.32, S: 0.08, B: 0.44, C: 0.08, H: 0.08 },
    highlightTraits: ["B", "T"],
    recommendationReason:
      "تتمتع بمزيج رائع من الرؤية الإدارية والقدرة التقنية، وتفضل ربط التكنولوجيا بإدارة الأعمال وتنسيق المشاريع وحوكمة البيانات المؤسسية.",
    careerPath: "محلل نظم أعمال، مدير مشاريع رقمية، استشاري تخطيط موارد المؤسسات ERP، حوكمة البيانات.",
    iconName: "database",
  },
  {
    planId: "cce",
    majorName: "هندسة أنظمة الحاسوب",
    collegeName: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    weights: { T: 0.48, S: 0.28, B: 0.12, C: 0.06, H: 0.06 },
    highlightTraits: ["T", "S"],
    recommendationReason:
      "يميل تفكيرك إلى فهم كيفية عمل الحواسيب من الداخل؛ من المعالجات والدوائر الرقمية إلى الأنظمة المدمجة وبرمجة العتاد منخفضة المستوى.",
    careerPath: "مهندس أنظمة مدمجة، مطور أجهزة إنترنت الأشياء IoT، مهندس بنية تحتية وعمارة حواسيب.",
    iconName: "chip",
  },
  {
    planId: "mechatronics",
    majorName: "هندسة الميكاترونكس",
    collegeName: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    weights: { T: 0.38, S: 0.40, B: 0.10, C: 0.06, H: 0.06 },
    highlightTraits: ["S", "T"],
    recommendationReason:
      "شغفك يجمع بين الميكانيكا الذكية، الدوائر الإلكترونية، والبرمجة المؤتمتة؛ وهو التكوين المثالي لتصميم الروبوتات والأنظمة الصناعية الذكية.",
    careerPath: "مهندس روبوتات وأتمتة صناعية، مصمم أنظمة تحكم وميكانيكا إلكترونية، مطور معدات ذكية.",
    iconName: "robot",
  },
  {
    planId: "telecom",
    majorName: "هندسة الحاسوب والاتصالات",
    collegeName: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    weights: { T: 0.44, S: 0.34, B: 0.10, C: 0.06, H: 0.06 },
    highlightTraits: ["T", "S"],
    recommendationReason:
      "يلهمك عالم الشبكات اللاسلكية وتراسل البيانات وتأمين الاتصالات الحديثة وربط العالم ببروتوكولات وبنى اتصالات سريعة وآمنة.",
    careerPath: "مهندس شبكات واتصالات متقدمة، مصمم بنى سحابية ولاسلكية، مهندس ألياف ضوئية وبث رقمي.",
    iconName: "signal",
  },
  {
    planId: "biomedical",
    majorName: "هندسة المعدات الطبية",
    collegeName: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    weights: { T: 0.22, S: 0.42, B: 0.08, C: 0.06, H: 0.22 },
    highlightTraits: ["S", "H"],
    recommendationReason:
      "تجمع بين الفضول العلمي التقني والرغبة الصادقة في خدمة صحة الإنسان ورعاية المرضى عبر الأجهزة الطبية التشخيصية وأجهزة العناية المركزة.",
    careerPath: "مهندس صيانة وتطوير أجهزة طبية، مسؤول هندسة المستشفيات، متخصص أنظمة التصوير والمختبرات.",
    iconName: "heartbeat",
  },
  {
    planId: "energy",
    majorName: "هندسة الطاقة المتجددة",
    collegeName: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    weights: { T: 0.32, S: 0.44, B: 0.12, C: 0.06, H: 0.06 },
    highlightTraits: ["S", "T"],
    recommendationReason:
      "يدفعك شغف الحفاظ على البيئة والاستفادة من المصادر الطبيعية؛ لتصميم محطات الطاقة الشمسية والرياح وإدارة كفاءة الطاقة والشبكات الكهربائية الذكية.",
    careerPath: "مهندس محطات طاقة شمسية ورياح، استشاري كفاءة طاقة، مهندس شبكات كهربائية ذكية وتخزين طاقة.",
    iconName: "sun",
  },
  {
    planId: "multimedia",
    majorName: "الوسائط المتعددة التطبيقية",
    collegeName: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    weights: { T: 0.28, S: 0.06, B: 0.10, C: 0.48, H: 0.08 },
    highlightTraits: ["C", "T"],
    recommendationReason:
      "تمتلك حساً جمالياً وإبداعياً متفرداً يندمج مع التقنية؛ لتصميم واجهات وتجارب المستخدم UI/UX، الرسوم ثلاثية الأبعاد، والوسائط الرقمية التفاعلية.",
    careerPath: "مصمم واجهات وتجربة مستخدم UI/UX، فنان رسوم متحركة 2D/3D، مصمم وسائط رقمية وألعاب تفاعلية.",
    iconName: "palette",
  },
  {
    planId: "geomatics",
    majorName: "هندسة المساحة والجيوماتكس",
    collegeName: "كلية الهندسة وتكنولوجيا المعلومات",
    degree: "بكالوريوس",
    weights: { T: 0.34, S: 0.40, B: 0.14, C: 0.06, H: 0.06 },
    highlightTraits: ["S", "T"],
    recommendationReason:
      "يجذبك تحليل البيانات المكانية، نظم المعلومات الجغرافية GIS، التصوير الجوي والاستشعار عن بعد لرسم الخرائط الرقمية وتخطيط المدن الذكية.",
    careerPath: "مهندس نظم معلومات جغرافية GIS، متخصص مساحة واستشعار عن بعد، محلل مكاني للبيئات والمشاريع.",
    iconName: "chip",
  },
];

export interface QuizResultCalculation {
  scores: Record<TraitKey, number>;
  percentages: Record<TraitKey, number>;
  topTraits: TraitKey[];
  topMajor: MajorWeightProfile & { matchPercentage: number };
  alternatives: (MajorWeightProfile & { matchPercentage: number })[];
  summaryExplanation: string;
  completedAt: string;
}

/**
 * Calculates student orientation results from their raw answers.
 */
export function calculateOrientationResult(answers: Record<number, TraitKey>): QuizResultCalculation {
  const scores: Record<TraitKey, number> = { T: 0, S: 0, H: 0, B: 0, C: 0 };
  const totalAnswers = Object.keys(answers).length || 1;

  Object.values(answers).forEach((trait) => {
    if (scores[trait] !== undefined) {
      scores[trait] += 1;
    }
  });

  const percentages: Record<TraitKey, number> = {
    T: Math.round((scores.T / totalAnswers) * 100),
    S: Math.round((scores.S / totalAnswers) * 100),
    H: Math.round((scores.H / totalAnswers) * 100),
    B: Math.round((scores.B / totalAnswers) * 100),
    C: Math.round((scores.C / totalAnswers) * 100),
  };

  // Sort traits by highest score
  const sortedTraits = (Object.keys(scores) as TraitKey[]).sort((a, b) => scores[b] - scores[a]);
  const primaryTrait = sortedTraits[0];
  const secondaryTrait = sortedTraits[1];

  // Score each major based on weighted alignment with student's trait vector
  const rankedMajors = MAJOR_PROFILES.map((profile) => {
    // Weighted dot product
    let rawScore = 0;
    (Object.keys(profile.weights) as TraitKey[]).forEach((trait) => {
      const studentRatio = scores[trait] / totalAnswers;
      const weight = profile.weights[trait];
      rawScore += Math.sqrt(studentRatio * weight);
    });

    // Bonus for matching top traits
    if (profile.highlightTraits.includes(primaryTrait)) {
      rawScore += 0.08;
    }
    if (profile.highlightTraits.includes(secondaryTrait)) {
      rawScore += 0.04;
    }

    // Scale to intuitive range between 68% and 97%
    const normalized = Math.min(0.97, Math.max(0.68, rawScore * 1.15));
    const matchPercentage = Math.round(normalized * 100);

    return {
      ...profile,
      matchPercentage,
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);

  const topMajor = rankedMajors[0];
  const alternatives = rankedMajors.slice(1, 3);

  // Customized 2-line explanation in Arabic
  const trait1Info = TRAITS_CONFIG[primaryTrait];
  const trait2Info = TRAITS_CONFIG[secondaryTrait];

  const summaryExplanation = `أظهرت إجاباتك تميزاً واضحاً في سمة "${trait1Info.name}" بنسبة ${percentages[primaryTrait]}% وتليها سمة "${trait2Info.name}" بنسبة ${percentages[secondaryTrait]}%.\nهذا التوافق يرجّح تفوقك وإبداعك الأكاديمي في خطة "${topMajor.majorName}" مع إمكانيات واعدة في المسارات المتقاربة.`;

  return {
    scores,
    percentages,
    topTraits: [primaryTrait, secondaryTrait],
    topMajor,
    alternatives,
    summaryExplanation,
    completedAt: new Date().toISOString(),
  };
}
