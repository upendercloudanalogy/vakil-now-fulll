import { sql } from "drizzle-orm";
import { bigint, boolean, datetime, index, int, longtext, mysqlEnum, mysqlTable, primaryKey, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";


export const admins = mysqlTable("admins", {
  id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
  name: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull(),
  emailVerifiedAt: timestamp("email_verified_at", { mode: 'string' }),
  password: varchar({ length: 255 }).notNull(),
  rememberToken: varchar("remember_token", { length: 100 }),
  createdAt: timestamp("created_at", { mode: 'string' }),
  updatedAt: timestamp("updated_at", { mode: 'string' }),
  phone: varchar({ length: 255 }),
  address: text(),
  city: varchar({ length: 255 }),
  state: varchar({ length: 255 }),
  dist: varchar({ length: 255 }),
  pincode: varchar({ length: 255 }),
  profileImage: varchar("profile_image", { length: 255 }),
  username: varchar({ length: 255 }),
  status: mysqlEnum(['1', '2']).default('2').notNull(),
  country: varchar({ length: 255 }),
  otp: int().notNull(),
  otpVerify: mysqlEnum("otp_verify", ['1', '0']).notNull(),
  panCardNumber: varchar("pan_card_number", { length: 11 }),
  aadharNumber: varchar("aadhar_number", { length: 20 }),
  refferalCode: varchar("refferal_code", { length: 11 }),
  service: varchar({ length: 255 }),
  mpin: int(),
  referralId: int("referral_id").notNull(),
  gender: varchar({ length: 255 }),
  profile: varchar({ length: 255 }),
  showProfilePublic: int("show_profile_public").default(0).notNull(),
  panVerify: mysqlEnum("pan_verify", ['0', '1']).notNull(),
  aadharVerify: mysqlEnum("aadhar_verify", ['0', '1']).notNull(),
  userType: int("user_type"),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "admins_id" }),
  ]);

export const apiDetails = mysqlTable("api_details", {
  id: int().autoincrement().notNull(),
  platformUrl: varchar("platform_url", { length: 255 }).notNull(),
  appId: varchar("app_id", { length: 255 }).notNull(),
  serversecret: varchar({ length: 255 }).notNull(),
  appChannelName: varchar("app_channel_name", { length: 255 }).notNull(),
  status: mysqlEnum(['t', 'f']).default('t').notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "api_details_id" }),
  ]);

export const blogmanager = mysqlTable("blogmanager", {
  id: int().autoincrement().notNull(),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }),
  description: text().notNull(),
  image: varchar({ length: 255 }).notNull(),
  status: mysqlEnum(['t', 'f']).default('f').notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "blogmanager_id" }),
  ]);

export const callchatLogsLaywerCustomer = mysqlTable("callchat_logs_laywer_customer", {
  id: int().autoincrement().notNull(),
  customerId: int("customer_id").notNull(),
  lawyerId: int("lawyer_id").notNull(),
  totalCallDuration: varchar("total_call_duration", { length: 255 }).notNull(),
  startTime: varchar("start_time", { length: 255 }).notNull(),
  endTime: varchar("end_time", { length: 255 }).notNull(),
  totalCharges: varchar("total_charges", { length: 255 }).notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  chatStartFromUserId: int("chat_start_from_user_id").notNull(),
  userType: int("user_type").notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
  status: mysqlEnum(['t', 'f']).default('t').notNull(),
  liveStatus: int("live_status").default(0),
  randomcallid: int().notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "callchat_logs_laywer_customer_id" }),
  ]);

export const chatHistoryLaywerCustomer = mysqlTable("chat_history_laywer_customer", {
  id: int().autoincrement().notNull(),
  customerId: int("customer_id").notNull(),
  lawyerId: int("lawyer_id").notNull(),
  communicationStartDatetime: text("communication_start_datetime").notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
  status: mysqlEnum(['t', 'f']).default('t').notNull(),
  liveStatus: int("live_status").default(0),
  chatEndTime: varchar("chat_end_time", { length: 255 }).default('0'),
  totalChatTime: varchar("total_chat_time", { length: 255 }).default('0').notNull(),
  totalLowyerEarn: varchar("total_lowyer_earn", { length: 255 }).default('0'),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "chat_history_laywer_customer_id" }),
  ]);

