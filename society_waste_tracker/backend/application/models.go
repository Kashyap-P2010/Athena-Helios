package api

import "time"

type Apartment struct {
	ID            int       `json:"id"`
	ApartmentName string    `json:"apartment_name"`
	Password      string    `json:"password"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type ApartmentWastes struct {
	ID          int    `json:"id"`
	FlatNumber  string `json:"flat_number"`
	WasteAmount int    `json:"waste_generated"`
	Month       string `json:"month"`
}

type Resident struct {
	ID          int       `json:"id"`
	FlatNumber  string    `json:"flat_number"`
	ApartmentID int       `json:"apartment_id"`
	Password    string    `json:"password"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
