from datetime import date, time
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

class BirthDetails(BaseModel):
    model_config = ConfigDict(extra="forbid")
    date_of_birth: date
    time_of_birth: time
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    timezone: str = Field(default="Asia/Kolkata", min_length=1, max_length=64)
    place_name: str | None = Field(default=None, max_length=120)
    as_of_date: date | None = None

    @field_validator("timezone")
    @classmethod
    def validate_timezone(cls, value: str) -> str:
        try:
            ZoneInfo(value)
        except (ZoneInfoNotFoundError, ValueError):
            raise ValueError("timezone must be a valid IANA timezone, e.g. Asia/Kolkata")
        return value

    @model_validator(mode="after")
    def validate_analysis_date(self):
        if self.as_of_date and self.as_of_date < self.date_of_birth:
            raise ValueError("as_of_date cannot be before date_of_birth")
        return self
