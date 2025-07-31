package api

import (
	"database/sql"
	"log"
	"net/http"
	"time"
)

func (app *Application) ApartmentLogin(w http.ResponseWriter, r *http.Request) {
	type inputPayloadStruct struct {
		ApartmentName string `json:"apartment_name"`
		Password      string `json:"password"`
	}
	var inputPayload inputPayloadStruct

	app.readJSON(r, &inputPayload)

	user, err := app.LoginApartment(ApartmentAuthInput(inputPayload))
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	var payload = struct {
		User Apartment `json:"user"`
	}{
		User: user,
	}

	app.writeJSON(w, http.StatusOK, payload)
}

func (app *Application) ApartmentRegister(w http.ResponseWriter, r *http.Request) {
	type inputPayloadStruct struct {
		ApartmentName string `json:"apartment_name"`
		Password      string `json:"password"`
	}
	var inputPayload inputPayloadStruct

	app.readJSON(r, &inputPayload)

	check, err := app.RegisterApartment(ApartmentAuthInput(inputPayload))
	if err != nil && !check {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	payload := struct {
		Message string `json:"message"`
	}{
		Message: "Apartment successfully created",
	}

	app.writeJSON(w, http.StatusOK, payload)
}

func (app *Application) ResidentLogin(w http.ResponseWriter, r *http.Request) {
	type inputPayloadStruct struct {
		FlatNumber    string `json:"flat_number"`
		ApartmentName string `json:"apartment_name"`
		Password      string `json:"password"`
	}
	var inputPayload inputPayloadStruct

	app.readJSON(r, &inputPayload)

	user, err := app.LoginResident(ResidentAuthInput(inputPayload))
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	var payload = struct {
		User Resident `json:"user"`
	}{
		User: user,
	}

	app.writeJSON(w, http.StatusOK, payload)
}

func (app *Application) ResidentRegister(w http.ResponseWriter, r *http.Request) {
	type inputPayloadStruct struct {
		FlatNumber    string `json:"flat_number"`
		ApartmentName string `json:"apartment_name"`
		Password      string `json:"password"`
	}
	var inputPayload inputPayloadStruct

	app.readJSON(r, &inputPayload)

	log.Println(inputPayload)

	check, err := app.RegisterResident(ResidentAuthInput(inputPayload))
	if err != nil && !check {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	payload := struct {
		Message string `json:"message"`
	}{
		Message: "Resident account successfully created",
	}

	app.writeJSON(w, http.StatusOK, payload)
}

func (app *Application) ResidentDashboard(w http.ResponseWriter, r *http.Request) {
	type inputPayloadStruct struct {
		ID int `json:"id"`
	}
	var inputPayload inputPayloadStruct

	app.readJSON(r, &inputPayload)
	queryGetDistinct := `select distinct month from wastes where resident_id=$1`
	rowsMonthDistinct, _ := app.DB.Query(queryGetDistinct, inputPayload.ID)

	var months []string
	for rowsMonthDistinct.Next() {
		var month string
		_ = rowsMonthDistinct.Scan(&month)
		months = append(months, month)
	}

	type wastePerMonth struct {
		WasteAmount int    `json:"waste_amount"`
		Month       string `json:"month"`
	}
	var wastePerMonthList []wastePerMonth

	for _, month := range months {
		queryGetWaste := `select waste_generated from wastes where resident_id=$1 and month=$2`
		rowsGetWaste, _ := app.DB.Query(queryGetWaste, inputPayload.ID, month)

		wasteTotal := 0
		for rowsGetWaste.Next() {
			var wasteCurrentRow int
			_ = rowsGetWaste.Scan(&wasteCurrentRow)
			wasteTotal += wasteCurrentRow
		}

		wastePerMonthList = append(wastePerMonthList, wastePerMonth{
			WasteAmount: wasteTotal,
			Month:       month,
		})
	}

	var payload = struct {
		WastePerMonth []wastePerMonth `json:"waste_per_month"`
	}{
		WastePerMonth: wastePerMonthList,
	}

	log.Println(payload)

	app.writeJSON(w, http.StatusOK, payload)
}

func (app *Application) ResidentLogWastes(w http.ResponseWriter, r *http.Request) {
	type inputPayloadStruct struct {
		WasteAmount int    `json:"waste_amount_entered"`
		Month       string `json:"month_entered"`
		ResidentID  int    `json:"resident_id"`
		ApartmentID int    `json:"apartment_id"`
	}
	var inputPayload inputPayloadStruct

	app.readJSON(r, &inputPayload)
	log.Println(inputPayload)

	var id int
	queryAddUpdateWastes := `update wastes set waste_generated=waste_generated+$1 where month=$2 and resident_id=$3 and apartment_id=$4 returning id`
	row := app.DB.QueryRow(queryAddUpdateWastes, inputPayload.WasteAmount, inputPayload.Month, inputPayload.ResidentID, inputPayload.ApartmentID)

	err := row.Scan(&id)
	if err != nil && err == sql.ErrNoRows {
		queryAddWasteLog := `insert into wastes(waste_generated, month, resident_id, apartment_id, created_at, updated_at) values($1, $2, $3, $4, $5, $6)`
		_, err := app.DB.Exec(queryAddWasteLog, inputPayload.WasteAmount, inputPayload.Month, inputPayload.ResidentID,
			inputPayload.ApartmentID, time.Now(), time.Now())

		if err != nil {
			app.errorJSON(w, err, http.StatusBadRequest)
			return
		}

		var payload = struct {
			Message string `json:"success_message"`
		}{
			Message: "Waste Log updated",
		}
		app.writeJSON(w, http.StatusOK, payload)
	} else if err != nil && err != sql.ErrNoRows {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	} else {
		var payload = struct {
			Message string `json:"success_message"`
		}{
			Message: "Waste Log updated",
		}
		app.writeJSON(w, http.StatusOK, payload)
	}
}

func (app *Application) ApartmentDashboard(w http.ResponseWriter, r *http.Request) {
	type inputPayloadStruct struct {
		ID    int    `json:"id"`
		Month string `json:"month"`
	}
	var inputPayload inputPayloadStruct

	app.readJSON(r, &inputPayload)
	log.Println(inputPayload)

	wasteMonthAmount, err := app.GetMonthlyWastesApartment(w, inputPayload.ID, inputPayload.Month)
	if err != nil {
		log.Println(err)
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	var payload = struct {
		Wastes []ApartmentWastes `json:"wastes"`
	}{
		Wastes: wasteMonthAmount,
	}

	app.writeJSON(w, http.StatusOK, payload)
}
