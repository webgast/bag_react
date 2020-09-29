import React, { useState } from 'react';
//import { findDOMNode } from 'react-dom';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Grid from '@material-ui/core/Grid';

import { makeStyles } from '@material-ui/core/styles';

import $ from 'jquery';

import './App.css';

const App = props => {
    const [state, setState] = useState({
        base_link: 'https://geodata.nationaalgeoregister.nl/bag/wfs/v1_1?service=WFS&request=GetFeature&typeName=bag:verblijfsobject&count=100&outputFormat=json',
        latlong_addon: '&srsName=EPSG:4326',
        version: '&version=2.0.0',
        colkeys: [],
        rows: [],
        adres: '',
    });

    //voor de snackbar
    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    //snackbar styles
    // const snackbarStyles = makeStyles(theme => ({
    // 	root: {
    // 	  width: '100%',
    // 	  '& > * + *': {
    // 		marginTop: theme.spacing(2),
    // 	  },
    // 	},
    // }));

    //voor de spinner
    const circularProgressStyles = makeStyles(theme => ({
        root: {
            display: 'flex',
            '& > * + *': {
                marginLeft: theme.spacing(2),
            },
        },
    }));

    // doet de postcode controle
    // laat de spinner zien
    // laat eventueel een snackbar alert zien
    // roept de haalJSON functie aan
    const postcodeCheck = postcode => {
        $('#table').hide();
        $('#adres').hide();
        $('#spinner').show(200);
        postcode = $('#postcode').val().replace(/ /g, '').toUpperCase();
        if (!postcode.match(/^[1-9]\d{3}[A-Z]{2}$/)) {
            console.log('postcode niet goed');
            $('#spinner').hide(200);
            state.message = 'ongeldige postcode';
            state.severity = 'error';
            setOpen(true);
        } else {
            state.postcode = postcode;
            haalJSON();
            console.log('postcode wel goed');
        }
    };

    // haal de data op met de link en parameters
    // laat een snackbar alert zien
    const haalJSON = JSONdata => {
        //var filter = "&cql_filter=(postcode = '" + state.postcode +"')";
        let filter = "&filter=<Filter><PropertyIsEqualTo><PropertyName>postcode</PropertyName><Literal>" + state.postcode + "</Literal></PropertyIsEqualTo></Filter>";

        var jqxhr = $.getJSON(state.base_link + filter + state.version);

        jqxhr.done(function () {
            console.log('ik ben klaar');
            if (jqxhr.responseJSON.features.length > 0) {
                state.message = 'ik heb ' + jqxhr.responseJSON.features.length + ' gebouwen gevonden in ' + jqxhr.responseJSON.features[0].properties.woonplaats;
                state.severity = 'success';
                //console.log(Object.keys(jqxhr.responseJSON.features[0].properties));
                state.colkeys = Object.keys(jqxhr.responseJSON.features[0].properties);
                state.rows = jqxhr.responseJSON.features;
                $('#adres').show();
                state.adres = jqxhr.responseJSON.features[0].properties.openbare_ruimte + ' ' + jqxhr.responseJSON.features[0].properties.woonplaats;
                $('#table').fadeIn(500);

            } else {
                state.message = 'ik heb geen gebouwen gevonden';
                state.severity = 'error';
            }
            setOpen(true);
            setTimeout(handleClose, 5000);

            $('#spinner').hide(200);
            console.log(jqxhr.responseJSON.features);
        });
    }

    const circularProgressClasses = circularProgressStyles();
    //const snackbarClasses = snackbarStyles();
    const [open, setOpen] = React.useState(false);

    // const handleClick = () => {
    // 	setOpen(true);
    // };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const tableStyles = makeStyles({
        table: {
            minWidth: 650,
        },
    });

    // function createData(name, calories, fat, carbs, protein) {
    // 	return { name, calories, fat, carbs, protein };
    // }

    // const rows = [
    // 	createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    // 	createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    // 	createData('Eclair', 262, 16.0, 24, 6.0),
    // 	createData('Cupcake', 305, 3.7, 67, 4.3),
    // 	createData('Gingerbread', 356, 16.0, 49, 3.9),
    // ];

    const tableClasses = tableStyles();

    let content = (
        <React.Fragment>

            <h4>Basisregistratie Adressen en Gebouwen</h4>

            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >

                <TextField id="postcode" placeholder="1234 AA" variant="filled" label="Postcode" />
				&nbsp;
				<Button onClick={postcodeCheck} variant="contained" color="primary" size="large">
                    Zoek
				</Button>
            </Grid>

            <p>
                <span variant="outlined" id="adres">{state.adres}</span>
            </p>

            <TableContainer component={Paper} id="table">
                <Table className={tableClasses.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {/* {state.colkeys.map((item, key) =>
							<TableCell key={key}>{item}</TableCell>
						)} */}
                            <TableCell>Bouwjaar</TableCell>
                            <TableCell>Adres</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Oppervlakte</TableCell>
                            <TableCell>Gebuiksdoel</TableCell>

                            {/* <<TableCell>>Dessert (100g serving)</TableCell>
						<TableCell align="right">Calories</TableCell>
						<TableCell align="right">Fat&nbsp;(g)</TableCell>
						<TableCell align="right">Carbs&nbsp;(g)</TableCell>
						<TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.rows.map((item, key) =>
                            <TableRow key={key}>
                                {/* <TableCell component="th" scope="row">
							{item.id}
						</TableCell> */}
                                <TableCell component="th" scope="row">
                                    {item.properties.bouwjaar}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {item.properties.openbare_ruimte + ' ' + item.properties.huisnummer + ' ' + (item.properties.huisletter === null ? '' : item.properties.huisletter)}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {item.properties.status}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {item.properties.oppervlakte}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {item.properties.gebruiksdoel}
                                </TableCell>

                                {/* {state.colkeys.map((dingie, sleutel) =>
							<TableCell component="th" scope="row">
								{item.{dingie}}}
							</TableCell>
						)} */}

                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <div id="progressContainer" className={circularProgressClasses.root}>
                <CircularProgress id="spinner" color="secondary" />
            </div>

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={state.severity}>
                    {state.message}
                </Alert>
            </Snackbar>

        </React.Fragment>
    );

    return content;

}

export default App