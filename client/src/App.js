import './App.css';

import React, { useState, useEffect } from 'react';

function App() {

  const [parameters, setParameters] =useState([]);//מערך לשמור את הנתונים מהשרת
  const [altitude, setAltitude] = useState('');
  const [HSI, setHSI] = useState('');
  const [ADI, setADI]= useState('');
  const latest = parameters.length > 0 ? parameters[parameters.length - 1] : { altitude: '', HSI: '', ADI: '' };

  const [viewMode, setViewMode] = useState('text');//מצב תצוגה
  const [showForm, setShowForm] = useState(false);//האם הטופס להזנת נתונים פתוח
//   ומר הודעת שגיאה אם הערך לא תקין בדיקת תקינות קלט
const [altitudeError, setAltitudeError]= useState('');
const [HSIError, setHSIError] = useState('');
const [adiError, setAdiError] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault(); // מונע רענון של הדף
    //ממיר למספר בשביל  לבדוק ולידציה של הקלט
  const alt= Number(altitude);
  const hsi= Number(HSI);
  const adi= Number(ADI);

  let isValid = true;
  if(alt < 0 || alt> 3000) {isValid = false;}
  if(hsi<0||hsi > 360) {isValid = false;}
  if (adi < -100 || adi >100) {
    isValid = false;
  }
//אם כל הערכים תקינים
  if (!isValid) { return;}
    const newParameter = {
      altitude: Number(altitude),
      HSI: Number(HSI),
      ADI: Number(ADI)
    };
  
    //לשלוח את הנתונים לשרת בעזרת בקשת POST ולעדכן את הנתונים שמוצגים 
    fetch('http://localhost:5000/api/parameters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'//מגדיר שהמידע שנשלח הוא בפורמט JSON
      },
      body: JSON.stringify(newParameter)//newParameter שבתוכו שלושת הנתונים למחרוזת JSOM כדי לשלוח לשרת הופכים את האובייקט 
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Data submitted successfully:', data);
        setParameters([...parameters, data]); //מוסיף את הנתון החדש לרשימת הנתונים בתצוגה
        setAltitude('');//מאפס את השדות של הקלט בטופס
        setHSI('');
        setADI('');
      })
      .catch((err) =>{
        console.error('Error submitting data:', err);
      });
  };
  // מביאה את הנתונים מהשרת ושומר אותם בstate parameters נטען אוטומטית כשהקומפוננטה נטענת
  useEffect(() => {
    fetch('http://localhost:5000/api/parameters')
    .then(response => response.json())
    .then(data =>{
      setParameters(data);//stateשומר את התוצאה ב  
    })
    .catch(err =>{
      console.error('Error fetching data', err)
    })
  })

  return (
    <div className="App">
      <div className="top-buttons">
        <button className={viewMode=== 'text' ? 'tab active' : 'tab'}//כפתור טקסט
        onClick={() =>setViewMode('text')}>TEXT</button> 
        <button className={viewMode==='visual' ? 'tab active' : 'tab'}//כפתור להצגה ויזואלית
        onClick={()=>setViewMode('visual')}>VISUAL</button>
        {!showForm && (// הפלוס לא יופיע אם הטופס פתוח
          <button onClick={() => setShowForm(prev => !prev)/*מחליף בין true וfalse כל פעם לוחצים וזה מתהפך */}>+</button>
        )}

          </div>
         { /*להציג את העמוד להזנת נתוני*/}
          {showForm && (
  <div className="modal-overlay" onClick={() => setShowForm(false)}>
    <div className="input-form" onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
        {altitudeError && <div className="error-message">{altitudeError}</div>}

          <label>Altitude:</label>
          <input type="number"
            value={altitude}
            onChange={(e) => {
              const value = Number(e.target.value); //הופך את הערך מהקלט למספר
              setAltitude(value);//שומר את הערך שהוזן בstate של altitude

              if(value < 0 || value > 3000) {//בודק אם בטווח
                 setAltitudeError('Altitude must be between 0 and 3000');
              }else {
                setAltitudeError('');
              }
           }}
        />

        </div>
        {/*     לוודא שבטווח להזנת HSI*/}
        <div className="form-row">
        {HSIError && <div className="error-message">{HSIError}</div>}

          <label>HSI:</label>
          <input
            type= "number"
            value={HSI}
            onChange={(e) =>{
              const value =Number(e.target.value);
              setHSI(value);
               if(value < 0 || value > 360) {
               setHSIError('HSI must be between 0 and 360');//הודעת שגיאה אם לא בטווח
               }else {
               setHSIError('');
               }
             }}
          />
        </div>

        {/*    קלט ADI ולוודא שבטווח */}
        <div className="form-row">
          <label>ADI:</label>
          <input type="number"
            value={ADI}
            onChange={(e) =>{
              const value= Number(e.target.value);
              setADI(value);
              if(value < -100 || value > 100) {
                setAdiError('ADI must be between -100 and 100');
              } else{
              setAdiError('');
              }
            }}
         />
        </div>

        {adiError && <div className="error-message">{adiError}</div>}

        <button type="submit">send</button>

        </form>
      </div>
   </div>
  )}

      {viewMode === 'text' && (
        //כשלוחצים על הכפתור טקסט מוצגים שלושה עיגולים עם הנתונים 
        <div className="text-display">
        <div className="circle">
          <div className="label">Altitude</div>
          <div className="value">{latest.altitude}</div>
        </div>
        <div className="circle">
          <div className="label">HSI</div>
          <div className="value">{latest.HSI}</div>
        </div>
        <div className="circle">
          <div className="label">ADI</div>
          <div className="value">{latest.ADI}</div>
        </div>
      </div>
      )}

{viewMode === 'visual' && (
  <div className="visual-display">
    
    {/* Altitude */}
    <div className="altitude-display">
      <div className="scale-container">
        <div className="scale">
          <div className="labels">
            <div style={{bottom:'98%'}}>3000</div>
            <div style={{bottom:'66.6%'}}>2000</div>
            <div style={{bottom: '33.3%'}}>1000</div>
            <div style={{bottom: '3%', left:'23px' }}>0</div>
          </div>
          
          <div className="altitude-line"
            style={{
              bottom: `${(latest.altitude / 3000) * 100}%`
            }}
          ></div>

          <div className="altitude-arrow"
            style={{
              bottom: `${(latest.altitude / 3000) * 100}%`
            }}
          >
            ➤
          </div>
        </div>
      </div>
    </div>

    {/* HSI*/}
    <div className="HSI-display">
      <div className="degree-container">
        <img
          src="/images/HSIDegree.png"
          style={{ transform:`rotate(${latest.HSI-90}deg)` }}
          alt="degree"
          className="degree"
        />
        <img
          src="/images/HSIArrow.png"
          alt="arrow"
          className="arrow"
        />
        
      </div>
    </div>

    {/* ADI*/}
{/*   אני מניחה שבין 0 ל 100 מההבנה שלי של הרכיב במטוס העיגול יהיה צבוע בחלקו בירוק ובחלקו האחר בכחול לדוגמא אם 
ADI=50 הוא יהיה צבוע בחציו התחתון בירוק ובעליון בכחול בהתאם לזווית האופק*/}
<div className="ADI-display">
    <div className="ADI-circle"
      style={{
        background: `linear-gradient(to top, green ${100- latest.ADI}%,
         blue ${100 - latest.ADI}%)`}}//ירוק למטה כחול למעלה, רקע דינאמי משתנה בהתאם לקלט
        ></div>
       </div>
  </div>
)}
    </div>
  );
}

export default App;
