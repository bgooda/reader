from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslationRequest(BaseModel):
    text: str
    language: str
    context: Optional[str] = None

class TranslationResponse(BaseModel):
    translation: str

# German-English translation dictionary
translations = {
    "Sehr geehrte Damen und Herren": "Dear Ladies and Gentlemen",
    "ich": "I",
    "habe": "have",
    "vor wenigen Wochen": "a few weeks ago",
    "eine neue Jeans": "a new pair of jeans",
    "bei Ihnen bestellt": "ordered from you",
    "Ich war sehr glücklich": "I was very happy",
    "die Hose ist nach wenigen Tagen schon angekommen": "the pants arrived after just a few days",
    "Sie sieht aus wie in der Werbung": "They look like in the advertisement",
    "und gefällt mir sehr": "and I like them very much",
    "Leider": "Unfortunately",
    "haben Sie mir die Jeans in der falschen Größe geschickt": "you sent me the jeans in the wrong size",
    "Die Hose passt mir nicht": "The pants don't fit me",
    "und ich kann sie daher nicht tragen": "and I cannot wear them",
    "Ich bitte Sie daher um einen Umtausch der Ware": "I am therefore asking you to exchange the item",
    "Bitte schicken Sie mir per Post eine neue Jeans in der richtigen Größe zu": "Please send me a new pair of jeans in the correct size by post",
    "Ich schicke Ihnen dann die falsche Hose per Post zurück": "I will then send you the incorrect pants back by post",
    "Falls sie die Hose nicht in meiner Größe vorrätig haben": "If the pants are not available in my size",
    "möchte ich gern mein Geld zurück": "I would like a refund",
    "Mit freundlichen Grüßen": "Sincerely,",
    "Sehr": "Very",
    "geehrte": "honored",
    "Damen": "ladies",
    "und": "and",
    "Herren": "gentlemen",
    "vor": "before",
    "wenigen": "few",
    "Wochen": "weeks",
    "eine": "a",
    "neue": "new",
    "Jeans": "jeans",
    "bei": "with/at",
    "Ihnen": "you (formal)",
    "bestellt": "ordered",
    "war": "was",
    "sehr": "very",
    "glücklich": "happy",
    "die": "the",
    "Hose": "pants",
    "ist": "is",
    "nach": "after",
    "Tagen": "days",
    "schon": "already",
    "angekommen": "arrived",
    "sieht": "looks",
    "aus": "out",
    "wie": "like",
    "in": "in",
    "der": "the",
    "Werbung": "advertisement",
    "gefällt": "pleases",
    "mir": "me",
    "Leider": "unfortunately",
    "haben": "have",
    "Sie": "you (formal)",
    "falschen": "wrong",
    "Größe": "size",
    "geschickt": "sent",
    "passt": "fits",
    "nicht": "not",
    "kann": "can",
    "daher": "therefore",
    "tragen": "wear",
    "bitte": "ask",
    "um": "for",
    "einen": "a",
    "Umtausch": "exchange",
    "Ware": "goods",
    "Bitte": "please",
    "schicken": "send",
    "per": "by",
    "Post": "post/mail",
    "richtigen": "correct",
    "zu": "to",
    "schicke": "send",
    "dann": "then",
    "falsche": "wrong",
    "Falls": "if",
    "sie": "she/they/it",
    "meiner": "my",
    "vorrätig": "available/in stock",
    "möchte": "would like",
    "gern": "gladly",
    "mein": "my",
    "Geld": "money",
    "zurück": "back",
    "Mit": "with",
    "freundlichen": "friendly",
    "Grüßen": "greetings"
}

@app.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    text = request.text.strip()
    print(f"\nTranslation Request:")
    print(f"  Text: {text}")
    print(f"  Language: {request.language}")
    print(f"  Context: {request.context}")
  
    # Only process German text
    if request.language != 'de':
        print(f"  Result: Non-German text, returning as is")
        return TranslationResponse(translation=text)
    
    # First check if the exact phrase exists in the dictionary
    if text in translations:
        print(f"  Result: Found exact phrase match: {translations[text]}")
        return TranslationResponse(translation=translations[text])
    
    # For single words, check the dictionary
    if ' ' not in text:
        result = translations.get(text, text)
        print(f"  Result: Single word {'found' if text in translations else 'not found'}: {result}")
        return TranslationResponse(translation=result)
    
    # For phrases, try to find the longest matching subphrases
    words = text.split()
    translated_words = []
    i = 0
    print(f"  Phrase translation:")

    while i < len(words):
        found_match = False
        # Try phrases from longest to shortest
        for j in range(min(len(words), i + 12), i, -1):
            phrase = ' '.join(words[i:j])
            if phrase in translations:
                translated_words.append(translations[phrase])
                print(f"    Found phrase: '{phrase}' -> '{translations[phrase]}'")
                i = j
                found_match = True
                break

        # If no phrase found, try to translate the single word
        if not found_match:
            word = words[i]
            translated_words.append(translations.get(word, word))
            print(f"    Single word: '{word}' -> '{translations.get(word, word)}'")
            i += 1

    final_translation = ' '.join(translated_words)
    print(f"  Final translation: {final_translation}")
    return TranslationResponse(translation=final_translation)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}