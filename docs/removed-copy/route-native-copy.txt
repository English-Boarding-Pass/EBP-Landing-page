/**
 * Route card tagline/description, always shown in the route's own spoken
 * language — regardless of the site's active interface locale. This is
 * intentional: the Sinhala route's card should read in spoken Sinhala (and
 * the Tamil route's in spoken Tamil) even when browsing in English, since
 * the copy itself is a preview of the class experience, not translatable
 * UI chrome. Draft colloquial register — needs native-speaker review
 * before launch (see messages/TRANSLATION_NOTES.md).
 */
export const routeNativeCopy = {
  sinhala: {
    tagline: "සිංහලෙන් පටන් ගන්න. ඉංග්‍රීසියෙන් කතා කරලා ඉවර කරන්න.",
    description:
      "සතියෙන් සතියට, පියවරෙන් පියවර ඔබේ කතා කරන ඉංග්‍රීසිය හදාගන්න පුළුවන් සජීවී පන්ති. ඕන වෙලාවක සිංහලෙන් තේරුම් කරලා දෙනවා — ඕන නැති වෙනකම්.",
  },
  tamil: {
    tagline: "தமிழில ஆரம்பிங்க. ஆங்கிலத்தில பேசி முடிங்க.",
    description:
      "வாரா வாரம், படிப்படியா உங்க பேசற ஆங்கிலத்த கட்டி எழுப்பற லைவ் கிளாஸ். தேவைப்படும்போதெல்லாம் தமிழில விளக்கம் தருவோம் — தேவையில்லாத வரைக்கும்.",
  },
} as const;
