const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const ChatMessage = require('../models/ChatMessage');
const HealthDataUser = require('../models/HealthDataUser');
const jwt = require('jsonwebtoken');
const { debug } = require('openai/core.mjs');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// router.get('/initial', authenticate, async (req, res) => {
//   try {
//     const healthData = await HealthDataUser.findOne({ userId: req.user.userId });

//     if (!healthData) {
//       return res.status(404).json({ message: 'לא נמצאו נתוני בריאות למשתמש זה' });
//     }

//     if (healthData.nutritionGoals && healthData.nutritionGoals.length > 0) {
//     //  console.log("yessssssss")
//       return res.json({ nutritionGoals: healthData.nutritionGoals, healthData });

//     }




// const prompt = `
// אתה תזונאי מומחה ואיש כושר מוסמך. נא ליצור 4 מטרות מותאמות אישית עבור משתמש עם הנתונים הבאים:

// - משקל: ${healthData.weight} ק"ג
// - גובה: ${healthData.height} ס"מ
// - גיל: ${healthData.age} שנים
// - מין: ${healthData.gender}
// - אלרגיות: ${healthData.allergies.join(', ')}

// כל מטרה צריכה לכלול:
// 1. כותרת המטרה ("title") – קצרה וברורה
// 2. תיאור הפעולות שהמשתמש צריך לעשות ("description") – כגון פעילות גופנית מומלצת (הליכה, ריצה, אופני כושר, חדר כושר), והרגלים תזונתיים (כמו שתיית מים, ירקות מסוימים, הימנעות ממזון מסוים)
// 3. יעד קלורי מומלץ ליום ("targetCalories")
// 4. יעד יומי לפחמימות בגרם ("targetCarbs")
// 5. יעד יומי לחלבון בגרם ("targetProtein")
// 6. יעד יומי לשומן בגרם ("targetFat")

//  ההצעות חייבות להיות מדויקות, מבוססות עקרונות תזונה וכושר, לא מומצאות, ולא לכלול מידע שאינו מתאים לנתוני המשתמש.ובשפה העברית בלבד

 
//  אנא הצג את המטרות בפורמט JSON בלבד, במערך של אובייקטים, כאשר כל אובייקט כולל את המאפיינים:
//  החזר אך ורק JSON תקין, ללא טקסט נוסף, ללא עטיפות של json או טקסט אחר. 

//  "title", "description", "targetCalories", "targetCarbs", "targetProtein", "targetFat".
// `;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo" ,
//       messages: [{ role: "user", content: prompt }],
//     });

//     const responseText = completion.choices[0].message.content;

//     console.log(responseText,"responseText")
//      const cleanText = extractJsonFromText(responseText);
//  console.log("cleanText" ,cleanText)
//     let nutritionGoals;
//     try {
    

//   nutritionGoals = JSON.parse(cleanText);
   

  
//     } catch (e) {
//       return res.status(500).json({ error: 'שגיאה בפרסינג JSON מה-OpenAI' });
//     }

//     // console.log("nutritionGoals" ,nutritionGoals)
//    nutritionGoals = nutritionGoals.map(goal => ({
//   ...goal,
//   status: 'notStarted' }));

//     console.log("nutritionGoals" ,nutritionGoals)
//     healthData.nutritionGoals = nutritionGoals;
       

//     await healthData.save();

//     res.json({ nutritionGoals, healthData });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
 

