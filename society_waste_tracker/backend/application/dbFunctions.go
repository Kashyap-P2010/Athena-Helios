package api

import (
	"database/sql"
	"errors"
	"log"
	"net/http"
	"time"
)

type ApartmentAuthInput struct {
	ApartmentName string
	Password      string
}

type ResidentAuthInput struct {
	FlatNumber    string
	ApartmentName string
	Password      string
}

func (app *Application) RegisterApartment(a ApartmentAuthInput) (bool, error) {
	queryCheckApartment := `select id from apartments where apartment_name=$1`
	row := app.DB.QueryRow(queryCheckApartment, a.ApartmentName)

	var id int
	err := row.Scan(&id)
	if err == nil {
		return false, errors.New("this apartment already exists")
	}

	password := app.HashPassword(a.Password)

	insertApartmentQuery := `insert into apartments(apartment_name, password, created_at, updated_at) values($1, $2, $3, $4)`
	_, err = app.DB.Exec(insertApartmentQuery, a.ApartmentName, password, time.Now(), time.Now())
	if err != nil {
		return false, err
	}

	return true, nil
}

func (app *Application) LoginApartment(a ApartmentAuthInput) (Apartment, error) {
	queryGetApartment := `select * from apartments where apartment_name=$1`
	row := app.DB.QueryRow(queryGetApartment, a.ApartmentName)

	var apartmentUser Apartment
	err := row.Scan(&apartmentUser.ID, &apartmentUser.ApartmentName, &apartmentUser.Password, &apartmentUser.CreatedAt, &apartmentUser.UpdatedAt)
	if err != nil && err == sql.ErrNoRows {
		return Apartment{}, errors.New("incorrect credentials")
	} else if err != nil && err != sql.ErrNoRows {
		return Apartment{}, err
	}

	if app.CompareHashPassword([]byte(apartmentUser.Password), []byte(a.Password)) != nil {
		return Apartment{}, errors.New("incorrect credentials")
	}

	return apartmentUser, nil
}

func (app *Application) RegisterResident(r ResidentAuthInput) (bool, error) {
	queryGetApartmentId := `select id from apartments where apartment_name=$1`
	row_get_apt_id := app.DB.QueryRow(queryGetApartmentId, r.ApartmentName)

	var apartment_id int
	err := row_get_apt_id.Scan(&apartment_id)
	if err != nil {
		log.Println(err)
		return false, errors.New("this apartment does not exist")
	}

	queryCheckApartment := `select id from residents where flat_number=$1 and apartment_id=$2`
	row := app.DB.QueryRow(queryCheckApartment, r.FlatNumber, apartment_id)

	var id int
	err = row.Scan(&id)
	if err == nil {
		return false, errors.New("this resident already exists")
	}

	password := app.HashPassword(r.Password)

	var lastID int

	currentMonth := time.Now().Month().String()

	insertResidentQuery := `insert into residents(flat_number, apartment_id, password, created_at, updated_at) values($1, $2, $3, $4, $5) returning id`
	_ = app.DB.QueryRow(insertResidentQuery, r.FlatNumber, apartment_id, password, time.Now(), time.Now()).Scan(&lastID)

	createEmptyWasteRowQuery := `insert into wastes(waste_generated, month, resident_id, apartment_id, created_at, updated_at) values($1, $2, $3, $4, $5, $6)`
	_, err = app.DB.Exec(createEmptyWasteRowQuery, 0, currentMonth, lastID, apartment_id, time.Now(), time.Now())
	if err != nil {
		return false, err
	}

	return true, nil
}

func (app *Application) LoginResident(r ResidentAuthInput) (Resident, error) {
	queryGetApartmentId := `select id from apartments where apartment_name=$1`
	row_get_apt_id := app.DB.QueryRow(queryGetApartmentId, r.ApartmentName)

	var apartment_id int
	err := row_get_apt_id.Scan(&apartment_id)
	if err != nil {
		return Resident{}, err
	}

	queryGetResident := `select * from residents where flat_number=$1 and apartment_id=$2`
	row := app.DB.QueryRow(queryGetResident, r.FlatNumber, apartment_id)

	var residentUser Resident
	err = row.Scan(&residentUser.ID, &residentUser.FlatNumber, &residentUser.ApartmentID, &residentUser.Password, &residentUser.CreatedAt, &residentUser.UpdatedAt)
	if err != nil && err == sql.ErrNoRows {
		return Resident{}, errors.New("incorrect credentials")
	} else if err != nil && err != sql.ErrNoRows {
		return Resident{}, err
	}

	if app.CompareHashPassword([]byte(residentUser.Password), []byte(r.Password)) != nil {
		return Resident{}, errors.New("incorrect credentials")
	}

	return residentUser, nil
}

func (app *Application) GetMonthlyWastesApartment(w http.ResponseWriter, id int, month string) ([]ApartmentWastes, error) {
	queryGetWastes := `select resident_id, waste_generated from wastes where apartment_id=$1 and month=$2`
	rows, err := app.DB.Query(queryGetWastes, id, month)
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return []ApartmentWastes{}, err
	}

	var wastePerMonthList []ApartmentWastes

	for rows.Next() {
		var residentID string
		var wasteGenerated int

		_ = rows.Scan(&residentID, &wasteGenerated)

		var flatNumber string
		queryGetFlatNumber := `select flat_number from residents where id=$1`
		row := app.DB.QueryRow(queryGetFlatNumber, residentID)
		_ = row.Scan(&flatNumber)

		wastePerMonthList = append(wastePerMonthList, ApartmentWastes{
			ID:          id,
			FlatNumber:  flatNumber,
			WasteAmount: wasteGenerated,
			Month:       month,
		})
	}

	return wastePerMonthList, nil
}

func (app *Application) ApartmentMonthlyLeaderboardFunc(month string) ()