export const cities = mysqlTable("cities", {
  id: int().autoincrement().notNull(),
  name: varchar({ length: 30 }).notNull(),
  stateId: int("state_id").notNull(),
  viewCount: int("view_count"),
  createdAt: datetime("created_at", { mode: 'string' }),
  updatedAt: datetime("updated_at", { mode: 'string' }),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "cities_id" }),
  ]);

export const countries = mysqlTable("countries", {
  id: int().autoincrement().notNull(),
  sortname: varchar({ length: 3 }).notNull(),
  name: varchar({ length: 150 }).notNull(),
  phonecode: int().notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "countries_id" }),
  ]);

export const documentsApplyManagement = mysqlTable("documents_apply_management", {
  id: int().autoincrement().notNull(),
  userId: int("user_id").notNull(),
  usertype: int().notNull(),
  documentsName: varchar("documents_name", { length: 255 }).notNull(),
  documentsCharge: varchar("documents_charge", { length: 255 }).notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
  status: mysqlEnum(['pending', 'reject', 'process', 'complete']).default('pending').notNull(),
  uploadDocument: varchar("upload_document", { length: 255 }),
  requestUserPhone: varchar("request_user_phone", { length: 255 }),
  requestUsername: varchar("request_username", { length: 255 }),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "documents_apply_management_id" }),
  ]);

export const documentsCharges = mysqlTable("documents_charges", {
  id: int().autoincrement().notNull(),
  amount: int().notNull(),
  status: mysqlEnum(['t', 'f']).default('t').notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "documents_charges_id" }),
  ]);

export const expertservices = mysqlTable("expertservices", {
  id: int().autoincrement().notNull(),
  title: varchar({ length: 255 }).notNull(),
  priceStartFrom: varchar("price_start_from", { length: 255 }).notNull(),
  slug: varchar({ length: 255 }),
  description: text().notNull(),
  image: varchar({ length: 255 }).notNull(),
  status: mysqlEnum(['t', 'f']).default('f').notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "expertservices_id" }),
  ]);

export const hiremeLawyerManager = mysqlTable("hireme_lawyer_manager", {
  id: int().autoincrement().notNull(),
  userId: int("user_id").notNull(),
  usertype: int().notNull(),
  lawyerId: int("lawyer_id").notNull(),
  status: mysqlEnum(['t', 'f']).default('t').notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "hireme_lawyer_manager_id" }),
  ]);

export const languageManager = mysqlTable("language_manager", {
  id: int().autoincrement().notNull(),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull(),
  status: mysqlEnum(['t', 'f']).default('f').notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "language_manager_id" }),
  ]);

export const lawyerCustomerDocuments = mysqlTable("lawyer_customer_documents", {
  id: int().autoincrement().notNull(),
  lawyerId: int("lawyer_id").notNull(),
  customerId: int("customer_id").notNull(),
  documents: varchar({ length: 255 }),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
  usertype: int().default(1).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "lawyer_customer_documents_id" }),
  ]);

export const lawyerSettelAmountHistory = mysqlTable("lawyer_settel_amount_history", {
  id: int().autoincrement().notNull(),
  lawyerId: int("lawyer_id").notNull(),
  setteledAmount: varchar("setteled_amount", { length: 255 }).notNull(),
  transactionNumber: varchar("transaction_number", { length: 255 }).notNull(),
  status: mysqlEnum(['0', '1']).notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "lawyer_settel_amount_history_id" }),
  ]);

export const lawyerWalletManager = mysqlTable("lawyer_wallet_manager", {
  id: int().autoincrement().notNull(),
  lawyerId: int("lawyer_id").notNull(),
  totalWalletAmount: varchar("total_wallet_amount", { length: 255 }).notNull(),
  totalDeductAmount: varchar("total_deduct_amount", { length: 255 }).notNull(),
  totalAmount: int("total_amount").default(0),
  totalAdminDeduction: int("total_admin_deduction").default(0),
  walletStatus: int("wallet_status").default(0).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "lawyer_wallet_manager_id" }),
  ]);