router.get('/initial', authenticate, async (req, res) => {
  try {
    const healthData = await HealthDataUser.findOne({ userId: req.user.userId });

    if (!healthData) {
      return res.status(404).json({ message: 'לא נמצאו נתוני בריאות למשתמש זה' });
    }

    if (healthData.nutritionGoals && healthData.nutritionGoals.length > 0) {
      return res.json({ nutritionGoals: healthData.nutritionGoals, healthData });
    }

    const prompt = `
אתה תזונאי מומחה ואיש כושר מוסמך. נא ליצור 4 מטרות מותאמות אישית עבור משתמש עם הנתונים הבאים:

- משקל: ${healthData.weight} ק"ג
- גובה: ${healthData.height} ס"מ
- גיל: ${healthData.age} שנים
- מין: ${healthData.gender}
- אלרגיות: ${healthData.allergies.join(', ')}

כל מטרה צריכה לכלול:
1. כותרת המטרה ("title") – קצרה וברורה
2. תיאור הפעולות שהמשתמש צריך לעשות ("description") – כגון פעילות גופנית מומלצת (הליכה, ריצה, אופני כושר, חדר כושר), והרגלים תזונתיים (כמו שתיית מים, ירקות מסוימים, הימנעות ממזון מסוים)
3. יעד קלורי מומלץ ליום ("targetCalories")
4. יעד יומי לפחמימות בגרם ("targetCarbs")
5. יעד יומי לחלבון בגרם ("targetProtein")
6. יעד יומי לשומן בגרם ("targetFat")

ההצעות חייבות להיות מדויקות, מבוססות עקרונות תזונה וכושר, לא מומצאות, ולא לכלול מידע שאינו מתאים לנתוני המשתמש. בשפה העברית בלבד.

אנא החזר אך ורק JSON תקין – מערך של אובייקטים. ללא טקסט הסבר, ללא עטיפות של json או סימונים כמו.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // או gpt-3.5-turbo אם אין לך גישה
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = completion.choices[0].message.content;
    console.log("responseText:", responseText);

    // ניקוי JSON מתוך תגובה
    const extractJsonFromText = (text) => {
      const match = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (match) {
        return match[1];
      }
      return text;
    };

    const cleanText = extractJsonFromText(responseText);
    console.log("cleanText:", cleanText);

    let nutritionGoals;
    try {
      nutritionGoals = JSON.parse(cleanText);
    } catch (e) {
      console.error("JSON parsing error:", e.message);
      return res.status(500).json({ error: 'שגיאה בפרסינג JSON מה-OpenAI' });
    }

    // הוספת סטטוס לכל מטרה
    nutritionGoals = nutritionGoals.map(goal => ({
      ...goal,
      status: 'notStarted'
    }));

    healthData.nutritionGoals = nutritionGoals;
    await healthData.save();

    res.json({ nutritionGoals, healthData });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: 'שגיאה בשרת' });
  }
});

router.post('/updateNutritionGoals', authenticate, async (req, res) => {
  try {
  
    const healthData = await HealthDataUser.findOne({ userId: req.user.userId });

    if (!healthData) {
      return res.status(404).json({ message: 'לא נמצאו נתוני בריאות למשתמש זה' });
    }
   console.log( req.body )
    healthData.nutritionGoals = req.body;
 
    await healthData.save();

    res.json({ message: 'עודכן בהצלחה' });
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בעדכון המטרות', error: err });
  }
});



// router.get('/initial',authenticate , async (req, res) => {
//   try {
//     // דוגמה לנתוני בריאות שהמשתמש מספק
//    // const healthData = { weight: 70, height: 175, age: 30, gender: 'male', allergies: ['nuts'] };

//      const healthData = await HealthDataUser.findOne({ userId: req.user.userId });
//     if (!healthData) {
//       return res.status(404).json({ message: 'לא נמצאו נתוני בריאות למשתמש זה' });
//     }

//     // if(healthData.nutritionGoals.length>=1)
//     // {
//     //   let a = healthData.nutritionGoals
//     //  console.log("healthData" ,a)
//     //  console.log("healthDatahealthData" ,healthData)
//     //   res.json({ a, healthData });
//     // }
//    // else
//     // בניית פרומפט חכם
// const prompt = `
// אתה תזונאי מומחה. אנא ספק 6 מטרות תזונתיות מותאמות אישית עבור משתמש עם הנתונים הבאים:
// משקל: ${healthData.weight} ק"ג,
// גובה: ${healthData.height} ס"מ,
// גיל: ${healthData.age} שנים,
// מין: ${healthData.gender},
// אלרגיות: ${healthData.allergies.join(', ')}.

// אנא הצג את המטרות בפורמט JSON בלבד, במערך של אובייקטים, כאשר כל אובייקט כולל את המאפיינים:
// "title" (מחרוזת), "description" (מחרוזת), "targetCalories" (מספר), "targetCarbs" (מספר), "targetProtein" (מספר), "targetFat" (מספר).

// לדוגמה:

// [
//   {
//     "title": "איזון קלורי",
//     "description": "מטרת איזון קלורי",
//     "targetCalories": 2000,
//     "targetCarbs": 250,
//     "targetProtein": 150,
//     "targetFat": 70
//   },
//   {
//     "title": "הפחתת שומן",
//     "description": "מטרת הפחתת שומן",
//     "targetCalories": 1800,
//     "targetCarbs": 200,
//     "targetProtein": 160,
//     "targetFat": 50
//   }
// ]
// `;


//     // קריאה ל-OpenAI עם הפרומפט החכם
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//     });

//     // הפוך את התגובה לאובייקט JSON (תלוי איך ה-GPT מחזיר)
//     const responseText = completion.choices[0].message.content;


//     // לדוגמה, נניח שה-GPT מחזיר JSON בפורמט כזה
//     // אבל לרוב הוא מחזיר טקסט חופשי אז תצטרך לפרסר או לבקש ממנו להחזיר JSON מדויק
// let nutritionGoals;
// try {
  
//   nutritionGoals = JSON.parse(responseText);
// } catch (e) {
//   // אם הפרסינג נכשל, אפשר לוג או להחזיר שגיאה
//   return res.status(500).json({ error: 'שגיאה בפרסינג JSON מה-OpenAI' });
// }




//     // שמירה במסד הנתונים
//     healthData.nutritionGoals = nutritionGoals;
//     await healthData.save();
// res.json({ nutritionGoals, healthData });
//   //  }
//     // מחזיר את המידע ללקוח
//    // res.json({ nutritionGoals: responseText, healthData });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });







function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'טוקן חסר' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'טוקן שגוי' });
  }
}

