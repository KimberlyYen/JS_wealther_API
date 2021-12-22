fetch(
  "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=CWB-1E70461D-B346-4378-A55A-DB337F9BD7C5"
)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    pullAlldata(data);
    findTempMin(data);
    findMountain(data);
    findRainTop(data);
  })
  .catch(function (err) {
    console.log(err);
  });

fetch(
  "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-063?Authorization=CWB-1E70461D-B346-4378-A55A-DB337F9BD7C5&format=JSON&locationName=%E5%85%A7%E6%B9%96%E5%8D%80&elementName"
)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    expectFutureMaxT(data);
  })
  .catch(function (err) {
    console.log(err);
  });

// All data
function pullAlldata(data) {
  const location = data.records.location;
  return location;
}

// Exam One
function findTempMin(data) {
  const location = pullAlldata(data);
  const newTempArray = [];

  for (i = 0; i < location.length; i++) {
    const time = location[i].time.obsTime;
    let city = location[i].parameter[0].parameterValue;
    let town = location[i].parameter[2].parameterValue;
    let locationName = location[i].locationName;
    let temp = location[i].weatherElement[3].elementValue;
    let lon = location[i].lon;
    let lat = location[i].lat;

    // Push
    newTempArray.push({ time, city, town, locationName, temp, lon, lat });

    // Sort
    newTempArray.sort(function (a, b) {
      return a.temp - b.temp;
    });
  }
  // Filter
  let filterNewTempArray = newTempArray.filter((e) => e.temp !== "-99");
  document.getElementById("examOne_answer").innerHTML = `
  <li><span>自動氣象站資料-無人自動站氣象資料</span></li>
  <li><span>觀測資料時間</span> ${filterNewTempArray[0].time}</li>
  <li><span>縣市</span> ${filterNewTempArray[0].city}</li>
  <li><span>鄉鎮</span> ${filterNewTempArray[0].town}</li>
  <li><span>測站名稱</span> ${filterNewTempArray[0].locationName}</li>
  <li><span>溫度</span><span> ${filterNewTempArray[0].temp}</span></li>
  <li><span>緯度</span> ${filterNewTempArray[0].lat}</li>
  <li><span>經度</span> ${filterNewTempArray[0].lon}</li>
  `;
}

// Exam Two
function findMountain(data) {
  const location = pullAlldata(data);
  const five = []; // 0 - 500
  const one = []; // - 1000
  const oneFive = []; // - 1500
  const two = []; // - 2000
  const twoFive = []; // - 2500
  const three = []; // - 3000
  const threeFive = []; // - 3500
  const four = []; //8. - 4000

  for (i = 0; i < location.length; i++) {
    let elve = location[i].weatherElement[0].elementValue;
    let temp = location[i].weatherElement[3].elementValue;
    let city = location[i].parameter[0].parameterValue;
    let town = location[i].parameter[2].parameterValue;
    const newElve = Math.floor(elve / 500) * 500;
    let obj = Object.assign({ newElve, temp, city, town });

    if (obj.newElve < 500 && obj.temp !== "-99") {
      five.push(obj);
    } else if (obj.newElve < 1000 && obj.temp !== "-99") {
      one.push(obj);
    } else if (obj.newElve < 1500 && obj.temp !== "-99") {
      oneFive.push(obj);
    } else if (obj.newElve < 2000 && obj.temp !== "-99") {
      two.push(obj);
    } else if (obj.newElve < 2500 && obj.temp !== "-99") {
      twoFive.push(obj);
    } else if (obj.newElve < 3000 && obj.temp !== "-99") {
      three.push(obj);
    } else if (obj.newElve < 3500 && obj.temp !== "-99") {
      threeFive.push(obj);
    } else if (obj.newElve < 4000 && obj.temp !== "-99") {
      four.push(obj);
    }
  }
  
  // sort
  const newArray = [five, one, oneFive, two, twoFive, three, threeFive, four]
  for (i = 0 ; i < newArray.length ; i++) {
    newArray[i].sort(function (a, b) {
      return a.temp - b.temp;
    })
  }

  document.getElementById("examTwo_answer").innerHTML = `
  <li>500 公尺以下<span>     ${five[0].city} ${five[0].town} 溫度 ${five[0].temp}度 </span></li>
  <li>500 - 1000公尺<span>  ${one[0].city} ${one[0].town} 溫度${one[0].temp}度 </span></li>
  <li>1000 - 1500公尺<span> ${oneFive[0].city} ${oneFive[0].town} 溫度${oneFive[0].temp}度 </span></li>
  <li>1500 - 2000公尺<span> ${two[0].city} ${two[0].town} 溫度${two[0].temp}度 </span></li>
  <li>2000 - 2500公尺<span> ${twoFive[0].city} ${twoFive[0].town} 溫度${twoFive[0].temp}度 </span></li>
  <li>2500 - 3000公尺<span> ${three[0].city} ${three[0].town} 溫度${three[0].temp}度 </span></li>
  <li>3000 - 3500公尺<span> ${threeFive[0].city} ${threeFive[0].town} 溫度${threeFive[0].temp}度 </span></li>
  <li>3500 公尺以上<span>${four[0].city} ${four[0].town} 溫度 ${four[0].temp}度 </span></li>
  `;
}

