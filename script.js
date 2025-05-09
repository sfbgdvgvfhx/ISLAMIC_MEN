// API مفتاح ورابط
const API_KEY = 'AIzaSyDjMwL_OQEy-qCvBj8SuLH1vjERqyCRY3w';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// قائمة موسعة من الشخصيات الإسلامية البارزة للاختيار العشوائي
const islamicPersonalityNames = [
    // علماء الفقه والحديث والتفسير
    "الإمام أبو حنيفة النعمان",
    "الإمام مالك بن أنس",
    "الإمام الشافعي",
    "الإمام أحمد بن حنبل",
    "الإمام البخاري",
    "الإمام مسلم",
    "الإمام الترمذي",
    "الإمام أبو داود",
    "الإمام النسائي",
    "الإمام ابن ماجه",
    "ابن تيمية",
    "ابن القيم الجوزية",
    "الإمام الغزالي",
    "السيوطي",
    "ابن حجر العسقلاني",
    "الإمام النووي",
    "الشاطبي",
    "ابن كثير",
    "الطبري",
    "القرطبي",
    
    // الصحابة والخلفاء
    "أبو بكر الصديق",
    "عمر بن الخطاب",
    "عثمان بن عفان",
    "علي بن أبي طالب",
    "خالد بن الوليد",
    "سعد بن أبي وقاص",
    "أبو هريرة",
    "عائشة بنت أبي بكر",
    "فاطمة الزهراء",
    "بلال بن رباح",
    "حمزة بن عبد المطلب",
    "جعفر بن أبي طالب",
    "سلمان الفارسي",
    "الحسن بن علي",
    "الحسين بن علي",
    "معاذ بن جبل",
    
    // علماء اللغة والأدب
    "الخليل بن أحمد الفراهيدي",
    "سيبويه",
    "الجاحظ",
    "المتنبي",
    "أبو الفرج الأصفهاني",
    "الخنساء",
    "ابن المقفع",
    "الحريري",
    "أبو العلاء المعري",
    "الزمخشري",
    
    // العلماء والفلاسفة
    "ابن سينا",
    "الخوارزمي",
    "البيروني",
    "ابن الهيثم",
    "جابر بن حيان",
    "ابن رشد",
    "الفارابي",
    "الكندي",
    "ابن خلدون",
    "ابن البيطار",
    "الرازي",
    "الإدريسي",
    "ابن بطوطة",
    "ابن النفيس",
    "الجزري",
    
    // شخصيات صوفية وزهاد
    "رابعة العدوية",
    "الحلاج",
    "الجنيد البغدادي",
    "ابن عربي",
    "جلال الدين الرومي",
    "الشيخ عبد القادر الجيلاني",
    "البسطامي",
    
    // قادة وسلاطين
    "صلاح الدين الأيوبي",
    "محمد الفاتح",
    "نور الدين زنكي",
    "قطز",
    "عبد الرحمن الناصر",
    "هارون الرشيد",
    "المعتصم بالله"
];

// تهيئة زر البحث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('getPersonBtn').addEventListener('click', getRandomPerson);
});

// دالة البحث عن شخصية عشوائية
async function getRandomPerson() {
    // إضافة تأثير الاهتزاز للزر
    const button = document.getElementById('getPersonBtn');
    button.classList.add('btn-shake');
    setTimeout(() => {
        button.classList.remove('btn-shake');
    }, 600);
    
    // إظهار شاشة التحميل
    const loader = document.getElementById('loaderContainer');
    loader.style.display = 'flex';
    
    // إخفاء المحتوى السابق
    const contentElement = document.getElementById('personContent');
    contentElement.style.display = 'none';
    contentElement.classList.remove('show');
    
    try {
        // اختيار شخصية إسلامية عشوائية
        const randomName = getRandomPersonName();
        
        // إنشاء طلب للذكاء الاصطناعي
        const prompt = createAIPrompt(randomName);
        
        // استدعاء الواجهة البرمجية Gemini
        const response = await fetchAIResponse(prompt);
        
        // التحقق من صحة الاستجابة
        if (response && response.candidates && response.candidates[0] && response.candidates[0].content) {
            // الحصول على النص من الاستجابة
            const generatedContent = response.candidates[0].content.parts[0].text;
            
            // عرض المحتوى مع تأثير حركي
            setTimeout(() => {
                displayContent(contentElement, generatedContent);
            }, 500); // تأخير بسيط للانتقال السلس
        } else {
            // معالجة خطأ الواجهة البرمجية أو الاستجابة الفارغة
            handleError(randomName);
        }
    } catch (error) {
        console.error('خطأ في استدعاء الواجهة البرمجية:', error);
        // محاولة الحصول على الاسم العشوائي الذي تم تحديده قبل الخطأ
        const randomName = getRandomPersonName();
        handleError(randomName);
    } finally {
        // إخفاء شاشة التحميل بعد مرور وقت محدد لتحسين تجربة المستخدم
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1000);
    }
}

