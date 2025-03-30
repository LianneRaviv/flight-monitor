
function TextView({ parameters }){

    const latest = parameters[parameters.length - 1]; // הפריט האחרון שהוזן

    return(
        <div>
            <p>Altitude: {latest.altitude}</p>
            <p>HIS: {latest.HIS}</p>
            <p>ADI: {latest.ADI}</p>
        </div>
    );
}