export const lawyerWalletTransacrion = mysqlTable("lawyer_wallet_transacrion", {
  id: int().autoincrement().notNull(),
  lawyerId: int("lawyer_id").notNull(),
  customerId: int("customer_id").notNull(),
  amountCredit: varchar("amount_credit", { length: 255 }),
  amountDebit: varchar("amount_debit", { length: 255 }),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "lawyer_wallet_transacrion_id" }),
  ]);

export const lowCategory = mysqlTable("low_category", {
  id: int().autoincrement().notNull(),
  lowCategoryName: varchar("low_category_name", { length: 255 }).notNull(),
  lowCategorySulg: varchar("low_category_sulg", { length: 255 }),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
  status: mysqlEnum(['t', 'f']).default('t').notNull(),
  description: varchar({ length: 255 }),
  image: varchar({ length: 255 }),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "low_category_id" }),
  ]);

export const sponsorManager = mysqlTable("sponsor_manager", {
  id: int().autoincrement().notNull(),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }),
  url: varchar({ length: 255 }).notNull(),
  image: varchar({ length: 255 }).notNull(),
  status: mysqlEnum(['t', 'f']).default('f').notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "sponsor_manager_id" }),
  ]);

export const states = mysqlTable("states", {
  id: int().autoincrement().notNull(),
  name: varchar({ length: 30 }).notNull(),
  countryId: int("country_id").default(1).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "states_id" }),
  ]);

export const testimonialManager = mysqlTable("testimonial_manager", {
  id: int().autoincrement().notNull(),
  title: varchar({ length: 255 }).notNull(),
  profile: varchar({ length: 255 }),
  slug: varchar({ length: 255 }),
  description: text().notNull(),
  image: varchar({ length: 255 }).notNull(),
  status: mysqlEnum(['t', 'f']).default('f').notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "testimonial_manager_id" }),
  ]);

export const userAccountManagement = mysqlTable("user_account_management", {
  id: int().autoincrement().notNull(),
  userId: int("user_id").notNull(),
  accountName: varchar("account_name", { length: 255 }).notNull(),
  bankName: varchar("bank_name", { length: 255 }).notNull(),
  accountNumber: varchar("account_number", { length: 255 }).notNull(),
  accountIfsc: varchar("account_ifsc", { length: 100 }).notNull(),
  accountBranch: text("account_branch").notNull(),
  status: mysqlEnum(['t', 'f']).default('t').notNull(),
  createdAt: varchar("created_at", { length: 255 }),
  updatedAt: varchar("updated_at", { length: 255 }),
  setprimary: mysqlEnum(['0', '1']).notNull(),
  address: text().notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "user_account_management_id" }),
  ]);

export const userAuthentication = mysqlTable("user_authentication", {
  id: int().autoincrement().notNull(),
  userId: int("user_id").notNull(),
  phonenumber: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
  usertype: mysqlEnum(['1', '2']).default('1').notNull(),
  status: int().default(0).notNull(),
  otp: varchar({ length: 255 }).notNull(),
  otpVerify: int("otp_verify").default(0).notNull(),
  liveStatus: mysqlEnum("live_status", ['1', '0']).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "user_authentication_id" }),
  ]);

export const userCustomLowCategory = mysqlTable("user_custom_low_category", {
  id: int().autoincrement().notNull(),
  lowCategoryName: varchar("low_category_name", { length: 255 }).notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
  status: mysqlEnum(['t', 'f']).default('t').notNull(),
  userId: int("user_id").notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "user_custom_low_category_id" }),
  ]);

export const userCustomerManager = mysqlTable("user_customer_manager", {
  id: int().autoincrement().notNull(),
  userId: int("user_id").notNull(),
  userUsertype: int("user_usertype").notNull(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  useremail: varchar({ length: 255 }).notNull(),
  userPhone: varchar("user_phone", { length: 255 }).notNull(),
  userCityId: int("user_city_id").notNull(),
  userStateId: int("user_state_id").notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
  status: mysqlEnum(['t', 'f']).default('t').notNull(),
  profilePhoto: varchar("profile_photo", { length: 255 }),
  gender: varchar({ length: 255 }),
  address: text(),
  pincode: int(),
  otherDetails: text("other_details"),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "user_customer_manager_id" }),
  ]);

