import React, {useState} from "react";
import {TextField, Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import DoneIcon from '@material-ui/icons/Done';
import httpAgent from "../util/httpAgent";
import {useAuth} from "../context/auth-context"
import {Alert} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    error: {
        maxWidth: '150px'
    },
}));


export default function CompletedSwitch({quantity, SKU}) {
    const classes = useStyles();
    const [quantityData, setQuantityData] = useState(quantity || 0);
    const {authData} = useAuth();
    const [error, setError] = useState('');
    const saveQuantity = async () => {
        await httpAgent.patch(`/inventory/${SKU}`, {quantity: parseInt(quantityData)}, {Authorization: `Bearer ${authData.token}`});
    }
    const setQuantity = (value) => {
        if (!Number(value)) {
            setQuantityData(quantityData)
            setError("Must be a number")
        } else {
            setQuantityData(value)
            setError('')
        }
    }
    return (
        <div>
            {!!error && <Alert className={classes.error} severity="warning">{error}</Alert>}
            <TextField
                required
                size="small"
                name="quantity"
                variant="outlined"
                value={quantityData}
                onChange={(e) => setQuantity(e.target.value)}
                style={{width: '100px'}}
            />
            <Button
                type="button"
                variant="outlined"
                color="primary"
                style={{
                    marginLeft: '6px',
                    marginTop: '2px'
                }}
                onClick={saveQuantity}
            >
                <DoneIcon/>
            </Button>
        </div>
    );
}