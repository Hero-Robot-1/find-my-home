import { Box } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";

const HeaderProfileView = ({ user }) => {

  return (
    <Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <img
          alt="profile-user"
          width="30px"
          height="30px"
          src={ user.picture }
          style={{ cursor: "pointer", borderRadius: 30 / 2 }}
        />
      </Box>

    </Box>
  );
};
export default HeaderProfileView;
