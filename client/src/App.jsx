// import './App.css'
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import Dropdown from "./Dropdown";

function App() {
  // console.log("Running");

  const localizer = momentLocalizer(moment);

  const [myEventsList, setmyEventsList] = useState();
  const [visible, setVisible] = useState();
  const [filters, setFilters] = useState({
    status: { value: "All", label: "All" },
    meeting: { value: "All", label: "All" },
    roomType: { value: "All", label: "All" },
  });
  const [selected, setSelected] = useState();

  useEffect(() => {
    //*  Call the api for data
    const call = async () => {
      const response = await axios.get("/api/");
      // console.log("Calling API for data 2");
      if (response.data.status == 200) {
        // console.log("Got the data!");
        const rawdata = structuredClone(response.data.payload);
        for (let i of rawdata) {
          i.start = moment(i.start).toDate();
          i.end = moment(i.end).toDate();
        }
        setmyEventsList(rawdata);
        setVisible(rawdata);
      } else {
        console.log(response);
      }
    };
    // console.log("Calling API for data 1");
    call();
  }, []);

  const handleSelected = (event) => {
    setSelected(event);
    // console.log("Found this event: ", event);
    alert(
      `Title: ${event.title}\nStatus: ${event.status}\nDuration: ${moment(
        event.start
      ).format("Do MMMM YYYY")} - ${moment(event.end).format(
        "Do MMMM YYYY"
      )}\nTime: ${event.start_time} - ${event.end_time}\nLocation: ${
        event.location
      }\nType: ${event.type}`
    );
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    // console.log("Found this event: ", event);
    const backgroundColor = "#" + event.hexColor;
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: "0px",
      opacity: 0.8,
      color: "black",
      border: "0px",
      display: "block",
    };
    if (event.title.includes("HSO_COLAB_WD")) {
      // console.log("COLAB spotted");
      if (event.status == "CONFIRMED") {
        style.backgroundColor = "lightgreen";
      } else {
        style.backgroundColor = "beige";
      }
    } else {
      // console.log("ITCD spotted");
      if (event.status == "CONFIRMED") {
        style.backgroundColor = "blueviolet";
      } else {
        style.backgroundColor = "darkturquoise";
      }
    }
    return { style: style };
  };

  const filterStatus = [
    { value: "All", label: "All" },
    { value: "CONFIRMED", label: "CONFIRMED Status" },
    { value: "CANCELLED", label: "CANCELLED Status" },
  ];

  const filterMeeting = [
    { value: "All", label: "All" },
    { value: "Meeting Room 6-1-1", label: "Meeting Room 6-1-1" },
    { value: "Meeting Room 8-3-1", label: "Meeting Room 8-3-1" },
    { value: "Discussion Room 6-1-2", label: "Discussion Room 6-1-2" },
    { value: "Discussion Room 6-1-3", label: "Discussion Room 6-1-3" },
    { value: "Discussion Room 9-2-1", label: "Discussion Room 9-2-1" },
    { value: "Discussion Room 9-2-2", label: "Discussion Room 9-2-2" },
    { value: "Discussion Room 9-2-3", label: "Discussion Room 9-2-3" },
    { value: "Discussion Room 9-2-4", label: "Discussion Room 9-2-4" },
    { value: "APOLLO", label: "APOLLO" },
    { value: "OCEANUS 6-1-4", label: "OCEANUS 6-1-4" },
    { value: "PERSEUS", label: "PERSEUS" },
  ];

  const filterRoomType = [
    { value: "All", label: "All" },
    { value: "MEETING ROOM", label: "Meeting Rooms" },
    { value: "CONFERENCE ROOM", label: "Conference Rooms" },
    { value: "DISCUSSION ROOM", label: "Discussion Rooms" },
  ];


  useEffect(() => {
    const copiedlist = structuredClone(myEventsList);

    //* Filter Status
    let filterone = [];
    if (filters.status.value !== "All") {
      for (let i of copiedlist) {
        if (i.status == filters.status.value) {
          filterone.push(i);
        }
      }
    } else {
      filterone = structuredClone(copiedlist);
    }

    //* Filter Meeting Room
    let filtertwo = [];
    if (filters.meeting.value !== "All") {
      for (let i of filterone) {
        if (i.location == filters.meeting.value) {
          filtertwo.push(i);
        }
      }
    } else {
      filtertwo = structuredClone(filterone);
    }

    //* Filter Room Type
    let filtered = [];
    if (filters.roomType.value !== "All") {
      for (let i of filtertwo) {
        if (i.type == filters.roomType.value) {
          filtered.push(i);
        }
      }
    } else {
      filtered = structuredClone(filtertwo);
    }

    // console.log("Setting visible");
    setVisible(filtered);
  }, [filters]);

  return (
    <>
      <div>
        <Calendar
          localizer={localizer}
          events={visible}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={handleSelected}
          eventPropGetter={eventStyleGetter}
        />
      </div>
      <div style={{ display: "Flex", flexDirection: "row", width: "100%" }}>
        <div style={{ width: "25%", margin: "3%" }}>
          <p>Status Filter</p>
          <Dropdown
            isSearchable
            placeHolder="All"
            options={filterStatus}
            onChange={(value) => {
              // console.log(value);
              const tempfilter = structuredClone(filters);
              tempfilter.status = value;
              setFilters(tempfilter);
            }}
          ></Dropdown>
        </div>
        <div style={{ width: "25%", margin: "3%" }}>
          <p>Meeting Rooms Filter</p>
          <Dropdown
            isSearchable
            placeHolder="All"
            options={filterMeeting}
            onChange={(value) => {
              // console.log(value);
              const tempfilter = structuredClone(filters);
              tempfilter.meeting = value;
              setFilters(tempfilter);
            }}
          ></Dropdown>
        </div>
        <div style={{ width: "25%", margin: "3%" }}>
          <p>Room Type Filter</p>
          <Dropdown
            isSearchable
            placeHolder="All"
            options={filterRoomType}
            onChange={(value) => {
              // console.log(value);
              const tempfilter = structuredClone(filters);
              tempfilter.roomType = value;
              setFilters(tempfilter);
            }}
          ></Dropdown>
        </div>
      </div>
    </>
  );
}

export default App;