router.post('/healthData', authenticate, async (req, res) => {
  try {
    const { weight, height, age, gender, allergies } = req.body;

    const existing = await HealthDataUser.findOne({ userId: req.user.userId });
    
    if (existing) {
      // עדכון אם קיים
      existing.weight = weight;
      existing.height = height;
      existing.age = age;
      existing.gender = gender;
      existing.allergies = allergies;
      await existing.save();
      return res.json({ message: 'עודכן בהצלחה' });
    }
console.log("userID" ,req.user.userId)
console.log(req.body)
    // חדש אם לא קיים
    const healthData = new HealthDataUser({
      userId: req.user.userId,
      weight,
      height,
      age,
      gender,
      allergies
    });

    await healthData.save();
    res.json({ message: 'נשמר בהצלחה' });

  } catch (error) {
    res.status(500).json({ error: 'שגיאה בשמירת נתוני הבריאות' });
  }
});

// שליפה של נתוני הבריאות
  var q= router.get('/healthDataGet', authenticate, async (req, res) => {
  try {
    const data = await HealthDataUser.findOne({ userId: req.user.userId });
    if (!data) return res.status(404).json({ message: 'לא נמצאו נתונים' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'שגיאה בשליפת נתוני הבריאות' });
  }
});

router.get('/all', authenticate, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.user.userId });
    res.json(messages);
  } catch {
    res.status(500).json({ error: 'שגיאה בהבאת ההודעות' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: "gpt-3.5-turbo",
    });

    const botReply = chatCompletion.choices[0].message.content;

    const newChat = new ChatMessage({
      userId: req.user.userId,
      userMessage: message,
      botReply
    });

    await newChat.save();

    res.json({ reply: botReply });
  } catch (error) {
    res.status(500).json({ error: 'שגיאה בשיחה עם הבוט' });
  }
});

module.exports = router;
