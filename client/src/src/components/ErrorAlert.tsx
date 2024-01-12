import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

interface ErrorAlertProps {
    errorAlert : string
    setErrorAlert : (error : string) => void
}

const ErrorAlert = ({errorAlert, setErrorAlert} : ErrorAlertProps) => {
    return (
        <Snackbar open={!!errorAlert?.length} autoHideDuration={6000} onClose={() => setErrorAlert("")} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <MuiAlert onClose={() => setErrorAlert("")} elevation={6} severity="error" sx={{ width: '100%' }}>
                    {errorAlert}
                </MuiAlert>
            </Snackbar>
    )
}

export default ErrorAlert