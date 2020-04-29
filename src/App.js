import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import $ from 'jquery';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';

//we gaan uit van geen filters
var filter = '';

//zorgt voor bruikbare LAT / LONG data in de result set (voor google maps)
var latlong_addon = '&srsName=EPSG:4326';

var table_headers = [];

function doeDeJSON(postcode) {
    $('#spinner').show();

    filter = "&cql_filter=(postcode = '" + postcode +"')";

    var link = "https://geodata.nationaalgeoregister.nl/bag/wfs?service=WFS&request=GetFeature&typeName=bag:verblijfsobject&count=100&outputFormat=json" + latlong_addon + filter;

    var jqxhr = $.getJSON(link);

    jqxhr.done(function() {
        $('#spinner').hide();
        //console.log(jqxhr.responseJSON.features);

        //console.log(jqxhr.responseJSON.features[0].properties);

        for(var prop in jqxhr.responseJSON.features[0].properties) {
            if(prop !== 'pandgeometrie') {
                table_headers.push(prop);
            }
        }

        var rows = jqxhr.responseJSON.features;

        console.log(rows);



        //console.log(table_header);
    });

}


function handlePost() {
    var postcode = $('#postcode').val().replace(/ /g,'').toUpperCase();

    if (!postcode.match(/^[1-9]\d{3}[A-Z]{2}$/)) {
        $('#postcode').css('color', 'red');
        postcode = false;
    } else {
        $('#postcode').css('color', 'white');
        doeDeJSON(postcode);
    }

    return postcode;
}

function App() {

    const useEffect = () => {
        console.log('effects work');
    };

    const useStyles = makeStyles((theme: Theme) =>
      createStyles({
        root: {
          display: 'flex',
          '& > * + *': {
            marginLeft: theme.spacing(2),
          },
        },
      }),
    );

    const classes = useStyles();

    return (

    <div className="App">

      <header className="App-header">      
            
        <TextField id="postcode" label="Postcode" variant="filled" placeholder="1234 AA" />
        <Button className="square" onClick={handlePost} >zoek</Button>

        <div className={classes.root} id="spinner">
            <CircularProgress color="secondary" />
        </div>

      </header>
    </div>
    );
}

export default App;
