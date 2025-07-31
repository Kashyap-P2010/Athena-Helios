function HomePage() {
    return (
        <div>
            <h1>HomeScrap</h1>
            <h2>Project Overview</h2>
            <p>The aim to clear waste is much better fulfilled when it becomes a competiton or a race to be the cleanest society. In view of that, we have created the project HomeScrap. It aims to make apartments and societies cleaner by tracking the waste generation of apartments and ranks them on a monthly basis based on how less waste they produce. It also tracks the waste generation of individual residents.</p>
            
            <br />

            <h2>Features</h2>
            <ul className="list-group">
                <li className="list-group-item">Tracks waste generation by apartments/societies based on how less waste they produce</li>
                <li className="list-group-item">Tracks  waste generation by individual residents of apartments</li>
                <li className="list-group-item">Includes admin dashboards for apartment presidents to track total waste generation in their respective apartments</li>
            </ul>

            <br />

            <h2>Tools and Frameworks</h2>
            <ul className="list-group">
                <li className="list-group-item">Go (Golang)</li>
                <li className="list-group-item">ReactJS</li>
                <li className="list-group-item">SQL</li>
                <li className="list-group-item">PostgreSQL</li>
                <li className="list-group-item">Bootstrap</li>
            </ul>
        </div>
    )
}

export default HomePage