// اختيار اسم شخصية عشوائية من القائمة
function getRandomPersonName() {
    return islamicPersonalityNames[Math.floor(Math.random() * islamicPersonalityNames.length)];
}

// إنشاء طلب للذكاء الاصطناعي
function createAIPrompt(personName) {
    return `قم بإعداد نبذة شاملة ومميزة عن الشخصية الإسلامية "${personName}" بتنسيق HTML جميل. احرص على دقة المعلومات وشموليتها وتنظيمها كالتالي:

    1. <h2>${personName}</h2> (للعنوان الرئيسي)
    2. <h3>نبذة عن حياته وعصره</h3> متبوعة بفقرات <p> تشرح سيرته وحياته.
    3. <h3>أهم إنجازاته وإسهاماته</h3> متبوعة بفقرات <p> أو قائمة <ul><li> توضح إنجازاته.
    4. <h3>أشهر أقواله وحكمه</h3> متبوعة بفقرات <p> أو قائمة <ul><li> لأبرز أقواله.
    5. إذا كان له كتب أو مؤلفات، أضف <h3>كتبه ومؤلفاته</h3> متبوعة بقائمة <ul><li>.
    6. <h3>تأثيره وإرثه</h3> متبوعة بفقرات <p> عن أثره في الحضارة الإسلامية.

    لتحسين الشكل، اجعل الاقتباسات والحكم داخل عناصر <div class="quote-section">.
    قم بإعداد معلومات دقيقة وشاملة، مع ذكر السنوات بالتقويمين الهجري والميلادي عند الإمكان.`;
}

// استدعاء الواجهة البرمجية Gemini
async function fetchAIResponse(prompt) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    });
    
    return await response.json();
}

// عرض المحتوى في الصفحة
function displayContent(element, content) {
    element.innerHTML = content;
    element.style.display = 'block';
    
    // فرض إعادة التدفق للرسوم المتحركة
    void element.offsetWidth;
    
    // إضافة فئة الرسوم المتحركة
    element.classList.add('show');
}

// معالجة حالة الخطأ
function handleError(personName) {
    const errorHTML = `
        <h2>${personName}</h2>
        
        <div class="error-message">
            <p><i class="fas fa-exclamation-triangle"></i> عذراً، حدث خطأ أثناء جلب المعلومات عن هذه الشخصية. يرجى المحاولة مرة أخرى لاحقاً.</p>
        </div>
        
        <h3>معلومات موجزة</h3>
        <p>نأسف لعدم تمكننا من جلب المعلومات التفصيلية عن "${personName}" في الوقت الحالي، ولكننا نشجعك على البحث أكثر عن هذه الشخصية الإسلامية المهمة.</p>
        
        <h3>أسباب المشكلة المحتملة</h3>
        <ul>
            <li>مشكلة مؤقتة في الاتصال بخدمة الذكاء الاصطناعي</li>
            <li>تجاوز حد الاستخدام للواجهة البرمجية</li>
            <li>قيود تقنية على الخدمة في الوقت الحالي</li>
        </ul>
        
        <h3>ماذا يمكنك أن تفعل؟</h3>
        <ul>
            <li>حاول النقر على الزر مرة أخرى بعد لحظات</li>
            <li>اكتشف شخصية إسلامية أخرى</li>
        </ul>
    `;
    
    const contentElement = document.getElementById('personContent');
    contentElement.innerHTML = errorHTML;
    contentElement.style.display = 'block';
    
    // إضافة فئة الرسوم المتحركة
    setTimeout(() => {
        contentElement.classList.add('show');
    }, 100);
}
