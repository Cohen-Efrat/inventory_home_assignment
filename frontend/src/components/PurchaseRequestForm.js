import React, {useState} from "react";
import {Divider, Button, TextField, Typography, Grid} from "@material-ui/core";
import {Alert} from '@material-ui/lab';


export default function PurchaseRequestForm({data, onSubmit}) {
    const [quantity, setquantity] = useState(0);
    const [unitPrice, setunitPrice] = useState(0);
    const [error, setError] = useState('');
    const submit = async (e) => {
        e.preventDefault();
        const result = await onSubmit(data.SKU, quantity, unitPrice);
        if (result.error) {
            setError(result.error);
        }
    }
    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Purchase Request
            </Typography>
            <div style={{marginBottom: '22px'}}>
                {!!error && <Alert severity="warning">{error}</Alert>}
            </div>
            <Divider/>
            <Typography variant="subtitle1">
                SKU: {data.SKU}
            </Typography>
            <Typography variant="subtitle2" style={{paddingBottom: '10px'}}>
                {data.product}
            </Typography>
            <form onSubmit={submit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            size="small"
                            name="quantity"
                            label="Quantity"
                            variant="outlined"
                            value={quantity}
                            onChange={(e) => setquantity(e.target.value)}
                            style={{width: '100px'}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            size="small"
                            name="unitPrice"
                            label="Unit Price $"
                            variant="outlined"
                            value={unitPrice}
                            onChange={(e) => setunitPrice(e.target.value)}
                            style={{width: '100px'}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="outlined"
                            color="primary"
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>

    );
}