export const userRegistration = mysqlTable("user_registration", {
  id: int().autoincrement().notNull(),
  legalProblem: text("legal_problem"),
  lawSchoolSubject: text("law_school_subject"),
  totalCases: varchar("total_cases", { length: 255 }),
  gameOfLife: text("game_of_life"),
  shareUltimateLegalHigklight: text("share_ultimate_legal_higklight"),
  yourWishlistOfWonder: text("your_wishlist_of_wonder"),
  phoneNumber: varchar("phone_number", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  emailAddress: varchar("email_address", { length: 255 }).notNull(),
  state: int().notNull(),
  city: int().notNull(),
  language: varchar({ length: 255 }),
  courtDetails: varchar("court_details", { length: 255 }).notNull(),
  experience: varchar({ length: 255 }).notNull(),
  lowCategory: varchar("low_category", { length: 255 }).notNull(),
  otherLawField: varchar("other_law_field", { length: 255 }),
  cartificateEnrollNo: varchar("cartificate_enroll_no", { length: 255 }).notNull(),
  cartificateUpload: varchar("cartificate_upload", { length: 255 }).notNull(),
  gender: varchar({ length: 255 }).notNull(),
  comfortability: varchar({ length: 255 }).notNull(),
  handlingProBonoCases: varchar("handling_pro_bono_cases", { length: 255 }).notNull(),
  workingHoursFrom: varchar("working_hours_from", { length: 255 }).notNull(),
  workingHoursTo: varchar("working_hours_to", { length: 255 }).notNull(),
  workingDays: varchar("working_days", { length: 255 }).notNull(),
  callChargesPerMinite: int("call_charges_per_minite").notNull(),
  chatChargesMinite: varchar("chat_charges_minite", { length: 255 }).notNull(),
  documentsCharges: varchar("documents_charges", { length: 255 }).notNull(),
  status: mysqlEnum(['t', 'f', 'h', 'p', 'd', '0']).default('p').notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
  profileId: int("profile_id").notNull(),
  profilePhoto: varchar("profile_photo", { length: 255 }),
  barCouncilId: varchar("bar_council_id", { length: 255 }),
  documentsupload1: varchar({ length: 255 }),
  documentsupload2: varchar({ length: 255 }),
  otherDetails: text("other_details"),
  slug: varchar({ length: 255 }),
  password: varchar({ length: 255 }).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "user_registration_id" }),
  ]);

export const userWallet = mysqlTable("user_wallet", {
  id: int().autoincrement().notNull(),
  userId: int("user_id").notNull(),
  totalAmount: varchar("total_amount", { length: 255 }).notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
  status: mysqlEnum(['t', 'f']).default('t').notNull(),
  userType: int("user_type").default(1).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "user_wallet_id" }),
  ]);

export const userWalletTransaction = mysqlTable("user_wallet_transaction", {
  id: int().autoincrement().notNull(),
  userId: int("user_id").notNull(),
  creditAmount: int("credit_amount").notNull(),
  debitAmount: int("debit_amount").notNull(),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
  description: text().notNull(),
  transactionMode: varchar("transaction_mode", { length: 255 }),
  status: mysqlEnum(['t', 'f']).default('t').notNull(),
  chatDuration: varchar("chat_duration", { length: 255 }),
  userType: int("user_type").default(1).notNull(),
  chatlawyerid: int().default(0),
  randomcallid: varchar({ length: 255 }),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "user_wallet_transaction_id" }),
  ]);

