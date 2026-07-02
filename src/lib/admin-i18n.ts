import type { Language } from "./types";

export type AdminTranslationKey =
  | "adminConsole"
  | "nav_dashboard"
  | "nav_branding"
  | "nav_companies"
  | "nav_staff"
  | "nav_visits"
  | "nav_cards"
  | "nav_notification"
  | "nav_system"
  | "link_kiosk"
  | "link_staffNotify"
  | "link_health"
  | "auth_logout"
  | "loading"
  | "save"
  | "saving"
  | "saveAll"
  | "cancel"
  | "add"
  | "edit"
  | "delete"
  | "search"
  | "searching"
  | "active"
  | "inactive"
  | "show"
  | "required"
  | "selectPlaceholder"
  | "msg_saveSuccess"
  | "msg_saveFailed"
  | "msg_deleteSuccess"
  | "msg_deleteFailed"
  | "msg_companyRequired"
  | "msg_staffRequired"
  | "msg_companyAdded"
  | "msg_companyUpdated"
  | "msg_companyDeleted"
  | "msg_staffAdded"
  | "msg_staffUpdated"
  | "msg_staffDeleted"
  | "msg_staffDeactivated"
  | "msg_staffActivated"
  | "msg_cardsSaved"
  | "msg_brandingSaved"
  | "msg_purgeFailed"
  | "msg_purgeSuccess"
  | "msg_resetFailed"
  | "msg_resetSuccess"
  | "confirm_deleteCompany"
  | "confirm_deleteStaff"
  | "confirm_purgeLogs"
  | "confirm_resetSeed"
  | "dash_todayVisits"
  | "dash_pending"
  | "dash_responded"
  | "dash_staffCount"
  | "dash_kioskStatus"
  | "dash_latestVisits"
  | "dash_noVisits"
  | "dash_online"
  | "dash_offline"
  | "dash_database"
  | "dash_camera"
  | "dash_company"
  | "col_datetime"
  | "col_visitor"
  | "col_host"
  | "col_status"
  | "col_company"
  | "col_staffCount"
  | "col_actions"
  | "col_photo"
  | "col_type"
  | "col_contact"
  | "col_department"
  | "branding_title"
  | "branding_preview"
  | "field_companyDisplayName"
  | "field_brandName"
  | "field_logoUrl"
  | "field_heroImageUrl"
  | "field_heroVideoUrl"
  | "field_heroTitle"
  | "field_heroSubtitle"
  | "field_primaryColor"
  | "field_accentColor"
  | "field_fallbackMessage"
  | "field_privacyNotice"
  | "field_retentionDays"
  | "field_companyName"
  | "field_welcomeMessage"
  | "field_name"
  | "field_department"
  | "field_role"
  | "field_email"
  | "field_phone"
  | "field_notificationMethod"
  | "field_title"
  | "field_subtitle"
  | "field_icon"
  | "notify_dashboard"
  | "notify_email"
  | "companies_list"
  | "companies_add"
  | "companies_edit"
  | "staff_list"
  | "staff_add"
  | "staff_edit"
  | "staff_deactivate"
  | "staff_activate"
  | "visits_filter"
  | "visits_list"
  | "visits_exportCsv"
  | "visits_purgeOld"
  | "visits_searchVisitor"
  | "visits_searchHost"
  | "visits_statusAll"
  | "visits_typeAll"
  | "visits_dateFrom"
  | "visits_dateTo"
  | "visits_noResults"
  | "visits_searchHint"
  | "cards_title"
  | "cards_desc"
  | "system_appInfo"
  | "system_version"
  | "system_environment"
  | "system_quickLinks"
  | "system_openKiosk"
  | "system_openStaff"
  | "system_openHealth"
  | "system_devTools"
  | "system_devToolsDesc"
  | "system_resetSeed"
  | "system_resetting"
  | "status_pending"
  | "status_accepted"
  | "status_please_wait"
  | "status_declined"
  | "status_no_response"
  | "status_completed"
  | "type_meeting"
  | "type_delivery"
  | "type_interview"
  | "type_maintenance"
  | "type_reception"
  | "type_tour"
  | "type_other"
  | "preview_selectPurpose"
  | "preview_preregister"
  | "preview_video"
  | "visits_statusFilter"
  | "visits_typeFilter"
  | "col_inputMethod"
  | "inputMethod_quick"
  | "inputMethod_manual"
  | "inputMethod_business_card"
  | "col_notification"
  | "notification_sent"
  | "notification_failed"
  | "notification_no_email"
  | "notify_settingsTitle"
  | "notify_testTitle"
  | "notify_testRecipient"
  | "notify_testSend"
  | "notify_testSending"
  | "notify_testSuccess"
  | "notify_testFailed"
  | "notify_testFallback"
  | "notify_testEmailRequired"
  | "notify_testDesc"
  | "notify_configuredYes"
  | "notify_configuredNo"
  | "notify_smtpReady"
  | "notify_envHint"
  | "notify_loadFailed"
  | "notify_aboutTitle"
  | "notify_aboutDesc";

