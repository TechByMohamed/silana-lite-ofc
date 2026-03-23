// _allfake.js — Lite Version
// هذا الملف يشتغل قبل أي رسالة ويقدر يضيف إعدادات بسيطة فقط

let handler = m => m

handler.all = async function (m) {

    // اسم المرسل
    const name = m.pushName || m.sender.split('@')[0]

    // تحية بسيطة حسب الوقت
    const hour = new Date().getHours()
    let greet = 'مرحبا'
    if (hour >= 5 && hour < 12) greet = 'صباح الخير'
    if (hour >= 12 && hour < 18) greet = 'مساء الخير'
    if (hour >= 18) greet = 'مساء النور'

    // نضيفها كمتغير عالمي بسيط
    global.ucapanLite = greet

    // مثال: نقدر نطبع كل رسالة
    console.log(`📨 رسالة من ${name}: ${m.text || '[media]'}`)
}

export default handler
