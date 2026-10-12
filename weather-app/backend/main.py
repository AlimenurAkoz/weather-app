from typing import Annotated

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Hava Durumu API'si")

# Tarayicidaki Angular bu API'ye istek atabilsin diye CORS izni veriyoruz. Sadece okuma (GET) yetiyor.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


# Turkce harfleri temizleme islemi
TR_MAP = str.maketrans("ıİğĞüÜşŞöÖçÇ", "iIgGuUsSoOcC")


def normalize(text: str) -> str:
    return text.strip().translate(TR_MAP).lower()

#veri tipi tanimlari
class Weather(BaseModel):
    city: str
    temperature: float
    description: str
    humidity: int = Field(ge=0, le=100) #nem


#Ornek veri
SAMPLE_DATA = [
    Weather(city="Isparta", temperature=18, description="Parçalı bulutlu", humidity=45),
    Weather(city="Ankara", temperature=15, description="Açık", humidity=38),
    Weather(city="Antalya", temperature=26, description="Güneşli", humidity=60),
    Weather(city="Konya", temperature=14, description="Rüzgarlı", humidity=35),
    Weather(city="İstanbul", temperature=17, description="Yağmurlu", humidity=72),
    Weather(city="İzmir", temperature=23, description="Güneşli", humidity=50),
]

#Aramayı hızlı yapmak için listeyi sözlüğe çeviriyoruz. 
#Anahtari normalize() ile ürettigimiz icin arama ile kayit eslesir.
CITIES: dict[str, Weather] = {normalize(item.city): item for item in SAMPLE_DATA}


#Endpoint'ler
@app.get("/")
def root():
    return {"mesaj": "Hava durumu API'si çalışıyor"}#Api'nin ayakta olup olmadigini kontrol

#Aranan sehrin bilgilerini getiren GET
@app.get("/weather", response_model=Weather)
def get_weather(city: Annotated[str, Query(min_length=2)]):
    weather = CITIES.get(normalize(city))
    if weather is None:
        raise HTTPException(status_code=404, detail="Şehir bulunamadı")
    return weather


@app.get("/cities", response_model=list[str])
def list_cities():
    return [item.city for item in CITIES.values()]