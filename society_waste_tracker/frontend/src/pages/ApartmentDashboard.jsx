import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"

function ApartmentDashboardPage() {
    const {developmentBackendLink, productionBackendLink, navigate, setErrorAlert, setSuccessAlert} = useOutletContext();

    const [wasteData, setWasteData] = useState([]);
    const user = JSON.parse(sessionStorage.getItem("apartment"))

    const getRecordsSubmit = (event) => {
        event.preventDefault()

        var month = event.target.month_entered.value

        const requestBody = {
            id: Number(user.id),
            month: month,
        }

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        }

        fetch(`${developmentBackendLink}/apartment-dashboard`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error)
                    setErrorAlert(data.error)
                    return
                }
                console.log(data.wastes)
                setWasteData(data.wastes)
            })
    }

    useEffect(() => {
        if (!user) {
            navigate("/")
            return
        }

        console.log(user.id)
    }, [])

    return (
        <div>
            <h1>Apartment Dashboard - {user.apartment_name}</h1>
            <hr />
            <br />

            <div className="waste-table">
                <h3>Waste Generation Records</h3>
                <form onSubmit={getRecordsSubmit} method="post">
                    <select name="month_entered" class="form-select" aria-label="Default select example" style={{"marginTop": "1%"}}>
                        <option selected value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                    </select>
                    <br />

                    <button type="submit" className="btn btn-primary">Get Records</button>
                </form>

                <hr />

                <table className="table table-dark table-striped table-hover">
                    <thead>
                        <tr>
                            <td>Flat Number</td>
                            <td>Waste Generated</td>
                            <td>Month</td>
                        </tr>
                    </thead>
                    <tbody>
                        {wasteData.map((w, index) => (
                            <tr index={index}>
                                <td>{w.flat_number}</td>
                                <td>{w.waste_generated}</td>
                                <td>{w.month}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ApartmentDashboardPage