

export interface TeamMember {
  name: string;
  roleEn: string;
  roleAr: string;
  desc: string;
  image?: string;
  isLead?: boolean;
  socials?: {
    linkedin?: string;
    whatsapp?: string;
    instagram?: string;
  };
}

export const coreTeamMembers: TeamMember[] = [
  {
    name: "م. إيناس الحسني ",
    roleEn: "UI/UX Designer",
    roleAr: "مصممة واجهة وتجربة المستخدم",
    desc: "هندسة النماذج التفاعلية ودراسة متطلبات الطلبة وتصميم واجهات المنصة لتوفير تجربة رقمية جامعية سلسة.",
  },
  {
    name: "م. سجى محمد أبو حسن",
    roleEn: "Project Lead & Frontend Developer",
    roleAr: "مؤسسة وقائدة المشروع ومطورة الواجهات",
    desc: "مؤسسة وقائدة مشروع UniMeta، والمشرفة على تطوير رؤية المنصة وهندسة واجهات المستخدم التفاعلية وتنفيذها التقني.",
    image: "/images/saja-profile.jpg",
    isLead: true,
    socials: {
      linkedin: "https://www.linkedin.com/in/saja-abu-hasan-259545374/",
      whatsapp: "https://wa.me/972594334334",
      instagram: "https://www.instagram.com/saja_abo_hassan",
    },
  },
  {
    name: "م. براء الشواف",
    roleEn: "Backend Developer",
    roleAr: "مطور الأنظمة الخلفية",
    desc: "تطوير وهندسة خدمات الـ API وقواعد البيانات، وتأمين تدفق العمليات وتكامل الخدمات الرقمية للمنصة.",
  },
];
