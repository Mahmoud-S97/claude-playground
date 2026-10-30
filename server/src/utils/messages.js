// Every message the API sends, keyed by a stable code. Responses carry both:
// `code` for logs/client logic, `message` already in the user's language.
// Placeholders like {max} are filled by translate().

export const SUPPORTED_LANGUAGES = ["en", "ar"];
export const DEFAULT_LANGUAGE = "en";

const MESSAGES = {
  // Auth
  AUTH_FIELDS_REQUIRED: {
    en: "Username and password are required",
    ar: "اسم المستخدم وكلمة المرور مطلوبان",
  },
  AUTH_USERNAME_INVALID: {
    en: "Username must start with a letter and contain only letters, numbers, or underscores (7–25 characters)",
    ar: "يجب أن يبدأ اسم المستخدم بحرف، ويحتوي فقط على حروف أو أرقام أو شرطة سفلية (_)، بطول من 7 إلى 25 حرفًا",
  },
  AUTH_PASSWORD_INVALID: {
    en: "Password must be 6–25 characters, with no spaces",
    ar: "يجب أن تتكون كلمة المرور من 6 إلى 25 حرفًا، ولا يُسمح بالمسافات",
  },
  AUTH_USERNAME_TAKEN: {
    en: "This username is already taken",
    ar: "اسم المستخدم هذا مُستخدم بالفعل",
  },
  AUTH_INVALID_CREDENTIALS: {
    en: "Invalid username or password",
    ar: "اسم المستخدم أو كلمة المرور غير صحيحة",
  },
  AUTH_NOT_AUTHENTICATED: {
    en: "Please sign in to continue",
    ar: "يرجى تسجيل الدخول للمتابعة",
  },
  AUTH_SIGNED_UP: {
    en: "Account created successfully",
    ar: "تم إنشاء الحساب بنجاح",
  },
  AUTH_LOGGED_IN: {
    en: "Signed in successfully",
    ar: "تم تسجيل الدخول بنجاح",
  },
  AUTH_LOGGED_OUT: {
    en: "Signed out successfully",
    ar: "تم تسجيل الخروج بنجاح",
  },

  // Todo cards
  TODO_TITLE_REQUIRED: {
    en: "Card title is required",
    ar: "عنوان البطاقة مطلوب",
  },
  TODO_NOT_FOUND: {
    en: "Todo card not found",
    ar: "لم يتم العثور على بطاقة المهمة",
  },
  TODO_CREATED: {
    en: "Card created successfully",
    ar: "تم إنشاء البطاقة بنجاح",
  },
  TODO_UPDATED: {
    en: "Card updated successfully",
    ar: "تم تحديث البطاقة بنجاح",
  },
  TODO_DELETED: {
    en: "Card deleted successfully",
    ar: "تم حذف البطاقة بنجاح",
  },
  INVALID_TODO_DATA: {
    en: "Some of the card details are invalid",
    ar: "بعض تفاصيل البطاقة غير صالحة",
  },
  TITLE_TOO_LONG: {
    en: "Titles can be at most {max} characters",
    ar: "يجب ألا يتجاوز العنوان {max} حرفًا",
  },
  INVALID_PRIORITY: {
    en: "Priority must be low, medium, or high",
    ar: "يجب أن تكون الأولوية منخفضة أو متوسطة أو عالية",
  },

  // Subtasks
  SUBTASK_REQUIRED: {
    en: "Fill at least one subtask with a title and a due date",
    ar: "يرجى تعبئة مهمة فرعية واحدة على الأقل بعنوان وتاريخ استحقاق",
  },
  SUBTASK_TITLE_REQUIRED: {
    en: "Subtask title is required",
    ar: "عنوان المهمة الفرعية مطلوب",
  },
  SUBTASK_DUE_DATE_REQUIRED: {
    en: "Subtask due date is required",
    ar: "تاريخ استحقاق المهمة الفرعية مطلوب",
  },
  SUBTASK_DATE_WITHOUT_TITLE: {
    en: "A subtask with a due date needs a title",
    ar: "المهمة الفرعية التي لها تاريخ استحقاق تحتاج إلى عنوان",
  },
  INVALID_DUE_DATE: {
    en: "Subtask due date is not a valid date",
    ar: "تاريخ استحقاق المهمة الفرعية غير صالح",
  },
  SUBTASK_LIMIT_REACHED: {
    en: "A card can have at most {max} subtasks",
    ar: "يمكن أن تحتوي البطاقة على {max} مهام فرعية كحد أقصى",
  },
  SUBTASK_COUNT_INVALID: {
    en: "A card needs between 1 and {max} subtasks",
    ar: "يجب أن تحتوي البطاقة على مهمة فرعية واحدة على الأقل و{max} مهام كحد أقصى",
  },
  SUBTASK_NOT_FOUND: {
    en: "Subtask not found",
    ar: "لم يتم العثور على المهمة الفرعية",
  },
  SUBTASK_ADDED: {
    en: "Subtask added successfully",
    ar: "تمت إضافة المهمة الفرعية بنجاح",
  },
  SUBTASK_UPDATED: {
    en: "Subtask updated successfully",
    ar: "تم تحديث المهمة الفرعية بنجاح",
  },

  // General
  ROUTE_NOT_FOUND: {
    en: "Route not found: {method} {path}",
    ar: "المسار غير موجود: {method} {path}",
  },
  INVALID_JSON: {
    en: "Request body is not valid JSON",
    ar: "محتوى الطلب ليس بتنسيق JSON صالح",
  },
  BODY_TOO_LARGE: {
    en: "Request body is too large",
    ar: "محتوى الطلب كبير جدًا",
  },
  SERVER_ERROR: {
    en: "Something went wrong, please try again",
    ar: "حدث خطأ ما، يرجى المحاولة مرة أخرى",
  },
};

export function translate(code, language, params = {}) {
  const entry = MESSAGES[code] ?? MESSAGES.SERVER_ERROR;
  const text = entry[language] ?? entry[DEFAULT_LANGUAGE];
  return text.replace(/\{(\w+)\}/g, (placeholder, name) => params[name] ?? placeholder);
}

// Picks the first supported language from an Accept-Language header such as
// "ar", "ar-EG", or "ar,en;q=0.9". Anything else falls back to English.
export function resolveLanguage(acceptLanguage = "") {
  for (const part of acceptLanguage.split(",")) {
    const base = part.split(";")[0].trim().toLowerCase().split("-")[0];
    if (SUPPORTED_LANGUAGES.includes(base)) return base;
  }
  return DEFAULT_LANGUAGE;
}
