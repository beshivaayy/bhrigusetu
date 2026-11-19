from datetime import date, time, datetime
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator
from .astronomy.time import resolve_local_datetime

class BirthDetails(BaseModel):
    model_config = ConfigDict(extra="forbid")
    date_of_birth: date
    time_of_birth: time
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    timezone: str = Field(default="Asia/Kolkata", min_length=1, max_length=64)
    time_fold: int | None = Field(default=None, ge=0, le=1)
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
    def validate_birth_datetime_and_analysis_date(self):
        if self.as_of_date and self.as_of_date < self.date_of_birth:
            raise ValueError("as_of_date cannot be before date_of_birth")
        if self.time_of_birth.tzinfo is not None:
            raise ValueError("time_of_birth must be a local wall time without a UTC offset")
        resolve_local_datetime(
            self.date_of_birth,
            self.time_of_birth,
            self.timezone,
            self.time_fold,
        )
        return self

    def resolved_birth_datetime(self) -> datetime:
        return resolve_local_datetime(
            self.date_of_birth,
            self.time_of_birth,
            self.timezone,
            self.time_fold,
        )
