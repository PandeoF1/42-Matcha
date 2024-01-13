import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

interface successAlertProps {
	successAlert: string
	setSuccessAlert: (error: string) => void
}

const SuccessAlert = ({ successAlert, setSuccessAlert }: successAlertProps) => {
	return (
		<Snackbar open={!!successAlert?.length} autoHideDuration={4000} onClose={() => setSuccessAlert("")} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
			<MuiAlert onClose={() => setSuccessAlert("")} elevation={6} severity="success" sx={{ width: '100%' }}>
				{successAlert}
			</MuiAlert>
		</Snackbar>
	)
}

export default SuccessAlert