const translations: Record<Language, Record<AdminTranslationKey, string>> = {
  ja: {
    adminConsole: "Admin Console v0.3",
    nav_dashboard: "ダッシュボード",
    nav_branding: "キオスクブランディング",
    nav_companies: "会社管理",
    nav_staff: "スタッフ管理",
    nav_visits: "来訪ログ",
    nav_cards: "用件カード設定",
    nav_notification: "メール通知",
    nav_system: "システム設定",
    link_kiosk: "キオスクを開く",
    link_staffNotify: "スタッフ通知",
    link_health: "ヘルスチェック",
    auth_logout: "ログアウト",
    loading: "読み込み中...",
    save: "保存",
    saving: "保存中...",
    saveAll: "一括保存",
    cancel: "キャンセル",
    add: "追加",
    edit: "編集",
    delete: "削除",
    search: "検索",
    searching: "検索中...",
    active: "有効",
    inactive: "無効",
    show: "表示",
    required: "必須",
    selectPlaceholder: "選択してください",
    msg_saveSuccess: "保存しました",
    msg_saveFailed: "保存に失敗しました",
    msg_deleteSuccess: "削除しました",
    msg_deleteFailed: "削除に失敗しました",
    msg_companyRequired: "会社名は必須です",
    msg_staffRequired: "名前と会社は必須です",
    msg_companyAdded: "会社を追加しました",
    msg_companyUpdated: "会社を更新しました",
    msg_companyDeleted: "会社を削除しました",
    msg_staffAdded: "スタッフを追加しました",
    msg_staffUpdated: "スタッフを更新しました",
    msg_staffDeleted: "スタッフを削除しました",
    msg_staffDeactivated: "スタッフを無効化しました",
    msg_staffActivated: "スタッフを有効化しました",
    msg_cardsSaved: "用件カードを保存しました",
    msg_brandingSaved: "ブランディング設定を保存しました",
    msg_purgeFailed: "削除に失敗しました",
    msg_purgeSuccess: "件のログを削除しました",
    msg_resetFailed: "リセットに失敗しました",
    msg_resetSuccess: "シードデータを再投入しました",
    confirm_deleteCompany: "この会社を削除しますか？",
    confirm_deleteStaff: "このスタッフを削除しますか？",
    confirm_purgeLogs: "日より古いログを削除しますか？",
    confirm_resetSeed: "シードデータを再投入します。既存データは上書きされます。よろしいですか？",
    dash_todayVisits: "今日の来訪数",
    dash_pending: "未対応",
    dash_responded: "対応済み",
    dash_staffCount: "登録スタッフ数",
    dash_kioskStatus: "キオスクステータス",
    dash_latestVisits: "最新の来訪（10件）",
    dash_noVisits: "来訪記録はまだありません",
    dash_online: "オンライン",
    dash_offline: "オフライン",
    dash_database: "データベース",
    dash_camera: "カメラ設定",
    dash_company: "表示会社名",
    col_datetime: "日時",
    col_visitor: "来訪者",
    col_host: "担当者",
    col_status: "状態",
    col_company: "会社名",
    col_staffCount: "スタッフ数",
    col_actions: "操作",
    col_photo: "写真",
    col_type: "種別",
    col_contact: "連絡先",
    col_department: "部署 / 役職",
    branding_title: "キオスクブランディング設定",
    branding_preview: "ライブプレビュー",
    field_companyDisplayName: "会社表示名",
    field_brandName: "ブランド名",
    field_logoUrl: "ロゴ URL",
    field_heroImageUrl: "ヒーロー画像 URL",
    field_heroVideoUrl: "ヒーロー動画 URL",
    field_heroTitle: "ヒーロータイトル",
    field_heroSubtitle: "ヒーローサブタイトル",
    field_primaryColor: "プライマリカラー",
    field_accentColor: "アクセントカラー",
    field_fallbackMessage: "フォールバックメッセージ",
    field_privacyNotice: "プライバシー通知文",
    field_retentionDays: "ログ保持日数",
    field_companyName: "会社名",
    field_welcomeMessage: "ウェルカムメッセージ",
    field_name: "名前",
    field_department: "部署",
    field_role: "役職",
    field_email: "メール",
    field_phone: "電話番号",
    field_notificationMethod: "通知方法",
    field_title: "タイトル",
    field_subtitle: "サブタイトル",
    field_icon: "アイコン",
    notify_dashboard: "ダッシュボード",
    notify_email: "メール（将来）",
    companies_list: "会社一覧",
    companies_add: "会社を追加",
    companies_edit: "会社を編集",
    staff_list: "スタッフ一覧",
    staff_add: "スタッフを追加",
    staff_edit: "スタッフを編集",
    staff_deactivate: "無効化",
    staff_activate: "有効化",
    visits_filter: "検索・フィルター",
    visits_list: "来訪ログ",
    visits_exportCsv: "CSVエクスポート",
    visits_purgeOld: "保持期間外ログを削除",
    visits_searchVisitor: "来訪者名・会社",
    visits_searchHost: "担当者・会社",
    visits_statusAll: "すべて",
    visits_typeAll: "すべて",
    visits_dateFrom: "開始日",
    visits_dateTo: "終了日",
    visits_noResults: "来訪ログはありません。検索ボタンを押してください。",
    visits_searchHint: "検索...",
    cards_title: "来訪用件カード設定",
    cards_desc: "キオスクホーム画面に表示される7枚のカードを編集できます。非アクティブにすると非表示になります。",
    system_appInfo: "アプリケーション情報",
    system_version: "バージョン",
    system_environment: "環境",
    system_quickLinks: "クイックリンク",
    system_openKiosk: "キオスクを開く（/）",
    system_openStaff: "スタッフ通知を開く（/staff）",
    system_openHealth: "ヘルスチェックを開く（/health）",
    system_devTools: "開発者ツール",
    system_devToolsDesc: "開発環境のみ利用可能です。シードデータを再投入すると、会社・スタッフ・設定が初期状態に戻ります。",
    system_resetSeed: "シードデータを再投入",
    system_resetting: "リセット中...",
    status_pending: "未対応",
    status_accepted: "対応中",
    status_please_wait: "お待ちください",
    status_declined: "対応不可",
    status_no_response: "無応答",
    status_completed: "完了",
    type_meeting: "打ち合わせ",
    type_delivery: "配達・宅配",
    type_interview: "面接・面談",
    type_maintenance: "工事・点検",
    type_reception: "ご案内・受付",
    type_tour: "会社見学",
    type_other: "その他",
    preview_selectPurpose: "ご用件をお選びください",
    preview_preregister: "事前登録はこちら",
    preview_video: "▶ 動画",
    visits_statusFilter: "ステータス",
    visits_typeFilter: "来訪種別",
    col_inputMethod: "呼び出し方法",
    inputMethod_quick: "すぐに呼び出し",
    inputMethod_manual: "入力あり",
    inputMethod_business_card: "名刺撮影",
    col_notification: "通知",
    notification_sent: "送信済み",
    notification_failed: "送信失敗",
    notification_no_email: "メールなし",
    notify_settingsTitle: "SMTP設定ステータス",
    notify_testTitle: "テストメール送信",
    notify_testRecipient: "送信先メールアドレス",
    notify_testSend: "テストメールを送信",
    notify_testSending: "送信中...",
    notify_testSuccess: "テストメールを送信しました",
    notify_testFailed: "テストメールの送信に失敗しました",
    notify_testFallback: "SMTP未設定のためコンソールにログ出力しました",
    notify_testEmailRequired: "送信先メールアドレスを入力してください",
    notify_testDesc: "件名: 【YOBELL】テストメール / 本文: YOBELLのメール通知設定テストです。",
    notify_configuredYes: "設定済み",
    notify_configuredNo: "未設定",
    notify_smtpReady: "メール送信可能",
    notify_envHint: "SMTP_PASSはセキュリティのため表示されません。環境変数で設定してください。",
    notify_loadFailed: "設定の読み込みに失敗しました",
    notify_aboutTitle: "来訪通知メールについて",
    notify_aboutDesc:
      "来訪者が担当者を呼び出すと、担当スタッフのメールアドレスに通知が送信されます。メール内のリンクから「今行きます」「少々お待ちください」「本日は対応できません」を選択できます。",
  },
  en: {
    adminConsole: "Admin Console v0.3",
    nav_dashboard: "Dashboard",
    nav_branding: "Kiosk Branding",
    nav_companies: "Companies",
    nav_staff: "Staff",
    nav_visits: "Visit Logs",
    nav_cards: "Purpose Cards",
    nav_notification: "Email Notifications",
    nav_system: "System",
    link_kiosk: "Open Kiosk",
    link_staffNotify: "Staff Notifications",
    link_health: "Health Check",
    auth_logout: "Log out",
    loading: "Loading...",
    save: "Save",
    saving: "Saving...",
    saveAll: "Save All",
    cancel: "Cancel",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    search: "Search",
    searching: "Searching...",
    active: "Active",
    inactive: "Inactive",
    show: "Show",
    required: "Required",
    selectPlaceholder: "Please select",
    msg_saveSuccess: "Saved successfully",
    msg_saveFailed: "Failed to save",
    msg_deleteSuccess: "Deleted successfully",
    msg_deleteFailed: "Failed to delete",
    msg_companyRequired: "Company name is required",
    msg_staffRequired: "Name and company are required",
    msg_companyAdded: "Company added",
    msg_companyUpdated: "Company updated",
    msg_companyDeleted: "Company deleted",
    msg_staffAdded: "Staff member added",
    msg_staffUpdated: "Staff member updated",
    msg_staffDeleted: "Staff member deleted",
    msg_staffDeactivated: "Staff member deactivated",
    msg_staffActivated: "Staff member activated",
    msg_cardsSaved: "Purpose cards saved",
    msg_brandingSaved: "Branding settings saved",
    msg_purgeFailed: "Failed to delete logs",
    msg_purgeSuccess: "logs deleted",
    msg_resetFailed: "Reset failed",
    msg_resetSuccess: "Seed data restored",
    confirm_deleteCompany: "Delete this company?",
    confirm_deleteStaff: "Delete this staff member?",
    confirm_purgeLogs: "Delete logs older than",
    confirm_resetSeed: "Reset seed data? Existing data will be overwritten.",
    dash_todayVisits: "Today's Visits",
    dash_pending: "Pending",
    dash_responded: "Responded",
    dash_staffCount: "Registered Staff",
    dash_kioskStatus: "Kiosk Status",
    dash_latestVisits: "Latest Visits (10)",
    dash_noVisits: "No visit records yet",
    dash_online: "Online",
    dash_offline: "Offline",
    dash_database: "Database",
    dash_camera: "Camera",
    dash_company: "Display Company",
    col_datetime: "Date/Time",
    col_visitor: "Visitor",
    col_host: "Host",
    col_status: "Status",
    col_company: "Company",
    col_staffCount: "Staff",
    col_actions: "Actions",
    col_photo: "Photo",
    col_type: "Type",
    col_contact: "Contact",
    col_department: "Dept / Role",
    branding_title: "Kiosk Branding Settings",
    branding_preview: "Live Preview",
    field_companyDisplayName: "Company Display Name",
    field_brandName: "Brand Name",
    field_logoUrl: "Logo URL",
    field_heroImageUrl: "Hero Image URL",
    field_heroVideoUrl: "Hero Video URL",
    field_heroTitle: "Hero Title",
    field_heroSubtitle: "Hero Subtitle",
    field_primaryColor: "Primary Color",
    field_accentColor: "Accent Color",
    field_fallbackMessage: "Fallback Message",
    field_privacyNotice: "Privacy Notice",
    field_retentionDays: "Log Retention (days)",
    field_companyName: "Company Name",
    field_welcomeMessage: "Welcome Message",
    field_name: "Name",
    field_department: "Department",
    field_role: "Role",
    field_email: "Email",
    field_phone: "Phone",
    field_notificationMethod: "Notification Method",
    field_title: "Title",
    field_subtitle: "Subtitle",
    field_icon: "Icon",
    notify_dashboard: "Dashboard",
    notify_email: "Email (future)",
    companies_list: "Companies",
    companies_add: "Add Company",
    companies_edit: "Edit Company",
    staff_list: "Staff",
    staff_add: "Add Staff",
    staff_edit: "Edit Staff",
    staff_deactivate: "Deactivate",
    staff_activate: "Activate",
    visits_filter: "Search & Filter",
    visits_list: "Visit Logs",
    visits_exportCsv: "Export CSV",
    visits_purgeOld: "Delete Old Logs",
    visits_searchVisitor: "Visitor / Company",
    visits_searchHost: "Host / Company",
    visits_statusAll: "All",
    visits_typeAll: "All",
    visits_dateFrom: "From",
    visits_dateTo: "To",
    visits_noResults: "No visit logs. Click Search to load.",
    visits_searchHint: "Search...",
    cards_title: "Purpose Card Settings",
    cards_desc: "Edit the 7 cards shown on the kiosk home screen. Inactive cards are hidden.",
    system_appInfo: "Application Info",
    system_version: "Version",
    system_environment: "Environment",
    system_quickLinks: "Quick Links",
    system_openKiosk: "Open Kiosk (/)",
    system_openStaff: "Open Staff Panel (/staff)",
    system_openHealth: "Open Health Check (/health)",
    system_devTools: "Developer Tools",
    system_devToolsDesc: "Development only. Resets companies, staff, and settings to seed data.",
    system_resetSeed: "Reset Seed Data",
    system_resetting: "Resetting...",
    status_pending: "Pending",
    status_accepted: "In Progress",
    status_please_wait: "Please Wait",
    status_declined: "Declined",
    status_no_response: "No Response",
    status_completed: "Completed",
    type_meeting: "Meeting",
    type_delivery: "Delivery",
    type_interview: "Interview",
    type_maintenance: "Maintenance",
    type_reception: "Reception",
    type_tour: "Company Tour",
    type_other: "Other",
    preview_selectPurpose: "Please select your visit purpose",
    preview_preregister: "Pre-register here",
    preview_video: "▶ Video",
    visits_statusFilter: "Status",
    visits_typeFilter: "Visit Type",
    col_inputMethod: "Call Method",
    inputMethod_quick: "Quick call",
    inputMethod_manual: "Manual entry",
    inputMethod_business_card: "Business card",
    col_notification: "Notification",
    notification_sent: "Sent",
    notification_failed: "Failed",
    notification_no_email: "No email",
    notify_settingsTitle: "SMTP Configuration Status",
    notify_testTitle: "Send Test Email",
    notify_testRecipient: "Recipient email",
    notify_testSend: "Send test email",
    notify_testSending: "Sending...",
    notify_testSuccess: "Test email sent successfully",
    notify_testFailed: "Failed to send test email",
    notify_testFallback: "SMTP not configured — logged to console",
    notify_testEmailRequired: "Please enter a recipient email",
    notify_testDesc: "Subject: 【YOBELL】テストメール / Body: YOBELLのメール通知設定テストです。",
    notify_configuredYes: "Configured",
    notify_configuredNo: "Not set",
    notify_smtpReady: "Email ready",
    notify_envHint: "SMTP_PASS is hidden for security. Set it via environment variables.",
    notify_loadFailed: "Failed to load settings",
    notify_aboutTitle: "About visit notifications",
    notify_aboutDesc:
      "When a visitor calls a host, an email is sent to the staff member's address. They can respond via links: Accept, Please wait, or Declined.",
  },
  ko: {
    adminConsole: "Admin Console v0.3",
    nav_dashboard: "대시보드",
    nav_branding: "키오스크 브랜딩",
    nav_companies: "회사 관리",
    nav_staff: "스태프 관리",
    nav_visits: "방문 로그",
    nav_cards: "용건 카드 설정",
    nav_notification: "이메일 알림",
    nav_system: "시스템 설정",
    link_kiosk: "키오스크 열기",
    link_staffNotify: "스태프 알림",
    link_health: "헬스 체크",
    auth_logout: "로그아웃",
    loading: "불러오는 중...",
    save: "저장",
    saving: "저장 중...",
    saveAll: "일괄 저장",
    cancel: "취소",
    add: "추가",
    edit: "편집",
    delete: "삭제",
    search: "검색",
    searching: "검색 중...",
    active: "활성",
    inactive: "비활성",
    show: "표시",
    required: "필수",
    selectPlaceholder: "선택하세요",
    msg_saveSuccess: "저장되었습니다",
    msg_saveFailed: "저장에 실패했습니다",
    msg_deleteSuccess: "삭제되었습니다",
    msg_deleteFailed: "삭제에 실패했습니다",
    msg_companyRequired: "회사명은 필수입니다",
    msg_staffRequired: "이름과 회사는 필수입니다",
    msg_companyAdded: "회사가 추가되었습니다",
    msg_companyUpdated: "회사가 수정되었습니다",
    msg_companyDeleted: "회사가 삭제되었습니다",
    msg_staffAdded: "스태프가 추가되었습니다",
    msg_staffUpdated: "스태프가 수정되었습니다",
    msg_staffDeleted: "스태프가 삭제되었습니다",
    msg_staffDeactivated: "스태프가 비활성화되었습니다",
    msg_staffActivated: "스태프가 활성화되었습니다",
    msg_cardsSaved: "용건 카드가 저장되었습니다",
    msg_brandingSaved: "브랜딩 설정이 저장되었습니다",
    msg_purgeFailed: "삭제에 실패했습니다",
    msg_purgeSuccess: "건의 로그가 삭제되었습니다",
    msg_resetFailed: "리셋에 실패했습니다",
    msg_resetSuccess: "시드 데이터가 재설정되었습니다",
    confirm_deleteCompany: "이 회사를 삭제하시겠습니까?",
    confirm_deleteStaff: "이 스태프를 삭제하시겠습니까?",
    confirm_purgeLogs: "일 이전 로그를 삭제하시겠습니까?",
    confirm_resetSeed: "시드 데이터를 재설정합니다. 기존 데이터가 덮어씌워집니다. 계속하시겠습니까?",
    dash_todayVisits: "오늘 방문",
    dash_pending: "미대응",
    dash_responded: "대응 완료",
    dash_staffCount: "등록 스태프",
    dash_kioskStatus: "키오스크 상태",
    dash_latestVisits: "최근 방문 (10건)",
    dash_noVisits: "방문 기록이 없습니다",
    dash_online: "온라인",
    dash_offline: "오프라인",
    dash_database: "데이터베이스",
    dash_camera: "카메라 설정",
    dash_company: "표시 회사명",
    col_datetime: "일시",
    col_visitor: "방문자",
    col_host: "담당자",
    col_status: "상태",
    col_company: "회사명",
    col_staffCount: "스태프 수",
    col_actions: "작업",
    col_photo: "사진",
    col_type: "유형",
    col_contact: "연락처",
    col_department: "부서 / 직책",
    branding_title: "키오스크 브랜딩 설정",
    branding_preview: "라이브 미리보기",
    field_companyDisplayName: "회사 표시명",
    field_brandName: "브랜드명",
    field_logoUrl: "로고 URL",
    field_heroImageUrl: "히어로 이미지 URL",
    field_heroVideoUrl: "히어로 영상 URL",
    field_heroTitle: "히어로 제목",
    field_heroSubtitle: "히어로 부제목",
    field_primaryColor: "기본 색상",
    field_accentColor: "강조 색상",
    field_fallbackMessage: "폴백 메시지",
    field_privacyNotice: "개인정보 안내",
    field_retentionDays: "로그 보관 일수",
    field_companyName: "회사명",
    field_welcomeMessage: "환영 메시지",
    field_name: "이름",
    field_department: "부서",
    field_role: "직책",
    field_email: "이메일",
    field_phone: "전화번호",
    field_notificationMethod: "알림 방법",
    field_title: "제목",
    field_subtitle: "부제목",
    field_icon: "아이콘",
    notify_dashboard: "대시보드",
    notify_email: "이메일 (예정)",
    companies_list: "회사 목록",
    companies_add: "회사 추가",
    companies_edit: "회사 편집",
    staff_list: "스태프 목록",
    staff_add: "스태프 추가",
    staff_edit: "스태프 편집",
    staff_deactivate: "비활성화",
    staff_activate: "활성화",
    visits_filter: "검색 · 필터",
    visits_list: "방문 로그",
    visits_exportCsv: "CSV보내기",
    visits_purgeOld: "보관 기간 외 로그 삭제",
    visits_searchVisitor: "방문자 · 회사",
    visits_searchHost: "담당자 · 회사",
    visits_statusAll: "전체",
    visits_typeAll: "전체",
    visits_dateFrom: "시작일",
    visits_dateTo: "종료일",
    visits_noResults: "방문 로그가 없습니다. 검색 버튼을 눌러주세요.",
    visits_searchHint: "검색...",
    cards_title: "방문 용건 카드 설정",
    cards_desc: "키오스크 홈 화면에 표시되는 7개 카드를 편집할 수 있습니다. 비활성화하면 숨겨집니다.",
    system_appInfo: "애플리케이션 정보",
    system_version: "버전",
    system_environment: "환경",
    system_quickLinks: "빠른 링크",
    system_openKiosk: "키오스크 열기 (/)",
    system_openStaff: "스태프 알림 열기 (/staff)",
    system_openHealth: "헬스 체크 열기 (/health)",
    system_devTools: "개발자 도구",
    system_devToolsDesc: "개발 환경에서만 사용 가능합니다. 시드 데이터를 재설정하면 회사·스태프·설정이 초기화됩니다.",
    system_resetSeed: "시드 데이터 재설정",
    system_resetting: "리셋 중...",
    status_pending: "미대응",
    status_accepted: "대응 중",
    status_please_wait: "잠시 대기",
    status_declined: "대응 불가",
    status_no_response: "무응답",
    status_completed: "완료",
    type_meeting: "미팅",
    type_delivery: "배달·택배",
    type_interview: "면접·면담",
    type_maintenance: "공사·점검",
    type_reception: "안내·접수",
    type_tour: "회사 견학",
    type_other: "기타",
    preview_selectPurpose: "방문 목적을 선택해 주세요",
    preview_preregister: "사전 등록",
    preview_video: "▶ 영상",
    visits_statusFilter: "상태",
    visits_typeFilter: "방문 유형",
    col_inputMethod: "호출 방법",
    inputMethod_quick: "바로 호출",
    inputMethod_manual: "직접 입력",
    inputMethod_business_card: "명함 촬영",
    col_notification: "알림",
    notification_sent: "전송됨",
    notification_failed: "전송 실패",
    notification_no_email: "이메일 없음",
    notify_settingsTitle: "SMTP 설정 상태",
    notify_testTitle: "테스트 메일 보내기",
    notify_testRecipient: "수신 이메일",
    notify_testSend: "테스트 메일 보내기",
    notify_testSending: "전송 중...",
    notify_testSuccess: "테스트 메일을 보냈습니다",
    notify_testFailed: "테스트 메일 전송에 실패했습니다",
    notify_testFallback: "SMTP 미설정 — 콘솔에 로그 출력됨",
    notify_testEmailRequired: "수신 이메일을 입력하세요",
    notify_testDesc: "제목: 【YOBELL】テストメール / 본문: YOBELLのメール通知設定テストです。",
    notify_configuredYes: "설정됨",
    notify_configuredNo: "미설정",
    notify_smtpReady: "메일 전송 가능",
    notify_envHint: "보안상 SMTP_PASS는 표시되지 않습니다. 환경 변수로 설정하세요.",
    notify_loadFailed: "설정을 불러오지 못했습니다",
    notify_aboutTitle: "방문 알림 메일 안내",
    notify_aboutDesc:
      "방문자가 담당자를 호출하면 담당 스태프 이메일로 알림이 전송됩니다. 메일 링크에서 대응을 선택할 수 있습니다.",
  },
};

