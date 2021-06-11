//#region Imports
import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
//#endregion Imports

//#region Main function
export default function SearchAppBar() {

    return (
        <div>
            <AppBar position="static">
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" noWrap>
                        <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                            <img src="bookLogo.png" alt="Book logo" width='55px' height='55px' style={{ marginRight: '10px' }} />
                            Library
                        </Link>
                    </Typography>
                    <div>
                        <Button style={{ fontWeight: '600' }} color="inherit">
                            <Link to="/Clients" style={{ color: 'white', textDecoration: 'none' }}>
                                Clients
                            </Link>
                        </Button>
                        <Button style={{ fontWeight: '600' }} color="inherit">
                            <Link to="/Orders" style={{ color: 'white', textDecoration: 'none' }}>
                                Orders
                            </Link>
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}
//#endregion Main function