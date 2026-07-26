// Arabic dictionary — keys are the English source strings.
export const ar: Record<string, string> = {
    // ── Navigation & chrome ──
    Platform: 'المنصة',
    Dashboard: 'لوحة التحكم',
    Approvals: 'الموافقات',
    Meters: 'العدادات',
    'Tariff periods': 'فترات التسعير',
    Users: 'المستخدمون',
    Reports: 'التقارير',
    Simulator: 'المحاكي',
    'New reading': 'قراءة جديدة',
    'My entries': 'قراءاتي',
    History: 'السجل',
    Settings: 'الإعدادات',
    Notifications: 'الإشعارات',
    'Mark all as read': 'وضع علامة مقروء على الكل',
    'Nothing here yet — new activity will show up in this bell.':
        'لا شيء هنا بعد — سيظهر النشاط الجديد في هذا الجرس.',

    // ── Common words ──
    Actions: 'إجراءات',
    Active: 'نشط',
    Inactive: 'غير نشط',
    Amount: 'المبلغ',
    Cancel: 'إلغاء',
    Clear: 'مسح',
    Columns: 'الأعمدة',
    'Show columns': 'إظهار الأعمدة',
    Consumption: 'الاستهلاك',
    Current: 'الحالي',
    Date: 'التاريخ',
    Delete: 'حذف',
    Edit: 'تعديل',
    Electricity: 'الكهرباء',
    electricity: 'كهرباء',
    Email: 'البريد الإلكتروني',
    Location: 'الموقع',
    Meter: 'العداد',
    Name: 'الاسم',
    Next: 'التالي',
    Previous: 'السابق',
    Password: 'كلمة المرور',
    Pending: 'قيد الانتظار',
    Approved: 'معتمد',
    Rejected: 'مرفوض',
    Period: 'الفترة',
    Preview: 'معاينة',
    Reading: 'القراءة',
    Readings: 'القراءات',
    readings: 'قراءات',
    Reason: 'السبب',
    Result: 'النتيجة',
    Role: 'الدور',
    'Serial number': 'الرقم التسلسلي',
    'No serial': 'بدون رقم تسلسلي',
    'No location': 'بدون موقع',
    Status: 'الحالة',
    Summary: 'الملخص',
    Technician: 'الفني',
    Technicians: 'الفنيون',
    'Unit price': 'سعر الوحدة',
    Used: 'المستهلك',
    Utility: 'النوع',
    Water: 'الماء',
    water: 'ماء',
    Joined: 'تاريخ الانضمام',
    Accounts: 'الحسابات',
    '(you)': '(أنت)',
    'View all': 'عرض الكل',
    'Save changes': 'حفظ التغييرات',
    Admin: 'مسؤول',
    Viewer: 'مشاهد',
    Back: 'رجوع',
    'Log in': 'تسجيل الدخول',
    'Get started': 'ابدأ الآن',
    Features: 'المميزات',
    'How it works': 'كيف يعمل',
    Roles: 'الأدوار',

    // ── Pagination / tables ──
    'Showing :from to :to of :total results': 'عرض :from إلى :to من :total نتيجة',
    'No results found': 'لا توجد نتائج',
    'No readings found': 'لا توجد قراءات',
    'Try changing the filters, or check back later.':
        'جرّب تغيير عوامل التصفية أو عد لاحقًا.',

    // ── Filters ──
    'All meters': 'كل العدادات',
    'All periods': 'كل الفترات',
    'All statuses': 'كل الحالات',
    'All utilities': 'كل الأنواع',
    'All time': 'كل الفترة',
    Today: 'اليوم',
    'This week': 'هذا الأسبوع',
    'This month': 'هذا الشهر',
    'This year': 'هذه السنة',
    'Time range': 'النطاق الزمني',
    'From date': 'من تاريخ',
    'To date': 'إلى تاريخ',
    'Search by meter name or serial…': 'ابحث باسم العداد أو الرقم التسلسلي…',
    'Search by name or email…': 'ابحث بالاسم أو البريد…',
    'Search by name, serial or location…': 'ابحث بالاسم أو الرقم أو الموقع…',
    'Search meter, serial or technician…': 'ابحث عن عداد أو رقم أو فني…',
    'Try a different search, or add a new user.':
        'جرّب بحثًا مختلفًا أو أضف مستخدمًا جديدًا.',

    // ── Dashboards ──
    'Admin Dashboard': 'لوحة تحكم المسؤول',
    'Technician Dashboard': 'لوحة تحكم الفني',
    'Facility overview': 'نظرة عامة على المنشأة',
    'Consumption overview': 'نظرة عامة على الاستهلاك',
    'Field readings': 'قراءات ميدانية',
    ':count readings waiting for your approval.': ':count قراءة في انتظار موافقتك.',
    'All readings reviewed — nothing waiting on you.':
        'تمت مراجعة كل القراءات — لا شيء بانتظارك.',
    ':count readings in total': ':count قراءة إجمالًا',
    ':count active meters are waiting on you.': ':count عدادًا نشطًا بانتظارك.',
    'Review queue': 'قائمة المراجعة',
    'Pending approval': 'بانتظار الموافقة',
    'Pending review': 'بانتظار المراجعة',
    'Electricity this month': 'الكهرباء هذا الشهر',
    'Water this month': 'الماء هذا الشهر',
    'Billed this month': 'المفوتر هذا الشهر',
    'Cost this month': 'التكلفة هذا الشهر',
    'Active meters': 'العدادات النشطة',
    'Waiting for approval': 'بانتظار الموافقة',
    'Queue is clear': 'القائمة فارغة',
    'New readings from technicians will appear here for review.':
        'ستظهر القراءات الجديدة من الفنيين هنا للمراجعة.',
    'Electricity — last 30 days (kWh)': 'الكهرباء — آخر 30 يومًا (كيلوواط)',
    'Water — last 30 days (m³)': 'الماء — آخر 30 يومًا (م³)',
    'Recent readings': 'القراءات الأخيرة',
    'Recent approved readings': 'القراءات المعتمدة الأخيرة',
    'Latest entries': 'آخر الإدخالات',
    'View history': 'عرض السجل',
    'Validated readings across the facility, updated as admins approve them.':
        'قراءات معتمدة عبر المنشأة، تُحدَّث مع موافقة المسؤولين.',
    'No readings yet': 'لا قراءات بعد',
    'Record your first meter reading to get started.': 'سجّل أول قراءة للبدء.',
    'Nothing approved yet': 'لا شيء معتمد بعد',
    'Approved readings will show up here as soon as an admin validates them.':
        'ستظهر القراءات المعتمدة هنا فور موافقة المسؤول.',

    // ── Approvals ──
    'Readings & approvals': 'القراءات والموافقات',
    'Review technician readings — approved values become billing history.':
        'راجع قراءات الفنيين — القيم المعتمدة تصبح سجل الفوترة.',
    All: 'الكل',
    Approve: 'موافقة',
    Reject: 'رفض',
    'Reject this reading?': 'رفض هذه القراءة؟',
    ':meter — :value :unit, recorded by :technician. They will see your reason and can correct and resubmit.':
        ':meter — :value :unit، سجّلها :technician. سيرى السبب ويمكنه التصحيح وإعادة الإرسال.',
    'Reason (optional)': 'السبب (اختياري)',
    'e.g. Value does not match the meter photo': 'مثال: القيمة لا تطابق صورة العداد',
    'Reject reading': 'رفض القراءة',
    'a technician': 'فني',
    'View reading': 'عرض القراءة',
    'Reading detail': 'تفاصيل القراءة',
    'Delete this reading?': 'حذف هذه القراءة؟',
    'This cannot be undone.': 'لا يمكن التراجع عن هذا.',
    'Delete reading': 'حذف القراءة',
    'Edit reading': 'تعديل القراءة',
    'Back to history': 'العودة إلى السجل',
    'Reading history': 'سجل القراءات',
    'All approved readings, newest first.': 'كل القراءات المعتمدة، الأحدث أولًا.',
    'Open reports': 'فتح التقارير',
    'Reading date': 'تاريخ القراءة',
    'Recorded by': 'سجّلها',
    'Approved by': 'اعتمدها',
    'Rejected by': 'رفضها',
    'Rejection reason': 'سبب الرفض',
    'Tariff period': 'فترة التسعير',
    'This reading was rejected': 'رُفضت هذه القراءة',
    'No reason was given. Correct the value and resubmit.':
        'لم يُذكر سبب. صحّح القيمة وأعد الإرسال.',
    'Saving resubmits this reading for admin approval.':
        'الحفظ يعيد إرسال القراءة لموافقة المسؤول.',
    'Everything you have recorded. Pending and rejected readings can still be edited.':
        'كل ما سجّلته. القراءات قيد الانتظار أو المرفوضة قابلة للتعديل.',

    // ── Reading form ──
    'Record a reading': 'تسجيل قراءة',
    'Enter the value shown on the meter dial. It goes to an admin for approval.':
        'أدخل القيمة الظاهرة على العداد. سترسل للمسؤول للموافقة.',
    'Choose the meter you are reading': 'اختر العداد الذي تقرأه',
    'When was the reading taken?': 'متى أُخذت القراءة؟',
    'Meter reading': 'قراءة العداد',
    'Greater than :value': 'أكبر من :value',
    'That is a jump of more than :max :unit — the entry will be blocked. Double-check the dial.':
        'القفزة تتجاوز :max :unit — سيتم رفض الإدخال. تحقق من العداد.',
    'Previous approved reading': 'آخر قراءة معتمدة',
    'First reading for this meter': 'أول قراءة لهذا العداد',
    'Estimated amount': 'المبلغ المقدر',
    'Pick a tariff period to estimate the amount.': 'اختر فترة تسعير لتقدير المبلغ.',
    'Pick a meter to see its previous reading and a live cost estimate.':
        'اختر عدادًا لرؤية قراءته السابقة وتقدير التكلفة مباشرة.',
    'Save reading': 'حفظ القراءة',
    'Water uses the daily tariff: :price :currency per m³. No period to choose.':
        'الماء يستخدم التعرفة اليومية: :price :currency لكل م³. لا فترة للاختيار.',
    'No water tariff exists yet — ask an admin to create one.':
        'لا توجد تعرفة ماء بعد — اطلب من المسؤول إنشاءها.',

    // ── Meters ──
    'The physical electricity and water meters technicians read.':
        'عدادات الكهرباء والماء التي يقرأها الفنيون.',
    'Add meter': 'إضافة عداد',
    'Edit meter': 'تعديل العداد',
    'No meters found': 'لا توجد عدادات',
    'Add your first meter so technicians can start recording readings.':
        'أضف أول عداد ليبدأ الفنيون بتسجيل القراءات.',
    'Register a new electricity or water meter.': 'سجّل عداد كهرباء أو ماء جديدًا.',
    'Changes apply to future readings; existing history keeps its snapshot.':
        'التغييرات تنطبق على القراءات المستقبلية؛ السجل الحالي محفوظ.',
    'Create meter': 'إنشاء العداد',
    'Meter name': 'اسم العداد',
    'e.g. Kitchen — ground floor': 'مثال: المطبخ — الطابق الأرضي',
    'Where is the meter installed?': 'أين تم تركيب العداد؟',
    'Delete “:name”?': 'حذف «:name»؟',
    'This meter has :count readings — deletion will be refused. Set it to inactive instead.':
        'هذا العداد لديه :count قراءة — سيُرفض الحذف. اجعله غير نشط بدلًا من ذلك.',
    'The meter has no readings and will be removed permanently.':
        'العداد بلا قراءات وسيُحذف نهائيًا.',
    'The serial number is what technicians match against the physical meter — keep it identical to the plate on the device.':
        'الرقم التسلسلي هو ما يطابقه الفنيون مع العداد الفعلي — أبقه مطابقًا للوحة الجهاز.',
    "Inactive meters disappear from the technician's reading form but keep their full history in reports.":
        'العدادات غير النشطة تختفي من نموذج القراءة لكن سجلها يبقى في التقارير.',

    // ── Periods ──
    'Electricity is billed by time-of-day windows; water has one flat daily tariff.':
        'الكهرباء تُفوتر حسب فترات اليوم؛ الماء له تعرفة يومية واحدة.',
    'Electricity uses time-of-day windows; water has one flat daily tariff.':
        'الكهرباء تستخدم فترات زمنية؛ الماء له تعرفة يومية واحدة.',
    'Add period': 'إضافة فترة',
    'Add tariff period': 'إضافة فترة تسعير',
    'Edit period': 'تعديل الفترة',
    'No tariff periods': 'لا توجد فترات تسعير',
    'Create at least one period so readings can be priced.':
        'أنشئ فترة واحدة على الأقل لتسعير القراءات.',
    'Existing readings keep the price they were recorded with.':
        'القراءات الحالية تحتفظ بسعرها وقت التسجيل.',
    'Create period': 'إنشاء الفترة',
    'Period name': 'اسم الفترة',
    'e.g. Peak hours': 'مثال: ساعات الذروة',
    'Starts at': 'تبدأ في',
    'Ends at': 'تنتهي في',
    'Whole day': 'اليوم كاملًا',
    overnight: 'ليلية',
    'Delete period': 'حذف الفترة',
    'This period is used by existing readings and cannot be deleted.':
        'هذه الفترة مستخدمة في قراءات موجودة ولا يمكن حذفها.',
    'This period has no readings and will be removed permanently.':
        'هذه الفترة بلا قراءات وستُحذف نهائيًا.',
    ':count readings priced with this period': ':count قراءة مسعّرة بهذه الفترة',
    'Overnight windows are fine — 23:00 to 08:00 covers the night tariff.':
        'الفترات الليلية ممكنة — 23:00 إلى 08:00 تغطي التعرفة الليلية.',
    'New readings snapshot this price at the moment they are recorded — changing it later never rewrites billing history.':
        'القراءات الجديدة تثبّت هذا السعر لحظة تسجيلها — تغييره لاحقًا لا يعيد كتابة السجل.',
    'Water is billed at one flat tariff for the whole day — no time window to configure.':
        'الماء يُفوتر بتعرفة واحدة لليوم كله — لا فترة زمنية للإعداد.',
    'Water already has its daily tariff — edit that period instead.':
        'الماء لديه تعرفته اليومية بالفعل — عدّل تلك الفترة.',

    // ── Users ──
    'Users & roles': 'المستخدمون والأدوار',
    'Who can record, approve, and view consumption data.':
        'من يمكنه تسجيل بيانات الاستهلاك والموافقة عليها وعرضها.',
    'Add user': 'إضافة مستخدم',
    'Edit user': 'تعديل المستخدم',
    'No users found': 'لا يوجد مستخدمون',
    'Delete :name?': 'حذف :name؟',
    'Their account is removed permanently. Readings they recorded stay in the history.':
        'يُحذف الحساب نهائيًا. قراءاته تبقى في السجل.',
    'Delete user': 'حذف المستخدم',
    'Create user': 'إنشاء المستخدم',
    'The account is created verified and can sign in right away.':
        'يُنشأ الحساب موثقًا ويمكنه تسجيل الدخول فورًا.',
    'Leave the password fields empty to keep the current password.':
        'اترك حقول كلمة المرور فارغة للاحتفاظ بالحالية.',
    'New password (optional)': 'كلمة مرور جديدة (اختياري)',
    'Confirm password': 'تأكيد كلمة المرور',
    'Full access — approves readings and manages meters, tariffs and users.':
        'صلاحية كاملة — يعتمد القراءات ويدير العدادات والتعرفات والمستخدمين.',
    'Records meter readings in the field and tracks their approval.':
        'يسجل قراءات العدادات ميدانيًا ويتابع اعتمادها.',
    'Read-only access to approved consumption data and reports.':
        'وصول للقراءة فقط إلى البيانات المعتمدة والتقارير.',
    Admins: 'المسؤولون',
    Viewers: 'المشاهدون',

    // ── Reports ──
    'Approved readings only — the numbers you can bill against.':
        'قراءات معتمدة فقط — الأرقام التي يمكن الفوترة عليها.',
    'Export Excel': 'تصدير Excel',
    'Total cost': 'التكلفة الإجمالية',
    'Nothing to report': 'لا شيء للتقرير',
    'No approved readings match these filters.':
        'لا قراءات معتمدة تطابق هذه المرشحات.',
    'Cost by meter': 'التكلفة حسب العداد',
    'Top :top of :total meters, by billed amount (:currency).':
        'أعلى :top من :total عدادًا حسب المبلغ المفوتر (:currency).',
    'Matching readings': 'القراءات المطابقة',

    // ── Simulator ──
    'Cost simulator': 'محاكي التكلفة',
    'Quick what-if calculations — nothing on this page is ever saved.':
        'حسابات سريعة افتراضية — لا يُحفظ شيء من هذه الصفحة.',
    'Use this to sanity-check a bill, test a tariff change, or estimate a reading before it is recorded.':
        'استخدمه للتحقق من فاتورة أو تجربة تعرفة أو تقدير قراءة قبل تسجيلها.',
    'Previous reading': 'القراءة السابقة',
    'Current reading': 'القراءة الحالية',
    'Pick a tariff': 'اختر تعرفة',
    'No tariff for this utility': 'لا تعرفة لهذا النوع',
    'Or a custom price': 'أو سعر مخصص',
    'Overrides the tariff': 'يتجاوز التعرفة',
    'Using your custom price': 'يُستخدم سعرك المخصص',
    'The current reading must be greater than the previous one.':
        'القراءة الحالية يجب أن تكون أكبر من السابقة.',
    'This is a scratchpad — close the page and it is gone.':
        'هذه مسودة — أغلق الصفحة وتختفي.',

    // ── Notifications ──
    ':technician recorded :amount on :meter': 'سجّل :technician ‏:amount على :meter',
    ':technician resubmitted :amount on :meter':
        'أعاد :technician إرسال :amount على :meter',
    'Your reading of :amount on :meter was approved':
        'تم اعتماد قراءتك :amount على :meter',
    'Your reading of :amount on :meter was rejected':
        'تم رفض قراءتك :amount على :meter',
    'A technician': 'فني',

    // ── Settings ──
    'Manage your profile and account settings': 'أدر ملفك الشخصي وإعدادات الحساب',
    Profile: 'الملف الشخصي',
    'Two-Factor Auth': 'التحقق بخطوتين',
    Appearance: 'المظهر',
    'Profile settings': 'إعدادات الملف الشخصي',
    'Password settings': 'إعدادات كلمة المرور',
    'Appearance settings': 'إعدادات المظهر',
    'Profile information': 'معلومات الملف الشخصي',
    'Update your name and email address': 'حدّث اسمك وبريدك الإلكتروني',
    'Update password': 'تحديث كلمة المرور',
    'Ensure your account is using a long, random password to stay secure':
        'استخدم كلمة مرور طويلة وعشوائية للبقاء آمنًا',
    'Two-Factor Authentication': 'التحقق بخطوتين',
    'Manage your two-factor authentication settings': 'أدر إعدادات التحقق بخطوتين',
    "Update your account's appearance settings": 'اضبط مظهر حسابك',
    'Delete account': 'حذف الحساب',
    'Delete your account and all of its resources': 'احذف حسابك وكل بياناته',

    // ── Landing ──
    'Every meter,': 'كل عداد،',
    'every drop,': 'كل قطرة،',
    'on the record.': 'تحت السيطرة.',
    'Approved data only': 'بيانات معتمدة فقط',
    'EcoTrack turns hand-read utility meters into an approved, auditable history — with time-of-day tariffs, live dashboards and costs your whole team can trust.':
        'يحوّل EcoTrack القراءات اليدوية إلى سجل معتمد وقابل للتدقيق — مع تعرفات زمنية ولوحات مباشرة وتكاليف يثق بها فريقك.',
    'Create an account': 'إنشاء حساب',
    'See how it works': 'شاهد كيف يعمل',
    'Open dashboard': 'فتح لوحة التحكم',
    'Go to your dashboard': 'اذهب إلى لوحة التحكم',
    'Built for the way utilities are actually read':
        'مصمم لطريقة قراءة العدادات فعليًا',
    'No IoT hardware required — EcoTrack makes human meter reading reliable, reviewable and beautiful.':
        'لا حاجة لأجهزة إنترنت الأشياء — يجعل EcoTrack القراءة اليدوية موثوقة وقابلة للمراجعة وجميلة.',
    'From meter dial to trusted number in three steps':
        'من عداد الجهاز إلى رقم موثوق في ثلاث خطوات',
    'Everyone sees exactly what they need': 'كلٌ يرى ما يحتاجه بالضبط',
    'Dark mode, done properly': 'وضع داكن، بإتقان',
    'A deep-forest theme with charts validated for contrast and color-blind safety — in both modes.':
        'سمة غابة داكنة برسوم بيانية مدققة للتباين وعمى الألوان — في الوضعين.',
    'Your data is never stuck': 'بياناتك ليست حبيسة أبدًا',
    'Every filtered list and report exports exactly as you see it. No lock-in, ever.':
        'كل قائمة وتقرير يُصدَّر كما تراه تمامًا. لا احتكار للبيانات.',
    'Start putting your meters on the record': 'ابدأ بوضع عداداتك تحت السيطرة',
    'Log in with your team account, record the first reading, and watch the dashboard come alive.':
        'سجّل الدخول بحساب فريقك، سجّل أول قراءة، وشاهد اللوحة تنبض بالحياة.',
    'energy & water tracking': 'تتبع الطاقة والماء',
    // Landing features
    'Dual-utility tracking': 'تتبع مزدوج للطاقة',
    'Electricity in kWh, water in m³ — color-coded everywhere so a glance tells you which is which. Never a mixed-up axis or unit.':
        'الكهرباء بالكيلوواط والماء بالمتر المكعب — بألوان مميزة في كل مكان. لا خلط في المحاور أو الوحدات.',
    'Approval workflow': 'مسار الموافقات',
    'Every reading passes an admin review. Rejected entries go back to the technician with a reason; approved ones are locked into history.':
        'كل قراءة تمر بمراجعة المسؤول. المرفوضة تعود للفني مع سبب؛ والمعتمدة تُقفل في السجل.',
    'Time-of-day tariffs': 'تعرفات حسب الوقت',
    'Peak, off-peak and overnight windows each carry their own price. Readings snapshot the tariff, so old bills never change.':
        'لكل فترة سعرها الخاص. القراءات تثبّت التعرفة فلا تتغير الفواتير القديمة.',
    'Reports that bill': 'تقارير جاهزة للفوترة',
    'Trends, per-meter cost breakdowns and totals over any date range — computed only from approved, audit-ready data.':
        'اتجاهات وتفاصيل تكلفة لكل عداد وإجماليات لأي فترة — من بيانات معتمدة فقط.',
    'One-click CSV export': 'تصدير بنقرة واحدة',
    'Any filtered view exports to a clean CSV for your accountant, spreadsheet, or archive. What you see is what you get.':
        'أي عرض مفلتر يُصدَّر بشكل نظيف لمحاسبك أو جداولك أو أرشيفك.',
    'Works where you work': 'يعمل حيث تعمل',
    'Tables become cards on a phone, forms fit a technician’s pocket, and dark mode is a first-class citizen — not an afterthought.':
        'الجداول تصبح بطاقات على الهاتف، والنماذج تناسب جيب الفني، والوضع الداكن أساسي لا ثانوي.',
    // Landing steps
    'Record in the field': 'سجّل ميدانيًا',
    'The technician picks the meter and sees its last approved value on the spot — typos are caught before they are saved.':
        'يختار الفني العداد ويرى آخر قيمة معتمدة فورًا — تُكتشف الأخطاء قبل الحفظ.',
    'Approve with context': 'وافق مع السياق',
    'Admins review each reading with the consumption delta and cost already computed. One click to approve, a reason to reject.':
        'يراجع المسؤول كل قراءة مع فرق الاستهلاك والتكلفة محسوبين. نقرة للموافقة وسبب للرفض.',
    'Understand & export': 'افهم وصدّر',
    'Approved data flows into dashboards, trends and CSV exports — the numbers your bills and budgets can rely on.':
        'البيانات المعتمدة تغذي اللوحات والاتجاهات والتصدير — أرقام تعتمد عليها فواتيرك.',
    // Landing roles
    'Guided reading form': 'نموذج قراءة موجّه',
    'Previous value shown live': 'القيمة السابقة تظهر مباشرة',
    'Edit & resubmit rejections': 'تعديل المرفوض وإعادة إرساله',
    'Approval queue': 'قائمة الموافقات',
    'Meters, tariffs & users': 'العدادات والتعرفات والمستخدمون',
    'Full reports & exports': 'تقارير كاملة وتصدير',
    'Consumption dashboards': 'لوحات الاستهلاك',
    'Self-serve reports': 'تقارير ذاتية الخدمة',
    // ── Gasoil ──
    Gasoil: 'الغازوال',
    'Gasoil stock': 'مخزون الغازوال',
    'Deliveries in, daily consumption out — the tank in real time.':
        'التوريدات دخولًا والاستهلاك اليومي خروجًا — الخزان في الوقت الفعلي.',
    'Add import': 'إضافة توريد',
    'Add consumption': 'إضافة استهلاك',
    'Record a gasoil delivery': 'تسجيل توريد غازوال',
    'The quantity is added to the tank immediately.': 'تُضاف الكمية إلى الخزان فورًا.',
    Quantity: 'الكمية',
    Unit: 'الوحدة',
    'liters (L)': 'لترات (L)',
    'tons (t)': 'أطنان (t)',
    '≈ :liters L (1 t ≈ :perTon L of diesel)': '≈ :liters لتر (1 طن ≈ :perTon لتر غازوال)',
    'Note (optional)': 'ملاحظة (اختياري)',
    'e.g. Delivery — 4 t truck': 'مثال: توريد — شاحنة 4 أطنان',
    'Add to stock': 'إضافة إلى المخزون',
    "Record a day's consumption": 'تسجيل استهلاك اليوم',
    'It is deducted from the tank once approved. :stock L currently in stock.':
        'يُخصم من الخزان بعد الموافقة. المخزون الحالي :stock لتر.',
    'Record consumption': 'تسجيل الاستهلاك',
    'e.g. Generator — night shift': 'مثال: المولد — الوردية الليلية',
    'Low stock': 'مخزون منخفض',
    'Only :stock L left in the tank (alert level: :threshold L). Plan a delivery.':
        'لم يتبق سوى :stock لتر في الخزان (حد التنبيه: :threshold لتر). خطط لتوريد.',
    'Current stock': 'المخزون الحالي',
    ':percent% of all-time imports still in the tank · alert at :threshold L':
        ':percent% من إجمالي التوريدات ما زال في الخزان · تنبيه عند :threshold لتر',
    'Imported (total)': 'المورَّد (الإجمالي)',
    'Consumed (total)': 'المستهلك (الإجمالي)',
    'Consumed this month': 'المستهلك هذا الشهر',
    'Gasoil — last 30 days (L)': 'الغازوال — آخر 30 يومًا (لتر)',
    Movements: 'الحركات',
    Type: 'النوع',
    Note: 'ملاحظة',
    Import: 'توريد',
    'Delete this entry?': 'حذف هذا الإدخال؟',
    'The stock is recalculated without it. This cannot be undone.':
        'يُعاد حساب المخزون بدونه. لا يمكن التراجع.',
    'Gasoil stock is low: :liters L remaining':
        'مخزون الغازوال منخفض: تبقى :liters لتر',
    'Alert settings': 'إعدادات التنبيه',
    'Admins are notified when the stock crosses below this level. Current level: :threshold L.':
        'يُخطر المسؤولون عندما ينخفض المخزون تحت هذا المستوى. المستوى الحالي: :threshold لتر.',
    'Alert me when stock falls below': 'نبهني عندما ينخفض المخزون تحت',
    '% of total imports': '% من إجمالي التوريدات',
    'The level follows your deliveries — 10% of everything imported so far.':
        'يتبع المستوى توريداتك — مثلًا 10% من كل ما تم توريده.',
    'Save alert level': 'حفظ مستوى التنبيه',

    // Landing stats
    'utilities, one ledger': 'نوعا طاقة، سجل واحد',
    'roles with clear duties': 'أدوار بمهام واضحة',
    'of reports from approved data': 'من التقارير من بيانات معتمدة',
    'CSV export on every view': 'تصدير من كل عرض',
};