export function at(lang: Language, key: AdminTranslationKey): string {
  return translations[lang][key] ?? translations.ja[key];
}

export function getVisitorTypeLabel(lang: Language, type: string): string {
  const map: Record<string, AdminTranslationKey> = {
    meeting: "type_meeting",
    delivery: "type_delivery",
    interview: "type_interview",
    maintenance: "type_maintenance",
    reception: "type_reception",
    tour: "type_tour",
    other: "type_other",
  };
  const k = map[type];
  return k ? at(lang, k) : type;
}

export function getStatusLabel(
  lang: Language,
  status: string
): { label: string; color: "gray" | "green" | "amber" | "red" | "blue" } {
  const map: Record<string, { key: AdminTranslationKey; color: "gray" | "green" | "amber" | "red" | "blue" }> = {
    pending: { key: "status_pending", color: "amber" },
    accepted: { key: "status_accepted", color: "green" },
    please_wait: { key: "status_please_wait", color: "blue" },
    declined: { key: "status_declined", color: "red" },
    no_response: { key: "status_no_response", color: "gray" },
    completed: { key: "status_completed", color: "green" },
  };
  const entry = map[status] ?? { key: "status_pending" as AdminTranslationKey, color: "gray" as const };
  return { label: at(lang, entry.key), color: entry.color };
}

