from fastapi import FastAPI
from fastapi.responses import JSONResponse
import requests
import uvicorn

app = FastAPI(
    title="Profile Generator API",
    description="Génère des profils utilisateurs complets avec données fictives",
    version="1.0.0"
)

API_KEY = 'b4a95ecc867f4c6496b36e35bb43e654'
TIMEOUT = 5

def safe_call(func):
    try:
        return func()
    except Exception as e:
        return {"error": str(e)}

def fetch_random_user():
    res = requests.get('https://randomuser.me/api/?nat=fr', timeout=TIMEOUT)
    data = res.json()['results'][0]
    return {
        'name': f'{data["name"]["first"]} {data["name"]["last"]}',
        'email': data['email'],
        'gender': data['gender'],
        'location': f'{data["location"]["city"]}, {data["location"]["country"]}',
        'picture': data['picture']['large']
    }

def fetch_phone():
    res = requests.get('https://randommer.io/api/Phone/Generate?CountryCode=FR&Quantity=1',
                       headers={'X-Api-Key': API_KEY}, timeout=TIMEOUT)
    return res.json()[0]

def fetch_iban():
    res = requests.get('https://randommer.io/api/Finance/Iban/FR',
                       headers={'X-Api-Key': API_KEY}, timeout=TIMEOUT)
    return res.json()

def fetch_cb():
    res = requests.get('https://randommer.io/api/Card',
                       headers={'X-Api-Key': API_KEY}, timeout=TIMEOUT)
    card = res.json()
    return {
        'card_number': card['cardNumber'],
        'card_type': card['type'],
        'expiration_date': card['date'],
        'cvv': card['cvv']
    }

def fetch_name():
    res = requests.get('https://randommer.io/api/Name?nameType=firstname&quantity=1',
                       headers={'X-Api-Key': API_KEY}, timeout=TIMEOUT)
    return res.json()[0]

def fetch_pet():
    res = requests.get('https://dog.ceo/api/breeds/image/random', timeout=TIMEOUT)
    return res.json()['message'].split('/')[-2]

def fetch_quote():
    res = requests.get('https://api.quotable.io/random', timeout=TIMEOUT)
    data = res.json()
    return {'content': data['content'], 'author': data['author']}

def fetch_joke():
    res = requests.get('https://v2.jokeapi.dev/joke/Programming?type=single', timeout=TIMEOUT)
    data = res.json()
    return {'type': data['category'], 'content': data['joke']}

@app.get("/", tags=["Root"])
def root():
    """Page d'accueil de l'API"""
    return {"message": "Bienvenue sur Profile Generator API", "docs": "/docs"}

@app.get("/pipeline", tags=["Profile"], summary="Génère un profil complet")
def create_full_profile():
    """
    Génère un profil utilisateur complet avec :
    - Informations personnelles (nom, email, photo)
    - Numéro de téléphone français
    - IBAN français
    - Carte bancaire
    - Nom aléatoire
    - Race de chien
    - Citation inspirante
    - Blague de programmation
    """
    return {
        'user': safe_call(fetch_random_user),
        'phone_number': safe_call(fetch_phone),
        'iban': safe_call(fetch_iban),
        'credit_card': safe_call(fetch_cb),
        'random_name': safe_call(fetch_name),
        'pet': safe_call(fetch_pet),
        'quote': safe_call(fetch_quote),
        'joke': safe_call(fetch_joke)
    }

@app.get("/user", tags=["Profile"], summary="Utilisateur aléatoire")
def get_user():
    """Génère uniquement un utilisateur français aléatoire"""
    return safe_call(fetch_random_user)

@app.get("/phone", tags=["Profile"], summary="Téléphone français")
def get_phone():
    """Génère un numéro de téléphone français"""
    return {"phone": safe_call(fetch_phone)}

@app.get("/iban", tags=["Profile"], summary="IBAN français")
def get_iban():
    """Génère un IBAN français"""
    return {"iban": safe_call(fetch_iban)}

@app.get("/card", tags=["Profile"], summary="Carte bancaire")
def get_card():
    """Génère une carte bancaire fictive"""
    return safe_call(fetch_cb)

@app.get("/joke", tags=["Fun"], summary="Blague de programmation")
def get_joke():
    """Retourne une blague de programmation aléatoire"""
    return safe_call(fetch_joke)

@app.get("/quote", tags=["Fun"], summary="Citation")
def get_quote():
    """Retourne une citation inspirante"""
    return safe_call(fetch_quote)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)