import React, {useState} from "react";
import {Checkbox} from "@material-ui/core";
import httpAgent from "../util/httpAgent";
import {useAuth} from "../context/auth-context"

export default function PurchaseRequestCompletedCheckbox({completed, id}) {
    const {authData} = useAuth();
    const [checked, setChecked] = useState(completed || false);
    const saveCompleted = async (value) => {
        setChecked(value)
        await httpAgent.patch(`/purchases/${id}`, {completed: value}, {Authorization: `Bearer ${authData.token}`});
    }
    return (
        <div>
            <Checkbox
                checked={checked}
                onChange={(e) => saveCompleted(e.target.checked)}
                inputProps={{'aria-label': 'primary checkbox'}}
                disabled={checked}
            />
        </div>

    );
}