export const ADMIN_NAV_KEYS = [
  "dashboard",
  "branding",
  "companies",
  "staff",
  "visits",
  "cards",
  "notification",
  "system",
] as const;

export function getInputMethodLabel(lang: Language, method: string): string {
  const map: Record<string, AdminTranslationKey> = {
    quick: "inputMethod_quick",
    manual: "inputMethod_manual",
    business_card: "inputMethod_business_card",
  };
  const k = map[method];
  return k ? at(lang, k) : method;
}

export function getLangDisplay(lang: Language): string {
  const labels: Record<Language, string> = { ja: "日本語", en: "English", ko: "한국어" };
  return labels[lang];
}

export function formatPurgeConfirm(lang: Language, days: number): string {
  if (lang === "en") return `Delete logs older than ${days} days?`;
  if (lang === "ko") return `${days}일 이전 로그를 삭제하시겠습니까?`;
  return `${days}日より古いログを削除しますか？`;
}

export function formatPurgeSuccess(lang: Language, count: number): string {
  if (lang === "en") return `${count} ${at(lang, "msg_purgeSuccess")}`;
  return `${count}${at(lang, "msg_purgeSuccess")}`;
}

export const ADMIN_NAV_I18N: Record<(typeof ADMIN_NAV_KEYS)[number], AdminTranslationKey> = {
  dashboard: "nav_dashboard",
  branding: "nav_branding",
  companies: "nav_companies",
  staff: "nav_staff",
  visits: "nav_visits",
  cards: "nav_cards",
  notification: "nav_notification",
  system: "nav_system",
};
