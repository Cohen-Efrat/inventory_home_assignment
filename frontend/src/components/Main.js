import React, {useState} from "react";
import {Container, AppBar, Tabs, Tab, Button, Toolbar} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Inventory from "./Inventory";
import PurchaseRequest from "./PurchaseRequest";
import TabPanel from "./TabPanel";
import {useAuth} from "../context/auth-context"
import {isRole} from "../util/functions"
import httpAgent from "../util/httpAgent";

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    logout: {
        position: 'absolute',
        right: 0,
        top: '14px'
    }
}));

export default function Main() {
    const classes = useStyles();
    const {setAuthData, authData} = useAuth();
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const logOut = async () => {
        await httpAgent.post('/users/logout', {}, {Authorization: `Bearer ${authData.token}`});
        setAuthData('');
    };
    return (
        <React.Fragment>
            <Container fixed>
                <div className={classes.root}>
                    <AppBar position="static">
                        <Toolbar>
                            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                                <Tab disabled={!isRole(['Logistic', 'Sales'], authData.user.role)}
                                     label="Inventory" {...a11yProps(0)} />
                                <Tab disabled={!isRole(['Logistic'], authData.user.role)}
                                     label="Purchase Request" {...a11yProps(1)} />
                            </Tabs>
                            <Button className={classes.logout} onClick={logOut}>
                                <ExitToAppIcon/>
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <Inventory/>
                    </TabPanel>
                    <TabPanel disabled={!isRole(['Logistic'], authData.user.role)} value={value} index={1}>
                        <PurchaseRequest/>
                    </TabPanel>
                </div>

            </Container>
        </React.Fragment>
    );
}