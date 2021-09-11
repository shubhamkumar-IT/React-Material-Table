import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import "./App.css";
import axios from "axios";
import { forwardRef } from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const App = () => {
  const [user, setUser] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  let columns = [
    {
      title: "NAME",
      field: "name",
      validate: (rowData) => (rowData.name === undefined ? "Required" : true),
    },
    {
      title: "USERNAME",
      field: "username",
      validate: (rowData) =>
        rowData.username === undefined ? "Required" : true,
    },
    {
      title: "EMAIL",
      field: "email",
      validate: (rowData) => (rowData.email === undefined ? "Required" : true),
    },
    {
      title: "PHONE",
      field: "phone",
      validate: (rowData) => (rowData.phone === undefined ? "Required" : true),
    },
    {
      title: "WEBSITE",
      field: "website",
      validate: (rowData) =>
        rowData.website === undefined ? "Required" : true,
    },
  ];

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/users`).then((res) => {
      const users = res.data;
      setUser(users);
    });
  }, []);

  const handleRowUpdate = (newData, oldData, resolve) => {
    let errorList = [];
    if (newData.name === "") {
      errorList.push("Try Again, You didn't enter the name field");
    }
    if (newData.username === "") {
      errorList.push("Try Again, You didn't enter the Username field");
    }

    if (newData.phone === "") {
      errorList.push("Try Again, Phone number field can't be blank");
    }
    if (newData.website === "") {
      errorList.push("Try Again, Enter website url before submitting");
    }

    if (errorList.length < 1) {
      axios
        .put(
          `https://jsonplaceholder.typicode.com/users/${newData.id}`,
          newData
        )
        .then((response) => {
          const updateUser = [...user];
          const index = oldData.tableData.id;
          updateUser[index] = newData;
          setUser([...updateUser]);
          resolve();
          setIserror(false);
          setErrorMessages([]);
        })
        .catch((error) => {
          setErrorMessages(["Update failed! Server error"]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    }
  };

  const handleRowDelete = (oldData, resolve) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/users/${oldData.id}`)
      .then((response) => {
        const dataDelete = [...user];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setUser([...dataDelete]);
        resolve();
      })
      .catch((error) => {
        setErrorMessages(["Delete failed! Server error"]);
        setIserror(true);
        resolve();
      });
  };

  const handleRowAdd = (newData, resolve) => {
    let errorList = [];
    if (newData.name === "") {
      errorList.push("Try Again, You didn't enter the name field");
    }
    if (newData.username === "") {
      errorList.push("Try Again, You didn't enter the Username field");
    }

    if (newData.phone === "") {
      errorList.push("Try Again, Phone number field can't be blank");
    }
    if (newData.website === "") {
      errorList.push("Try Again, Enter website url before submitting");
    }

    if (errorList.length < 1) {
      axios
        .post(`https://jsonplaceholder.typicode.com/users`, newData)
        .then((response) => {
          let newUserdata = [...user];
          newUserdata.push(newData);
          setUser(newUserdata);
          resolve();
          setErrorMessages([]);
          setIserror(false);
        })
        .catch((error) => {
          setErrorMessages(["Cannot add data. Server error!"]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    }
  };

  return (
    <div className="app">
      <h1>React Material Table</h1> <br />
      <br />
      <MaterialTable
        title="User Details"
        columns={columns}
        data={user}
        icons={tableIcons}
        options={{
          headerStyle: {
            borderBottomColor: "red",
            borderBottomWidth: "3px",
            fontFamily: "verdana",
          },
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              handleRowUpdate(newData, oldData, resolve);
            }),
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              handleRowAdd(newData, resolve);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              handleRowDelete(oldData, resolve);
            }),
        }}
      />
      <div>
        {iserror && (
          <Alert severity="error">
            <AlertTitle>ERROR</AlertTitle>
            {errorMessages.map((msg, i) => {
              return <div key={i}>{msg}</div>;
            })}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default App;
