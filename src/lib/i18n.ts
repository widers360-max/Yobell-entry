import type { Language, VisitorType } from "./types";

export type TranslationKey =
  | "tagline"
  | "welcome"
  | "startReception"
  | "selectVisitorType"
  | "visitorType_meeting"
  | "visitorType_delivery"
  | "visitorType_interview"
  | "visitorType_maintenance"
  | "visitorType_reception"
  | "visitorType_tour"
  | "visitorType_other"
  | "purpose_meeting"
  | "purpose_delivery"
  | "purpose_interview"
  | "purpose_maintenance"
  | "purpose_reception"
  | "purpose_tour"
  | "purpose_other"
  | "footerPreregister"
  | "footerPreregisterSub"
  | "footerHelp"
  | "footerHelpSub"
  | "smartReception"
  | "nav_admin"
  | "nav_staff"
  | "auth_adminTitle"
  | "auth_staffTitle"
  | "auth_passwordLabel"
  | "auth_confirm"
  | "auth_cancel"
  | "auth_invalidPassword"
  | "auth_logout"
  | "selectCallMethod"
  | "callQuick"
  | "callQuickSub"
  | "callBusinessCard"
  | "callBusinessCardSub"
  | "callManual"
  | "callManualSub"
  | "businessCardCapture"
  | "businessCardInstruction"
  | "skipBusinessCard"
  | "skipManualInput"
  | "cameraStarting"
  | "selectHost"
  | "searchPlaceholder"
  | "noResults"
  | "visitorInfo"
  | "companyName"
  | "yourName"
  | "phoneOptional"
  | "purposeOptional"
  | "privacyConsent"
  | "privacyNotice"
  | "next"
  | "back"
  | "photoCapture"
  | "photoInstruction"
  | "takePhoto"
  | "skipPhoto"
  | "retakePhoto"
  | "confirmTitle"
  | "confirmHost"
  | "confirmVisitor"
  | "confirmCompany"
  | "confirmPhone"
  | "confirmPurpose"
  | "confirmType"
  | "callHost"
  | "waitingTitle"
  | "waitingPending"
  | "waitingAccepted"
  | "waitingPleaseWait"
  | "waitingDeclined"
  | "waitingNoResponse"
  | "waitingFallback"
  | "returnHome"
  | "department"
  | "role"
  | "required"
  | "cameraError";