export const users = mysqlTable("users", {
  id: varchar('id', { length: 36 })
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey()
    .unique()
    .notNull(),
  name: text('name'),
  email: varchar('email', { length: 255 }).unique(),
  phone: varchar('phone', { length: 20 }).unique(),
  emailVerified: boolean('email_verified').default(false),
  emailVerifiedAt: timestamp("email_verified_at", { mode: 'string' }),
  password: varchar('password', { length: 255 }),
  refreshToken: text('refresh_token').notNull().default(''),
  rememberToken: varchar("remember_token", { length: 100 }),
  signupSource: varchar('signup_source', { length: 50 }).default('WEB'),
  referralCode: varchar('referral_code', { length: 50 }),
  utmSource: varchar('utm_source', { length: 50 }),
  utmCampaign: varchar('utm_campaign', { length: 50 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  type: mysqlEnum('type', ['ADMIN', 'USER', 'LAWYER']).notNull().default('USER'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  verificationToken: varchar('verification_token', { length: 255 }),
  verificationExpiresAt: timestamp('verification_expires_at'),
  kycStatus: varchar('kyc_status', { length: 20 }).default('PENDING'),
  lastLogin: timestamp('last_login'),
  deviceInfo: text('device_info'),
  address: text(),
  city: varchar({ length: 255 }),
  state: varchar({ length: 255 }),
  dist: varchar({ length: 255 }),
  pincode: varchar({ length: 255 }),
  profileImage: varchar("profile_image", { length: 255 }),
  username: varchar({ length: 255 }),
  status: mysqlEnum(['0', '1', '2']).default('2'),
  country: varchar({ length: 255 }),
  otp: int(),
  otpVerify: mysqlEnum("otp_verify", ['0', '1']),
  panCardNumber: varchar("pan_card_number", { length: 11 }),
  aadharNumber: varchar("aadhar_number", { length: 20 }),
  refferalCode: varchar("refferal_code", { length: 11 }),
  service: varchar({ length: 255 }),
  mpin: int(),
  referralId: int("referral_id"),
  gender: varchar({ length: 255 }),
  profile: varchar({ length: 255 }),
  showProfilePublic: int("show_profile_public").default(0).notNull(),
  panVerify: mysqlEnum("pan_verify", ['0', '1']),
  aadharVerify: mysqlEnum("aadhar_verify", ['0', '1']),
  userType: int("user_type"),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "users_id" }),
  ]);

export const vakilWorkingDays = mysqlTable("vakil_working_days", {
  id: int().autoincrement().notNull(),
  dayName: varchar("day_name", { length: 255 }).notNull(),
  fromHh: varchar("from_hh", { length: 255 }),
  fromMm: varchar("from_mm", { length: 255 }),
  toHh: varchar("to_hh", { length: 255 }),
  toMm: varchar("to_mm", { length: 255 }),
  createdAt: varchar("created_at", { length: 255 }).notNull(),
  updatedAt: varchar("updated_at", { length: 255 }).notNull(),
  userId: int("user_id").notNull(),
  phonenumber: varchar({ length: 255 }).notNull(),
},
  (table) => [
    primaryKey({ columns: [table.id], name: "vakil_working_days_id" }),
  ]);

export const otpsLocks = mysqlTable(
  'otps_locks',
  {
    id: varchar('id', { length: 36 })
      .$defaultFn(() => crypto.randomUUID())
      .primaryKey()
      .unique()
      .notNull(),
    phone: varchar('phone', { length: 20 }).notNull().unique(),
    retryCount: int('retry_count').notNull().default(0),
    lastRequestAt: timestamp('last_request_at').notNull().defaultNow(),
    lockedUntil: timestamp('locked_until'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [uniqueIndex('idx_otps_locks_phone').on(table.phone)],
);


export const otps = mysqlTable(
  'otps',
  {
    id: varchar('id', { length: 36 })
      .$defaultFn(() => crypto.randomUUID())
      .primaryKey()
      .unique()
      .notNull(),
    phone: varchar('phone', { length: 20 }).notNull().unique(),
    otp: text('otp').notNull(),
    isUsed: boolean('is_used').default(false),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => [uniqueIndex('idx_otps_phone').on(table.phone)],
);




export const llpRegistration = mysqlTable("llp_registration", {

  id: varchar('id', { length: 36 })

    .$defaultFn(() => crypto.randomUUID())

    .primaryKey()

    .unique()

    .notNull(),

  userId: varchar("user_id", { length: 36 })
    .notNull()
    .unique() // ✅ Strict 1:1 relation
    .references(() => users.id),

  // ---- Step 1: Name finalization ----

  companyName: varchar("company_name", { length: 255 }).notNull().unique(),

  fileId: int("fileId").notNull().autoincrement().unique(),

  object: longtext("object").notNull(),
  // isCompleted: boolean("is_completed").default(false).notNull(),



  // ---- Step 3 fields here because step2 repeated ----

  llpEmail: varchar("llp_email", { length: 255 }),

  llpMobile1: varchar("llp_mobile_1", { length: 20 }),

  llpMobile2: varchar("llp_mobile_2", { length: 20 }),

  registeredOfficeAddress: varchar("registered_office", { length: 255 }),

  // stayDurationYears: int("stay_duration_years"),

  residentialProofKey: varchar("residential_proof_url", { length: 500 }),

  nocKey: varchar("noc_url", { length: 500 }),



  // ---- Main status ----



  status: varchar("status", { length: 50 }).default("draft"),



  createdAt: timestamp("created_at").defaultNow(),





  subscriberSheetKey: varchar("subscriber_sheet_url", { length: 500 }),



});



// ---------------------- PARTNERS TABLE ---------------------- 




export const partners = mysqlTable("partners", {

  id: varchar('id', { length: 36 })

    .$defaultFn(() => crypto.randomUUID())

    .primaryKey()

    .unique()

    .notNull(),



  // Use UUID to link to LLP registration

  llpId: varchar("llp_id", { length: 36 })

    .notNull()

    .references(() => llpRegistration.id), // foreign key reference



  name: varchar("name", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }),

  mobile: varchar("mobile", { length: 20 }),

  occupation: varchar("occupation", { length: 255 }),

  education: varchar("education", { length: 255 }),

  contributedAmount: int("contributed_amount"),



  placeOfBirth: varchar("place_of_birth", { length: 255 }),

  partnerRatio: varchar("partner_ratio", { length: 50 }),



  dinAvailable: boolean("din_available").default(false),

  dscAvailable: boolean("dsc_available").default(false),
  dinNumber: varchar("din_number", { length: 8 }),



  // Uploads

  profilePicKey: varchar("profile_pic_url", { length: 500 }),

  idProofKey: varchar("id_proof_url", { length: 500 }),

  residentialProofKey: varchar("res_proof_url", { length: 500 }),

  panCardKey: varchar("pan_card_url", { length: 500 }),



  createdAt: timestamp("created_at").defaultNow(),

});



export const esignDocuments = mysqlTable("esign_documents", {

  id: varchar("id", { length: 36 })

    .$defaultFn(() => crypto.randomUUID())

    .primaryKey()

    .notNull(),



  llpId: varchar("llp_id", { length: 36 })

    .notNull()

    .references(() => llpRegistration.id),



  partnerId: varchar("partner_id", { length: 36 })

    .references(() => partners.id),



  documentType: varchar("document_type", { length: 50 }).notNull(),



  fileName: varchar("file_name", { length: 255 }).notNull(), // ✅ NEW



  pdfKey: varchar("pdf_url", { length: 500 }).notNull(),



  signed: boolean("signed").default(false),

  createdAt: timestamp("created_at").defaultNow(),

},
  (t) => ({
    unqPartnerDoc: uniqueIndex("unq_partner_doc").on(t.partnerId, t.documentType), // ✅ Prevent duplicates
  })
);

export const supportAndComplaints = mysqlTable(
  "support_and_complaints",
  {
    id: int("id").autoincrement().primaryKey().notNull(),
    title: text("title").notNull(),
    query: text("query").notNull(),
    attachmentKey: varchar("attachment_key", { length: 512 }),
    status: mysqlEnum(['PENDING', 'IN PROGRESS', 'CLOSED']).default('PENDING').notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  }
);




export const announcements = mysqlTable(

  "announcements",

  {

    id: varchar('id', { length: 36 })



      .$defaultFn(() => crypto.randomUUID())



      .primaryKey()



      .unique()



      .notNull(),

    type: mysqlEnum("type", ["offer", "activity"]).notNull(),

    status: mysqlEnum("status", ["active", "expired"]).default("active"),

    // badgeText: varchar("badge_text", { length: 255 }),

    title: varchar("title", { length: 255 }).notNull(),

    description: text("description").notNull(),

    startDate: datetime("start_date", { mode: "string" }),

    endDate: datetime("end_date", { mode: "string" }),

    createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),

  },

  (t) => ({

    typeIdx: index("type_idx").on(t.type),

  }),

);



export const announcementReads = mysqlTable("announcement_reads", {

  announcementId: varchar("announcement_id", { length: 36 }).notNull().references(() => announcements.id),

  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),

  isRead: boolean("is_read").default(false),

  readAt: datetime("read_at", { mode: "string" }),

},
  (table) => [
    primaryKey({ columns: [table.userId, table.announcementId], name: "announcement_reads_pk" }),
  ]);


// ---------------------- LAWYER ONBOARDING TABLES ----------------------
// 1. Core Profile Table (Step 1)
export const lawyerProfiles = mysqlTable("lawyer_profiles", {
  id: varchar('id', { length: 36 })
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey()
    .notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),

  // --- Step 1: Identity & Verification ---
  fullName: varchar("full_name", { length: 255 }).notNull(),
  mobileNumber: varchar("mobile_number", { length: 15 }).notNull(),
  emailAddress: varchar("email_address", { length: 255 }).notNull(),
  gender: mysqlEnum("gender", ['MALE', 'FEMALE', 'OTHER']).notNull(),
  barRegistrationNumber: varchar("bar_reg_number", { length: 100 }).notNull(),
  barCouncilState: varchar("bar_council_state", { length: 100 }).notNull(),
  collegeName: varchar("college_name", { length: 255 }).notNull(),
  highestQualification: mysqlEnum("highest_qualification", ['LLB', 'LLM', 'Other']).notNull(),

  // File storage keys (Step 1 Uploads)
  profilePhotoKey: varchar("profile_photo_url", { length: 500 }),
  governmentIdKey: varchar("govt_id_url", { length: 500 }),
  barCouncilIdKey: varchar("bar_id_url", { length: 500 }),

  // Global Status
  verificationStatus: mysqlEnum("verification_status", ['', 'PENDING', 'VERIFIED', 'REJECTED']).default('').notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// 2. Professional Details (Step 2)
export const lawyerProfessionalDetails = mysqlTable("lawyer_professional_details", {
  id: varchar('id', { length: 36 })
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey()
    .notNull(),
  lawyerId: varchar("lawyer_id", { length: 36 })
    .notNull()
    .references(() => lawyerProfiles.id, { onDelete: 'cascade', onUpdate: 'cascade' }),

  // --- Step 2: Structure & Capacity ---
  servicesWillingToProvide: mysqlEnum("services_willing", ['Consultation', 'FullLegalService']).notNull(),
  practiceType: mysqlEnum("practice_type", ['Individual', 'LawFirm']).notNull(),
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  pinCode: varchar("pincode", { length: 10 }).notNull(),
  country: varchar("country", { length: 100 }).default('India').notNull(),
  willingToServeOutside: boolean("serve_outside").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// 3. Expertise Mapping (Step 3)
export const lawyerExpertise = mysqlTable("lawyer_expertise", {
  id: varchar('id', { length: 36 })
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  lawyerId: varchar("lawyer_id", { length: 36 })
    .notNull()
    .references(() => lawyerProfiles.id, { onDelete: 'cascade', onUpdate: 'cascade' }),

  servicesByField: longtext("services_by_field").notNull(),
});

// 4. Onboarding Feedback (Step 4)
export const lawyerOnboardingFeedback = mysqlTable("lawyer_onboarding_feedback", {
  id: varchar('id', { length: 36 })
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  lawyerId: varchar("lawyer_id", { length: 36 })
    .notNull()
    .references(() => lawyerProfiles.id, { onDelete: 'cascade', onUpdate: 'cascade' }),

  // q1 to q7 responses
  responses: longtext("responses").notNull(),
});

export const schema = {
  users,
  otps,
  otpsLocks,
  vakilWorkingDays,
  userWalletTransaction,
  userWallet,
  userRegistration,
  userCustomerManager,
  userCustomLowCategory,
  userAuthentication,
  userAccountManagement,
  testimonialManager,
  states,
  sponsorManager,
  lowCategory,
  lawyerWalletManager,
  lawyerWalletTransacrion,
  lawyerSettelAmountHistory,
  lawyerCustomerDocuments,
  languageManager,
  hiremeLawyerManager,
  expertservices,
  documentsCharges,
  documentsApplyManagement,
  countries,
  cities,
  chatHistoryLaywerCustomer,
  callchatLogsLaywerCustomer,
  blogmanager,
  apiDetails,
  admins,
  llpRegistration,
  partners, esignDocuments,
  supportAndComplaints,
  announcements,
  announcementReads,
  lawyerProfiles,
  lawyerProfessionalDetails,
  lawyerExpertise,
  lawyerOnboardingFeedback
};