// Exam Three
function findRainTop(data) {
  let pullAlldataArray = pullAlldata(data);
  let array = [];

  // Get the name and value become an object and put in array
  for (i = 0; i < pullAlldataArray.length; i++) {
    let res = pullAlldataArray[i].parameter[0];
    let rainValue = pullAlldataArray[i].weatherElement[6];
    let obj = Object.assign({}, res, rainValue);
    array.push(obj);
  }
  // Rank
  array.sort(function (a, b) {
    return b.elementValue - a.elementValue;
  });

  for (var i = 0; i < 20; i++) {
    array[i].rank = i + 1;
    document.getElementById("examThree_answer").innerHTML += `
    <li>
      <span class="rankList">
        ${array[i].rank} &ensp;
      </span>
        ${array[i].parameterName}
        ${array[i].parameterValue}
        ${array[i].elementName}
      <span class="lowTemp">
        ${array[i].elementValue}
      <span>
    </li>
    `;
  }
}

// Exam Four
function expectFutureMaxT(data) {
  const weatherElement = data.records.locations[0].location[0].weatherElement;
  const maxDescription = weatherElement[12].description;
  const minDescription = weatherElement[8].description;
  const maxTempObject = weatherElement[12].time;
  const minTempObject = weatherElement[8].time;
  const maxTArray = [];
  const minTArray = [];
  const gapTArray = [];

  function findTheMaxT() {
    for (i = 0; i < maxTempObject.length; i++) {
      let maxTObjectValue = maxTempObject[i].elementValue[0].value;
      maxTArray.push(maxTObjectValue);
    }
    const max = Math.max(...maxTArray);
    return max;
  }

  function findTheMinT() {
    for (i = 0; i < minTempObject.length; i++) {
      let minTObjectValue = minTempObject[i].elementValue[0].value;
      minTArray.push(minTObjectValue);
    }
    const min = Math.min(...minTArray);
    return min;
  }
  const findTheMinTtemp = findTheMinT(data);
  const findTheMaxTtemp = findTheMaxT(data);

  function findTGap() {
    for (i = 0; i < maxTempObject.length; i++) {
      let maxTObjectValue = maxTempObject[i].elementValue[0].value;
      let minTObjectValue = minTempObject[i].elementValue[0].value;
      gapTArray.push(maxTObjectValue - minTObjectValue);
    }
    const max = Math.max(...gapTArray);
    return max;
  }
  let findTempGap = findTGap();

  document.getElementById("examFour_answer").innerHTML = `
  <li><span> 台北市/內湖區 </span></li>
  <li><span> 未來一週氣溫  </span></li>
  <li><span>${minDescription} </span><span> ${findTheMinTtemp} </span></li>
  <li><span>${maxDescription} </span><span> ${findTheMaxTtemp} </span></li>
  <li><span> 單日溫差最大 </span><span> 攝氏度 ${findTempGap}     </span></li>
  `;
}