const translations: Record<Language, Record<TranslationKey, string>> = {
  ja: {
    tagline: "内線電話のないオフィス受付",
    welcome: "ご来社ありがとうございます",
    startReception: "受付を開始する",
    selectVisitorType: "ご用件をお選びください",
    visitorType_meeting: "打ち合わせ",
    visitorType_delivery: "配達・宅配",
    visitorType_interview: "面接・面談",
    visitorType_maintenance: "工事・点検",
    visitorType_reception: "ご案内・受付",
    visitorType_tour: "会社見学",
    visitorType_other: "その他",
    purpose_meeting: "担当者との打ち合わせ",
    purpose_delivery: "荷物のお預かり・お届け",
    purpose_interview: "採用面接・各種面談",
    purpose_maintenance: "業者様はこちら",
    purpose_reception: "総合案内・受付",
    purpose_tour: "見学希望の方はこちら",
    purpose_other: "上記以外のご用件",
    footerPreregister: "事前登録はこちら",
    footerPreregisterSub: "スムーズにご案内できます",
    footerHelp: "お困りの方はスタッフまで",
    footerHelpSub: "内線 100 または受付までお声がけください",
    smartReception: "SMART RECEPTION",
    nav_admin: "管理",
    nav_staff: "スタッフ",
    auth_adminTitle: "管理者パスワード",
    auth_staffTitle: "スタッフパスワード",
    auth_passwordLabel: "パスワード",
    auth_confirm: "確認",
    auth_cancel: "キャンセル",
    auth_invalidPassword: "パスワードが正しくありません",
    auth_logout: "ログアウト",
    selectCallMethod: "呼び出し方法をお選びください",
    callQuick: "すぐに呼び出す",
    callQuickSub: "お名前を入力せずに担当者を呼び出します",
    callBusinessCard: "名刺を撮影して呼び出す",
    callBusinessCardSub: "名刺写真を担当者に送ります",
    callManual: "お名前を入力して呼び出す",
    callManualSub: "会社名・お名前を入力します",
    businessCardCapture: "名刺を撮影してください",
    businessCardInstruction: "名刺がはっきり写るように撮影してください",
    skipBusinessCard: "撮影せずに呼び出す",
    skipManualInput: "入力せずに呼び出す",
    cameraStarting: "カメラを起動中...",
    selectHost: "担当者をお選びください",
    searchPlaceholder: "名前・部署・会社名で検索",
    noResults: "該当する担当者が見つかりません",
    visitorInfo: "来訪者情報の入力",
    companyName: "会社名",
    yourName: "お名前",
    phoneOptional: "電話番号（任意）",
    purposeOptional: "用件（任意）",
    privacyConsent: "個人情報の取り扱いに同意する",
    privacyNotice:
      "入力された情報は受付対応および来訪記録のために利用されます。",
    next: "次へ",
    back: "戻る",
    photoCapture: "写真撮影",
    photoInstruction:
      "セキュリティのため、来訪記録用の写真を撮影できます（任意）",
    takePhoto: "写真を撮影する",
    skipPhoto: "写真なしで進む",
    retakePhoto: "撮り直す",
    confirmTitle: "内容の確認",
    confirmHost: "担当者",
    confirmVisitor: "お名前",
    confirmCompany: "会社名",
    confirmPhone: "電話番号",
    confirmPurpose: "用件",
    confirmType: "来訪種別",
    callHost: "担当者を呼び出す",
    waitingTitle: "担当者を呼び出しています",
    waitingPending: "担当者を呼び出しています。少々お待ちください。",
    waitingAccepted: "担当者がお迎えに向かっています。少々お待ちください。",
    waitingPleaseWait: "担当者より「少々お待ちください」との返答がありました。",
    waitingDeclined:
      "本日は対応できないとのことです。お手数ですがお電話でご連絡ください。",
    waitingNoResponse:
      "担当者が応答できません。お手数ですがお電話またはメールでご連絡ください。",
    waitingFallback:
      "担当者が応答できません。お手数ですがお電話またはメールでご連絡ください。",
    returnHome: "トップに戻る",
    department: "部署",
    role: "役職",
    required: "必須項目です",
    cameraError: "カメラにアクセスできません。写真なしでお進みください。",
  },
  en: {
    tagline: "Office reception without internal phones",
    welcome: "Thank you for visiting",
    startReception: "Start Reception",
    selectVisitorType: "Please select your visit purpose",
    visitorType_meeting: "Meeting",
    visitorType_delivery: "Delivery",
    visitorType_interview: "Interview",
    visitorType_maintenance: "Maintenance",
    visitorType_reception: "Reception",
    visitorType_tour: "Company Tour",
    visitorType_other: "Other",
    purpose_meeting: "Meeting with staff",
    purpose_delivery: "Package drop-off / pickup",
    purpose_interview: "Job interview / consultation",
    purpose_maintenance: "Contractors & vendors",
    purpose_reception: "General information",
    purpose_tour: "Company tour visitors",
    purpose_other: "Other inquiries",
    footerPreregister: "Pre-register here",
    footerPreregisterSub: "Faster check-in experience",
    footerHelp: "Need assistance?",
    footerHelpSub: "Extension 100 or speak to reception",
    smartReception: "SMART RECEPTION",
    nav_admin: "Admin",
    nav_staff: "Staff",
    auth_adminTitle: "Admin Password",
    auth_staffTitle: "Staff Password",
    auth_passwordLabel: "Password",
    auth_confirm: "Confirm",
    auth_cancel: "Cancel",
    auth_invalidPassword: "Incorrect password",
    auth_logout: "Log out",
    selectCallMethod: "How would you like to call the host?",
    callQuick: "Call immediately",
    callQuickSub: "Call the host without entering your name",
    callBusinessCard: "Scan business card",
    callBusinessCardSub: "Send a photo of your business card to the host",
    callManual: "Enter your name",
    callManualSub: "Enter your company and name",
    businessCardCapture: "Please photograph your business card",
    businessCardInstruction: "Make sure your business card is clearly visible",
    skipBusinessCard: "Call without photographing",
    skipManualInput: "Call without entering details",
    cameraStarting: "Starting camera...",
    selectHost: "Please select your host",
    searchPlaceholder: "Search by name, department, or company",
    noResults: "No staff members found",
    visitorInfo: "Visitor Information",
    companyName: "Company Name",
    yourName: "Your Name",
    phoneOptional: "Phone Number (optional)",
    purposeOptional: "Purpose (optional)",
    privacyConsent: "I agree to the privacy policy",
    privacyNotice:
      "The information entered will be used for reception and visit records.",
    next: "Next",
    back: "Back",
    photoCapture: "Photo Capture",
    photoInstruction:
      "For security purposes, you may take a photo for the visit record (optional)",
    takePhoto: "Take Photo",
    skipPhoto: "Continue without photo",
    retakePhoto: "Retake",
    confirmTitle: "Confirm Details",
    confirmHost: "Host",
    confirmVisitor: "Name",
    confirmCompany: "Company",
    confirmPhone: "Phone",
    confirmPurpose: "Purpose",
    confirmType: "Visit Type",
    callHost: "Notify Host",
    waitingTitle: "Notifying Host",
    waitingPending: "Notifying the host. Please wait a moment.",
    waitingAccepted: "The host is on their way. Please wait.",
    waitingPleaseWait: "The host asked you to please wait a moment.",
    waitingDeclined:
      "The host is unavailable today. Please contact by phone.",
    waitingNoResponse:
      "No response from the host. Please contact by phone or email.",
    waitingFallback:
      "No response from the host. Please contact by phone or email.",
    returnHome: "Return to Home",
    department: "Department",
    role: "Role",
    required: "This field is required",
    cameraError: "Cannot access camera. Please continue without a photo.",
  },
  ko: {
    tagline: "내선 전화 없는 사무실 접수",
    welcome: "방문해 주셔서 감사합니다",
    startReception: "접수 시작",
    selectVisitorType: "방문 목적을 선택해 주세요",
    visitorType_meeting: "미팅",
    visitorType_delivery: "배달·택배",
    visitorType_interview: "면접·면담",
    visitorType_maintenance: "공사·점검",
    visitorType_reception: "안내·접수",
    visitorType_tour: "회사 견학",
    visitorType_other: "기타",
    purpose_meeting: "담당자와의 미팅",
    purpose_delivery: "물품 보관·배달",
    purpose_interview: "채용 면접·각종 면담",
    purpose_maintenance: "협력업체 방문",
    purpose_reception: "종합 안내·접수",
    purpose_tour: "견학 희망자",
    purpose_other: "기타 문의",
    footerPreregister: "사전 등록",
    footerPreregisterSub: "원활한 안내가 가능합니다",
    footerHelp: "도움이 필요하신 분",
    footerHelpSub: "내선 100 또는 접수대로 문의해 주세요",
    smartReception: "SMART RECEPTION",
    nav_admin: "관리",
    nav_staff: "스태프",
    auth_adminTitle: "관리자 비밀번호",
    auth_staffTitle: "스태프 비밀번호",
    auth_passwordLabel: "비밀번호",
    auth_confirm: "확인",
    auth_cancel: "취소",
    auth_invalidPassword: "비밀번호가 올바르지 않습니다",
    auth_logout: "로그아웃",
    selectCallMethod: "호출 방법을 선택해 주세요",
    callQuick: "바로 호출",
    callQuickSub: "이름 입력 없이 담당자를 호출합니다",
    callBusinessCard: "명함 촬영 후 호출",
    callBusinessCardSub: "명함 사진을 담당자에게 전송합니다",
    callManual: "이름 입력 후 호출",
    callManualSub: "회사명·이름을 입력합니다",
    businessCardCapture: "명함을 촬영해 주세요",
    businessCardInstruction: "명함이 선명하게 보이도록 촬영해 주세요",
    skipBusinessCard: "촬영 없이 호출",
    skipManualInput: "입력 없이 호출",
    cameraStarting: "카메라 시작 중...",
    selectHost: "담당자를 선택해 주세요",
    searchPlaceholder: "이름·부서·회사명으로 검색",
    noResults: "해당 담당자를 찾을 수 없습니다",
    visitorInfo: "방문자 정보 입력",
    companyName: "회사명",
    yourName: "성함",
    phoneOptional: "전화번호 (선택)",
    purposeOptional: "용건 (선택)",
    privacyConsent: "개인정보 처리에 동의합니다",
    privacyNotice:
      "입력된 정보는 접수 대응 및 방문 기록을 위해 이용됩니다.",
    next: "다음",
    back: "뒤로",
    photoCapture: "사진 촬영",
    photoInstruction:
      "보안을 위해 방문 기록용 사진을 촬영할 수 있습니다 (선택)",
    takePhoto: "사진 촬영",
    skipPhoto: "사진 없이 진행",
    retakePhoto: "다시 촬영",
    confirmTitle: "내용 확인",
    confirmHost: "담당자",
    confirmVisitor: "성함",
    confirmCompany: "회사명",
    confirmPhone: "전화번호",
    confirmPurpose: "용건",
    confirmType: "방문 유형",
    callHost: "담당자 호출",
    waitingTitle: "담당자 호출 중",
    waitingPending: "담당자를 호출하고 있습니다. 잠시만 기다려 주세요.",
    waitingAccepted: "담당자가 맞이하러 오고 있습니다. 잠시만 기다려 주세요.",
    waitingPleaseWait: "담당자가 잠시만 기다려 달라고 했습니다.",
    waitingDeclined:
      "오늘은 대응이 어렵다고 합니다. 전화로 연락해 주세요.",
    waitingNoResponse:
      "담당자가 응답하지 않습니다. 전화 또는 이메일로 연락해 주세요.",
    waitingFallback:
      "담당자가 응답하지 않습니다. 전화 또는 이메일로 연락해 주세요.",
    returnHome: "처음으로",
    department: "부서",
    role: "직책",
    required: "필수 항목입니다",
    cameraError: "카메라에 접근할 수 없습니다. 사진 없이 진행해 주세요.",
  },
};

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang][key] ?? translations.ja[key];
}

export function visitorTypeLabel(lang: Language, type: VisitorType): string {
  return t(lang, `visitorType_${type}` as TranslationKey);
}

export function purposeSubtitle(
  lang: Language,
  subtitleKey: string
): string {
  return t(lang, subtitleKey as TranslationKey);
}

export function waitingMessage(lang: Language, status: string): string {
  const map: Record<string, TranslationKey> = {
    pending: "waitingPending",
    accepted: "waitingAccepted",
    please_wait: "waitingPleaseWait",
    declined: "waitingDeclined",
    no_response: "waitingNoResponse",
  };
  const key = map[status] ?? "waitingPending";
  return t(lang, key);
}
