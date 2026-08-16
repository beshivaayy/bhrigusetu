from datetime import date, time
from pydantic import BaseModel, Field

class BirthDetails(BaseModel):
    date_of_birth: date
    time_of_birth: time
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    timezone: str = "Asia/Kolkata"
