<?php

if(isset($_POST['action']))
{
    $conn = mysql_connect($sql_hostname, $sql_username, $sql_password);

    if($conn)
    {
        $db_selected = mysql_select_db($sql_database_name, $conn);

        if($db_selected)
        {
            switch($_POST['action'])
            {
                case "newUser":
                    // new user code
                    if(isset($_POST['username']) && isset($_POST['password']) && isset($_POST['verifyPassword']) && ($_POST['password'] == $_POST['verifyPassword']))
                    {
                        // verify username is not in use
                        $sql = "SELECT * FROM Users WHERE UserID LIKE '" . mysql_real_escape_string($_POST['username']) . "'";
                        $result = mysql_query($sql);
                        if(mysql_num_rows($result) == 0)
                        {
                            // create user
                            $salt = str_pad((string) rand(1, 1000), 4, '0', STR_PAD_LEFT);
                            $userID = mysql_real_escape_string($_POST['username']);
                            $password = hash('sha512', mysql_real_escape_string($_POST['password']) . $salt) . $salt;
                            $sql = "INSERT INTO Users (UserID, Password) VALUES ('" . $userID . "', '" . $password . "')";

                            mysql_query($sql);

                            echo '<xml><result>success</result></xml>';
                        }//end if
                    }//end if
                    break;
                case "signIn":
                    // sign in code
                    break;
                case "changePassword":
                    // change password code
                    break;
            }//end switch
        }//end if
    }//end if
}//end if

?>