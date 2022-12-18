const express = require("express");
const router = express.Router();
const fs = require("fs");

//* Change to date format
function dateConversion(inputdate, time) {
  //   console.log("Input date: ", input);
  const splitdate = inputdate.split("-");
  const datearr = [
    Number(splitdate[0]),
    Number(splitdate[1]),
    Number(splitdate[2]),
  ];

  const split_time = time.split(":");

  const newdate = new Date(
    Number(datearr[0]),
    Number(datearr[1] - 1),
    Number(datearr[2]),
    split_time[0],
    split_time[1],
    split_time[2]
  );

  //   console.log("Output date: ", newdate);

  return newdate;
}

//* Rearrange data for frontend calendar app to use
function arrangeData(data) {
  // {
  //   uuid: 'e44aac85-db90-4a69-af25-dd965e13d97b',
  //   status: 'CONFIRMED',
  //   date: '2022-11-01',
  //   start_time: '10:30:00',
  //   end_time: '12:30:00',
  //   user_uuid: 'e7f9a9c8-ac87-402a-8b01-eefa99f0920f',
  //   name: 'Meeting Room 6-1-1',
  //   code: 'HSO_COLAB_WD_Meeting Room 6-1-1',
  //   type: 'MEETING ROOM'
  // },
  const newdate = dateConversion(data.date, data.start_time, data.end_time);

  const newdata = {
    title: data.code,
    start: dateConversion(data.date, data.start_time),
    end: dateConversion(data.date, data.end_time),
    uuid: data.uuid,
    status: data.status,
    start_time: data.start_time,
    end_time: data.end_time,
    location: data.name,
    type: data.type,
  };

  return newdata;
}

//* Changes the csv to array of objects
function csvToArray(str, delimiter = ",") {
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });
  return arr;
}

//* Get all calendars
router.get("/", async (req, res) => {
  try {
    const getData = async () => {
      const newdata = [];
      fs.readFile("./assets/colab.csv", "utf-8", function (err, csv) {
        const data = csvToArray(csv);
        // console.log("File read successfully");
        for (let i of data) {
          if (i.status !== undefined) {
            newdata.push(arrangeData(i));
          }
        }
        fs.readFile("./assets/itcd.csv", "utf-8", function (err, csv) {
          const data = csvToArray(csv);
          //   console.log("File read successfully");
          for (let i of data) {
            if (i.status !== undefined) {
              newdata.push(arrangeData(i));
            }
          }
          fs.readFile("./assets/xcolab.csv", "utf-8", function (err, csv) {
            const data = csvToArray(csv);
            // console.log("File read successfully");
            for (let i of data) {
              if (i.status !== undefined) {
                newdata.push(arrangeData(i));
              }
            }
            fs.readFile("./assets/xitcd.csv", "utf-8", function (err, csv) {
              const data = csvToArray(csv);
              //   console.log("File read successfully");
              for (let i of data) {
                if (i.status !== undefined) {
                  newdata.push(arrangeData(i));
                }
              }
              //   console.log("Newdata sending?");
              //   console.log(newdata);
              res.send({ status: 200, payload: newdata });
            });
          });
        });
      });
    };
    getData();
  } catch {
    res.send({ status: 500, payload: "Server side error" });
  }
});

module.exports = router;
